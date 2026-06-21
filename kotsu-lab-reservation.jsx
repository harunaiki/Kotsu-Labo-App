import React, { useState, useEffect } from 'react';
import {
  User, Users, Building2, Activity, Calendar, Clock, Plus, X, Check,
  Megaphone, Trash2, Copy, AlertCircle, ClipboardList, Stethoscope,
  Search, Phone, Mail, GitMerge, History, UserPlus, ChevronLeft, FileText,
  Database, Download, RotateCcw, Pencil,
  LogIn, LogOut, QrCode, Lock, Eye, EyeOff, Share2, ShieldCheck, Link2, ChevronRight,
} from 'lucide-react';

/* ---------------------------------------------------------------------------
   骨ラボ 出張施術 予約システム + 顧客カルテ/CRM（プロトタイプ）
   役割: お客様(toB/toC) / 企業ご担当者 / 施術者 / カルテ・CRM   1枠 = 20分
--------------------------------------------------------------------------- */

const SLOT_MIN = 20;
const WD = ['日', '月', '火', '水', '木', '金', '土'];
const TAGS = ['腰痛', '肩こり', '首こり', '頭痛', '眼精疲労', '姿勢の歪み', 'その他'];
const SOLO = '__solo__';
const ADMIN = { id: 'admin', pass: 'kotsu' };
const RESERVE_URL = 'https://kotsulab.app/reserve';
const QR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 37 37" shape-rendering="crispEdges"><rect x="-4" y="-4" width="37" height="37" fill="#ffffff"/><g fill="#1f2d3d"><rect x="2" y="2" width="1" height="1"/><rect x="3" y="2" width="1" height="1"/><rect x="4" y="2" width="1" height="1"/><rect x="5" y="2" width="1" height="1"/><rect x="6" y="2" width="1" height="1"/><rect x="7" y="2" width="1" height="1"/><rect x="8" y="2" width="1" height="1"/><rect x="10" y="2" width="1" height="1"/><rect x="11" y="2" width="1" height="1"/><rect x="18" y="2" width="1" height="1"/><rect x="20" y="2" width="1" height="1"/><rect x="21" y="2" width="1" height="1"/><rect x="22" y="2" width="1" height="1"/><rect x="23" y="2" width="1" height="1"/><rect x="24" y="2" width="1" height="1"/><rect x="25" y="2" width="1" height="1"/><rect x="26" y="2" width="1" height="1"/><rect x="2" y="3" width="1" height="1"/><rect x="8" y="3" width="1" height="1"/><rect x="16" y="3" width="1" height="1"/><rect x="20" y="3" width="1" height="1"/><rect x="26" y="3" width="1" height="1"/><rect x="2" y="4" width="1" height="1"/><rect x="4" y="4" width="1" height="1"/><rect x="5" y="4" width="1" height="1"/><rect x="6" y="4" width="1" height="1"/><rect x="8" y="4" width="1" height="1"/><rect x="10" y="4" width="1" height="1"/><rect x="13" y="4" width="1" height="1"/><rect x="14" y="4" width="1" height="1"/><rect x="15" y="4" width="1" height="1"/><rect x="16" y="4" width="1" height="1"/><rect x="17" y="4" width="1" height="1"/><rect x="20" y="4" width="1" height="1"/><rect x="22" y="4" width="1" height="1"/><rect x="23" y="4" width="1" height="1"/><rect x="24" y="4" width="1" height="1"/><rect x="26" y="4" width="1" height="1"/><rect x="2" y="5" width="1" height="1"/><rect x="4" y="5" width="1" height="1"/><rect x="5" y="5" width="1" height="1"/><rect x="6" y="5" width="1" height="1"/><rect x="8" y="5" width="1" height="1"/><rect x="10" y="5" width="1" height="1"/><rect x="11" y="5" width="1" height="1"/><rect x="13" y="5" width="1" height="1"/><rect x="14" y="5" width="1" height="1"/><rect x="15" y="5" width="1" height="1"/><rect x="16" y="5" width="1" height="1"/><rect x="20" y="5" width="1" height="1"/><rect x="22" y="5" width="1" height="1"/><rect x="23" y="5" width="1" height="1"/><rect x="24" y="5" width="1" height="1"/><rect x="26" y="5" width="1" height="1"/><rect x="2" y="6" width="1" height="1"/><rect x="4" y="6" width="1" height="1"/><rect x="5" y="6" width="1" height="1"/><rect x="6" y="6" width="1" height="1"/><rect x="8" y="6" width="1" height="1"/><rect x="10" y="6" width="1" height="1"/><rect x="11" y="6" width="1" height="1"/><rect x="12" y="6" width="1" height="1"/><rect x="13" y="6" width="1" height="1"/><rect x="17" y="6" width="1" height="1"/><rect x="20" y="6" width="1" height="1"/><rect x="22" y="6" width="1" height="1"/><rect x="23" y="6" width="1" height="1"/><rect x="24" y="6" width="1" height="1"/><rect x="26" y="6" width="1" height="1"/><rect x="2" y="7" width="1" height="1"/><rect x="8" y="7" width="1" height="1"/><rect x="11" y="7" width="1" height="1"/><rect x="14" y="7" width="1" height="1"/><rect x="15" y="7" width="1" height="1"/><rect x="18" y="7" width="1" height="1"/><rect x="20" y="7" width="1" height="1"/><rect x="26" y="7" width="1" height="1"/><rect x="2" y="8" width="1" height="1"/><rect x="3" y="8" width="1" height="1"/><rect x="4" y="8" width="1" height="1"/><rect x="5" y="8" width="1" height="1"/><rect x="6" y="8" width="1" height="1"/><rect x="7" y="8" width="1" height="1"/><rect x="8" y="8" width="1" height="1"/><rect x="10" y="8" width="1" height="1"/><rect x="12" y="8" width="1" height="1"/><rect x="14" y="8" width="1" height="1"/><rect x="16" y="8" width="1" height="1"/><rect x="18" y="8" width="1" height="1"/><rect x="20" y="8" width="1" height="1"/><rect x="21" y="8" width="1" height="1"/><rect x="22" y="8" width="1" height="1"/><rect x="23" y="8" width="1" height="1"/><rect x="24" y="8" width="1" height="1"/><rect x="25" y="8" width="1" height="1"/><rect x="26" y="8" width="1" height="1"/><rect x="11" y="9" width="1" height="1"/><rect x="13" y="9" width="1" height="1"/><rect x="14" y="9" width="1" height="1"/><rect x="16" y="9" width="1" height="1"/><rect x="17" y="9" width="1" height="1"/><rect x="2" y="10" width="1" height="1"/><rect x="3" y="10" width="1" height="1"/><rect x="4" y="10" width="1" height="1"/><rect x="5" y="10" width="1" height="1"/><rect x="8" y="10" width="1" height="1"/><rect x="10" y="10" width="1" height="1"/><rect x="16" y="10" width="1" height="1"/><rect x="18" y="10" width="1" height="1"/><rect x="19" y="10" width="1" height="1"/><rect x="22" y="10" width="1" height="1"/><rect x="23" y="10" width="1" height="1"/><rect x="24" y="10" width="1" height="1"/><rect x="26" y="10" width="1" height="1"/><rect x="2" y="11" width="1" height="1"/><rect x="6" y="11" width="1" height="1"/><rect x="11" y="11" width="1" height="1"/><rect x="13" y="11" width="1" height="1"/><rect x="16" y="11" width="1" height="1"/><rect x="18" y="11" width="1" height="1"/><rect x="21" y="11" width="1" height="1"/><rect x="25" y="11" width="1" height="1"/><rect x="2" y="12" width="1" height="1"/><rect x="4" y="12" width="1" height="1"/><rect x="5" y="12" width="1" height="1"/><rect x="8" y="12" width="1" height="1"/><rect x="9" y="12" width="1" height="1"/><rect x="13" y="12" width="1" height="1"/><rect x="16" y="12" width="1" height="1"/><rect x="18" y="12" width="1" height="1"/><rect x="20" y="12" width="1" height="1"/><rect x="21" y="12" width="1" height="1"/><rect x="3" y="13" width="1" height="1"/><rect x="5" y="13" width="1" height="1"/><rect x="6" y="13" width="1" height="1"/><rect x="13" y="13" width="1" height="1"/><rect x="14" y="13" width="1" height="1"/><rect x="15" y="13" width="1" height="1"/><rect x="18" y="13" width="1" height="1"/><rect x="19" y="13" width="1" height="1"/><rect x="20" y="13" width="1" height="1"/><rect x="21" y="13" width="1" height="1"/><rect x="22" y="13" width="1" height="1"/><rect x="23" y="13" width="1" height="1"/><rect x="24" y="13" width="1" height="1"/><rect x="2" y="14" width="1" height="1"/><rect x="3" y="14" width="1" height="1"/><rect x="5" y="14" width="1" height="1"/><rect x="6" y="14" width="1" height="1"/><rect x="8" y="14" width="1" height="1"/><rect x="10" y="14" width="1" height="1"/><rect x="11" y="14" width="1" height="1"/><rect x="15" y="14" width="1" height="1"/><rect x="17" y="14" width="1" height="1"/><rect x="19" y="14" width="1" height="1"/><rect x="20" y="14" width="1" height="1"/><rect x="22" y="14" width="1" height="1"/><rect x="24" y="14" width="1" height="1"/><rect x="25" y="14" width="1" height="1"/><rect x="26" y="14" width="1" height="1"/><rect x="3" y="15" width="1" height="1"/><rect x="4" y="15" width="1" height="1"/><rect x="5" y="15" width="1" height="1"/><rect x="12" y="15" width="1" height="1"/><rect x="14" y="15" width="1" height="1"/><rect x="15" y="15" width="1" height="1"/><rect x="16" y="15" width="1" height="1"/><rect x="17" y="15" width="1" height="1"/><rect x="18" y="15" width="1" height="1"/><rect x="20" y="15" width="1" height="1"/><rect x="21" y="15" width="1" height="1"/><rect x="22" y="15" width="1" height="1"/><rect x="26" y="15" width="1" height="1"/><rect x="3" y="16" width="1" height="1"/><rect x="5" y="16" width="1" height="1"/><rect x="8" y="16" width="1" height="1"/><rect x="9" y="16" width="1" height="1"/><rect x="12" y="16" width="1" height="1"/><rect x="16" y="16" width="1" height="1"/><rect x="18" y="16" width="1" height="1"/><rect x="19" y="16" width="1" height="1"/><rect x="22" y="16" width="1" height="1"/><rect x="24" y="16" width="1" height="1"/><rect x="25" y="16" width="1" height="1"/><rect x="2" y="17" width="1" height="1"/><rect x="5" y="17" width="1" height="1"/><rect x="6" y="17" width="1" height="1"/><rect x="7" y="17" width="1" height="1"/><rect x="9" y="17" width="1" height="1"/><rect x="10" y="17" width="1" height="1"/><rect x="11" y="17" width="1" height="1"/><rect x="12" y="17" width="1" height="1"/><rect x="13" y="17" width="1" height="1"/><rect x="14" y="17" width="1" height="1"/><rect x="16" y="17" width="1" height="1"/><rect x="17" y="17" width="1" height="1"/><rect x="18" y="17" width="1" height="1"/><rect x="20" y="17" width="1" height="1"/><rect x="21" y="17" width="1" height="1"/><rect x="22" y="17" width="1" height="1"/><rect x="26" y="17" width="1" height="1"/><rect x="2" y="18" width="1" height="1"/><rect x="3" y="18" width="1" height="1"/><rect x="5" y="18" width="1" height="1"/><rect x="7" y="18" width="1" height="1"/><rect x="8" y="18" width="1" height="1"/><rect x="10" y="18" width="1" height="1"/><rect x="12" y="18" width="1" height="1"/><rect x="13" y="18" width="1" height="1"/><rect x="14" y="18" width="1" height="1"/><rect x="15" y="18" width="1" height="1"/><rect x="17" y="18" width="1" height="1"/><rect x="18" y="18" width="1" height="1"/><rect x="19" y="18" width="1" height="1"/><rect x="20" y="18" width="1" height="1"/><rect x="21" y="18" width="1" height="1"/><rect x="22" y="18" width="1" height="1"/><rect x="23" y="18" width="1" height="1"/><rect x="24" y="18" width="1" height="1"/><rect x="25" y="18" width="1" height="1"/><rect x="26" y="18" width="1" height="1"/><rect x="10" y="19" width="1" height="1"/><rect x="13" y="19" width="1" height="1"/><rect x="14" y="19" width="1" height="1"/><rect x="15" y="19" width="1" height="1"/><rect x="16" y="19" width="1" height="1"/><rect x="18" y="19" width="1" height="1"/><rect x="22" y="19" width="1" height="1"/><rect x="24" y="19" width="1" height="1"/><rect x="26" y="19" width="1" height="1"/><rect x="2" y="20" width="1" height="1"/><rect x="3" y="20" width="1" height="1"/><rect x="4" y="20" width="1" height="1"/><rect x="5" y="20" width="1" height="1"/><rect x="6" y="20" width="1" height="1"/><rect x="7" y="20" width="1" height="1"/><rect x="8" y="20" width="1" height="1"/><rect x="12" y="20" width="1" height="1"/><rect x="15" y="20" width="1" height="1"/><rect x="18" y="20" width="1" height="1"/><rect x="20" y="20" width="1" height="1"/><rect x="22" y="20" width="1" height="1"/><rect x="24" y="20" width="1" height="1"/><rect x="25" y="20" width="1" height="1"/><rect x="26" y="20" width="1" height="1"/><rect x="2" y="21" width="1" height="1"/><rect x="8" y="21" width="1" height="1"/><rect x="12" y="21" width="1" height="1"/><rect x="13" y="21" width="1" height="1"/><rect x="14" y="21" width="1" height="1"/><rect x="16" y="21" width="1" height="1"/><rect x="17" y="21" width="1" height="1"/><rect x="18" y="21" width="1" height="1"/><rect x="22" y="21" width="1" height="1"/><rect x="25" y="21" width="1" height="1"/><rect x="2" y="22" width="1" height="1"/><rect x="4" y="22" width="1" height="1"/><rect x="5" y="22" width="1" height="1"/><rect x="6" y="22" width="1" height="1"/><rect x="8" y="22" width="1" height="1"/><rect x="16" y="22" width="1" height="1"/><rect x="18" y="22" width="1" height="1"/><rect x="19" y="22" width="1" height="1"/><rect x="20" y="22" width="1" height="1"/><rect x="21" y="22" width="1" height="1"/><rect x="22" y="22" width="1" height="1"/><rect x="23" y="22" width="1" height="1"/><rect x="25" y="22" width="1" height="1"/><rect x="26" y="22" width="1" height="1"/><rect x="2" y="23" width="1" height="1"/><rect x="4" y="23" width="1" height="1"/><rect x="5" y="23" width="1" height="1"/><rect x="6" y="23" width="1" height="1"/><rect x="8" y="23" width="1" height="1"/><rect x="10" y="23" width="1" height="1"/><rect x="11" y="23" width="1" height="1"/><rect x="13" y="23" width="1" height="1"/><rect x="19" y="23" width="1" height="1"/><rect x="20" y="23" width="1" height="1"/><rect x="22" y="23" width="1" height="1"/><rect x="23" y="23" width="1" height="1"/><rect x="24" y="23" width="1" height="1"/><rect x="25" y="23" width="1" height="1"/><rect x="26" y="23" width="1" height="1"/><rect x="2" y="24" width="1" height="1"/><rect x="4" y="24" width="1" height="1"/><rect x="5" y="24" width="1" height="1"/><rect x="6" y="24" width="1" height="1"/><rect x="8" y="24" width="1" height="1"/><rect x="10" y="24" width="1" height="1"/><rect x="11" y="24" width="1" height="1"/><rect x="13" y="24" width="1" height="1"/><rect x="14" y="24" width="1" height="1"/><rect x="17" y="24" width="1" height="1"/><rect x="20" y="24" width="1" height="1"/><rect x="22" y="24" width="1" height="1"/><rect x="24" y="24" width="1" height="1"/><rect x="25" y="24" width="1" height="1"/><rect x="2" y="25" width="1" height="1"/><rect x="8" y="25" width="1" height="1"/><rect x="10" y="25" width="1" height="1"/><rect x="12" y="25" width="1" height="1"/><rect x="13" y="25" width="1" height="1"/><rect x="15" y="25" width="1" height="1"/><rect x="16" y="25" width="1" height="1"/><rect x="17" y="25" width="1" height="1"/><rect x="22" y="25" width="1" height="1"/><rect x="24" y="25" width="1" height="1"/><rect x="2" y="26" width="1" height="1"/><rect x="3" y="26" width="1" height="1"/><rect x="4" y="26" width="1" height="1"/><rect x="5" y="26" width="1" height="1"/><rect x="6" y="26" width="1" height="1"/><rect x="7" y="26" width="1" height="1"/><rect x="8" y="26" width="1" height="1"/><rect x="10" y="26" width="1" height="1"/><rect x="12" y="26" width="1" height="1"/><rect x="15" y="26" width="1" height="1"/><rect x="16" y="26" width="1" height="1"/><rect x="19" y="26" width="1" height="1"/><rect x="21" y="26" width="1" height="1"/><rect x="22" y="26" width="1" height="1"/><rect x="23" y="26" width="1" height="1"/><rect x="24" y="26" width="1" height="1"/><rect x="25" y="26" width="1" height="1"/><rect x="26" y="26" width="1" height="1"/></g></svg>`;

