/**
 * ===========================================================================
 *  骨ラボ 予約・カルテ管理システム ― Google スプレッドシート バックエンド
 *  Apps Script（Web アプリ）
 * ===========================================================================
 *
 *  役割: フロントエンド（kotsu-lab-sheets.jsx）からの読込/保存リクエストを受け、
 *        スプレッドシートをデータベースとして読み書きする JSON API。
 *
 *  テーブル（= シートタブ）:
 *      companies / customers / practitioners / sessions / reservations
 *
 *  各タブの構造:
 *      A列  id      … レコードID（目視用）
 *      B列  _json   … レコード全体の JSON（★読み込みはこの列を正本とする）
 *      C列〜       … 可読用のフラット列（配列/オブジェクトは JSON 文字列で表示）
 *
 *  デプロイ手順は「セットアップ手順書」を参照してください。
 * ===========================================================================
 */

var TABLES = ['companies', 'customers', 'practitioners', 'sessions', 'reservations'];

/** GET: ?action=load&table=sessions / ?action=loadAll / ?action=ping */
function doGet(e) {
  var p = (e && e.parameter) || {};
  return handle_(p.action || 'load', p);
}

/** POST: text/plain ボディに {action:'save', table:'sessions', rows:[...]} */
function doPost(e) {
  var body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) { body = {}; }
  return handle_(body.action || 'save', body);
}

function handle_(action, params) {
  try {
    if (action === 'ping') {
      return json_({ ok: true, pong: true, tables: TABLES });
    }
    if (action === 'loadAll') {
      var all = {};
      TABLES.forEach(function (t) { all[t] = readTable_(t); });
      return json_({ ok: true, data: all });
    }
    if (action === 'load') {
      var t = params.table;
      if (TABLES.indexOf(t) < 0) return json_({ ok: false, error: 'unknown table: ' + t });
      return json_({ ok: true, table: t, rows: readTable_(t) });
    }
    if (action === 'save') {
      var tw = params.table;
      if (TABLES.indexOf(tw) < 0) return json_({ ok: false, error: 'unknown table: ' + tw });
      var rows = params.rows || [];
      var lock = LockService.getScriptLock();
      lock.waitLock(20000); // 同時書き込みによる上書き衝突を防止
      try { writeTable_(tw, rows); } finally { lock.releaseLock(); }
      return json_({ ok: true, table: tw, count: rows.length });
    }
    return json_({ ok: false, error: 'unknown action: ' + action });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* --------------------------------- I/O ----------------------------------- */

function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }

function sheet_(name) {
  var ss = ss_();
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

/** タブを読み、レコード配列を返す（_json 列を正本とする） */
function readTable_(name) {
  var sh = ss_().getSheetByName(name);
  if (!sh) return [];
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var header = values[0];
  var ji = header.indexOf('_json');
  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    // 空行スキップ
    var blank = row.every(function (v) { return v === '' || v === null; });
    if (blank) continue;
    if (ji >= 0 && row[ji]) {
      try { rows.push(JSON.parse(row[ji])); continue; } catch (e) { /* フォールバックへ */ }
    }
    // _json が無い/壊れている場合はヘッダから復元
    var obj = {};
    for (var c = 0; c < header.length; c++) {
      var key = header[c];
      if (!key || key === '_json') continue;
      obj[key] = row[c];
    }
    if (Object.keys(obj).length) rows.push(obj);
  }
  return rows;
}

/** レコード配列をタブに全置換で書き込む */
function writeTable_(name, rows) {
  var sh = sheet_(name);
  sh.clear();

  // 可読列のキー集合（全レコードの和集合, 出現順）
  var keys = [];
  var seen = {};
  rows.forEach(function (o) {
    Object.keys(o || {}).forEach(function (k) {
      if (k !== 'id' && !seen[k]) { seen[k] = true; keys.push(k); }
    });
  });
  var header = ['id', '_json'].concat(keys);

  var out = [header];
  rows.forEach(function (o) {
    o = o || {};
    var line = [];
    line.push(o.id != null ? o.id : '');
    line.push(JSON.stringify(o));
    keys.forEach(function (k) {
      var v = o[k];
      if (v === null || v === undefined) line.push('');
      else if (typeof v === 'object') line.push(JSON.stringify(v));
      else line.push(v);
    });
    out.push(line);
  });

  sh.getRange(1, 1, out.length, header.length).setValues(out);
  sh.setFrozenRows(1);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------ セットアップ ------------------------------ */

/**
 * 初回のみ手動実行: 5つのタブを作成します（既存があればそのまま）。
 * スクリプトエディタで関数 setupSheets を選び「実行」してください。
 */
function setupSheets() {
  TABLES.forEach(function (t) { sheet_(t); });
  // 既定の空シートがあれば、邪魔なら手動で削除してください（Sheet1 / シート1）。
  SpreadsheetApp.getActiveSpreadsheet().toast('5つのタブを準備しました', '骨ラボ', 5);
}

/**
 * 動作確認用: フロントを介さず、このスクリプト内で書込→読込をテストします。
 */
function selfTest() {
  writeTable_('practitioners', [
    { id: 'pr1', name: '田中 健', license: '柔道整復師', baseLocation: '骨ラボ 大宮サロン' },
  ]);
  var back = readTable_('practitioners');
  Logger.log(JSON.stringify(back));
}