const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const toTime = (n) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
const slotsOf = (s, e) => { const a = []; for (let t = toMin(s); t + SLOT_MIN <= toMin(e); t += SLOT_MIN) a.push(toTime(t)); return a; };
const localDate = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fmtDate = (s) => { if (!s) return '—'; const [y, m, d] = s.split('-').map(Number); const dt = new Date(y, m - 1, d); return `${m}月${d}日(${WD[dt.getDay()]})`; };
const uid = (p) => p + Math.random().toString(36).slice(2, 9);
const byDateTime = (a, b) => (a.date === b.date ? toMin(a.start) - toMin(b.start) : a.date < b.date ? -1 : 1);
const safeParse = (s) => { try { return JSON.parse(s); } catch { return null; } };
const copyText = async (t) => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };
const norm = (s) => (s || '').trim().toUpperCase();

const genCode = (prefix, existing) => {
  const used = new Set((existing || []).map((c) => c.code));
  let code;
  do { code = `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`; } while (used.has(code));
  return code;
};
const companyByCode = (companies, code) => companies.find((c) => norm(c.code) === norm(code)) || null;
const custById = (customers, id) => customers.find((c) => c.id === id) || null;
const custByB2B = (customers, companyId, empNo) =>
  customers.find((c) => c.type === 'b2b' && c.companyId === companyId && norm(c.empNo) === norm(empNo)) || null;
const custByCode = (customers, code) => customers.find((c) => norm(c.code) === norm(code)) || null;

function visitsOf(reservations, sessions, customerId) {
  return reservations
    .filter((r) => r.customerId === customerId)
    .map((r) => ({ ...r, session: sessions.find((s) => s.id === r.sessionId) }))
    .filter((r) => r.session)
    .sort((a, b) => byDateTime(b.session, a.session));
}

const hasStore = typeof window !== 'undefined' && window.storage && typeof window.storage.get === 'function';
const sGet = async (k) => { if (!hasStore) return null; try { return await window.storage.get(k, true); } catch { return null; } };
const sSet = async (k, v) => { if (!hasStore) return; try { await window.storage.set(k, JSON.stringify(v), true); } catch { /* in-memory fallback */ } };

function buildSeed() {
  const D = (o) => { const d = new Date(); d.setDate(d.getDate() + o); return localDate(d); };
  const companies = [
    { id: 'c1', name: '山田製作所', industry: '製造業', code: 'YMD-4471', coordPass: 'yamada' },
    { id: 'c2', name: 'テックフロー株式会社', industry: 'IT企業', code: 'TFW-2208', coordPass: 'techflow' },
    { id: 'c3', name: 'みなと物流', industry: '物流業', code: 'MNT-6033', coordPass: 'minato' },
  ];
  const customers = [
    { id: 'u1', type: 'b2b', code: 'B-7K2QX', name: '山田 太郎', companyId: 'c1', empNo: '1024', dept: '製造1課', tel: '', email: '', symptoms: '右肩の慢性的なこり。立ち仕事が長く、夕方にかけて重さを感じる。', tags: ['肩こり', '姿勢の歪み'], followUpAt: '', followUpNote: '', followDone: false, createdAt: D(-60), mergedFrom: [], disclose: { symptoms: true, tags: true, treatment: true } },
    { id: 'u2', type: 'b2b', code: 'B-3MD8A', name: '鈴木 花子', companyId: 'c1', empNo: '2087', dept: '製造2課', tel: '', email: '', symptoms: '', tags: [], followUpAt: '', followUpNote: '', followDone: false, createdAt: D(-45), mergedFrom: [], disclose: { symptoms: true, tags: true, treatment: false } },
    { id: 'u3', type: 'b2b', code: 'B-9P4LC', name: '高橋 実', companyId: 'c1', empNo: '3310', dept: '品質管理課', tel: '', email: '', symptoms: '腰痛。特に午後にかけて張りが強くなる。', tags: ['腰痛'], followUpAt: '', followUpNote: '', followDone: false, createdAt: D(-30), mergedFrom: [], disclose: { symptoms: true, tags: true, treatment: false } },
    { id: 'u4', type: 'b2b', code: 'B-2T6VR', name: '伊藤 涼', companyId: 'c2', empNo: 'IT-204', dept: '開発部', tel: '', email: '', symptoms: '長時間のデスクワークで首から肩にかけて緊張。', tags: ['肩こり', '首こり', '眼精疲労'], followUpAt: '', followUpNote: '', followDone: false, createdAt: D(-90), mergedFrom: [], disclose: { symptoms: true, tags: true, treatment: true } },
    { id: 'u5', type: 'b2b', code: 'B-5H1WN', name: '渡辺 健', companyId: 'c2', empNo: 'IT-220', dept: '開発部', tel: '', email: '', symptoms: '', tags: [], followUpAt: '', followUpNote: '', followDone: false, createdAt: D(-20), mergedFrom: [], disclose: { symptoms: true, tags: true, treatment: false } },
    { id: 'u6', type: 'b2c', code: 'C-8F3KQ', name: '中村 由美', companyId: null, empNo: '', dept: '', tel: '090-1234-5678', email: '', symptoms: '産後の腰の不調。月1回ペースでの来院を希望。', tags: ['腰痛'], followUpAt: D(7), followUpNote: '次回予約の確認連絡', followDone: false, createdAt: D(-120), mergedFrom: [], disclose: { symptoms: true, tags: true, treatment: true } },
    { id: 'u7', type: 'b2c', code: 'C-1X9ZM', name: '小林 大輔', companyId: null, empNo: '', dept: '', tel: '080-2222-3333', email: 'kobayashi@example.com', symptoms: 'デスクワーク中心。肩こりと頭痛が気になる。', tags: ['肩こり', '頭痛'], followUpAt: '', followUpNote: '', followDone: false, createdAt: D(-15), mergedFrom: [], disclose: { symptoms: true, tags: true, treatment: false } },
  ];
  const sessions = [
    { id: 'p1', companyId: 'c1', date: D(-7), start: '10:00', end: '12:00', practitioner: '田中 健' },
    { id: 'p2', companyId: null, date: D(-10), start: '13:00', end: '15:00', practitioner: '佐藤 美咲' },
    { id: 's1', companyId: 'c1', date: D(2), start: '10:00', end: '12:00', practitioner: '田中 健' },
    { id: 's2', companyId: 'c2', date: D(3), start: '14:00', end: '16:00', practitioner: '田中 健' },
    { id: 'sp1', companyId: null, date: D(4), start: '16:00', end: '18:00', practitioner: '佐藤 美咲' },
    { id: 's3', companyId: 'c3', date: D(5), start: '09:00', end: '11:00', practitioner: '佐藤 美咲' },
    { id: 's4', companyId: 'c1', date: D(9), start: '13:00', end: '15:00', practitioner: '田中 健' },
  ];
  const now = new Date().toISOString();
  const R = (id, sessionId, slot, cu, note, treatment, done) => {
    const c = customers.find((x) => x.id === cu);
    return { id, sessionId, slot, customerId: cu, name: c.name, dept: c.dept || '', note: note || '', treatment: treatment || '', done: !!done, at: now };
  };
  const reservations = [
    R('r1', 'p1', '10:00', 'u1', '右肩のこり', '肩甲骨まわりを中心に施術。可動域が改善。継続を推奨。', true),
    R('r2', 'p1', '11:20', 'u3', '腰痛', '腰部の筋緊張を緩和。日常のストレッチを指導。', true),
    R('r3', 'p2', '13:00', 'u6', '産後の腰の不調', '骨盤まわりを調整。産後ケアとして負担の少ない施術。', true),
    R('r4', 'p2', '14:00', 'u7', '肩こりと頭痛', '首・肩の緊張を緩和。頭痛は肩こり由来の可能性を説明。', true),
    R('r5', 's1', '10:00', 'u1', '右肩のこりがひどい', '', false),
    R('r6', 's1', '10:40', 'u2', '', '', false),
    R('r7', 's2', '14:00', 'u4', '長時間のデスクワーク', '', false),
    R('r8', 's2', '14:40', 'u5', '', '', false),
    R('r9', 'sp1', '16:00', 'u6', '定期メンテナンス', '', false),
  ];
  return { companies, customers, sessions, reservations };
}

const ROLES = [
  { id: 'customer', label: 'お客様', icon: User },
  { id: 'admin', label: '企業ご担当', icon: Building2 },
  { id: 'provider', label: '施術者', icon: Activity },
  { id: 'crm', label: 'カルテ・CRM', icon: ClipboardList },
  { id: 'data', label: 'データ管理', icon: Database },
];

const INTRO = {
  customer: { t: '施術のご予約', p: '法人のお客様は企業コードと社員番号で、個人のお客様はお客様コードでご予約いただけます。1枠20分です。' },
  admin: { t: '自社の予約状況', p: '貴社の施術枠の予約状況を確認し、空き枠があれば従業員へ呼びかけられます。' },
  provider: { t: '全体の施術スケジュール', p: '法人・個人を含むすべての予約をまたいで確認・管理し、施術後の記録を残せます。' },
  crm: { t: 'お客様カルテ・CRM', p: '症状や施術履歴をカルテで管理し、フォローアップや、法人⇄個人の切替に伴うカルテの統合ができます。' },
  data: { t: 'データベース管理', p: '企業・お客様・施術日・予約の全データを一覧で確認し、編集・追加・削除・エクスポートができます。' },
};

function SpineMark({ size = 32 }) {
  const g = '#5f9377', d = '#487059';
  const dots = [
    [22, 5, 3.0, g], [18, 12, 3.5, g], [22, 19, 3.9, d],
    [18, 26, 3.9, g], [22, 33, 3.5, g], [18, 40, 3.0, g], [21, 46, 2.5, g],
  ];
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 40 52" fill="none" aria-hidden="true">
      {dots.map(([cx, cy, r, c], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={c} />)}
    </svg>
  );
}

/* -------------------------------- Shared UI ------------------------------- */
function Modal({ title, onClose, children, footer }) {
  return (
    <div className="kl-overlay" onClick={onClose}>
      <div className="kl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kl-modal-h"><div className="kl-modal-t">{title}</div><button className="kl-x" onClick={onClose}><X size={18} /></button></div>
        <div className="kl-modal-b">{children}</div>
        {footer && <div className="kl-modal-f">{footer}</div>}
      </div>
    </div>
  );
}

function Confirm({ open, message, confirmLabel = 'OK', danger, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="kl-overlay" onClick={onCancel}>
      <div className="kl-modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <div className="kl-modal-b" style={{ paddingTop: 22 }}>
          <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
            <AlertCircle size={20} color={danger ? '#cf7878' : '#5f9377'} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{message}</p>
          </div>
        </div>
        <div className="kl-modal-f">
          <button className="kl-btn kl-btn-ghost" onClick={onCancel}>キャンセル</button>
          <button className={`kl-btn ${danger ? 'kl-btn-danger-solid' : 'kl-btn-primary'}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function TreatmentModal({ res, sessionLabel, onClose, onSave }) {
  const [treatment, setTreatment] = useState(res.treatment || '');
  const [done, setDone] = useState(!!res.done);
  return (
    <Modal title="施術記録" onClose={onClose} footer={<>
      <button className="kl-btn kl-btn-ghost" onClick={onClose}>閉じる</button>
      <button className="kl-btn kl-btn-primary" onClick={() => onSave(res.id, treatment, done)}><Check size={16} />保存する</button>
    </>}>
      <div className="kl-info-row"><span className="k">お客様</span><span className="v">{res.name}</span></div>
      <div className="kl-info-row"><span className="k">日時</span><span className="v kl-mono">{sessionLabel}</span></div>
      {res.note && <div className="kl-info-row"><span className="k">主訴</span><span className="v">{res.note}</span></div>}
      <div className="kl-field" style={{ marginTop: 14 }}>
        <label>施術記録・所見</label>
        <textarea className="kl-area" value={treatment} onChange={(e) => setTreatment(e.target.value)} placeholder="施術内容、所見、次回への申し送りなど" />
      </div>
      <label className="kl-check"><input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} /><span>施術済みにする</span></label>
    </Modal>
  );
}

/* ------------------------------ Customer view ----------------------------- */
function PortalHeader({ title, subtitle, onLogout, icon: Icon }) {
  return (
    <header className="kl-top">
      <div className="kl-top-in">
        <div className="kl-brand"><SpineMark size={28} /><div><div className="kl-brand-name">骨ラボ</div><div className="kl-brand-sub">{title}</div></div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {subtitle && <span className="kl-whoami">{Icon && <Icon size={14} />}{subtitle}</span>}
          <button className="kl-btn kl-btn-ghost kl-btn-sm" onClick={onLogout}><LogOut size={15} />ログアウト</button>
        </div>
      </div>
    </header>
  );
}

const discloseOf = (c) => c.disclose || { symptoms: false, tags: false, treatment: false };

function BookingPanel({ me, companies, sessions, reservations, onBook, notify }) {
  const [booking, setBooking] = useState(null);
  const [note, setNote] = useState('');
  const today = localDate();
  const myCompanyId = me.type === 'b2b' ? me.companyId : null;
  const sessionList = sessions.filter((s) => (me.type === 'b2b' ? s.companyId === myCompanyId : s.companyId == null) && s.date >= today).sort(byDateTime);
  const resOf = (id) => reservations.filter((r) => r.sessionId === id);
  function confirmBook() {
    onBook({ sessionId: booking.session.id, slot: booking.slot, customerId: me.id, name: me.name, dept: me.type === 'b2b' ? (me.dept || '') : '', note });
    setBooking(null); setNote('');
  }
  return (
    <>
      <div className="kl-sub">{me.type === 'b2b' ? '予約できる施術日' : '個人向けの空き枠'}</div>
      {sessionList.length === 0 && <div className="kl-card"><div className="kl-empty"><Calendar size={28} /><div>現在、予約できる枠はありません。</div></div></div>}
      {sessionList.map((s) => {
        const slots = slotsOf(s.start, s.end);
        const taken = Object.fromEntries(resOf(s.id).map((r) => [r.slot, r]));
        const open = slots.length - Object.keys(taken).length;
        return (
          <div className="kl-sess" key={s.id}>
            <div className="kl-sess-h">
              <div>
                <div className="kl-sess-date">{fmtDate(s.date)}</div>
                <div className="kl-sess-meta"><span><Clock size={13} />{s.start}〜{s.end}</span><span><Stethoscope size={13} />{s.practitioner}</span></div>
              </div>
              {open > 0 ? <span className="kl-badge green">空き {open}枠</span> : <span className="kl-badge full">満員</span>}
            </div>
            <div className="kl-sess-b">
              <div className="kl-slots">
                {slots.map((t) => {
                  const r = taken[t];
                  const mine = r && r.customerId === me.id;
                  if (mine) return <div className="kl-slot mine" key={t}><div className="t">{t}</div><div className="s">あなたの予約</div></div>;
                  if (r) return <div className="kl-slot booked" key={t}><div className="t">{t}</div><div className="s">予約済み</div></div>;
                  return <button className="kl-slot open clickable" key={t} onClick={() => { setBooking({ session: s, slot: t }); setNote(''); }}><div className="t">{t}</div><div className="s">空き</div></button>;
                })}
              </div>
            </div>
          </div>
        );
      })}
      {booking && (
        <Modal title="ご予約の確認" onClose={() => setBooking(null)} footer={<>
          <button className="kl-btn kl-btn-ghost" onClick={() => setBooking(null)}>やめる</button>
          <button className="kl-btn kl-btn-primary" onClick={confirmBook}><Check size={16} />この枠で予約する</button>
        </>}>
          <div className="kl-info-row"><span className="k">日付</span><span className="v">{fmtDate(booking.session.date)}</span></div>
          <div className="kl-info-row"><span className="k">時間</span><span className="v kl-mono">{booking.slot}〜{toTime(toMin(booking.slot) + SLOT_MIN)}（20分）</span></div>
          <div className="kl-info-row"><span className="k">お名前</span><span className="v">{me.name}{me.type === 'b2b' && me.dept ? `（${me.dept}）` : ''}</span></div>
          <div className="kl-field" style={{ marginTop: 14 }}>
            <label>気になる部位・症状（任意）</label>
            <textarea className="kl-area" value={note} onChange={(e) => setNote(e.target.value)} placeholder="例）右肩のこり、腰の張り など" />
          </div>
        </Modal>
      )}
    </>
  );
}

function MyReservations({ me, companies, sessions, reservations, onCancel }) {
  const [confirm, setConfirm] = useState(null);
  const today = localDate();
  const d = discloseOf(me);
  const mine = reservations.filter((r) => r.customerId === me.id).map((r) => ({ ...r, session: sessions.find((s) => s.id === r.sessionId) })).filter((r) => r.session);
  const upcoming = mine.filter((r) => r.session.date >= today).sort((a, b) => byDateTime(a.session, b.session));
  const past = mine.filter((r) => r.session.date < today).sort((a, b) => byDateTime(b.session, a.session));
  const cName = (id) => (id ? (companies.find((c) => c.id === id)?.name || '—') : '個人向け枠');
  return (
    <>
      <div className="kl-sub">予約状況</div>
      {upcoming.length === 0 && <div className="kl-card"><div className="kl-empty"><Calendar size={26} /><div>今後のご予約はありません。</div></div></div>}
      {upcoming.length > 0 && <div className="kl-card"><div className="kl-roster">{upcoming.map((r) => (
        <div className="kl-rrow" key={r.id}>
          <div className="kl-rtime"><Calendar size={13} />{fmtDate(r.session.date)}</div>
          <div className="kl-rwho"><div className="kl-rname kl-mono">{r.slot}〜{toTime(toMin(r.slot) + SLOT_MIN)}</div><div className="kl-rdept">{cName(r.session.companyId)}・{r.session.practitioner}</div></div>
          {onCancel && <button className="kl-btn kl-btn-danger kl-btn-sm" onClick={() => setConfirm({ id: r.id, label: `${fmtDate(r.session.date)} ${r.slot}のご予約` })}><X size={14} />取消</button>}
        </div>
      ))}</div></div>}
      {past.length > 0 && (
        <>
          <div className="kl-sub">これまでの施術</div>
          <div className="kl-card"><div className="kl-roster">{past.map((r) => (
            <div className="kl-rrow" key={r.id}>
              <div className="kl-rtime"><History size={13} />{fmtDate(r.session.date)}</div>
              <div className="kl-rwho"><div className="kl-rname" style={{ fontSize: 13 }}>{r.session.practitioner}</div>{d.treatment && r.treatment ? <div className="kl-rnote">{r.treatment}</div> : <div className="kl-rdept">{r.done ? '施術済み' : '—'}</div>}</div>
            </div>
          ))}</div></div>
        </>
      )}
      <Confirm open={!!confirm} danger confirmLabel="取り消す" message={confirm ? `${confirm.label}を取り消します。よろしいですか？` : ''} onCancel={() => setConfirm(null)} onConfirm={() => { onCancel(confirm.id); setConfirm(null); }} />
    </>
  );
}

function MyKarte({ me, companies }) {
  const d = discloseOf(me);
  const company = me.type === 'b2b' ? companies.find((c) => c.id === me.companyId) : null;
  const anything = (d.symptoms && me.symptoms) || (d.tags && (me.tags || []).length > 0);
  return (
    <>
      <div className="kl-sub">マイカルテ（開示情報）</div>
      <div className="kl-card">
        <div className="kl-prof">
          <div className="kl-av">{me.name.slice(0, 1)}</div>
          <div className="kl-prof-info">
            <div className="kl-cust-name">{me.name} さん <span className={`kl-badge ${me.type === 'b2b' ? 'b2b' : 'b2c'}`}>{me.type === 'b2b' ? '法人' : '個人'}</span></div>
            <div className="kl-meta-line"><span className="kl-code">{me.code}</span>{company && <span><Building2 size={13} />{company.name}（社員番号 {me.empNo}{me.dept ? `・${me.dept}` : ''}）</span>}{me.type === 'b2c' && me.tel && <span><Phone size={13} />{me.tel}</span>}</div>
          </div>
        </div>
        {d.symptoms && me.symptoms && <div style={{ marginTop: 14 }}><div className="kl-klabel"><FileText size={14} />主訴・症状メモ</div><p className="kl-ktext">{me.symptoms}</p></div>}
        {d.tags && (me.tags || []).length > 0 && <div style={{ marginTop: 14 }}><div className="kl-klabel">症状タグ</div><div className="kl-tags">{me.tags.map((t) => <span key={t} className="kl-tag is-on" style={{ cursor: 'default' }}>{t}</span>)}</div></div>}
        {!anything && <p className="kl-ktext" style={{ marginTop: 12, color: 'var(--ink-soft)' }}>現在お客様に開示されているカルテ情報はありません。詳細は施術者へお問い合わせください。</p>}
        <div className="kl-hint hint-green" style={{ marginTop: 16 }}><ShieldCheck size={16} /><span>表示されるのは施術者が開示を許可した情報のみです。{d.treatment ? '過去の施術記録は「予約状況」内でご確認いただけます。' : ''}</span></div>
      </div>
    </>
  );
}

function IdentifyPanel({ companies, customers, onReady, onAddCustomer, notify }) {
  const [mode, setMode] = useState('b2b');
  const [companyCode, setCompanyCode] = useState('');
  const [empNo, setEmpNo] = useState('');
  const [custCode, setCustCode] = useState('');
  const [reg, setReg] = useState(null);
  const [regName, setRegName] = useState('');
  const [regDept, setRegDept] = useState('');
  const [regTel, setRegTel] = useState('');
  const [regEmail, setRegEmail] = useState('');
  function loginB2B() {
    const co = companyByCode(companies, companyCode);
    if (!co) { notify('企業コードが見つかりません'); return; }
    if (!empNo.trim()) { notify('社員番号を入力してください'); return; }
    const found = custByB2B(customers, co.id, empNo);
    if (found) { onReady(found); }
    else { setReg({ kind: 'b2b', companyId: co.id, companyName: co.name, empNo: empNo.trim() }); setRegName(''); setRegDept(''); }
  }
  function loginB2C() {
    const found = custByCode(customers, custCode);
    if (!found) { notify('お客様コードが見つかりません'); return; }
    onReady(found);
  }
  function submitReg() {
    if (!regName.trim()) { notify('お名前を入力してください'); return; }
    if (reg.kind === 'b2b') { const c = onAddCustomer({ type: 'b2b', companyId: reg.companyId, empNo: reg.empNo, dept: regDept.trim(), name: regName.trim() }); onReady(c, 'registered'); }
    else { const c = onAddCustomer({ type: 'b2c', name: regName.trim(), tel: regTel.trim(), email: regEmail.trim() }); onReady(c, 'issued'); }
  }
  if (reg) {
    return (
      <div className="kl-card">
        <div className="kl-card-h"><div className="kl-card-t"><UserPlus size={17} />新規のお客様情報</div></div>
        {reg.kind === 'b2b' && <div className="kl-hint hint-green" style={{ marginBottom: 14 }}><Building2 size={16} /><span>{reg.companyName}／社員番号 {reg.empNo} で登録します。</span></div>}
        <div className="kl-fields">
          <div className="kl-field"><label>お名前</label><input className="kl-input" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="山田 太郎" /></div>
          {reg.kind === 'b2b'
            ? <div className="kl-field"><label>部署（任意）</label><input className="kl-input" value={regDept} onChange={(e) => setRegDept(e.target.value)} placeholder="製造1課" /></div>
            : <div className="kl-fields kl-grid-2">
                <div className="kl-field"><label>電話番号（任意）</label><input className="kl-input" value={regTel} onChange={(e) => setRegTel(e.target.value)} placeholder="090-1234-5678" /></div>
                <div className="kl-field"><label>メール（任意）</label><input className="kl-input" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="you@example.com" /></div>
              </div>}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="kl-btn kl-btn-ghost" onClick={() => setReg(null)}>戻る</button>
          <button className="kl-btn kl-btn-primary" onClick={submitReg}><Check size={16} />登録して予約へ</button>
        </div>
      </div>
    );
  }
  return (
    <div className="kl-card">
      <div className="kl-card-h"><div className="kl-card-t"><User size={17} />ご予約のはじめに</div></div>
      <div className="kl-field"><label>ご利用区分</label>
        <div className="kl-seg">
          <button className={mode === 'b2b' ? 'is-on' : ''} onClick={() => setMode('b2b')}><Users size={14} />法人（toB）</button>
          <button className={mode === 'b2c' ? 'is-on' : ''} onClick={() => setMode('b2c')}><User size={14} />個人（toC）</button>
        </div>
      </div>
      {mode === 'b2b' ? (
        <div className="kl-fields" style={{ marginTop: 14 }}>
          <div className="kl-fields kl-grid-2">
            <div className="kl-field"><label>企業コード</label><input className="kl-input" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} placeholder="YMD-4471" /></div>
            <div className="kl-field"><label>社員番号</label><input className="kl-input" value={empNo} onChange={(e) => setEmpNo(e.target.value)} placeholder="1024" /></div>
          </div>
          <button className="kl-btn kl-btn-primary" onClick={loginB2B}><Check size={16} />確認する</button>
          <div className="kl-hint hint-green"><AlertCircle size={16} /><span>はじめての方は、コード確認後にお名前をご登録いただけます。<br /><span style={{ opacity: .85 }}>デモ用企業コード: YMD-4471 / TFW-2208 / MNT-6033（社員番号: 1024 など）</span></span></div>
        </div>
      ) : (
        <div className="kl-fields" style={{ marginTop: 14 }}>
          <div className="kl-field"><label>お客様コード</label><input className="kl-input" value={custCode} onChange={(e) => setCustCode(e.target.value)} placeholder="C-8F3KQ" /></div>
          <button className="kl-btn kl-btn-primary" onClick={loginB2C}><Check size={16} />確認する</button>
          <div className="kl-divider">または</div>
          <button className="kl-btn kl-btn-ghost" onClick={() => { setReg({ kind: 'b2c' }); setRegName(''); setRegTel(''); setRegEmail(''); }}><UserPlus size={16} />新規のお客様として登録</button>
          <div className="kl-hint hint-green"><AlertCircle size={16} /><span>デモ用お客様コード: C-8F3KQ / C-1X9ZM</span></div>
        </div>
      )}
    </div>
  );
}

function PublicReserve({ companies, customers, sessions, reservations, onBook, onAddCustomer, onExit, notify }) {
  const [me, setMe] = useState(null);
  const [issued, setIssued] = useState(null);
  function ready(c, flag) { setMe(c); if (flag === 'issued') setIssued(c.code); }
  return (
    <div className="kl-public">
      <header className="kl-top">
        <div className="kl-top-in">
          <div className="kl-brand"><SpineMark size={26} /><div><div className="kl-brand-name">骨ラボ</div><div className="kl-brand-sub">お客様 予約フォーム</div></div></div>
          <button className="kl-btn kl-btn-ghost kl-btn-sm" onClick={onExit}><ChevronLeft size={15} />トップへ</button>
        </div>
      </header>
      <main className="kl-main"><div className="kl-shell" style={{ maxWidth: 680 }}>
        <div className="kl-intro"><h1>ご予約フォーム</h1><p>はじめての方は登録のうえ、空いている時間枠（20分）からご予約いただけます。発行されるお客様コードはマイページのログインに使用します。</p></div>
        {!me ? <IdentifyPanel companies={companies} customers={customers} onReady={ready} onAddCustomer={onAddCustomer} notify={notify} /> : (
          <>
            <div className="kl-card"><div className="kl-prof">
              <div className="kl-av">{me.name.slice(0, 1)}</div>
              <div className="kl-prof-info"><div className="kl-cust-name">{me.name} さん <span className={`kl-badge ${me.type === 'b2b' ? 'b2b' : 'b2c'}`}>{me.type === 'b2b' ? '法人' : '個人'}</span></div><div className="kl-meta-line"><span className="kl-code">{me.code}</span>{me.type === 'b2b' && <span><Building2 size={13} />{companies.find((c) => c.id === me.companyId)?.name}</span>}</div></div>
              <button className="kl-btn kl-btn-ghost kl-btn-sm" onClick={() => { setMe(null); setIssued(null); }}>切替</button>
            </div></div>
            {issued && <div className="kl-codecard"><ClipboardList size={20} color="#487059" /><div><div style={{ fontSize: 12, color: 'var(--green-deep)', fontWeight: 700, marginBottom: 2 }}>お客様コードを発行しました（マイページのログインに使用）</div><div className="big">{issued}</div></div></div>}
            <BookingPanel me={me} companies={companies} sessions={sessions} reservations={reservations} onBook={onBook} notify={notify} />
            <MyReservations me={me} companies={companies} sessions={sessions} reservations={reservations} onCancel={null} />
          </>
        )}
      </div></main>
    </div>
  );
}

function CustomerPortal({ me, companies, sessions, reservations, onBook, onCancel, onLogout, notify }) {
  const [tab, setTab] = useState('home');
  return (
    <div className="kl-portal">
      <PortalHeader title="お客様マイページ" subtitle={`${me.name} さん`} onLogout={onLogout} icon={User} />
      <main className="kl-main"><div className="kl-shell" style={{ maxWidth: 760 }}>
        <div className="kl-seg" style={{ maxWidth: 380, marginBottom: 18 }}>
          <button className={tab === 'home' ? 'is-on' : ''} onClick={() => setTab('home')}><ClipboardList size={14} />予約状況・カルテ</button>
          <button className={tab === 'book' ? 'is-on' : ''} onClick={() => setTab('book')}><Plus size={14} />新規予約</button>
        </div>
        {tab === 'home' ? (
          <>
            <MyReservations me={me} companies={companies} sessions={sessions} reservations={reservations} onCancel={onCancel} />
            <MyKarte me={me} companies={companies} />
          </>
        ) : <BookingPanel me={me} companies={companies} sessions={sessions} reservations={reservations} onBook={onBook} notify={notify} />}
      </div></main>
    </div>
  );
}

/* ----------------------------- Corporate portal --------------------------- */
function CorporatePortal({ company, customers, sessions, reservations, onLogout, notify }) {
  const [tab, setTab] = useState('status');
  const [callout, setCallout] = useState(null);
  const [msg, setMsg] = useState('');
  const today = localDate();
  const upcoming = sessions.filter((s) => s.companyId === company.id && s.date >= today).sort(byDateTime);
  const employees = customers.filter((c) => c.type === 'b2b' && c.companyId === company.id).sort((a, b) => (a.empNo || '').localeCompare(b.empNo || ''));

  let totalSlots = 0, booked = 0;
  upcoming.forEach((s) => { totalSlots += slotsOf(s.start, s.end).length; booked += reservations.filter((r) => r.sessionId === s.id).length; });
  const open = totalSlots - booked;
  const rate = totalSlots ? Math.round((booked / totalSlots) * 100) : 0;

  function openCallout(s) {
    const slots = slotsOf(s.start, s.end);
    const taken = new Set(reservations.filter((r) => r.sessionId === s.id).map((r) => r.slot));
    const openSlots = slots.filter((t) => !taken.has(t));
    setMsg(`【骨ラボ 出張施術のご案内】\n${fmtDate(s.date)} に骨ラボの施術日があります（お一人20分）。\n\n空いている時間枠：\n${openSlots.map((t) => `・${t}〜`).join('\n')}\n\n腰痛・肩こりが気になる方は、お早めにご予約ください。`);
    setCallout(s);
  }
  async function copy() { const ok = await copyText(msg); notify(ok ? 'メッセージをコピーしました' : '下のテキストを選択してコピーしてください'); }

  const visitCount = (cid) => reservations.filter((r) => r.customerId === cid).length;
  const lastVisit = (cid) => {
    const past = reservations.filter((r) => r.customerId === cid).map((r) => sessions.find((s) => s.id === r.sessionId)).filter((s) => s && s.date < today).sort((a, b) => byDateTime(b, a));
    return past[0]?.date || null;
  };
  const hasUpcoming = (cid) => reservations.some((r) => r.customerId === cid && (sessions.find((s) => s.id === r.sessionId)?.date || '') >= today);

  return (
    <div className="kl-portal">
      <PortalHeader title="企業ご担当者ページ" subtitle={company.name} onLogout={onLogout} icon={Building2} />
      <main className="kl-main"><div className="kl-shell">
        <div className="kl-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div><div className="kl-card-t" style={{ fontSize: 16 }}><Building2 size={17} />{company.name}</div><div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 4 }}>{company.industry}</div></div>
          <span className="kl-code">{company.code}</span>
        </div>

        <div className="kl-seg" style={{ maxWidth: 420, marginBottom: 18 }}>
          <button className={tab === 'status' ? 'is-on' : ''} onClick={() => setTab('status')}><Calendar size={14} />予約状況</button>
          <button className={tab === 'emp' ? 'is-on' : ''} onClick={() => setTab('emp')}><Users size={14} />登録社員リスト</button>
        </div>

        {tab === 'status' ? (
          <>
            <div className="kl-stats">
              <div className="kl-stat"><div className="v kl-mono">{upcoming.length}</div><div className="l">今後の施術日</div></div>
              <div className="kl-stat accent"><div className="v kl-mono">{booked}<small>/{totalSlots}</small></div><div className="l">予約済みの枠</div></div>
              <div className="kl-stat warn"><div className="v kl-mono">{open}</div><div className="l">空いている枠</div></div>
              <div className="kl-stat"><div className="v kl-mono">{rate}<small>%</small></div><div className="l">予約率</div></div>
            </div>
            <div className="kl-sub">施術日ごとの予約状況</div>
            {upcoming.length === 0 && <div className="kl-card"><div className="kl-empty"><Calendar size={28} /><div>今後の施術日はまだ登録されていません。</div></div></div>}
            {upcoming.map((s) => {
              const slots = slotsOf(s.start, s.end);
              const taken = Object.fromEntries(reservations.filter((r) => r.sessionId === s.id).map((r) => [r.slot, r]));
              const bk = Object.keys(taken).length; const op = slots.length - bk;
              return (
                <div className="kl-sess" key={s.id}>
                  <div className="kl-sess-h">
                    <div><div className="kl-sess-date">{fmtDate(s.date)}</div><div className="kl-sess-meta"><span><Clock size={13} />{s.start}〜{s.end}</span><span><Stethoscope size={13} />{s.practitioner}</span><span>{bk}/{slots.length}名</span></div></div>
                    {op > 0 ? <button className="kl-btn kl-btn-amber kl-btn-sm" onClick={() => openCallout(s)}><Megaphone size={14} />空き枠を呼びかける</button> : <span className="kl-badge full">満員</span>}
                  </div>
                  <div className="kl-sess-b">
                    <div className="kl-fill"><i style={{ width: `${slots.length ? (bk / slots.length) * 100 : 0}%` }} /></div>
                    <div className="kl-roster">
                      {slots.map((t) => {
                        const r = taken[t];
                        const cu = r ? custById(customers, r.customerId) : null;
                        return r
                          ? <div className="kl-rrow" key={t}><div className="kl-rtime kl-mono">{t}</div><div className="kl-rwho"><div className="kl-rname">{r.name}</div>{(r.dept || cu?.empNo) && <div className="kl-rdept">{[r.dept, cu?.empNo ? `社員番号 ${cu.empNo}` : ''].filter(Boolean).join('・')}</div>}</div></div>
                          : <div className="kl-rrow open" key={t}><div className="kl-rtime kl-mono">{t}</div><div className="kl-rwho"><div className="kl-rdept">空き枠 — 呼びかけのチャンス</div></div></div>;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <div className="kl-sub">登録社員リスト（{employees.length}名）</div>
            {employees.length === 0 && <div className="kl-card"><div className="kl-empty"><Users size={28} /><div>登録されている社員がいません。</div></div></div>}
            {employees.map((e) => (
              <div className="kl-cust" key={e.id} style={{ cursor: 'default' }}>
                <div className="kl-av">{e.name.slice(0, 1)}</div>
                <div className="kl-cust-main">
                  <div className="kl-cust-name">{e.name}{hasUpcoming(e.id) && <span className="kl-badge green">予約あり</span>}</div>
                  <div className="kl-cust-sub"><span>社員番号 {e.empNo || '—'}</span>{e.dept && <span>{e.dept}</span>}</div>
                </div>
                <div className="kl-cust-side"><div className="vc kl-mono">{visitCount(e.id)}<span style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}> 回</span></div><div className="lv">{lastVisit(e.id) ? `前回 ${fmtDate(lastVisit(e.id))}` : '施術履歴なし'}</div></div>
              </div>
            ))}
            <div className="kl-hint" style={{ marginTop: 6 }}><ShieldCheck size={16} /><span>社員リストには氏名・社員番号・部署・施術回数のみを表示します。症状や施術内容などのカルテ情報は表示されません。</span></div>
          </>
        )}

        {callout && (
          <Modal title="空き枠の呼びかけメッセージ" onClose={() => setCallout(null)} footer={<>
            <button className="kl-btn kl-btn-ghost" onClick={() => setCallout(null)}>閉じる</button>
            <button className="kl-btn kl-btn-primary" onClick={copy}><Copy size={15} />コピー</button>
          </>}>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>社内チャットや掲示板に貼り付けてご利用ください。内容は自由に編集できます。</p>
            <textarea className="kl-area" style={{ minHeight: 200 }} value={msg} onChange={(e) => setMsg(e.target.value)} />
          </Modal>
        )}
      </div></main>
    </div>
  );
}

/* ------------------------------ Provider view ----------------------------- */
function SessionForm({ companies, onClose, onSubmit, notify }) {
  const [companyId, setCompanyId] = useState(companies[0]?.id || SOLO);
  const [date, setDate] = useState('');
  const [start, setStart] = useState('10:00');
  const [end, setEnd] = useState('12:00');
  const [practitioner, setPractitioner] = useState('');
  const timesValid = start && end && toMin(end) > toMin(start);
  const valid = date && timesValid && practitioner.trim();
  const slotCount = timesValid ? slotsOf(start, end).length : 0;
  return (
    <Modal title="施術日を追加" onClose={onClose} footer={<>
      <button className="kl-btn kl-btn-ghost" onClick={onClose}>やめる</button>
      <button className="kl-btn kl-btn-primary" disabled={!valid} onClick={() => valid ? onSubmit({ companyId: companyId === SOLO ? null : companyId, date, start, end, practitioner: practitioner.trim() }) : notify('入力内容をご確認ください')}><Check size={16} />追加する</button>
    </>}>
      <div className="kl-fields">
        <div className="kl-field"><label>対象</label><select className="kl-select" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
          <option value={SOLO}>個人向け（toC・一般枠）</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select></div>
        <div className="kl-field"><label>日付</label><input type="date" className="kl-input" value={date} min={localDate()} onChange={(e) => setDate(e.target.value)} /></div>
        <div className="kl-fields kl-grid-2">
          <div className="kl-field"><label>開始</label><input type="time" step="600" className="kl-input" value={start} onChange={(e) => setStart(e.target.value)} /></div>
          <div className="kl-field"><label>終了</label><input type="time" step="600" className="kl-input" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
        </div>
        <div className="kl-field"><label>担当施術者</label><input className="kl-input" value={practitioner} onChange={(e) => setPractitioner(e.target.value)} placeholder="田中 健" /></div>
        {slotCount > 0 && <div className="kl-hint hint-green"><ClipboardList size={16} /><span>20分 × <b>{slotCount}枠</b> が自動で作成されます。</span></div>}
        {start && end && toMin(end) <= toMin(start) && <div className="kl-hint"><AlertCircle size={16} /><span>終了時間は開始時間より後に設定してください。</span></div>}
      </div>
    </Modal>
  );
}

function CompanyForm({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const valid = name.trim();
  return (
    <Modal title="提携企業を追加" onClose={onClose} footer={<>
      <button className="kl-btn kl-btn-ghost" onClick={onClose}>やめる</button>
      <button className="kl-btn kl-btn-primary" disabled={!valid} onClick={() => onSubmit({ name: name.trim(), industry: industry.trim() || 'その他' })}><Check size={16} />追加する</button>
    </>}>
      <div className="kl-fields">
        <div className="kl-field"><label>企業名</label><input className="kl-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="山田製作所" /></div>
        <div className="kl-field"><label>業種（任意）</label><input className="kl-input" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="製造業" /></div>
        <div className="kl-hint hint-green"><AlertCircle size={16} /><span>登録時に企業コードが自動発行されます。</span></div>
      </div>
    </Modal>
  );
}

function ProviderView({ companies, customers, sessions, reservations, notify, onAddSession, onCancel, onDeleteSession, onAddCompany, onSetTreatment }) {
  const [showSession, setShowSession] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [tab, setTab] = useState('up');
  const [treat, setTreat] = useState(null);
  const today = localDate();
  const isUp = tab === 'up';
  const filtered = sessions.filter((s) => (isUp ? s.date >= today : s.date < today)).sort((a, b) => (isUp ? byDateTime(a, b) : byDateTime(b, a)));
  const upcomingAll = sessions.filter((s) => s.date >= today);
  const totalRes = upcomingAll.reduce((n, s) => n + reservations.filter((r) => r.sessionId === s.id).length, 0);
  const companyIds = new Set(upcomingAll.map((s) => s.companyId).filter(Boolean));
  const soloUp = upcomingAll.filter((s) => !s.companyId).length;
  const cName = (id) => (id ? (companies.find((c) => c.id === id)?.name || '—') : '個人向け（一般）');
  const cInd = (id) => (id ? (companies.find((c) => c.id === id)?.industry || '') : 'toC');

  const groups = [];
  filtered.forEach((s) => { let g = groups.find((x) => x.date === s.date); if (!g) { g = { date: s.date, items: [] }; groups.push(g); } g.items.push(s); });

  return (
    <>
      <div className="kl-card">
        <div className="kl-card-h">
          <div className="kl-card-t"><Activity size={17} />施術スケジュール管理</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="kl-btn kl-btn-ghost kl-btn-sm" onClick={() => setShowCompany(true)}><Plus size={14} />企業</button>
            <button className="kl-btn kl-btn-primary kl-btn-sm" onClick={() => setShowSession(true)}><Plus size={14} />施術日を追加</button>
          </div>
        </div>
        <div className="kl-stats" style={{ margin: 0 }}>
          <div className="kl-stat accent"><div className="v kl-mono">{upcomingAll.length}</div><div className="l">今後の施術日</div></div>
          <div className="kl-stat"><div className="v kl-mono">{totalRes}</div><div className="l">予約合計</div></div>
          <div className="kl-stat"><div className="v kl-mono">{companyIds.size}</div><div className="l">担当法人数</div></div>
          <div className="kl-stat"><div className="v kl-mono">{soloUp}</div><div className="l">個人枠（今後）</div></div>
        </div>
      </div>

      <div className="kl-sub" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span>{isUp ? '今後の予約一覧（日付順）' : '過去の施術（記録の入力）'}</span>
        <div className="kl-seg" style={{ width: 'auto', flex: '0 0 auto' }}>
          <button className={isUp ? 'is-on' : ''} onClick={() => setTab('up')}>今後</button>
          <button className={!isUp ? 'is-on' : ''} onClick={() => setTab('past')}>過去</button>
        </div>
      </div>

      {groups.length === 0 && <div className="kl-card"><div className="kl-empty"><Calendar size={28} /><div>{isUp ? '今後の施術日がありません。「施術日を追加」から登録してください。' : '過去の施術はありません。'}</div></div></div>}
      {groups.map((g) => (
        <div className="kl-daygroup" key={g.date}>
          <div className="kl-day-h"><span className="d">{fmtDate(g.date)}</span>{g.date === today && <span className="kl-today-pill">本日</span>}<span className="line" /></div>
          {g.items.map((s) => {
            const slots = slotsOf(s.start, s.end);
            const taken = Object.fromEntries(reservations.filter((r) => r.sessionId === s.id).map((r) => [r.slot, r]));
            const bk = Object.keys(taken).length;
            return (
              <div className="kl-sess" key={s.id}>
                <div className="kl-sess-h">
                  <div>
                    <div className="kl-sess-date">{cName(s.companyId)} <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>{cInd(s.companyId)}</span></div>
                    <div className="kl-sess-meta"><span><Clock size={13} />{s.start}〜{s.end}</span><span><Stethoscope size={13} />{s.practitioner}</span><span>{bk}/{slots.length}名</span></div>
                  </div>
                  <button className="kl-x" title="この施術日を削除" onClick={() => setConfirm({ kind: 'sess', id: s.id, label: `${fmtDate(s.date)} ${cName(s.companyId)}の施術日` })}><Trash2 size={16} /></button>
                </div>
                <div className="kl-sess-b">
                  <div className="kl-roster">
                    {slots.map((t) => {
                      const r = taken[t];
                      if (!r) return <div className="kl-rrow open" key={t}><div className="kl-rtime kl-mono">{t}</div><div className="kl-rwho"><div className="kl-rdept">空き</div></div></div>;
                      const cu = custById(customers, r.customerId);
                      return (
                        <div className="kl-rrow" key={t}>
                          <div className="kl-rtime kl-mono">{t}</div>
                          <div className="kl-rwho">
                            <div className="kl-rname">{r.name} {cu && <span className={`kl-badge ${cu.type === 'b2b' ? 'b2b' : 'b2c'}`} style={{ marginLeft: 4 }}>{cu.type === 'b2b' ? '法人' : '個人'}</span>}</div>
                            {r.dept && <div className="kl-rdept">{r.dept}</div>}
                            {r.note && <div className="kl-rnote">💬 {r.note}</div>}
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                              {r.done ? <span className="kl-badge done"><Check size={12} />施術済み</span> : <span className="kl-badge todo">予定</span>}
                              {r.treatment && <span style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>記録あり</span>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <button className="kl-btn kl-btn-ghost kl-btn-sm" onClick={() => setTreat({ res: r, label: `${fmtDate(s.date)} ${t}〜` })}><FileText size={13} />記録</button>
                            <button className="kl-btn kl-btn-danger kl-btn-sm" onClick={() => setConfirm({ kind: 'res', id: r.id, label: `${r.name}さんの予約（${fmtDate(s.date)} ${t}）` })}><X size={14} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {showSession && <SessionForm companies={companies} notify={notify} onClose={() => setShowSession(false)} onSubmit={(d) => { onAddSession(d); setShowSession(false); }} />}
      {showCompany && <CompanyForm onClose={() => setShowCompany(false)} onSubmit={(d) => { onAddCompany(d); setShowCompany(false); }} />}
      {treat && <TreatmentModal res={treat.res} sessionLabel={treat.label} onClose={() => setTreat(null)} onSave={(id, tx, dn) => { onSetTreatment(id, tx, dn); setTreat(null); }} />}

      <Confirm open={!!confirm} danger
        message={confirm ? (confirm.kind === 'sess' ? `${confirm.label}を削除します。関連する予約もすべて削除されます。よろしいですか？` : `${confirm.label}を取り消します。よろしいですか？`) : ''}
        confirmLabel={confirm?.kind === 'sess' ? '削除する' : '取り消す'}
        onCancel={() => setConfirm(null)}
        onConfirm={() => { if (confirm.kind === 'sess') onDeleteSession(confirm.id); else onCancel(confirm.id); setConfirm(null); }} />
    </>
  );
}

/* ------------------------------- CRM / Karte ------------------------------ */
function CustomerForm({ companies, onClose, onSubmit, notify }) {
  const [type, setType] = useState('b2b');
  const [companyId, setCompanyId] = useState(companies[0]?.id || '');
  const [empNo, setEmpNo] = useState('');
  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const valid = name.trim() && (type === 'b2c' || (companyId && empNo.trim()));
  return (
    <Modal title="新規カルテの作成" onClose={onClose} footer={<>
      <button className="kl-btn kl-btn-ghost" onClick={onClose}>やめる</button>
      <button className="kl-btn kl-btn-primary" disabled={!valid} onClick={() => valid ? onSubmit({ type, companyId, empNo: empNo.trim(), dept: dept.trim(), name: name.trim(), tel: tel.trim(), email: email.trim() }) : notify('入力内容をご確認ください')}><Check size={16} />作成する</button>
    </>}>
      <div className="kl-field"><label>区分</label>
        <div className="kl-seg">
          <button className={type === 'b2b' ? 'is-on' : ''} onClick={() => setType('b2b')}><Users size={14} />法人（toB）</button>
          <button className={type === 'b2c' ? 'is-on' : ''} onClick={() => setType('b2c')}><User size={14} />個人（toC）</button>
        </div>
      </div>
      <div className="kl-fields" style={{ marginTop: 12 }}>
        <div className="kl-field"><label>お名前</label><input className="kl-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="山田 太郎" /></div>
        {type === 'b2b' ? (
          <>
            <div className="kl-field"><label>企業</label><select className="kl-select" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>{companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className="kl-fields kl-grid-2">
              <div className="kl-field"><label>社員番号</label><input className="kl-input" value={empNo} onChange={(e) => setEmpNo(e.target.value)} placeholder="1024" /></div>
              <div className="kl-field"><label>部署（任意）</label><input className="kl-input" value={dept} onChange={(e) => setDept(e.target.value)} placeholder="製造1課" /></div>
            </div>
          </>
        ) : (
          <div className="kl-fields kl-grid-2">
            <div className="kl-field"><label>電話番号（任意）</label><input className="kl-input" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="090-1234-5678" /></div>
            <div className="kl-field"><label>メール（任意）</label><input className="kl-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
          </div>
        )}
        <div className="kl-hint hint-green"><AlertCircle size={16} /><span>作成時にお客様コードが自動発行されます。</span></div>
      </div>
    </Modal>
  );
}

function CRMView({ companies, customers, sessions, reservations, onUpdateCustomer, onMergeCustomers, onSetTreatment, onAddCustomer, notify }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selId, setSelId] = useState(null);
  const [treat, setTreat] = useState(null);
  const [merge, setMerge] = useState(false);
  const [mergeSec, setMergeSec] = useState('');
  const [confirmMerge, setConfirmMerge] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [tags, setTags] = useState([]);
  const [fuDate, setFuDate] = useState('');
  const [fuNote, setFuNote] = useState('');
  const today = localDate();

  const cName = (id) => companies.find((c) => c.id === id)?.name || '個人';
  const sel = selId ? customers.find((c) => c.id === selId) : null;

  useEffect(() => {
    if (sel) { setSymptoms(sel.symptoms || ''); setTags(sel.tags || []); setFuDate(sel.followUpAt || ''); setFuNote(sel.followUpNote || ''); setMerge(false); setMergeSec(''); }
  }, [selId, customers]);

  const enrich = (c) => {
    const vs = visitsOf(reservations, sessions, c.id);
    const past = vs.filter((v) => v.session.date < today);
    const upcoming = vs.filter((v) => v.session.date >= today).length;
    return { visits: vs, count: vs.length, last: past[0]?.session?.date || null, upcoming };
  };
  const counts = {
    all: customers.length,
    b2b: customers.filter((c) => c.type === 'b2b').length,
    b2c: customers.filter((c) => c.type === 'b2c').length,
    follow: customers.filter((c) => c.followUpAt && !c.followDone).length,
  };
  const q = query.trim().toLowerCase();
  const list = customers.filter((c) => {
    if (filter === 'b2b' && c.type !== 'b2b') return false;
    if (filter === 'b2c' && c.type !== 'b2c') return false;
    if (filter === 'follow' && !(c.followUpAt && !c.followDone)) return false;
    if (!q) return true;
    return [c.name, c.code, c.empNo, c.tel, c.email, cName(c.companyId)].join(' ').toLowerCase().includes(q);
  });

  function saveKarte() { onUpdateCustomer(sel.id, { symptoms: symptoms.trim(), tags }); notify('カルテを保存しました'); }
  function toggleTag(t) { setTags((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t])); }
  function saveFollow() { if (!fuDate) { notify('フォロー予定日を選択してください'); return; } onUpdateCustomer(sel.id, { followUpAt: fuDate, followUpNote: fuNote.trim(), followDone: false }); notify('フォローアップを設定しました'); }
  function clearFollow() { onUpdateCustomer(sel.id, { followUpAt: '', followUpNote: '', followDone: false }); setFuDate(''); setFuNote(''); notify('フォローアップを解除しました'); }
  function doneFollow() { onUpdateCustomer(sel.id, { followDone: true }); notify('フォローアップを完了にしました'); }
  function toggleDisclose(k) { const cur = discloseOf(sel); onUpdateCustomer(sel.id, { disclose: { ...cur, [k]: !cur[k] } }); }

  /* ---- list view ---- */
  if (!sel) {
    return (
      <>
        <div className="kl-card">
          <div className="kl-card-h"><div className="kl-card-t"><ClipboardList size={17} />お客様カルテ</div><button className="kl-btn kl-btn-primary kl-btn-sm" onClick={() => setShowNew(true)}><UserPlus size={14} />新規カルテ</button></div>
          <div className="kl-field"><div style={{ position: 'relative' }}><Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--ink-soft)' }} /><input className="kl-input" style={{ paddingLeft: 36 }} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="名前・コード・社員番号で検索" /></div></div>
          <div className="kl-chips" style={{ marginTop: 12 }}>
            {[['all', 'すべて'], ['b2b', '法人'], ['b2c', '個人'], ['follow', '要フォロー']].map(([k, l]) => (
              <button key={k} className={`kl-chip ${filter === k ? 'is-on' : ''}`} onClick={() => setFilter(k)}>{l}<span className="n">{counts[k]}</span></button>
            ))}
          </div>
        </div>

        {counts.follow > 0 && filter !== 'follow' && <div className="kl-hint"><Megaphone size={16} /><span>フォローアップ予定のお客様が <b>{counts.follow}名</b> います。「要フォロー」で確認できます。</span></div>}

        <div className="kl-sub">お客様一覧（{list.length}名）</div>
        {list.length === 0 && <div className="kl-card"><div className="kl-empty"><User size={28} /><div>該当するお客様がいません。</div></div></div>}
        {list.map((c) => {
          const info = enrich(c);
          return (
            <button className="kl-cust" key={c.id} onClick={() => setSelId(c.id)}>
              <div className="kl-av">{c.name.slice(0, 1)}</div>
              <div className="kl-cust-main">
                <div className="kl-cust-name">{c.name}
                  <span className={`kl-badge ${c.type === 'b2b' ? 'b2b' : 'b2c'}`}>{c.type === 'b2b' ? '法人' : '個人'}</span>
                  {c.followUpAt && !c.followDone && <span className="kl-badge follow">要フォロー</span>}
                </div>
                <div className="kl-cust-sub">
                  <span className="kl-code">{c.code}</span>
                  <span>{c.type === 'b2b' ? `${cName(c.companyId)}・No.${c.empNo}` : '個人のお客様'}</span>
                </div>
              </div>
              <div className="kl-cust-side">
                <div className="vc kl-mono">{info.count}<span style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}> 回</span></div>
                <div className="lv">{info.last ? `前回 ${fmtDate(info.last)}` : '施術履歴なし'}</div>
              </div>
            </button>
          );
        })}

        {showNew && <CustomerForm companies={companies} notify={notify} onClose={() => setShowNew(false)} onSubmit={(d) => { onAddCustomer(d); setShowNew(false); }} />}
      </>
    );
  }

  /* ---- detail view ---- */
  const info = enrich(sel);
  const others = customers.filter((c) => c.id !== sel.id);
  const secObj = mergeSec ? customers.find((c) => c.id === mergeSec) : null;
  const secVisits = mergeSec ? visitsOf(reservations, sessions, mergeSec).length : 0;

  return (
    <>
      <button className="kl-back" onClick={() => setSelId(null)}><ChevronLeft size={16} />カルテ一覧へ戻る</button>

      <div className="kl-card">
        <div className="kl-prof">
          <div className="kl-av">{sel.name.slice(0, 1)}</div>
          <div className="kl-prof-info">
            <div className="kl-cust-name">{sel.name}
              <span className={`kl-badge ${sel.type === 'b2b' ? 'b2b' : 'b2c'}`}>{sel.type === 'b2b' ? '法人' : '個人'}</span>
              {sel.followUpAt && !sel.followDone && <span className="kl-badge follow">要フォロー</span>}
            </div>
            <div className="kl-meta-line">
              <span className="kl-code">{sel.code}</span>
              {sel.type === 'b2b'
                ? <span><Building2 size={13} />{cName(sel.companyId)}・社員番号 {sel.empNo}{sel.dept ? `・${sel.dept}` : ''}</span>
                : <>{sel.tel && <span><Phone size={13} />{sel.tel}</span>}{sel.email && <span><Mail size={13} />{sel.email}</span>}</>}
              <span style={{ fontSize: 11.5 }}>登録日 {fmtDate(sel.createdAt)}・施術 {info.count}回</span>
              {sel.mergedFrom && sel.mergedFrom.length > 0 && <span style={{ fontSize: 11.5 }}><GitMerge size={12} /> 統合済み: {sel.mergedFrom.map((m) => m.code).join(', ')}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="kl-card">
        <div className="kl-card-t" style={{ fontSize: 14, marginBottom: 12 }}><FileText size={15} />主訴・症状メモ</div>
        <textarea className="kl-area" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="慢性的な症状、既往、施術方針、注意点など" />
        <div className="kl-field" style={{ marginTop: 12 }}>
          <label>症状タグ</label>
          <div className="kl-tags">{TAGS.map((t) => <button key={t} className={`kl-tag ${tags.includes(t) ? 'is-on' : ''}`} onClick={() => toggleTag(t)}>{t}</button>)}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}><button className="kl-btn kl-btn-primary kl-btn-sm" onClick={saveKarte}><Check size={15} />カルテを保存</button></div>
      </div>

      <div className="kl-card">
        <div className="kl-card-t" style={{ fontSize: 14, marginBottom: 12 }}><Megaphone size={15} />フォローアップ</div>
        {sel.followUpAt && !sel.followDone && <div className="kl-hint" style={{ marginBottom: 12 }}><Calendar size={16} /><span><b>{fmtDate(sel.followUpAt)}</b> に予定{sel.followUpNote ? `：${sel.followUpNote}` : ''}</span></div>}
        {sel.followUpAt && sel.followDone && <div className="kl-hint hint-green" style={{ marginBottom: 12 }}><Check size={16} /><span>このフォローアップは完了済みです。</span></div>}
        <div className="kl-fields kl-grid-2">
          <div className="kl-field"><label>フォロー予定日</label><input type="date" className="kl-input" value={fuDate} min={localDate()} onChange={(e) => setFuDate(e.target.value)} /></div>
          <div className="kl-field"><label>メモ（任意）</label><input className="kl-input" value={fuNote} onChange={(e) => setFuNote(e.target.value)} placeholder="次回予約の確認 など" /></div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14, flexWrap: 'wrap' }}>
          {sel.followUpAt && <button className="kl-btn kl-btn-ghost kl-btn-sm" onClick={clearFollow}>解除</button>}
          {sel.followUpAt && !sel.followDone && <button className="kl-btn kl-btn-ghost kl-btn-sm" onClick={doneFollow}><Check size={14} />完了にする</button>}
          <button className="kl-btn kl-btn-primary kl-btn-sm" onClick={saveFollow}><Check size={15} />設定する</button>
        </div>
      </div>

      <div className="kl-card">
        <div className="kl-card-t" style={{ fontSize: 14, marginBottom: 12 }}><History size={15} />施術履歴（{info.count}件）</div>
        {info.visits.length === 0 && <div className="kl-empty" style={{ padding: 16 }}>施術履歴はまだありません。</div>}
        {info.visits.map((v) => (
          <div className="kl-visit" key={v.id}>
            <div className="kl-visit-h">
              <div>
                <div className="kl-visit-d"><Calendar size={13} />{fmtDate(v.session.date)} <span className="kl-mono" style={{ fontWeight: 700, color: 'var(--ink-soft)', fontSize: 12.5 }}>{v.slot}〜</span></div>
                <div className="kl-visit-meta"><span><Stethoscope size={13} />{v.session.practitioner}</span><span>{v.session.companyId ? cName(v.session.companyId) : '個人向け'}</span></div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {v.done ? <span className="kl-badge done"><Check size={12} />施術済み</span> : (v.session.date < today ? <span className="kl-badge todo">記録待ち</span> : <span className="kl-badge todo">予定</span>)}
                <button className="kl-btn kl-btn-ghost kl-btn-sm" onClick={() => setTreat({ res: v, label: `${fmtDate(v.session.date)} ${v.slot}〜` })}><FileText size={13} />記録</button>
              </div>
            </div>
            {v.note && <div className="kl-visit-note"><span className="lab">主訴・ご相談</span>{v.note}</div>}
            {v.treatment ? <div className="kl-visit-tx"><span className="lab">施術記録</span>{v.treatment}</div> : <div className="kl-visit-note" style={{ opacity: .7 }}><span className="lab">施術記録</span>未記録</div>}
          </div>
        ))}
      </div>

      <div className="kl-card">
        <div className="kl-card-t" style={{ fontSize: 14, marginBottom: 6 }}><ShieldCheck size={15} />お客様への開示設定</div>
        <p style={{ margin: '0 0 12px', fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>お客様マイページに表示する情報を選択します。オフの項目はお客様には表示されません（施術日時はお客様自身の予約のため常に表示されます）。</p>
        {[['symptoms', '主訴・症状メモ'], ['tags', '症状タグ'], ['treatment', '施術記録（所見）']].map(([k, label]) => {
          const on = !!discloseOf(sel)[k];
          return (
            <div className="kl-disc" key={k}>
              <div className="kl-disc-l">{on ? <Eye size={15} color="#487059" /> : <EyeOff size={15} color="#9aa3b0" />}<span>{label}</span></div>
              <button className={`kl-toggle ${on ? 'is-on' : ''}`} onClick={() => toggleDisclose(k)} aria-label="開示切替"><span className="knob" /></button>
            </div>
          );
        })}
      </div>

      <div className="kl-merge" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}><GitMerge size={15} />カルテの統合（法人⇄個人の切替など）</div>
        <p style={{ margin: '0 0 12px', fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>別のカルテをこのカルテに統合します。統合元の施術履歴・症状メモがこのカルテに引き継がれ、統合元は削除されます。例：退職して個人利用に変わったお客様の法人カルテを、新しい個人カルテに統合します。</p>
        {!merge ? (
          <button className="kl-btn kl-btn-ghost kl-btn-sm" onClick={() => setMerge(true)}><GitMerge size={14} />別のカルテと統合する</button>
        ) : (
          <div className="kl-fields">
            <div className="kl-field"><label>統合元のカルテ（このカルテに取り込む）</label>
              <select className="kl-select" value={mergeSec} onChange={(e) => setMergeSec(e.target.value)}>
                <option value="">選択してください</option>
                {others.map((o) => <option key={o.id} value={o.id}>{o.name}（{o.type === 'b2b' ? '法人' : '個人'}・{o.code}）</option>)}
              </select>
            </div>
            {secObj && <div className="kl-hint"><AlertCircle size={16} /><span>「{secObj.name}」の施術履歴 {secVisits}件 と症状メモを「{sel.name}」に統合します。この操作は取り消せません。</span></div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="kl-btn kl-btn-ghost" onClick={() => { setMerge(false); setMergeSec(''); }}>やめる</button>
              <button className="kl-btn kl-btn-primary" disabled={!mergeSec} onClick={() => setConfirmMerge(true)}><GitMerge size={15} />統合する</button>
            </div>
          </div>
        )}
      </div>

      {treat && <TreatmentModal res={treat.res} sessionLabel={treat.label} onClose={() => setTreat(null)} onSave={(id, tx, dn) => { onSetTreatment(id, tx, dn); setTreat(null); }} />}

      <Confirm open={confirmMerge} confirmLabel="統合する"
        message={secObj ? `「${secObj.name}」を「${sel.name}」に統合します。よろしいですか？` : ''}
        onCancel={() => setConfirmMerge(false)}
        onConfirm={() => { onMergeCustomers(sel.id, mergeSec); setConfirmMerge(false); setMerge(false); setMergeSec(''); }} />
    </>
  );
}

/* --------------------------- Data management ------------------------------ */
const COL_LABELS = { code: 'コード', name: '名称', industry: '業種', type: '区分', company: '企業', date: '日付', time: '時間', practitioner: '担当', slot: '枠', status: '状態' };

const SCHEMAS = {
  companies: {
    label: '企業', icon: Building2, idPrefix: 'c',
    cols: ['code', 'name', 'industry'],
    fields: [
      { k: 'id', label: 'ID', type: 'readonly' },
      { k: 'code', label: '企業コード', type: 'text' },
      { k: 'name', label: '企業名', type: 'text' },
      { k: 'industry', label: '業種', type: 'text' },
    ],
  },
  customers: {
    label: 'お客様', icon: User, idPrefix: 'u',
    cols: ['code', 'type', 'name', 'company'],
    fields: [
      { k: 'id', label: 'ID', type: 'readonly' },
      { k: 'code', label: 'お客様コード', type: 'text' },
      { k: 'type', label: '区分', type: 'select', options: [['b2b', '法人 (b2b)'], ['b2c', '個人 (b2c)']] },
      { k: 'name', label: 'お名前', type: 'text' },
      { k: 'companyId', label: '所属企業', type: 'rel-company', nullable: true, nullLabel: '（個人・なし）' },
      { k: 'empNo', label: '社員番号', type: 'text' },
      { k: 'dept', label: '部署', type: 'text' },
      { k: 'tel', label: '電話番号', type: 'text' },
      { k: 'email', label: 'メール', type: 'text' },
      { k: 'symptoms', label: '主訴・症状メモ', type: 'textarea' },
      { k: 'tags', label: '症状タグ', type: 'tags' },
      { k: 'followUpAt', label: 'フォロー予定日', type: 'date' },
      { k: 'followUpNote', label: 'フォローメモ', type: 'text' },
      { k: 'followDone', label: 'フォロー完了', type: 'bool' },
      { k: 'createdAt', label: '登録日', type: 'date' },
      { k: 'disclose', label: 'お客様への開示', type: 'disclose' },
    ],
  },
  sessions: {
    label: '施術日', icon: Calendar, idPrefix: 's',
    cols: ['date', 'time', 'company', 'practitioner'],
    fields: [
      { k: 'id', label: 'ID', type: 'readonly' },
      { k: 'companyId', label: '対象企業', type: 'rel-company', nullable: true, nullLabel: '個人向け（一般枠）' },
      { k: 'date', label: '日付', type: 'date' },
      { k: 'start', label: '開始', type: 'time' },
      { k: 'end', label: '終了', type: 'time' },
      { k: 'practitioner', label: '担当施術者', type: 'text' },
    ],
  },
  reservations: {
    label: '予約', icon: ClipboardList, idPrefix: 'r',
    cols: ['date', 'slot', 'name', 'status'],
    fields: [
      { k: 'id', label: 'ID', type: 'readonly' },
      { k: 'sessionId', label: '施術日', type: 'rel-session' },
      { k: 'slot', label: '時間枠', type: 'time' },
      { k: 'customerId', label: 'お客様', type: 'rel-customer', nullable: true, nullLabel: '（未ひも付け）' },
      { k: 'name', label: 'お名前（記録）', type: 'text' },
      { k: 'dept', label: '部署（記録）', type: 'text' },
      { k: 'note', label: '主訴メモ', type: 'textarea' },
      { k: 'treatment', label: '施術記録', type: 'textarea' },
      { k: 'done', label: '施術済み', type: 'bool' },
    ],
  },
};

function blankRecord(table, companies, sessions) {
  if (table === 'companies') return { code: '', name: '', industry: '' };
  if (table === 'customers') return { code: '', type: 'b2c', name: '', companyId: null, empNo: '', dept: '', tel: '', email: '', symptoms: '', tags: [], followUpAt: '', followUpNote: '', followDone: false, createdAt: localDate(), mergedFrom: [], disclose: { symptoms: true, tags: true, treatment: false } };
  if (table === 'sessions') return { companyId: null, date: localDate(), start: '10:00', end: '12:00', practitioner: '' };
  return { sessionId: sessions[0]?.id || '', slot: '10:00', customerId: null, name: '', dept: '', note: '', treatment: '', done: false, at: new Date().toISOString() };
}

function RelSelect({ value, onChange, options, nullable, nullLabel }) {
  return (
    <select className="kl-select" value={value == null ? '' : value} onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}>
      {nullable && <option value="">{nullLabel || '（なし）'}</option>}
      {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
    </select>
  );
}

function RecordEditor({ table, record, isAdd, companies, customers, sessions, onClose, onSave }) {
  const schema = SCHEMAS[table];
  const [form, setForm] = useState({ ...record });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const companyOpts = companies.map((c) => ({ id: c.id, label: `${c.name}（${c.code}）` }));
  const customerOpts = customers.map((c) => ({ id: c.id, label: `${c.name}（${c.code}・${c.type === 'b2b' ? '法人' : '個人'}）` }));
  const sessionOpts = sessions.map((s) => ({ id: s.id, label: `${fmtDate(s.date)} ${s.start}〜 ${s.companyId ? (companies.find((c) => c.id === s.companyId)?.name || '—') : '個人向け'}` }));
  const toggleTag = (t) => set('tags', (form.tags || []).includes(t) ? form.tags.filter((x) => x !== t) : [...(form.tags || []), t]);

  return (
    <Modal title={`${schema.label}レコードの${isAdd ? '追加' : '編集'}`} onClose={onClose} footer={<>
      <button className="kl-btn kl-btn-ghost" onClick={onClose}>やめる</button>
      <button className="kl-btn kl-btn-primary" onClick={() => onSave(form)}><Check size={16} />保存する</button>
    </>}>
      <div className="kl-fields">
        {schema.fields.map((f) => {
          if (f.k === 'id' && isAdd) return null;
          if (f.type === 'readonly') return (
            <div className="kl-field" key={f.k}><label>{f.label}</label><div className="kl-readonly kl-mono">{String(form[f.k] ?? '—')}</div></div>
          );
          if (f.type === 'bool') return (
            <label className="kl-check" key={f.k} style={{ marginTop: 2 }}><input type="checkbox" checked={!!form[f.k]} onChange={(e) => set(f.k, e.target.checked)} /><span>{f.label}</span></label>
          );
          let ctrl;
          if (f.type === 'textarea') ctrl = <textarea className="kl-area" value={form[f.k] || ''} onChange={(e) => set(f.k, e.target.value)} />;
          else if (f.type === 'date') ctrl = <input type="date" className="kl-input" value={form[f.k] || ''} onChange={(e) => set(f.k, e.target.value)} />;
          else if (f.type === 'time') ctrl = <input type="time" step="600" className="kl-input" value={form[f.k] || ''} onChange={(e) => set(f.k, e.target.value)} />;
          else if (f.type === 'select') ctrl = <select className="kl-select" value={form[f.k] || ''} onChange={(e) => set(f.k, e.target.value)}>{f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>;
          else if (f.type === 'tags') ctrl = <div className="kl-tags">{TAGS.map((t) => <button key={t} className={`kl-tag ${(form.tags || []).includes(t) ? 'is-on' : ''}`} onClick={() => toggleTag(t)}>{t}</button>)}</div>;
          else if (f.type === 'disclose') { const dv = form.disclose || { symptoms: false, tags: false, treatment: false }; ctrl = <div className="kl-tags">{[['symptoms', '主訴'], ['tags', 'タグ'], ['treatment', '施術記録']].map(([k, l]) => <button key={k} className={`kl-tag ${dv[k] ? 'is-on' : ''}`} onClick={() => set('disclose', { ...dv, [k]: !dv[k] })}>{dv[k] ? '◉' : '○'} {l}</button>)}</div>; }
          else if (f.type === 'rel-company') ctrl = <RelSelect value={form.companyId} onChange={(v) => set('companyId', v)} options={companyOpts} nullable={f.nullable} nullLabel={f.nullLabel} />;
          else if (f.type === 'rel-session') ctrl = <RelSelect value={form.sessionId} onChange={(v) => set('sessionId', v)} options={sessionOpts} nullable={f.nullable} nullLabel={f.nullLabel} />;
          else if (f.type === 'rel-customer') ctrl = <RelSelect value={form.customerId} onChange={(v) => set('customerId', v)} options={customerOpts} nullable={f.nullable} nullLabel={f.nullLabel} />;
          else ctrl = <input className="kl-input" value={form[f.k] || ''} onChange={(e) => set(f.k, e.target.value)} />;
          return <div className="kl-field" key={f.k}><label>{f.label}</label>{ctrl}</div>;
        })}
      </div>
    </Modal>
  );
}

function DataView({ companies, customers, sessions, reservations, onUpdate, onDelete, onAdd, onReset, notify }) {
  const [table, setTable] = useState('companies');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const data = { companies, customers, sessions, reservations };
  const rows = data[table];
  const schema = SCHEMAS[table];
  const cName = (id) => (id ? (companies.find((c) => c.id === id)?.name || '—') : '個人向け');

  const q = query.trim().toLowerCase();
  const filtered = q ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q)) : rows;

  function cell(col, rec) {
    if (col === 'code') return <span className="kl-code">{rec.code}</span>;
    if (col === 'name') return rec.name;
    if (col === 'industry') return rec.industry;
    if (col === 'type') return <span className={`kl-badge ${rec.type === 'b2b' ? 'b2b' : 'b2c'}`}>{rec.type === 'b2b' ? '法人' : '個人'}</span>;
    if (col === 'company') return table === 'customers' ? (rec.companyId ? cName(rec.companyId) : '個人') : cName(rec.companyId);
    if (col === 'date') return table === 'sessions' ? fmtDate(rec.date) : fmtDate(sessions.find((s) => s.id === rec.sessionId)?.date);
    if (col === 'time') return <span className="kl-mono">{rec.start}〜{rec.end}</span>;
    if (col === 'practitioner') return rec.practitioner;
    if (col === 'slot') return <span className="kl-mono">{rec.slot}</span>;
    if (col === 'status') return rec.done ? <span className="kl-badge done"><Check size={12} />施術済み</span> : <span className="kl-badge todo">予定</span>;
    return null;
  }

  function openAdd() { setEditing({ isAdd: true, record: blankRecord(table, companies, sessions) }); }
  function openEdit(rec) { setEditing({ isAdd: false, record: rec }); }
  function save(form) {
    if (editing.isAdd) onAdd(table, form); else onUpdate(table, editing.record.id, form);
    setEditing(null);
  }
  async function exportJson() {
    const ok = await copyText(JSON.stringify(filtered, null, 2));
    notify(ok ? `${schema.label} ${filtered.length}件をJSONでコピーしました` : 'コピーできませんでした');
  }
  const delMsg = {
    companies: 'この企業を削除します。ひも付くお客様・施術日の参照が外れる場合があります。よろしいですか？',
    customers: 'このお客様カルテを削除します。予約の参照が外れる場合があります。よろしいですか？',
    sessions: 'この施術日を削除すると、ひも付く予約もすべて削除されます。よろしいですか？',
    reservations: 'この予約を削除します。よろしいですか？',
  };

  return (
    <>
      <div className="kl-card">
        <div className="kl-card-h"><div className="kl-card-t"><Database size={17} />データベース</div>
          <button className="kl-btn kl-btn-ghost kl-btn-sm" onClick={() => setConfirmReset(true)}><RotateCcw size={14} />初期データに戻す</button>
        </div>
        <div className="kl-tabsel">
          {Object.entries(SCHEMAS).map(([k, sc]) => { const I = sc.icon; return (
            <button key={k} className={table === k ? 'is-on' : ''} onClick={() => { setTable(k); setQuery(''); }}>
              <I size={16} color={table === k ? '#487059' : '#5d6b80'} />
              <span><span className="tn">{sc.label}</span><br /><span className="tc">{data[k].length} 件</span></span>
            </button>
          ); })}
        </div>
      </div>

      <div className="kl-card">
        <div className="kl-card-h">
          <div className="kl-card-t"><schema.icon size={16} />{schema.label}テーブル</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="kl-btn kl-btn-ghost kl-btn-sm" onClick={exportJson}><Download size={14} />エクスポート</button>
            <button className="kl-btn kl-btn-primary kl-btn-sm" onClick={openAdd}><Plus size={14} />新規追加</button>
          </div>
        </div>
        <div className="kl-field"><div style={{ position: 'relative' }}><Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--ink-soft)' }} /><input className="kl-input" style={{ paddingLeft: 36 }} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`${schema.label}を検索（全項目対象）`} /></div></div>

        <div className="kl-tbl-wrap" style={{ marginTop: 14 }}>
          <table className="kl-tbl">
            <thead><tr>{schema.cols.map((c) => <th key={c}>{COL_LABELS[c]}</th>)}<th></th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={schema.cols.length + 1}><div className="kl-empty" style={{ padding: 24 }}>該当するレコードがありません。</div></td></tr>}
              {filtered.map((rec) => (
                <tr key={rec.id} onClick={() => openEdit(rec)}>
                  {schema.cols.map((c) => <td key={c}>{cell(c, rec)}</td>)}
                  <td className="act">
                    <button className="kl-iconbtn" title="編集" onClick={(e) => { e.stopPropagation(); openEdit(rec); }}><Pencil size={14} /></button>
                    <button className="kl-iconbtn danger" title="削除" onClick={(e) => { e.stopPropagation(); setConfirmDel({ id: rec.id, label: rec.name || rec.code || rec.id }); }}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 10 }}>{filtered.length} / {rows.length} 件を表示 — 行をタップすると編集できます。</div>
      </div>

      {editing && <RecordEditor table={table} record={editing.record} isAdd={editing.isAdd} companies={companies} customers={customers} sessions={sessions} onClose={() => setEditing(null)} onSave={save} />}

      <Confirm open={!!confirmDel} danger confirmLabel="削除する"
        message={confirmDel ? `「${confirmDel.label}」を削除します。\n${delMsg[table]}` : ''}
        onCancel={() => setConfirmDel(null)} onConfirm={() => { onDelete(table, confirmDel.id); setConfirmDel(null); }} />

      <Confirm open={confirmReset} danger confirmLabel="リセットする"
        message={'すべてのテーブルを初期デモデータに戻します。現在のデータは失われます。よろしいですか？'}
        onCancel={() => setConfirmReset(false)} onConfirm={() => { onReset(); setConfirmReset(false); }} />
    </>
  );
}

/* ------------------------------ Admin portal ------------------------------ */
function AdminPortal(p) {
  const [tab, setTab] = useState('schedule');
  return (
    <div className="kl-portal">
      <PortalHeader title="管理者ページ（施術者）" subtitle="管理者" onLogout={p.onLogout} icon={ShieldCheck} />
      <main className="kl-main"><div className="kl-shell">
        <div className="kl-seg" style={{ maxWidth: 540, marginBottom: 18 }}>
          <button className={tab === 'schedule' ? 'is-on' : ''} onClick={() => setTab('schedule')}><Activity size={14} />スケジュール</button>
          <button className={tab === 'karte' ? 'is-on' : ''} onClick={() => setTab('karte')}><ClipboardList size={14} />カルテ</button>
          <button className={tab === 'master' ? 'is-on' : ''} onClick={() => setTab('master')}><Database size={14} />マスター管理</button>
        </div>
        {tab === 'schedule' && <ProviderView companies={p.companies} customers={p.customers} sessions={p.sessions} reservations={p.reservations} notify={p.notify} onAddSession={p.onAddSession} onCancel={p.onCancel} onDeleteSession={p.onDeleteSession} onAddCompany={p.onAddCompany} onSetTreatment={p.onSetTreatment} />}
        {tab === 'karte' && <CRMView companies={p.companies} customers={p.customers} sessions={p.sessions} reservations={p.reservations} onUpdateCustomer={p.onUpdateCustomer} onMergeCustomers={p.onMergeCustomers} onSetTreatment={p.onSetTreatment} onAddCustomer={p.onAddCustomer} notify={p.notify} />}
        {tab === 'master' && <DataView companies={p.companies} customers={p.customers} sessions={p.sessions} reservations={p.reservations} onUpdate={p.dbUpdate} onDelete={p.dbDelete} onAdd={p.dbAdd} onReset={p.dbReset} notify={p.notify} />}
      </div></main>
    </div>
  );
}

/* -------------------------------- Landing --------------------------------- */
function LandingScreen({ onPortal, onPublic }) {
  return (
    <div className="kl-landing">
      <div className="kl-land-inner">
        <div className="kl-land-hero">
          <SpineMark size={46} />
          <h1>骨ラボ</h1>
          <p>出張施術 予約・カルテ管理システム</p>
        </div>

        <div className="kl-card kl-land-public">
          <div className="kl-qr" dangerouslySetInnerHTML={{ __html: QR_SVG }} />
          <div className="kl-land-public-body">
            <div className="kl-card-t" style={{ fontSize: 16 }}><QrCode size={18} />お客様 ご予約フォーム</div>
            <p>QRコードまたはリンクから、ログイン不要でご登録・ご予約いただけます。チラシやLINEでの配布にご利用ください。</p>
            <div className="kl-linkrow"><Link2 size={15} /><span className="kl-linktext">{RESERVE_URL}</span><button className="kl-btn kl-btn-ghost kl-btn-sm" onClick={async () => copyText(RESERVE_URL)}><Copy size={13} />コピー</button></div>
            <button className="kl-btn kl-btn-primary" onClick={onPublic}><ChevronRight size={16} />予約フォームを開く</button>
          </div>
        </div>

        <div className="kl-sub" style={{ margin: '6px 2px 10px' }}>関係者ログイン</div>
        <button className="kl-portcard" onClick={() => onPortal('customer')}><div className="ic"><User size={20} /></div><div className="tx"><div className="t">お客様マイページ</div><div className="d">予約状況・マイカルテの確認</div></div><ChevronRight size={18} className="ar" /></button>
        <button className="kl-portcard" onClick={() => onPortal('corporate')}><div className="ic"><Building2 size={20} /></div><div className="tx"><div className="t">企業ご担当者ページ</div><div className="d">自社の予約状況・登録社員リスト</div></div><ChevronRight size={18} className="ar" /></button>
        <button className="kl-portcard" onClick={() => onPortal('admin')}><div className="ic"><ShieldCheck size={20} /></div><div className="tx"><div className="t">管理者ページ（施術者）</div><div className="d">スケジュール・カルテ・マスター管理</div></div><ChevronRight size={18} className="ar" /></button>

        <div className="kl-land-foot">プロトタイプ / デモ環境</div>
      </div>
    </div>
  );
}

/* --------------------------------- Login ---------------------------------- */
function LoginScreen({ portal, companies, customers, onBack, onLogin, notify }) {
  const meta = {
    customer: { title: 'お客様ログイン', icon: User, hint: 'デモ: 個人=お客様コード C-8F3KQ ／ 法人=企業コード YMD-4471 + 社員番号 1024' },
    corporate: { title: '企業ご担当者ログイン', icon: Building2, hint: 'デモ: 企業コード YMD-4471 / パスコード yamada' },
    admin: { title: '管理者ログイン', icon: ShieldCheck, hint: 'デモ: ID admin / パスワード kotsu' },
  }[portal];
  const Icon = meta.icon;
  const [mode, setMode] = useState('b2c');
  const [custCode, setCustCode] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [empNo, setEmpNo] = useState('');
  const [coCode, setCoCode] = useState('');
  const [coPass, setCoPass] = useState('');
  const [aid, setAid] = useState('');
  const [apass, setApass] = useState('');
  const [showPass, setShowPass] = useState(false);

  function loginCustomer() {
    if (mode === 'b2c') { const c = custByCode(customers, custCode); if (!c) { notify('お客様コードが見つかりません'); return; } onLogin({ portal: 'customer', customerId: c.id }); }
    else { const co = companyByCode(companies, companyCode); if (!co) { notify('企業コードが見つかりません'); return; } const c = custByB2B(customers, co.id, empNo); if (!c) { notify('該当する社員が見つかりません。先に予約フォームからご登録ください'); return; } onLogin({ portal: 'customer', customerId: c.id }); }
  }
  function loginCorp() { const co = companyByCode(companies, coCode); if (!co) { notify('企業コードが見つかりません'); return; } if ((co.coordPass || '') !== coPass.trim()) { notify('パスコードが違います'); return; } onLogin({ portal: 'corporate', companyId: co.id }); }
  function loginAdmin() { if (aid.trim() !== ADMIN.id || apass !== ADMIN.pass) { notify('IDまたはパスワードが違います'); return; } onLogin({ portal: 'admin' }); }

  return (
    <div className="kl-landing">
      <div className="kl-login">
        <button className="kl-back" onClick={onBack}><ChevronLeft size={16} />トップへ戻る</button>
        <div className="kl-card kl-login-card">
          <div className="kl-login-head"><div className="ic"><Icon size={22} /></div><div className="t">{meta.title}</div></div>

          {portal === 'customer' && (
            <>
              <div className="kl-seg"><button className={mode === 'b2c' ? 'is-on' : ''} onClick={() => setMode('b2c')}><User size={14} />個人</button><button className={mode === 'b2b' ? 'is-on' : ''} onClick={() => setMode('b2b')}><Users size={14} />法人</button></div>
              {mode === 'b2c'
                ? <div className="kl-field" style={{ marginTop: 12 }}><label>お客様コード</label><input className="kl-input" value={custCode} onChange={(e) => setCustCode(e.target.value)} placeholder="C-8F3KQ" /></div>
                : <div className="kl-fields kl-grid-2" style={{ marginTop: 12 }}><div className="kl-field"><label>企業コード</label><input className="kl-input" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} placeholder="YMD-4471" /></div><div className="kl-field"><label>社員番号</label><input className="kl-input" value={empNo} onChange={(e) => setEmpNo(e.target.value)} placeholder="1024" /></div></div>}
              <button className="kl-btn kl-btn-primary" style={{ marginTop: 14, width: '100%' }} onClick={loginCustomer}><LogIn size={16} />ログイン</button>
            </>
          )}

          {portal === 'corporate' && (
            <>
              <div className="kl-fields" style={{ marginTop: 4 }}>
                <div className="kl-field"><label>企業コード</label><input className="kl-input" value={coCode} onChange={(e) => setCoCode(e.target.value)} placeholder="YMD-4471" /></div>
                <div className="kl-field"><label>パスコード</label><input className="kl-input" type="password" value={coPass} onChange={(e) => setCoPass(e.target.value)} placeholder="••••••" /></div>
              </div>
              <button className="kl-btn kl-btn-primary" style={{ marginTop: 14, width: '100%' }} onClick={loginCorp}><LogIn size={16} />ログイン</button>
            </>
          )}

          {portal === 'admin' && (
            <>
              <div className="kl-fields" style={{ marginTop: 4 }}>
                <div className="kl-field"><label>管理者ID</label><input className="kl-input" value={aid} onChange={(e) => setAid(e.target.value)} placeholder="admin" /></div>
                <div className="kl-field"><label>パスワード</label><div style={{ position: 'relative' }}><input className="kl-input" type={showPass ? 'text' : 'password'} value={apass} onChange={(e) => setApass(e.target.value)} placeholder="••••••" style={{ paddingRight: 42 }} /><button className="kl-eye" onClick={() => setShowPass((v) => !v)} aria-label="表示切替">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
              </div>
              <button className="kl-btn kl-btn-primary" style={{ marginTop: 14, width: '100%' }} onClick={loginAdmin}><LogIn size={16} />ログイン</button>
            </>
          )}

          <div className="kl-hint hint-green" style={{ marginTop: 14, marginBottom: 0 }}><Lock size={15} /><span>{meta.hint}</span></div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- App ----------------------------------- */
export default function App() {
  const [route, setRoute] = useState('landing'); // 'landing' | 'login' | 'public'
  const [loginPortal, setLoginPortal] = useState(null); // 'customer' | 'corporate' | 'admin'
  const [session, setSession] = useState(null); // { portal, customerId?, companyId? }
  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      const cR = await sGet('kotsulab3:companies');
      const uR = await sGet('kotsulab3:customers');
      const sR = await sGet('kotsulab3:sessions');
      const rR = await sGet('kotsulab3:reservations');
      let comp = cR ? safeParse(cR.value) : null;
      let cust = uR ? safeParse(uR.value) : null;
      let sess = sR ? safeParse(sR.value) : null;
      let resv = rR ? safeParse(rR.value) : null;
      if (!comp || !sess || !cust) {
        const seed = buildSeed();
        comp = seed.companies; cust = seed.customers; sess = seed.sessions; resv = seed.reservations;
        await sSet('kotsulab3:companies', comp);
        await sSet('kotsulab3:customers', cust);
        await sSet('kotsulab3:sessions', sess);
        await sSet('kotsulab3:reservations', resv);
      }
      setCompanies(comp); setCustomers(cust || []); setSessions(sess); setReservations(resv || []); setReady(true);
    })();
  }, []);

  function notify(m) { setToast(m); setTimeout(() => setToast(null), 2600); }

  function book({ sessionId, slot, customerId, name, dept, note }) {
    if (reservations.some((r) => r.sessionId === sessionId && r.slot === slot)) { notify('その枠は予約済みです'); return; }
    const next = [...reservations, { id: uid('r'), sessionId, slot, customerId: customerId || null, name: (name || '').trim(), dept: (dept || '').trim(), note: (note || '').trim(), treatment: '', done: false, at: new Date().toISOString() }];
    setReservations(next); sSet('kotsulab3:reservations', next); notify('予約を受け付けました');
  }
  function cancelRes(id) { const next = reservations.filter((r) => r.id !== id); setReservations(next); sSet('kotsulab3:reservations', next); notify('予約を取り消しました'); }
  function addSession(s) { const next = [...sessions, { id: uid('s'), ...s }]; setSessions(next); sSet('kotsulab3:sessions', next); notify('施術日を追加しました'); }
  function deleteSession(id) {
    const next = sessions.filter((s) => s.id !== id); setSessions(next); sSet('kotsulab3:sessions', next);
    const nr = reservations.filter((r) => r.sessionId !== id); setReservations(nr); sSet('kotsulab3:reservations', nr); notify('施術日を削除しました');
  }
  function addCompany(c) { const next = [...companies, { id: uid('c'), code: genCode('CO', companies), coordPass: 'pass', ...c }]; setCompanies(next); sSet('kotsulab3:companies', next); notify('企業を追加しました'); }

  function addCustomer(data) {
    const created = {
      id: uid('u'), code: genCode(data.type === 'b2b' ? 'B' : 'C', customers), type: data.type, name: data.name,
      companyId: data.type === 'b2b' ? data.companyId : null, empNo: data.type === 'b2b' ? (data.empNo || '') : '',
      dept: data.dept || '', tel: data.tel || '', email: data.email || '',
      symptoms: data.symptoms || '', tags: data.tags || [],
      followUpAt: '', followUpNote: '', followDone: false, createdAt: localDate(), mergedFrom: [],
      disclose: data.disclose || { symptoms: true, tags: true, treatment: false },
    };
    const next = [...customers, created]; setCustomers(next); sSet('kotsulab3:customers', next); notify('カルテを作成しました');
    return created;
  }
  function updateCustomer(id, patch) {
    const next = customers.map((c) => (c.id === id ? { ...c, ...patch } : c));
    setCustomers(next); sSet('kotsulab3:customers', next);
  }
  function setTreatment(resId, treatment, done) {
    const next = reservations.map((r) => (r.id === resId ? { ...r, treatment: (treatment || '').trim(), done: !!done } : r));
    setReservations(next); sSet('kotsulab3:reservations', next); notify('施術記録を保存しました');
  }
  function mergeCustomers(primaryId, secondaryId) {
    const primary = customers.find((c) => c.id === primaryId);
    const secondary = customers.find((c) => c.id === secondaryId);
    if (!primary || !secondary || primaryId === secondaryId) return;
    const nr = reservations.map((r) => (r.customerId === secondaryId ? { ...r, customerId: primaryId } : r));
    const secLabel = `${secondary.name}・${secondary.type === 'b2b' ? '法人' : '個人'}（${secondary.code}）`;
    const mergedSymptoms = [primary.symptoms, secondary.symptoms].filter((s) => s && s.trim()).join(`\n\n── 統合: ${secLabel} ──\n`);
    const mergedTags = Array.from(new Set([...(primary.tags || []), ...(secondary.tags || [])]));
    const mergedFrom = [...(primary.mergedFrom || []), { code: secondary.code, type: secondary.type, label: secLabel }];
    const follow = (!primary.followUpAt && secondary.followUpAt) ? { followUpAt: secondary.followUpAt, followUpNote: secondary.followUpNote, followDone: secondary.followDone } : {};
    const nc = customers.filter((c) => c.id !== secondaryId).map((c) => (c.id === primaryId ? { ...c, symptoms: mergedSymptoms, tags: mergedTags, mergedFrom, ...follow } : c));
    setReservations(nr); sSet('kotsulab3:reservations', nr);
    setCustomers(nc); sSet('kotsulab3:customers', nc);
    notify('カルテを統合しました');
  }

  // ---- generic data management (DataView) ----
  const dbArr = (t) => (t === 'companies' ? companies : t === 'customers' ? customers : t === 'sessions' ? sessions : reservations);
  function dbSet(t, arr) {
    if (t === 'companies') { setCompanies(arr); sSet('kotsulab3:companies', arr); }
    else if (t === 'customers') { setCustomers(arr); sSet('kotsulab3:customers', arr); }
    else if (t === 'sessions') { setSessions(arr); sSet('kotsulab3:sessions', arr); }
    else { setReservations(arr); sSet('kotsulab3:reservations', arr); }
  }
  function dbUpdate(t, id, patch) { dbSet(t, dbArr(t).map((r) => (r.id === id ? { ...r, ...patch } : r))); notify('レコードを更新しました'); }
  function dbDelete(t, id) {
    dbSet(t, dbArr(t).filter((r) => r.id !== id));
    if (t === 'sessions') { const nr = reservations.filter((r) => r.sessionId !== id); setReservations(nr); sSet('kotsulab3:reservations', nr); }
    notify('レコードを削除しました');
  }
  function dbAdd(t, data) {
    const rec = { id: uid(SCHEMAS[t].idPrefix), ...data };
    if (t === 'companies' && !rec.code) rec.code = genCode('CO', companies);
    if (t === 'customers' && !rec.code) rec.code = genCode(rec.type === 'b2b' ? 'B' : 'C', customers);
    dbSet(t, [...dbArr(t), rec]); notify('レコードを追加しました');
  }
  function dbReset() {
    const seed = buildSeed();
    setCompanies(seed.companies); sSet('kotsulab3:companies', seed.companies);
    setCustomers(seed.customers); sSet('kotsulab3:customers', seed.customers);
    setSessions(seed.sessions); sSet('kotsulab3:sessions', seed.sessions);
    setReservations(seed.reservations); sSet('kotsulab3:reservations', seed.reservations);
    notify('初期データにリセットしました');
  }

  function doLogin(s) { setSession(s); setLoginPortal(null); setRoute('landing'); notify('ログインしました'); }
  function logout() { setSession(null); setLoginPortal(null); setRoute('landing'); notify('ログアウトしました'); }

  let content;
  if (!ready) {
    content = <div className="kl-main"><div className="kl-shell"><div className="kl-card"><div className="kl-empty">読み込み中…</div></div></div></div>;
  } else if (session) {
    if (session.portal === 'customer') {
      const me = custById(customers, session.customerId);
      content = me
        ? <CustomerPortal me={me} companies={companies} sessions={sessions} reservations={reservations} onBook={book} onCancel={cancelRes} onLogout={logout} notify={notify} />
        : <div className="kl-main"><div className="kl-shell"><div className="kl-card"><div className="kl-empty">アカウントが見つかりません。<button className="kl-btn kl-btn-ghost kl-btn-sm" style={{ marginTop: 12 }} onClick={logout}>ログアウト</button></div></div></div></div>;
    } else if (session.portal === 'corporate') {
      const company = companies.find((c) => c.id === session.companyId);
      content = company
        ? <CorporatePortal company={company} customers={customers} sessions={sessions} reservations={reservations} onLogout={logout} notify={notify} />
        : <div className="kl-main"><div className="kl-shell"><div className="kl-card"><div className="kl-empty">企業が見つかりません。<button className="kl-btn kl-btn-ghost kl-btn-sm" style={{ marginTop: 12 }} onClick={logout}>ログアウト</button></div></div></div></div>;
    } else {
      content = <AdminPortal companies={companies} customers={customers} sessions={sessions} reservations={reservations} notify={notify}
        onAddSession={addSession} onCancel={cancelRes} onDeleteSession={deleteSession} onAddCompany={addCompany} onSetTreatment={setTreatment}
        onUpdateCustomer={updateCustomer} onMergeCustomers={mergeCustomers} onAddCustomer={addCustomer}
        dbUpdate={dbUpdate} dbDelete={dbDelete} dbAdd={dbAdd} dbReset={dbReset} onLogout={logout} />;
    }
  } else if (route === 'public') {
    content = <PublicReserve companies={companies} customers={customers} sessions={sessions} reservations={reservations} onBook={book} onAddCustomer={addCustomer} onExit={() => setRoute('landing')} notify={notify} />;
  } else if (route === 'login' && loginPortal) {
    content = <LoginScreen portal={loginPortal} companies={companies} customers={customers} onBack={() => { setLoginPortal(null); setRoute('landing'); }} onLogin={doLogin} notify={notify} />;
  } else {
    content = <LandingScreen onPortal={(p) => { setLoginPortal(p); setRoute('login'); }} onPublic={() => setRoute('public')} />;
  }

  return (
    <div className="kl-app">
      <style>{CSS}</style>
      {content}
      {toast && <div className="kl-toast"><Check size={15} />{toast}</div>}
    </div>
  );
}

const CSS = `
.kl-app{
  --ink:#2b3a52; --ink-soft:#5d6b80; --green:#5f9377; --green-deep:#487059;
  --green-mist:#eaf2ed; --green-line:#cfe1d6; --sand-light:#f7f0e4;
  --amber:#d8954a; --amber-mist:#f8ecd9; --rose:#cf7878; --rose-mist:#f6e6e6;
  --paper:#f6f5f2; --surface:#ffffff; --line:#e7e4dd; --radius:14px;
  font-family:"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Yu Gothic UI",system-ui,sans-serif;
  color:var(--ink); background:var(--paper); min-height:100vh; -webkit-font-smoothing:antialiased;
}
.kl-app *{ box-sizing:border-box; }
.kl-mono{ font-variant-numeric:tabular-nums; }

.kl-top{ background:var(--surface); border-bottom:1px solid var(--line); position:sticky; top:0; z-index:20; }
.kl-top-in{ width:100%; max-width:1080px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:13px 20px; flex-wrap:wrap; }
.kl-brand{ display:flex; align-items:center; gap:10px; }
.kl-brand-name{ font-weight:800; font-size:19px; letter-spacing:.05em; line-height:1.1; }
.kl-brand-sub{ font-size:11px; color:var(--ink-soft); letter-spacing:.02em; }
.kl-roles{ display:flex; gap:4px; background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:4px; }
.kl-role{ display:flex; align-items:center; gap:6px; border:0; background:transparent; color:var(--ink-soft); font:inherit; font-size:13px; font-weight:600; padding:7px 14px; border-radius:999px; cursor:pointer; transition:all .15s; white-space:nowrap; }
.kl-role:hover{ color:var(--ink); }
.kl-role.is-on{ background:var(--green); color:#fff; box-shadow:0 1px 4px rgba(72,112,89,.35); }

.kl-main{ padding:22px 0 72px; }
.kl-shell{ width:100%; max-width:1080px; margin:0 auto; padding:0 20px; }
.kl-intro{ margin:2px 0 20px; }
.kl-intro h1{ font-size:21px; font-weight:800; margin:0 0 4px; letter-spacing:.01em; }
.kl-intro p{ margin:0; color:var(--ink-soft); font-size:13.5px; line-height:1.6; }

.kl-card{ background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:18px; margin-bottom:16px; }
.kl-card-h{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
.kl-card-t{ display:flex; align-items:center; gap:8px; font-weight:700; font-size:15px; }
.kl-sub{ font-size:12.5px; font-weight:700; color:var(--ink-soft); letter-spacing:.02em; margin:20px 2px 11px; }

.kl-fields{ display:grid; gap:12px; }
.kl-grid-2{ grid-template-columns:1fr 1fr; }
.kl-field label{ display:block; font-size:12px; font-weight:600; color:var(--ink-soft); margin-bottom:5px; }
.kl-input,.kl-select,.kl-area{ width:100%; font:inherit; font-size:14px; color:var(--ink); background:var(--surface); border:1px solid var(--line); border-radius:10px; padding:10px 12px; transition:border .15s, box-shadow .15s; }
.kl-input:focus,.kl-select:focus,.kl-area:focus{ outline:none; border-color:var(--green); box-shadow:0 0 0 3px var(--green-mist); }
.kl-area{ resize:vertical; min-height:78px; line-height:1.55; }

.kl-seg{ display:flex; gap:4px; background:var(--paper); border:1px solid var(--line); border-radius:10px; padding:4px; }
.kl-seg button{ flex:1; border:0; background:transparent; font:inherit; font-size:13px; font-weight:700; color:var(--ink-soft); padding:8px 10px; border-radius:7px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all .15s; }
.kl-seg button.is-on{ background:var(--surface); color:var(--green-deep); box-shadow:0 1px 3px rgba(20,30,45,.12); }

.kl-btn{ display:inline-flex; align-items:center; justify-content:center; gap:7px; font:inherit; font-size:14px; font-weight:700; padding:10px 16px; border-radius:10px; border:1px solid transparent; cursor:pointer; transition:all .15s; }
.kl-btn:disabled{ opacity:.45; cursor:not-allowed; }
.kl-btn-sm{ padding:7px 12px; font-size:12.5px; }
.kl-btn-primary{ background:var(--green); color:#fff; }
.kl-btn-primary:hover:not(:disabled){ background:var(--green-deep); }
.kl-btn-ghost{ background:var(--surface); color:var(--ink); border-color:var(--line); }
.kl-btn-ghost:hover:not(:disabled){ background:var(--paper); }
.kl-btn-amber{ background:var(--amber-mist); color:#9a6420; border-color:#e9d6b4; }
.kl-btn-amber:hover:not(:disabled){ background:#f3e1c6; }
.kl-btn-danger{ background:var(--rose-mist); color:#a64b4b; border-color:#ecc9c9; }
.kl-btn-danger:hover:not(:disabled){ background:#f0d6d6; }
.kl-btn-danger-solid{ background:var(--rose); color:#fff; }
.kl-btn-danger-solid:hover:not(:disabled){ background:#bf6868; }

.kl-badge{ display:inline-flex; align-items:center; gap:5px; font-size:11.5px; font-weight:700; padding:4px 10px; border-radius:999px; white-space:nowrap; }
.kl-badge.green{ background:var(--green-mist); color:var(--green-deep); }
.kl-badge.full{ background:#eaeef3; color:var(--ink); }
.kl-badge.b2b{ background:var(--green-mist); color:var(--green-deep); }
.kl-badge.b2c{ background:var(--amber-mist); color:#9a6420; }
.kl-badge.done{ background:#e7f0ea; color:var(--green-deep); }
.kl-badge.todo{ background:#eef1f5; color:var(--ink-soft); }
.kl-badge.follow{ background:var(--rose-mist); color:#a64b4b; }

.kl-code{ font-family:ui-monospace,Menlo,Consolas,monospace; font-size:12px; font-weight:700; letter-spacing:.04em; background:var(--paper); border:1px solid var(--line); border-radius:7px; padding:2px 8px; color:var(--ink); display:inline-flex; align-items:center; gap:6px; }
.kl-codecard{ background:var(--green-mist); border:1px solid var(--green-line); border-radius:12px; padding:13px 15px; margin-bottom:16px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.kl-codecard .big{ font-family:ui-monospace,Menlo,Consolas,monospace; font-size:18px; font-weight:800; color:var(--green-deep); letter-spacing:.05em; }

.kl-stats{ display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:16px; }
.kl-stat{ background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:14px 16px; }
.kl-stat .v{ font-size:24px; font-weight:800; letter-spacing:.01em; line-height:1.1; }
.kl-stat .v small{ font-size:13px; font-weight:600; color:var(--ink-soft); }
.kl-stat .l{ font-size:11.5px; color:var(--ink-soft); margin-top:3px; }
.kl-stat.accent{ background:var(--green-mist); border-color:var(--green-line); }
.kl-stat.accent .v{ color:var(--green-deep); }
.kl-stat.warn{ background:var(--amber-mist); border-color:#ecd9b9; }
.kl-stat.warn .v{ color:#9a6420; }

.kl-sess{ border:1px solid var(--line); border-radius:var(--radius); overflow:hidden; margin-bottom:14px; background:var(--surface); }
.kl-sess-h{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 16px; background:var(--sand-light); border-bottom:1px solid var(--line); flex-wrap:wrap; }
.kl-sess-date{ font-size:15.5px; font-weight:800; }
.kl-sess-meta{ display:flex; align-items:center; gap:14px; font-size:12.5px; color:var(--ink-soft); margin-top:4px; flex-wrap:wrap; }
.kl-sess-meta span{ display:inline-flex; align-items:center; gap:5px; }
.kl-sess-b{ padding:14px 16px; }
.kl-fill{ height:7px; border-radius:999px; background:var(--paper); overflow:hidden; margin:0 0 14px; border:1px solid var(--line); }
.kl-fill > i{ display:block; height:100%; background:var(--green); border-radius:999px; transition:width .3s; }

.kl-slots{ display:grid; grid-template-columns:repeat(auto-fill,minmax(92px,1fr)); gap:8px; }
.kl-slot{ border:1px solid var(--line); border-radius:10px; padding:9px 6px; text-align:center; background:var(--surface); transition:all .15s; font:inherit; }
.kl-slot .t{ font-size:14px; font-weight:800; font-variant-numeric:tabular-nums; }
.kl-slot .s{ font-size:10.5px; margin-top:2px; color:var(--ink-soft); }
.kl-slot.clickable{ cursor:pointer; border-color:var(--green-line); background:var(--green-mist); }
.kl-slot.clickable .s{ color:var(--green-deep); }
.kl-slot.clickable:hover{ background:#dcebe1; border-color:var(--green); transform:translateY(-1px); }
.kl-slot.booked{ background:var(--paper); border-style:dashed; }
.kl-slot.booked .t{ color:var(--ink-soft); }
.kl-slot.mine{ background:#fff; border:2px solid var(--green); }
.kl-slot.mine .t{ color:var(--green-deep); }
.kl-slot.mine .s{ color:var(--green-deep); font-weight:700; }

.kl-roster{ display:flex; flex-direction:column; gap:8px; }
.kl-rrow{ display:flex; align-items:center; gap:12px; padding:10px 12px; border:1px solid var(--line); border-radius:10px; background:var(--surface); }
.kl-rrow.open{ border-style:dashed; background:var(--paper); }
.kl-rtime{ font-weight:800; font-variant-numeric:tabular-nums; font-size:14px; min-width:104px; display:flex; align-items:center; gap:6px; color:var(--ink); }
.kl-rrow.open .kl-rtime{ color:var(--ink-soft); }
.kl-rwho{ flex:1; min-width:0; }
.kl-rname{ font-weight:700; font-size:14px; display:flex; align-items:center; flex-wrap:wrap; gap:4px; }
.kl-rdept{ font-size:12px; color:var(--ink-soft); margin-top:1px; }
.kl-rnote{ font-size:12px; color:var(--ink-soft); margin-top:4px; background:var(--sand-light); padding:3px 8px; border-radius:6px; display:inline-block; }

.kl-daygroup{ margin-bottom:20px; }
.kl-day-h{ display:flex; align-items:center; gap:10px; margin:0 2px 11px; }
.kl-day-h .d{ font-size:15px; font-weight:800; }
.kl-day-h .line{ flex:1; height:1px; background:var(--line); }
.kl-today-pill{ background:var(--green); color:#fff; font-size:10.5px; font-weight:700; padding:2px 9px; border-radius:999px; }

.kl-hint{ display:flex; align-items:flex-start; gap:9px; background:var(--amber-mist); border:1px solid #ecd9b9; color:#8a5a1c; border-radius:12px; padding:11px 14px; font-size:13px; line-height:1.55; margin-bottom:16px; }
.kl-hint.hint-green{ background:var(--green-mist); border-color:var(--green-line); color:var(--green-deep); margin-bottom:0; }
.kl-hint b{ font-weight:800; }
.kl-empty{ text-align:center; padding:30px 16px; color:var(--ink-soft); font-size:13.5px; }
.kl-empty svg{ opacity:.4; margin-bottom:8px; }

.kl-divider{ display:flex; align-items:center; gap:12px; margin:4px 0; color:var(--ink-soft); font-size:12px; }
.kl-divider::before,.kl-divider::after{ content:""; flex:1; height:1px; background:var(--line); }

.kl-chips{ display:flex; gap:8px; flex-wrap:wrap; }
.kl-chip{ border:1px solid var(--line); background:var(--surface); color:var(--ink-soft); font:inherit; font-size:12.5px; font-weight:700; padding:6px 12px; border-radius:999px; cursor:pointer; transition:all .15s; display:inline-flex; align-items:center; gap:6px; }
.kl-chip:hover{ color:var(--ink); }
.kl-chip.is-on{ background:var(--green); border-color:var(--green); color:#fff; }
.kl-chip .n{ font-size:11px; opacity:.8; }

.kl-tags{ display:flex; gap:7px; flex-wrap:wrap; }
.kl-tag{ border:1px solid var(--line); background:var(--surface); color:var(--ink-soft); font:inherit; font-size:12px; font-weight:600; padding:5px 11px; border-radius:999px; cursor:pointer; transition:all .15s; }
.kl-tag.is-on{ background:var(--green-mist); border-color:var(--green-line); color:var(--green-deep); }

.kl-cust{ display:flex; align-items:center; gap:13px; padding:13px 14px; border:1px solid var(--line); border-radius:12px; background:var(--surface); cursor:pointer; transition:all .15s; margin-bottom:10px; text-align:left; width:100%; font:inherit; }
.kl-cust:hover{ border-color:var(--green-line); background:var(--green-mist); }
.kl-av{ width:42px; height:42px; border-radius:12px; background:var(--sand-light); color:var(--green-deep); font-weight:800; font-size:17px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.kl-cust-main{ flex:1; min-width:0; }
.kl-cust-name{ font-weight:800; font-size:15px; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.kl-cust-sub{ font-size:12px; color:var(--ink-soft); margin-top:4px; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.kl-cust-side{ text-align:right; flex-shrink:0; }
.kl-cust-side .vc{ font-weight:800; font-size:15px; }
.kl-cust-side .lv{ font-size:11px; color:var(--ink-soft); margin-top:2px; }

.kl-back{ display:inline-flex; align-items:center; gap:6px; border:0; background:transparent; color:var(--green-deep); font:inherit; font-size:13.5px; font-weight:700; cursor:pointer; padding:6px 2px; margin-bottom:6px; }
.kl-back:hover{ text-decoration:underline; }
.kl-prof{ display:flex; align-items:flex-start; gap:14px; }
.kl-prof .kl-av{ width:52px; height:52px; font-size:21px; border-radius:14px; }
.kl-prof-info{ flex:1; min-width:0; }
.kl-meta-line{ font-size:12.5px; color:var(--ink-soft); margin-top:6px; display:flex; flex-direction:column; gap:4px; }
.kl-meta-line span{ display:inline-flex; align-items:center; gap:7px; }

.kl-visit{ border:1px solid var(--line); border-radius:11px; padding:12px 13px; margin-bottom:10px; background:var(--surface); }
.kl-visit-h{ display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
.kl-visit-d{ font-weight:800; font-size:13.5px; display:flex; align-items:center; gap:7px; }
.kl-visit-meta{ font-size:12px; color:var(--ink-soft); margin-top:3px; display:flex; gap:12px; flex-wrap:wrap; }
.kl-visit-meta span{ display:inline-flex; align-items:center; gap:5px; }
.kl-visit-note{ font-size:12.5px; margin-top:9px; color:var(--ink); background:var(--sand-light); border-radius:8px; padding:8px 10px; line-height:1.55; }
.kl-visit-note .lab{ font-weight:800; color:var(--ink-soft); font-size:11px; display:block; margin-bottom:2px; }
.kl-visit-tx{ font-size:12.5px; margin-top:8px; color:var(--ink); background:var(--green-mist); border:1px solid var(--green-line); border-radius:8px; padding:8px 10px; line-height:1.55; }
.kl-visit-tx .lab{ font-weight:800; color:var(--green-deep); font-size:11px; display:block; margin-bottom:2px; }

.kl-merge{ background:var(--sand-light); border:1px dashed var(--amber); border-radius:12px; padding:14px; }
.kl-check{ display:flex; align-items:center; gap:9px; font-size:13.5px; font-weight:600; margin-top:14px; cursor:pointer; }
.kl-check input{ width:17px; height:17px; accent-color:var(--green); }

.kl-overlay{ position:fixed; inset:0; background:rgba(30,40,55,.46); display:flex; align-items:flex-start; justify-content:center; padding:40px 16px; z-index:50; overflow-y:auto; }
.kl-modal{ background:var(--surface); border-radius:16px; width:100%; max-width:460px; box-shadow:0 20px 60px rgba(20,30,45,.3); border:1px solid var(--line); overflow:hidden; }
.kl-modal-h{ display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-bottom:1px solid var(--line); }
.kl-modal-t{ font-weight:800; font-size:16px; }
.kl-x{ border:0; background:transparent; cursor:pointer; color:var(--ink-soft); padding:4px; border-radius:8px; display:flex; }
.kl-x:hover{ background:var(--paper); color:var(--ink); }
.kl-modal-b{ padding:18px; }
.kl-modal-f{ display:flex; gap:10px; justify-content:flex-end; padding:14px 18px; border-top:1px solid var(--line); background:var(--paper); }
.kl-info-row{ display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px dashed var(--line); font-size:14px; gap:12px; }
.kl-info-row .k{ color:var(--ink-soft); }
.kl-info-row .v{ font-weight:700; text-align:right; }

.kl-toast{ position:fixed; left:50%; bottom:26px; transform:translateX(-50%); background:var(--ink); color:#fff; font-size:13.5px; font-weight:600; padding:11px 18px; border-radius:999px; box-shadow:0 8px 24px rgba(20,30,45,.3); z-index:80; display:flex; align-items:center; gap:8px; }

.kl-readonly{ font-size:13px; color:var(--ink-soft); background:var(--paper); border:1px solid var(--line); border-radius:10px; padding:10px 12px; word-break:break-all; }
.kl-tabsel{ display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
.kl-tabsel button{ border:1px solid var(--line); background:var(--surface); border-radius:11px; padding:11px 12px; cursor:pointer; font:inherit; transition:all .15s; text-align:left; display:flex; align-items:center; gap:9px; }
.kl-tabsel button:hover{ border-color:var(--green-line); }
.kl-tabsel button.is-on{ border-color:var(--green); background:var(--green-mist); }
.kl-tabsel .tn{ font-weight:800; font-size:13px; color:var(--ink); }
.kl-tabsel .tc{ font-size:11px; color:var(--ink-soft); font-variant-numeric:tabular-nums; }
.kl-tabsel button.is-on .tc{ color:var(--green-deep); }

.kl-tbl-wrap{ overflow-x:auto; border:1px solid var(--line); border-radius:var(--radius); background:var(--surface); -webkit-overflow-scrolling:touch; }
.kl-tbl{ width:100%; border-collapse:collapse; font-size:13px; min-width:520px; }
.kl-tbl th{ text-align:left; font-size:11px; font-weight:700; color:var(--ink-soft); padding:10px 12px; background:var(--paper); border-bottom:1px solid var(--line); white-space:nowrap; }
.kl-tbl td{ padding:10px 12px; border-bottom:1px solid var(--line); vertical-align:middle; }
.kl-tbl tbody tr{ cursor:pointer; transition:background .12s; }
.kl-tbl tbody tr:hover{ background:var(--green-mist); }
.kl-tbl tbody tr:last-child td{ border-bottom:0; }
.kl-tbl td.act{ text-align:right; white-space:nowrap; }
.kl-iconbtn{ border:1px solid var(--line); background:var(--surface); color:var(--ink-soft); width:30px; height:30px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:all .15s; margin-left:6px; }
.kl-iconbtn:hover{ background:var(--paper); color:var(--ink); }
.kl-iconbtn.danger:hover{ background:var(--rose-mist); color:#a64b4b; border-color:#ecc9c9; }

/* ---- portals / auth ---- */
.kl-portal{ min-height:100%; }
.kl-public{ min-height:100%; }
.kl-whoami{ display:inline-flex; align-items:center; gap:5px; font-size:12.5px; font-weight:700; color:var(--ink); background:var(--green-mist); border:1px solid var(--green-line); padding:5px 11px; border-radius:999px; }

/* my karte */
.kl-klabel{ display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:var(--green-deep); margin-bottom:5px; }
.kl-ktext{ margin:0; font-size:13.5px; line-height:1.7; color:var(--ink); white-space:pre-wrap; }

/* disclosure rows (CRM) */
.kl-disc{ display:flex; align-items:center; justify-content:space-between; padding:9px 2px; border-top:1px solid var(--line); }
.kl-disc:first-of-type{ border-top:none; }
.kl-disc-l{ display:flex; align-items:center; gap:8px; font-size:13.5px; font-weight:600; color:var(--ink); }
.kl-toggle{ width:42px; height:24px; border-radius:999px; border:none; background:#cfd4dc; position:relative; cursor:pointer; transition:background .15s; flex:0 0 auto; padding:0; }
.kl-toggle .knob{ position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; box-shadow:0 1px 2px rgba(0,0,0,.25); transition:left .15s; }
.kl-toggle.is-on{ background:var(--green); }
.kl-toggle.is-on .knob{ left:21px; }

/* password eye */
.kl-eye{ position:absolute; right:6px; top:50%; transform:translateY(-50%); border:none; background:transparent; color:var(--ink-soft); cursor:pointer; padding:6px; display:flex; }

/* landing */
.kl-landing{ min-height:100%; padding:34px 18px 56px; display:flex; justify-content:center; }
.kl-land-inner{ width:100%; max-width:480px; }
.kl-land-hero{ text-align:center; margin-bottom:24px; }
.kl-land-hero h1{ margin:10px 0 2px; font-size:30px; font-weight:800; color:var(--ink); letter-spacing:.04em; }
.kl-land-hero p{ margin:0; font-size:13px; color:var(--ink-soft); }
.kl-land-public{ display:flex; gap:16px; align-items:flex-start; }
.kl-qr{ flex:0 0 96px; width:96px; height:96px; border:1px solid var(--line); border-radius:10px; padding:6px; background:#fff; }
.kl-qr svg{ width:100%; height:100%; display:block; }
.kl-land-public-body{ flex:1; min-width:0; }
.kl-land-public-body p{ margin:6px 0 10px; font-size:12.5px; line-height:1.6; color:var(--ink-soft); }
.kl-linkrow{ display:flex; align-items:center; gap:7px; background:var(--paper); border:1px solid var(--line); border-radius:9px; padding:7px 9px; margin-bottom:11px; color:var(--green-deep); }
.kl-linktext{ flex:1; min-width:0; font-size:12px; font-family:var(--mono,ui-monospace,monospace); color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.kl-portcard{ width:100%; display:flex; align-items:center; gap:13px; background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:14px 15px; margin-bottom:10px; cursor:pointer; text-align:left; transition:border-color .15s, box-shadow .15s, transform .05s; }
.kl-portcard:hover{ border-color:var(--green-line); box-shadow:0 4px 14px rgba(72,112,89,.10); }
.kl-portcard:active{ transform:translateY(1px); }
.kl-portcard .ic{ flex:0 0 42px; width:42px; height:42px; border-radius:11px; background:var(--green-mist); color:var(--green-deep); display:flex; align-items:center; justify-content:center; }
.kl-portcard .tx{ flex:1; min-width:0; }
.kl-portcard .tx .t{ font-size:14.5px; font-weight:800; color:var(--ink); }
.kl-portcard .tx .d{ font-size:12px; color:var(--ink-soft); margin-top:2px; }
.kl-portcard .ar{ color:var(--ink-soft); flex:0 0 auto; }
.kl-land-foot{ text-align:center; font-size:11px; color:var(--ink-soft); margin-top:18px; opacity:.8; }

/* login */
.kl-login{ width:100%; max-width:420px; }
.kl-back{ display:inline-flex; align-items:center; gap:5px; border:none; background:transparent; color:var(--ink-soft); font-size:13px; font-weight:600; cursor:pointer; padding:6px 2px; margin-bottom:10px; }
.kl-login-card{ margin-bottom:0; }
.kl-login-head{ display:flex; align-items:center; gap:11px; margin-bottom:16px; }
.kl-login-head .ic{ width:44px; height:44px; border-radius:12px; background:var(--green-mist); color:var(--green-deep); display:flex; align-items:center; justify-content:center; }
.kl-login-head .t{ font-size:17px; font-weight:800; color:var(--ink); }

@media (max-width:640px){
  .kl-shell{ padding:0 14px; }
  .kl-top-in{ padding:11px 14px; gap:10px; }
  .kl-roles{ width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; }
  .kl-role{ flex:0 0 auto; justify-content:center; padding:8px 11px; font-size:12px; }
  .kl-tabsel{ grid-template-columns:1fr 1fr; }
  .kl-role span{ font-size:11px; }
  .kl-stats{ grid-template-columns:1fr 1fr; }
  .kl-grid-2{ grid-template-columns:1fr; }
  .kl-stat .v{ font-size:21px; }
  .kl-rtime{ min-width:84px; }
  .kl-cust-side .lv{ display:none; }
  .kl-land-public{ flex-direction:column; align-items:center; text-align:center; }
  .kl-qr{ flex-basis:130px; width:130px; height:130px; }
  .kl-linktext{ font-size:11px; }
}
`;
