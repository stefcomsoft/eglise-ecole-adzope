import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const COLORS = {
  emerald: "#1A6B4A",
  emeraldLight: "#2A8B62",
  emeraldDark: "#0F4530",
  gold: "#C9952A",
  goldLight: "#E8B84B",
  goldPale: "#FFF8E8",
  cream: "#FDFAF4",
  slate: "#2C3E50",
  slateLight: "#4A5568",
  muted: "#8FA3A0",
  red: "#C0392B",
  redLight: "#FADBD8",
  green: "#27AE60",
  greenLight: "#D5F5E3",
  blue: "#2471A3",
  blueLight: "#D6EAF8",
  purple: "#7D3C98",
  purpleLight: "#E8DAEF",
  white: "#FFFFFF",
  bg: "#F4F1EB",
  border: "#E0D8C8",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { font-family: 'DM Sans', sans-serif; background: ${COLORS.bg}; color: ${COLORS.slate}; }

  .font-display { font-family: 'Playfair Display', serif; }

  .sidebar {
    width: 260px; min-height: 100vh; background: ${COLORS.emeraldDark};
    position: fixed; left: 0; top: 0; z-index: 100;
    display: flex; flex-direction: column;
    box-shadow: 4px 0 20px rgba(0,0,0,0.15);
    transition: transform 0.3s ease;
  }

  .sidebar-logo {
    padding: 28px 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .sidebar-logo h1 {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 700;
    color: ${COLORS.goldLight};
    line-height: 1.2;
  }

  .sidebar-logo span {
    font-size: 11px; color: rgba(255,255,255,0.45);
    font-weight: 300; letter-spacing: 1px; text-transform: uppercase;
  }

  .nav-section-label {
    font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,0.3); padding: 18px 24px 6px; font-weight: 500;
  }

  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 24px; cursor: pointer; transition: all 0.2s;
    color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 400;
    border-left: 3px solid transparent;
  }

  .nav-item:hover { color: white; background: rgba(255,255,255,0.05); }
  .nav-item.active {
    color: ${COLORS.goldLight}; background: rgba(201,149,42,0.12);
    border-left-color: ${COLORS.goldLight};
  }

  .nav-icon { width: 18px; height: 18px; flex-shrink: 0; }

  .main { margin-left: 260px; min-height: 100vh; padding: 32px; }

  .page-header {
    margin-bottom: 28px;
  }
  .page-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 26px; color: ${COLORS.emeraldDark}; font-weight: 700;
  }
  .page-header p { color: ${COLORS.muted}; font-size: 14px; margin-top: 4px; }

  .card {
    background: white; border-radius: 14px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    overflow: hidden;
  }

  .card-header {
    padding: 18px 22px 14px;
    border-bottom: 1px solid ${COLORS.border};
    display: flex; align-items: center; justify-content: space-between;
  }

  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px; font-weight: 600; color: ${COLORS.emeraldDark};
  }

  .kpi-card {
    background: white; border-radius: 14px;
    padding: 22px; position: relative; overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }

  .kpi-accent {
    position: absolute; top: 0; right: 0;
    width: 80px; height: 80px; border-radius: 0 14px 0 80px;
    opacity: 0.12;
  }

  .kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.muted}; font-weight: 500; }
  .kpi-value { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin: 6px 0 4px; }
  .kpi-sub { font-size: 12px; color: ${COLORS.muted}; }

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
  }

  .btn {
    display: inline-flex; align-items: center; gap-8px; gap: 8px;
    padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.2s;
  }
  .btn-primary { background: ${COLORS.emerald}; color: white; }
  .btn-primary:hover { background: ${COLORS.emeraldLight}; }
  .btn-gold { background: ${COLORS.gold}; color: white; }
  .btn-gold:hover { background: ${COLORS.goldLight}; }
  .btn-outline { background: transparent; color: ${COLORS.emerald}; border: 1.5px solid ${COLORS.emerald}; }
  .btn-outline:hover { background: ${COLORS.emerald}; color: white; }
  .btn-sm { padding: 6px 14px; font-size: 12px; }
  .btn-danger { background: ${COLORS.red}; color: white; }

  .progress-bar-bg {
    height: 8px; background: ${COLORS.border}; border-radius: 4px; overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%; border-radius: 4px; transition: width 0.8s ease;
  }

  .table { width: 100%; border-collapse: collapse; }
  .table th {
    text-align: left; font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
    text-transform: uppercase; color: ${COLORS.muted}; padding: 10px 16px;
    background: ${COLORS.bg}; border-bottom: 1px solid ${COLORS.border};
  }
  .table td {
    padding: 12px 16px; font-size: 13px; border-bottom: 1px solid ${COLORS.border};
    color: ${COLORS.slate};
  }
  .table tr:last-child td { border-bottom: none; }
  .table tr:hover td { background: ${COLORS.bg}; }

  .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 13px; flex-shrink: 0;
  }

  .topbar {
    height: 64px; background: white; border-bottom: 1px solid ${COLORS.border};
    position: fixed; top: 0; left: 260px; right: 0; z-index: 90;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .main-with-topbar { padding-top: 96px; }

  .tab-bar {
    display: flex; gap: 4px; background: ${COLORS.bg};
    padding: 4px; border-radius: 10px; margin-bottom: 24px;
  }
  .tab-item {
    padding: 8px 18px; border-radius: 7px; font-size: 13px;
    cursor: pointer; transition: all 0.2s; font-weight: 400; color: ${COLORS.slateLight};
  }
  .tab-item.active {
    background: white; color: ${COLORS.emerald}; font-weight: 600;
    box-shadow: 0 1px 6px rgba(0,0,0,0.08);
  }

  .input-group { display: flex; flex-direction: column; gap: 5px; }
  .input-label { font-size: 12px; font-weight: 600; color: ${COLORS.slateLight}; }
  .input-field {
    padding: 10px 14px; border: 1.5px solid ${COLORS.border};
    border-radius: 8px; font-size: 13px; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.2s;
    background: white;
  }
  .input-field:focus { border-color: ${COLORS.emerald}; }

  .login-page {
    min-height: 100vh; display: flex;
    background: linear-gradient(135deg, ${COLORS.emeraldDark} 0%, ${COLORS.emerald} 50%, #1B4D3E 100%);
  }

  .login-left {
    flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 60px;
    color: white;
  }

  .login-right {
    width: 480px; background: white; display: flex; align-items: center; justify-content: center;
    padding: 60px; min-height: 100vh;
  }

  .notification-dot {
    width: 8px; height: 8px; background: ${COLORS.red}; border-radius: 50%;
    position: absolute; top: -2px; right: -2px;
  }

  .stat-ring {
    width: 56px; height: 56px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .gap-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border: 1.5px solid ${COLORS.border}; border-radius: 10px;
    background: white; transition: all 0.2s;
  }
  .gap-item:hover { border-color: ${COLORS.gold}; box-shadow: 0 2px 8px rgba(201,149,42,0.1); }

  .quiz-option {
    padding: 12px 16px; border: 2px solid ${COLORS.border}; border-radius: 8px;
    cursor: pointer; transition: all 0.2s; font-size: 14px;
  }
  .quiz-option:hover { border-color: ${COLORS.emerald}; background: rgba(26,107,74,0.04); }
  .quiz-option.selected { border-color: ${COLORS.emerald}; background: rgba(26,107,74,0.06); color: ${COLORS.emerald}; font-weight: 500; }
  .quiz-option.correct { border-color: ${COLORS.green}; background: ${COLORS.greenLight}; color: ${COLORS.green}; }
  .quiz-option.wrong { border-color: ${COLORS.red}; background: ${COLORS.redLight}; color: ${COLORS.red}; }

  .verse-card {
    background: linear-gradient(135deg, ${COLORS.emeraldDark}, ${COLORS.emerald});
    border-radius: 16px; padding: 28px; color: white; position: relative; overflow: hidden;
  }
  .verse-card::before {
    content: '"'; position: absolute; top: -20px; left: 16px;
    font-size: 120px; opacity: 0.1; font-family: 'Playfair Display', serif;
    line-height: 1;
  }

  .scrollable { overflow-y: auto; }

  .member-card {
    display: flex; align-items: center; gap: 14px;
    padding: 12px; border-radius: 10px; transition: background 0.15s;
    cursor: pointer;
  }
  .member-card:hover { background: ${COLORS.bg}; }

  .chip {
    padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
  }

  .timeline-item {
    display: flex; gap: 14px; padding: 10px 0;
    border-bottom: 1px solid ${COLORS.border};
  }
  .timeline-dot {
    width: 10px; height: 10px; border-radius: 50%;
    flex-shrink: 0; margin-top: 5px;
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .animate-in { animation: fadeIn 0.35s ease both; }

  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .animate-pulse { animation: pulse 2s infinite; }
`;

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const USERS = {
  membre: { id: 1, name: "Konan Emmanuel", email: "k.emmanuel@gmail.com", role: "MEMBRE", church: "Église Adzopé Centre", avatar: "KE", paid: 32000, total: 50000, status: "en_cours" },
  responsable: { id: 2, name: "Adjoua Marie-Claire", email: "mc.adjoua@gmail.com", role: "RESPONSABLE_LOCAL", church: "Église Adzopé Centre", avatar: "AM" },
  admin: { id: 3, name: "Président Kouassi", email: "president@eglise-adzope.ci", role: "ADMIN", church: "Région Adzopé", avatar: "PK" },
};

const CAMPAIGN = { year: 2025, target: 200000000, collected: 87450000, members: 4000, enrolled: 1749, share: 50000, minPayment: 500 };

const PAYMENTS = [
  { id: 1, date: "2025-01-15", amount: 5000, method: "MTN Mobile Money", status: "validé", ref: "TXN-00142" },
  { id: 2, date: "2025-02-03", amount: 5000, method: "MTN Mobile Money", status: "validé", ref: "TXN-00298" },
  { id: 3, date: "2025-03-01", amount: 5000, method: "Wave", status: "validé", ref: "TXN-00412" },
  { id: 4, date: "2025-04-10", amount: 10000, method: "Virement", status: "validé", ref: "TXN-00589" },
  { id: 5, date: "2025-05-05", amount: 7000, method: "MTN Mobile Money", status: "validé", ref: "TXN-00702" },
];

const MONTHLY_DATA = [
  { month: "Jan", collecte: 8200000, cible: 16667000 },
  { month: "Fév", collecte: 14100000, cible: 16667000 },
  { month: "Mar", collecte: 18900000, cible: 16667000 },
  { month: "Avr", collecte: 22300000, cible: 16667000 },
  { month: "Mai", collecte: 19800000, cible: 16667000 },
  { month: "Juin", collecte: 4150000, cible: 16667000 },
];

const CHURCHES = [
  { name: "Adzopé Centre", members: 412, paid: 87, gap: 23, leader: "Pasteur Yao" },
  { name: "Abengourou Est", members: 389, paid: 72, gap: 31, leader: "Pasteur Koffi" },
  { name: "Daoukro", members: 334, paid: 65, gap: 18, leader: "Pasteur Brou" },
  { name: "M'Batto", members: 287, paid: 58, gap: 27, leader: "Pasteur Ama" },
  { name: "Yakassé-Attobrou", members: 201, paid: 44, gap: 12, leader: "Pasteur Gneke" },
  { name: "Agnibilékrou", members: 126, paid: 31, gap: 9, leader: "Pasteur Assi" },
];

const GAPS = [
  { id: 1, member: "Kouamé F.", church: "Daoukro", amount: 50000, listed: true, listed_at: "2025-01-03" },
  { id: 2, member: "Akpé D.", church: "M'Batto", amount: 35000, listed: true, listed_at: "2025-01-05" },
  { id: 3, member: "Bamba I.", church: "Adzopé Centre", amount: 22000, listed: false, listed_at: null },
  { id: 4, member: "Touré N.", church: "Abengourou Est", amount: 47500, listed: true, listed_at: "2025-01-02" },
];

const COHORT = { name: "Cohorte Janvier 2025", plan: "Bible complète 6 mois", start: "2025-01-07", progress: 68, day: 89, total: 180, chapitres: 237, chapTotal: 1189, members: 147 };

const QUIZ_QUESTIONS = [
  {
    q: "Dans Genèse 1, combien de jours Dieu a-t-il mis pour créer le monde ?",
    options: ["5 jours", "6 jours", "7 jours", "40 jours"],
    correct: 1
  },
  {
    q: "Quel était le nom du premier homme selon la Bible ?",
    options: ["Noé", "Abraham", "Adam", "Moïse"],
    correct: 2
  },
  {
    q: "Dans quel livre de la Bible trouve-t-on les Béatitudes ?",
    options: ["Luc 6", "Matthieu 5", "Jean 3", "Marc 8"],
    correct: 1
  }
];

const MEMBERS_DATA = [
  { name: "Konan Emmanuel", category: "Travailleur", church: "Adzopé Centre", status: "actif", paid: 32000 },
  { name: "Adjoua Céleste", category: "Femme", church: "Adzopé Centre", status: "actif", paid: 50000 },
  { name: "Yao Rodrigue", category: "Homme", church: "Daoukro", status: "actif", paid: 18000 },
  { name: "Brou Marina", category: "Couple", church: "M'Batto", status: "en_retard", paid: 5000 },
  { name: "Koffi Alain", category: "Élève", church: "Abengourou Est", status: "actif", paid: 25000 },
  { name: "N'Goran Rose", category: "Femme", church: "Agnibilékrou", status: "actif", paid: 50000 },
  { name: "Assi Bertin", category: "Travailleur", church: "Yakassé", status: "en_retard", paid: 8000 },
  { name: "Ama Joëlle", category: "Couple", church: "Adzopé Centre", status: "actif", paid: 42000 },
];

const CATEGORY_DATA = [
  { name: "Hommes", value: 1089, color: COLORS.emerald },
  { name: "Femmes", value: 1243, color: COLORS.gold },
  { name: "Couples", value: 387, color: COLORS.blue },
  { name: "Élèves", value: 621, color: COLORS.purple },
  { name: "Travailleurs", value: 409, color: COLORS.green },
];

const NOTIFICATIONS = [
  { id: 1, type: "rappel", msg: "Votre prochaine échéance est dans 3 jours (5 000 FCFA)", time: "Il y a 2h", read: false },
  { id: 2, type: "lecture", msg: "Vous avez un QCM en attente pour Genèse 1-5", time: "Il y a 5h", read: false },
  { id: 3, type: "info", msg: "La campagne 2025 est ouverte. Objectif : 50 000 FCFA", time: "Il y a 1j", read: true },
  { id: 4, type: "gap", msg: "3 gaps sont disponibles à l'achat (compensation)", time: "Il y a 2j", read: true },
];

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  money: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  bible: "M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  chart: "M18 20V10 M12 20V4 M6 20v-6",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  plus: "M12 5v14M5 12h14",
  arrow_right: "M5 12h14M12 5l7 7-7 7",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  map: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4 M8 2v16 M16 6v16",
  gift: "M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 106 0 3 3 0 00-6 0",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  award: "M12 15l-8.5 5 2-9L1 6l9.5-.5L12 0l1.5 5.5L23 6l-4.5 5 2 9z",
  trending: "M23 6l-9.5 9.5-5-5L1 18",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  send: "M22 2L11 13 M22 2L15 22 8.5 13.5 2 11l20-9z",
};

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
const pct = (a, b) => Math.round((a / b) * 100);
const avatarColors = ["#1A6B4A", "#C9952A", "#2471A3", "#7D3C98", "#C0392B", "#27AE60"];
const getAvatarColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];

const StatusBadge = ({ status }) => {
  const map = {
    validé: { bg: COLORS.greenLight, color: COLORS.green, label: "Validé" },
    en_cours: { bg: COLORS.blueLight, color: COLORS.blue, label: "En cours" },
    en_retard: { bg: COLORS.redLight, color: COLORS.red, label: "En retard" },
    actif: { bg: COLORS.greenLight, color: COLORS.green, label: "Actif" },
    listed: { bg: "#FFF3CD", color: "#856404", label: "En vente" },
    sold: { bg: COLORS.greenLight, color: COLORS.green, label: "Vendu" },
  };
  const s = map[status] || { bg: COLORS.bg, color: COLORS.muted, label: status };
  return <span className="badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>;
};

// ─── VIEWS ─────────────────────────────────────────────────────────────────────

// LOGIN
const LoginView = ({ onLogin }) => {
  const [role, setRole] = useState("membre");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { onLogin(USERS[role]); setLoading(false); }, 900);
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 48, height: 48, background: COLORS.gold, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={Icons.bible} color="white" size={24} />
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Région Adzopé</div>
              <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color: COLORS.goldLight }}>Église-École</div>
            </div>
          </div>
          <h1 className="font-display" style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1, color: "white", marginBottom: 20 }}>
            Construire.<br />
            <span style={{ color: COLORS.goldLight }}>Digitaliser.</span><br />
            Édifier.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.7, maxWidth: 400 }}>
            La plateforme numérique intégrée pour financer votre complexe scolaire
            et renforcer la maturité spirituelle de vos 4 000 membres.
          </p>
        </div>

        <div style={{ display: "flex", gap: 28 }}>
          {[
            { v: "200M", l: "Objectif FCFA" },
            { v: "4 000", l: "Membres cibles" },
            { v: "5 ans", l: "Horizon projet" },
          ].map(({ v, l }) => (
            <div key={v}>
              <div className="font-display" style={{ fontSize: 28, color: COLORS.goldLight, fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div style={{ width: "100%" }}>
          <h2 className="font-display" style={{ fontSize: 28, color: COLORS.emeraldDark, marginBottom: 6 }}>Bienvenue</h2>
          <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 32 }}>Connectez-vous à votre espace</p>

          <div style={{ marginBottom: 20 }}>
            <div className="input-label" style={{ marginBottom: 8 }}>Démonstration — Choisir un profil</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { key: "membre", label: "👤 Konan Emmanuel", sub: "Membre — Adzopé Centre" },
                { key: "responsable", label: "📋 Adjoua Marie-Claire", sub: "Responsable Local" },
                { key: "admin", label: "👑 Président Kouassi", sub: "Administrateur Régional" },
              ].map(({ key, label, sub }) => (
                <div key={key}
                  onClick={() => setRole(key)}
                  style={{
                    padding: "12px 16px", border: `2px solid ${role === key ? COLORS.emerald : COLORS.border}`,
                    borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
                    background: role === key ? "rgba(26,107,74,0.04)" : "white"
                  }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: role === key ? COLORS.emerald : COLORS.slate }}>{label}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div className="input-group">
              <div className="input-label">Email</div>
              <input className="input-field" value={USERS[role].email} readOnly />
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <div className="input-group">
              <div className="input-label">Mot de passe</div>
              <input className="input-field" type="password" value="••••••••" readOnly />
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 15 }}
            onClick={handleLogin}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
};

// TOPBAR
const Topbar = ({ user, unreadCount, onNotif, onBack }) => (
  <div className="topbar">
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {onBack && (
        <button onClick={onBack} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.slateLight, padding: "6px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
          ← Accueil
        </button>
      )}
      <div style={{ fontSize: 13, color: COLORS.muted }}>
        {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", cursor: "pointer" }} onClick={onNotif}>
        <Icon d={Icons.bell} color={COLORS.slateLight} />
        {unreadCount > 0 && <div className="notification-dot" />}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="avatar" style={{ background: getAvatarColor(user.name), color: "white" }}>{user.avatar}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.slate }}>{user.name}</div>
          <div style={{ fontSize: 11, color: COLORS.muted }}>{user.role.replace("_", " ")}</div>
        </div>
      </div>
    </div>
  </div>
);

// SIDEBAR
const Sidebar = ({ user, current, onChange, onLogout }) => {
  const memberNav = [
    { id: "dashboard", label: "Tableau de bord", icon: Icons.home },
    { id: "paiements", label: "Mes Paiements", icon: Icons.money },
    { id: "lecture", label: "Lecture Biblique", icon: Icons.bible },
    { id: "gaps", label: "Compensation", icon: Icons.gift },
    { id: "notifications", label: "Notifications", icon: Icons.bell },
  ];
  const adminNav = [
    { id: "admin_dashboard", label: "Tableau de bord", icon: Icons.home },
    { id: "membres", label: "Membres & RBAC", icon: Icons.users },
    { id: "campagne", label: "Campagne", icon: Icons.chart },
    { id: "admin_gaps", label: "Gestion Gaps", icon: Icons.gift },
    { id: "admin_cohortes", label: "Cohortes", icon: Icons.bible },
    { id: "gouvernance", label: "Gouvernance & Org.", icon: Icons.shield },
    { id: "statistiques", label: "Statistiques", icon: Icons.trending },
    { id: "communications", label: "Communications", icon: Icons.mail },
    { id: "parametres", label: "Paramètres & Séc.", icon: Icons.settings },
  ];

  const isAdmin = user.role !== "MEMBRE";
  const nav = isAdmin ? adminNav : memberNav;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: COLORS.gold, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={Icons.bible} color="white" size={18} />
          </div>
          <div>
            <h1>Église-École</h1>
          </div>
        </div>
        <span>Adzopé • Campagne 2025</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        <div className="nav-section-label">{isAdmin ? "Administration" : "Mon Espace"}</div>
        {nav.map(({ id, label, icon }) => (
          <div key={id} className={`nav-item ${current === id ? "active" : ""}`} onClick={() => onChange(id)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {icon.split(" M").map((part, i) => <path key={i} d={(i === 0 ? "" : "M") + part} />)}
            </svg>
            {label}
          </div>
        ))}
      </div>

      <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="nav-item" onClick={onLogout} style={{ color: "rgba(255,255,255,0.4)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9" />
          </svg>
          Déconnexion
        </div>
      </div>
    </div>
  );
};

// ─── MEMBER VIEWS ──────────────────────────────────────────────────────────────

const MemberDashboard = ({ user }) => {
  const p = pct(user.paid, user.total);
  const reste = user.total - user.paid;

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Bonjour, {user.name.split(" ")[0]} 👋</h2>
        <p>Voici l'état de votre participation — Campagne 2025</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-accent" style={{ background: COLORS.emerald }} />
          <div className="kpi-label">Ma Part Annuelle</div>
          <div className="kpi-value" style={{ color: COLORS.emeraldDark }}>{fmt(user.total)}</div>
          <StatusBadge status={user.status} />
        </div>
        <div className="kpi-card">
          <div className="kpi-accent" style={{ background: COLORS.green }} />
          <div className="kpi-label">Total Versé</div>
          <div className="kpi-value" style={{ color: COLORS.green }}>{fmt(user.paid)}</div>
          <div className="kpi-sub">{p}% de l'objectif</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-accent" style={{ background: COLORS.gold }} />
          <div className="kpi-label">Reste à Payer</div>
          <div className="kpi-value" style={{ color: COLORS.gold }}>{fmt(reste)}</div>
          <div className="kpi-sub">avant le 31 déc. 2025</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Progression */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Ma Progression</span>
            <span className="badge" style={{ background: COLORS.blueLight, color: COLORS.blue }}>{p}% accompli</span>
          </div>
          <div style={{ padding: 22 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: COLORS.slateLight }}>Versé : {fmt(user.paid)}</span>
                <span style={{ color: COLORS.muted }}>Objectif : {fmt(user.total)}</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${p}%`, background: `linear-gradient(90deg, ${COLORS.emerald}, ${COLORS.emeraldLight})` }} />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={PAYMENTS.map((p, i) => ({ name: `Pmt ${i + 1}`, cumul: PAYMENTS.slice(0, i + 1).reduce((s, x) => s + x.amount, 0) }))}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Area type="monotone" dataKey="cumul" stroke={COLORS.emerald} fill={`${COLORS.emerald}18`} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verset de la semaine */}
        <div>
          <div className="verse-card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>Verset de la semaine</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "white", position: "relative", zIndex: 1 }}>
              « Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance. »
            </p>
            <div style={{ marginTop: 14, fontSize: 12, color: COLORS.goldLight, fontWeight: 600 }}>Jérémie 29:11</div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Lecture Biblique</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div className="progress-bar-bg" style={{ flex: 1, height: 6 }}>
                <div className="progress-bar-fill" style={{ width: "68%", background: COLORS.gold }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.gold }}>68%</span>
            </div>
            <div style={{ fontSize: 12, color: COLORS.slateLight }}>Jour 89 / 180 • Cohorte Jan. 2025</div>
          </div>
        </div>
      </div>

      {/* Historique paiements */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Historique des paiements</span>
          <button className="btn btn-outline btn-sm">
            <Icon d={Icons.download} size={14} /> Exporter PDF
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th><th>Montant</th><th>Méthode</th><th>Référence</th><th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map(p => (
              <tr key={p.id}>
                <td>{new Date(p.date).toLocaleDateString("fr-FR")}</td>
                <td style={{ fontWeight: 600, color: COLORS.emerald }}>{fmt(p.amount)}</td>
                <td>{p.method}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.muted }}>{p.ref}</td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Données constantes extraites hors du composant pour éviter tout conflit de variable
const FREQUENCES = [
  { key: "hebdo",       label: "Hebdomadaire",    montantLabel: "961 FCFA / sem." },
  { key: "mensuel",     label: "Mensuel",          montantLabel: "4 167 FCFA / mois" },
  { key: "trimestriel", label: "Trimestriel",      montantLabel: "12 500 FCFA / trim." },
  { key: "unique",      label: "Versement unique", montantLabel: "50 000 FCFA" },
];

const RECAPS = [
  { label: "Part allouée",  valeur: fmt(50000), color: COLORS.slate },
  { label: "Total versé",   valeur: fmt(32000), color: COLORS.green },
  { label: "Reste à payer", valeur: fmt(18000), color: COLORS.gold },
  { label: "Progression",   valeur: "64%",      color: COLORS.blue },
];

const PAIEMENT_CHART_DATA = PAYMENTS.map((p, i) => ({
  mois: p.date.slice(5),
  montant: p.amount,
}));

const PayementsView = () => {
  const [montantSaisi, setMontantSaisi] = useState("");
  const [freq, setFreq]     = useState("mensuel");
  const [methode, setMethode] = useState("mtn");
  const [telephone, setTelephone] = useState("");
  const [rappelHeure, setRappelHeure] = useState("09:00");
  const [paiementOk, setPaiementOk] = useState(false);
  const [prefOk, setPrefOk]         = useState(false);

  const handlePayer = () => {
    setPaiementOk(true);
    setTimeout(() => setPaiementOk(false), 3500);
  };

  const handleSauvePref = () => {
    setPrefOk(true);
    setTimeout(() => setPrefOk(false), 3000);
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Mes Paiements</h2>
        <p>Effectuez un versement ou planifiez votre périodicité de contribution</p>
      </div>

      {/* Ligne 1 : Versement + Périodicité */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Carte Versement */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">💳 Effectuer un Versement</span>
          </div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {paiementOk && (
              <div style={{ background: COLORS.greenLight, color: COLORS.green, padding: "12px 16px", borderRadius: 8, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon d={Icons.check} color={COLORS.green} size={16} />
                Paiement initié avec succès ! Un SMS de confirmation vous sera envoyé.
              </div>
            )}

            <div className="input-group">
              <div className="input-label">Montant à verser (min. 500 FCFA)</div>
              <input
                className="input-field"
                type="number"
                min="500"
                placeholder="Ex : 5 000"
                value={montantSaisi}
                onChange={e => setMontantSaisi(e.target.value)}
              />
              {montantSaisi && Number(montantSaisi) < 500 && (
                <div style={{ fontSize: 11, color: COLORS.red, marginTop: 2 }}>
                  Le montant minimum est de 500 FCFA
                </div>
              )}
            </div>

            <div className="input-group">
              <div className="input-label">Méthode de paiement</div>
              <select className="input-field" value={methode} onChange={e => setMethode(e.target.value)}>
                <option value="mtn">📱 MTN Mobile Money</option>
                <option value="wave">🌊 Wave</option>
                <option value="orange">🟠 Orange Money</option>
                <option value="virement">🏦 Virement Bancaire</option>
                <option value="especes">💵 Espèces (auprès du responsable)</option>
              </select>
            </div>

            {(methode === "mtn" || methode === "wave" || methode === "orange") && (
              <div className="input-group">
                <div className="input-label">Numéro de téléphone</div>
                <input
                  className="input-field"
                  type="tel"
                  placeholder="Ex : 07 00 00 00 00"
                  value={telephone}
                  onChange={e => setTelephone(e.target.value)}
                />
              </div>
            )}

            {methode === "virement" && (
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: 12, fontSize: 12, color: COLORS.slateLight, lineHeight: 1.7 }}>
                <strong>Coordonnées bancaires :</strong><br />
                Banque : SGBCI Adzopé<br />
                Compte : CI 01 000 12345678901 23<br />
                Titulaire : Église-École Adzopé
              </div>
            )}

            <div style={{ background: COLORS.bg, borderRadius: 8, padding: 12, fontSize: 12, color: COLORS.slateLight }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span>Déjà versé</span>
                <strong style={{ color: COLORS.green }}>32 000 FCFA</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Reste à atteindre</span>
                <strong style={{ color: COLORS.gold }}>18 000 FCFA</strong>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ justifyContent: "center" }}
              onClick={handlePayer}
              disabled={!montantSaisi || Number(montantSaisi) < 500}
            >
              <Icon d={Icons.send} size={15} color="white" />
              Valider le paiement
            </button>
          </div>
        </div>

        {/* Carte Périodicité */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🗓️ Planifier ma Périodicité</span>
          </div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {prefOk && (
              <div style={{ background: COLORS.greenLight, color: COLORS.green, padding: "12px 16px", borderRadius: 8, fontSize: 14 }}>
                ✅ Préférence enregistrée ! Vous recevrez des rappels selon ce rythme.
              </div>
            )}

            <p style={{ fontSize: 13, color: COLORS.muted }}>
              Choisissez votre rythme. Le système calculera le montant recommandé pour atteindre vos 50 000 FCFA.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {FREQUENCES.map(f => (
                <div
                  key={f.key}
                  onClick={() => setFreq(f.key)}
                  style={{
                    padding: "14px 10px",
                    border: `2px solid ${freq === f.key ? COLORS.emerald : COLORS.border}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "center",
                    background: freq === f.key ? "rgba(26,107,74,0.04)" : "white",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: freq === f.key ? COLORS.emerald : COLORS.slate }}>
                    {f.label}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
                    {f.montantLabel}
                  </div>
                </div>
              ))}
            </div>

            <div className="input-group">
              <div className="input-label">Heure de rappel préférée</div>
              <input
                className="input-field"
                type="time"
                value={rappelHeure}
                onChange={e => setRappelHeure(e.target.value)}
              />
            </div>

            <div style={{ background: COLORS.bg, borderRadius: 8, padding: 12, fontSize: 12, color: COLORS.slateLight, lineHeight: 1.6 }}>
              📢 Les rappels seront envoyés par <strong>SMS et Push</strong> selon vos consentements.
              Aucun rappel ne sera envoyé si votre part est entièrement soldée.
            </div>

            <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} onClick={handleSauvePref}>
              Enregistrer la préférence
            </button>
          </div>
        </div>
      </div>

      {/* Ligne 2 : Récapitulatif + Graphique */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">📊 Récapitulatif annuel — Campagne 2025</span>
          <button className="btn btn-outline btn-sm">
            <Icon d={Icons.download} size={14} /> Exporter PDF
          </button>
        </div>
        <div style={{ padding: 22 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {RECAPS.map(r => (
              <div key={r.label} style={{ textAlign: "center", padding: "14px", background: COLORS.bg, borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  {r.label}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: r.color, fontFamily: "'Playfair Display', serif" }}>
                  {r.valeur}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: COLORS.slateLight }}>Progression globale</span>
              <span style={{ fontWeight: 600, color: COLORS.emerald }}>64%</span>
            </div>
            <div className="progress-bar-bg" style={{ height: 10 }}>
              <div className="progress-bar-fill" style={{ width: "64%", background: `linear-gradient(90deg, ${COLORS.emerald}, ${COLORS.emeraldLight})` }} />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={PAIEMENT_CHART_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="mois"
                tick={{ fontSize: 11, fill: COLORS.muted }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide={true} />
              <Tooltip
                formatter={(val) => [fmt(val), "Versement"]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="montant" fill={COLORS.emerald} radius={[4, 4, 0, 0]} name="Versement" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ligne 3 : Historique détaillé */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">📋 Historique des versements</span>
          <span className="badge" style={{ background: COLORS.greenLight, color: COLORS.green }}>
            {PAYMENTS.length} transactions
          </span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Montant</th>
              <th>Méthode</th>
              <th>Référence</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map(p => (
              <tr key={p.id}>
                <td>{new Date(p.date).toLocaleDateString("fr-FR")}</td>
                <td style={{ fontWeight: 600, color: COLORS.emerald }}>{fmt(p.amount)}</td>
                <td>{p.method}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.muted }}>{p.ref}</td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LectureView = () => {
  const [tab, setTab] = useState("progression");
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [validated, setValidated] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = QUIZ_QUESTIONS[quizIdx];

  const handleAnswer = (i) => {
    if (!validated) setSelected(i);
  };

  const handleValidate = () => {
    setValidated(true);
    const correct = selected === q.correct;
    if (correct) setScore(s => s + 1);
    setAnswers(a => ({ ...a, [quizIdx]: { selected, correct } }));
  };

  const handleNext = () => {
    if (quizIdx < QUIZ_QUESTIONS.length - 1) {
      setQuizIdx(i => i + 1);
      setSelected(null);
      setValidated(false);
    } else {
      setQuizDone(true);
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Lecture Biblique</h2>
        <p>Cohorte Janvier 2025 — Bible complète en 6 mois</p>
      </div>

      <div className="tab-bar">
        {["progression", "qcm", "verset", "certification"].map(t => (
          <div key={t} className={`tab-item ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {{ progression: "📖 Ma Progression", qcm: "✏️ QCM du Jour", verset: "📌 Verset Semaine", certification: "🎓 Certification" }[t]}
          </div>
        ))}
      </div>

      {tab === "progression" && (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <span className="card-title">Ma Progression — {COHORT.name}</span>
                <span className="badge" style={{ background: COLORS.blueLight, color: COLORS.blue }}>Jour {COHORT.day}/{COHORT.total}</span>
              </div>
              <div style={{ padding: 22 }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                    <span>Chapitres lus : <strong>{COHORT.chapitres}</strong></span>
                    <span style={{ color: COLORS.muted }}>Objectif : {COHORT.chapTotal} chapitres</span>
                  </div>
                  <div className="progress-bar-bg" style={{ height: 12 }}>
                    <div className="progress-bar-fill" style={{ width: `${pct(COHORT.chapitres, COHORT.chapTotal)}%`, background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight})` }} />
                  </div>
                  <div style={{ textAlign: "right", fontSize: 12, color: COLORS.gold, marginTop: 4 }}>{pct(COHORT.chapitres, COHORT.chapTotal)}%</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                  {[
                    { label: "Jours complétés", v: COHORT.day, total: COHORT.total, color: COLORS.emerald },
                    { label: "Chapitres lus", v: COHORT.chapitres, total: COHORT.chapTotal, color: COLORS.gold },
                    { label: "Membres cohorte", v: 147, total: null, color: COLORS.blue },
                  ].map(({ label, v, total, color }) => (
                    <div key={label} style={{ padding: 14, background: COLORS.bg, borderRadius: 10, textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'Playfair Display', serif" }}>{v}{total ? `/${total}` : ""}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Valider ma lecture du jour</span></div>
              <div style={{ padding: 22 }}>
                <div style={{ background: COLORS.bg, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>Lecture du jour</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>📖 Psaumes 89–93 + Proverbes 12</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>6 chapitres recommandés</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div className="input-group">
                    <div className="input-label">Chapitres lus aujourd'hui</div>
                    <input className="input-field" type="number" defaultValue="6" />
                  </div>
                  <div className="input-group">
                    <div className="input-label">Temps de lecture (minutes)</div>
                    <input className="input-field" type="number" defaultValue="45" />
                  </div>
                </div>
                <button className="btn btn-primary" style={{ justifyContent: "center", width: "100%" }}>
                  <Icon d={Icons.check} color="white" size={15} /> Valider la lecture
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="verse-card" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>Plan actuel</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.goldLight, marginBottom: 8 }}>Bible Complète 6 mois</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                5 à 6 chapitres par jour pour compléter la lecture intégrale de la Bible d'ici juillet 2025.
              </div>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.slate, marginBottom: 14 }}>🏅 Mes Badges</div>
              {[
                { label: "Fidèle 7 jours", earned: true, icon: "⭐" },
                { label: "Psaumes complet", earned: true, icon: "📖" },
                { label: "30 jours consécutifs", earned: false, icon: "🔥" },
                { label: "Bible à mi-parcours", earned: false, icon: "🏆" },
              ].map(({ label, earned, icon }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, opacity: earned ? 1 : 0.4 }}>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: earned ? COLORS.slate : COLORS.muted }}>{label}</span>
                  {earned && <span className="badge" style={{ marginLeft: "auto", background: COLORS.greenLight, color: COLORS.green }}>Obtenu</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "qcm" && (
        <div style={{ maxWidth: 600 }}>
          {!quizDone ? (
            <div className="card">
              <div className="card-header">
                <span className="card-title">QCM — Lecture Genèse 1-5</span>
                <span style={{ fontSize: 13, color: COLORS.muted }}>Question {quizIdx + 1}/{QUIZ_QUESTIONS.length}</span>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ background: COLORS.bg, borderRadius: 10, padding: "14px 18px", marginBottom: 20, fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>
                  {q.q}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {q.options.map((opt, i) => {
                    let cls = "quiz-option";
                    if (validated) {
                      if (i === q.correct) cls += " correct";
                      else if (i === selected && i !== q.correct) cls += " wrong";
                    } else if (i === selected) cls += " selected";
                    return (
                      <div key={i} className={cls} onClick={() => handleAnswer(i)}>
                        <span style={{ fontWeight: 600, marginRight: 10, opacity: 0.5 }}>{["A", "B", "C", "D"][i]}.</span>
                        {opt}
                      </div>
                    );
                  })}
                </div>
                {!validated ? (
                  <button className="btn btn-primary" style={{ justifyContent: "center", width: "100%" }} onClick={handleValidate} disabled={selected === null}>
                    Valider ma réponse
                  </button>
                ) : (
                  <div>
                    <div style={{ background: selected === q.correct ? COLORS.greenLight : COLORS.redLight, color: selected === q.correct ? COLORS.green : COLORS.red, padding: "12px 16px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
                      {selected === q.correct ? "✅ Bonne réponse !" : "❌ Mauvaise réponse. La bonne réponse est : " + q.options[q.correct]}
                    </div>
                    <button className="btn btn-primary" style={{ justifyContent: "center", width: "100%" }} onClick={handleNext}>
                      {quizIdx < QUIZ_QUESTIONS.length - 1 ? "Question suivante →" : "Voir mon résultat"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h3 className="font-display" style={{ fontSize: 24, color: COLORS.emeraldDark, marginBottom: 8 }}>QCM terminé !</h3>
              <div style={{ fontSize: 40, fontWeight: 700, color: score === 3 ? COLORS.green : score >= 2 ? COLORS.gold : COLORS.red, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>
                {score}/{QUIZ_QUESTIONS.length}
              </div>
              <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>
                {score === 3 ? "Excellent ! Vous maîtrisez parfaitement cette section." : score >= 2 ? "Bien ! Continuez comme ça." : "Relisez les passages et réessayez."}
              </p>
              <button className="btn btn-primary" onClick={() => { setQuizIdx(0); setSelected(null); setValidated(false); setQuizDone(false); setScore(0); setAnswers({}); }}>
                Recommencer le QCM
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "verset" && (
        <div style={{ maxWidth: 600 }}>
          <div className="verse-card" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Verset à mémoriser — Semaine du 03 mars 2025</div>
            <p style={{ fontSize: 18, lineHeight: 1.8, color: "white", fontFamily: "'Playfair Display', serif", position: "relative", zIndex: 1 }}>
              « Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance. »
            </p>
            <div style={{ marginTop: 20, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
              <span style={{ color: COLORS.goldLight, fontWeight: 600, fontSize: 14 }}>Jérémie 29:11</span>
            </div>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: COLORS.slate }}>Testez votre mémorisation</div>
            <textarea className="input-field" rows={4} placeholder="Écrivez le verset de mémoire ici..." style={{ width: "100%", resize: "none" }} />
            <button className="btn btn-gold" style={{ marginTop: 12, width: "100%", justifyContent: "center" }}>
              Vérifier ma mémorisation
            </button>
          </div>
        </div>
      )}

      {tab === "certification" && (
        <div style={{ maxWidth: 600, textAlign: "center" }}>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.emeraldDark}, #1B4D3E)`, borderRadius: 16, padding: 48, color: "white", marginBottom: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, border: `3px solid ${COLORS.gold}`, borderRadius: "50%", opacity: 0.2 }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, border: `2px solid ${COLORS.gold}`, borderRadius: "50%", opacity: 0.15 }} />
            <Icon d={Icons.award} color={COLORS.goldLight} size={56} />
            <h3 className="font-display" style={{ fontSize: 24, marginTop: 16, marginBottom: 8 }}>Certification en cours</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7 }}>
              Vous êtes à <strong style={{ color: COLORS.goldLight }}>68%</strong> du parcours.<br />
              Complétez vos lectures et obtenez un score ≥ 70% aux QCM pour recevoir votre attestation.
            </p>
            <div style={{ marginTop: 24, padding: "14px", background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.goldLight, fontFamily: "'Playfair Display', serif" }}>89/180</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Jours complétés</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.goldLight, fontFamily: "'Playfair Display', serif" }}>76%</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Score moyen QCM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Génère un code anonyme stable basé sur l'id du gap
const gapCode = (id) => `COMP-2025-${String(id).padStart(3, "0")}`;
// Couleurs neutres pour les avatars anonymes (pas liées à un nom)
const anonColors = [COLORS.emerald, COLORS.blue, "#7D3C98", "#2E86AB", "#A23B72"];
const anonColor = (id) => anonColors[(id - 1) % anonColors.length];

const GapsView = ({ isAdmin = false }) => {
  const [bought, setBought] = useState({});

  const listedGaps = GAPS.filter(g => g.listed);

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Compensation (Gaps)</h2>
        <p>Parts non libérées disponibles à l'achat — Fenêtre : 1–15 janvier 2025</p>
      </div>

      {/* Bandeau confidentialité pour les membres */}
      {!isAdmin && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          background: COLORS.blueLight, border: `1px solid ${COLORS.blue}`,
          borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: COLORS.blue
        }}>
          <Icon d={Icons.shield} color={COLORS.blue} size={18} />
          <div>
            <strong>Confidentialité des contributeurs</strong><br />
            <span style={{ opacity: .85 }}>
              Les identités des membres sont anonymisées conformément à notre politique de protection des données.
              Seule l'équipe de pilotage/comptabilité peut accéder aux noms pour les besoins de gestion.
            </span>
          </div>
        </div>
      )}

      {/* Bandeau admin */}
      {isAdmin && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#FEF3DC", border: `1px solid ${COLORS.gold}`,
          borderRadius: 10, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: "#7A5400"
        }}>
          <Icon d={Icons.eye} color={COLORS.gold} size={16} />
          <span><strong>Vue Comptabilité / Pilotage</strong> — Noms visibles uniquement pour les besoins de gestion interne. Ces données sont confidentielles.</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Parts disponibles à l'achat</span>
              <span className="badge" style={{ background: "#FFF3CD", color: "#856404" }}>{listedGaps.length} disponibles</span>
            </div>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              {listedGaps.map(gap => (
                <div key={gap.id} className="gap-item">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Avatar : initiales réelles si admin, icône neutre sinon */}
                    {isAdmin ? (
                      <div className="avatar" style={{ background: getAvatarColor(gap.member), color: "white", fontSize: 12 }}>
                        {gap.member.split(" ").map(x => x[0]).join("")}
                      </div>
                    ) : (
                      <div className="avatar" style={{ background: anonColor(gap.id), color: "white", fontSize: 16 }}>
                        🔒
                      </div>
                    )}
                    <div>
                      {/* Nom : visible admin uniquement */}
                      {isAdmin ? (
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{gap.member}</div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.emerald, fontFamily: "monospace", letterSpacing: 1 }}>
                            {gapCode(gap.id)}
                          </div>
                          <span className="badge" style={{ background: COLORS.blueLight, color: COLORS.blue, fontSize: 10 }}>Anonyme</span>
                        </div>
                      )}
                      {/* L'église reste visible : info organisationnelle, pas identifiante */}
                      <div style={{ fontSize: 12, color: COLORS.muted }}>
                        {gap.church} • En vente depuis le {new Date(gap.listed_at).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontWeight: 700, color: COLORS.gold, fontFamily: "'Playfair Display', serif" }}>
                      {fmt(gap.amount)}
                    </div>
                    {bought[gap.id] ? (
                      <span className="badge" style={{ background: COLORS.greenLight, color: COLORS.green }}>Acheté ✓</span>
                    ) : (
                      <button className="btn btn-gold btn-sm" onClick={() => setBought(b => ({ ...b, [gap.id]: true }))}>
                        Acheter
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Note de bas de liste */}
            {!isAdmin && (
              <div style={{ padding: "10px 18px 16px", borderTop: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 11, color: COLORS.muted, display: "flex", gap: 6 }}>
                  <Icon d={Icons.shield} color={COLORS.muted} size={13} />
                  Les identités sont masquées. Seul le montant, l'église d'origine et la date de mise en vente sont affichés.
                </div>
              </div>
            )}
          </div>

          {/* Vue comptabilité admin : tableau complet avec noms */}
          {isAdmin && (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-header">
                <span className="card-title">🔐 Registre comptable (usage interne)</span>
                <button className="btn btn-outline btn-sm"><Icon d={Icons.download} size={14} /> Export PDF</button>
              </div>
              <table className="table">
                <thead>
                  <tr><th>Code</th><th>Nom complet</th><th>Église</th><th>Montant</th><th>Statut</th></tr>
                </thead>
                <tbody>
                  {GAPS.map(gap => (
                    <tr key={gap.id}>
                      <td style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.muted }}>{gapCode(gap.id)}</td>
                      <td style={{ fontWeight: 600 }}>{gap.member}</td>
                      <td style={{ fontSize: 12, color: COLORS.muted }}>{gap.church}</td>
                      <td style={{ fontWeight: 700, color: COLORS.gold }}>{fmt(gap.amount)}</td>
                      <td>
                        <span className="badge" style={{
                          background: gap.listed ? "#FFF3CD" : COLORS.bg,
                          color: gap.listed ? "#856404" : COLORS.muted
                        }}>
                          {gap.listed ? "En vente" : "Non listé"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.slate, marginBottom: 4 }}>Mon Gap 2024</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.gold, fontFamily: "'Playfair Display', serif" }}>{fmt(18000)}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 16 }}>Solde non versé au 31/12/2024</div>
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: 12, fontSize: 12, color: COLORS.slateLight, lineHeight: 1.6 }}>
                Ce montant a été mis en vente automatiquement le 1er janvier. Vous pouvez le racheter avant le 15 janvier.
              </div>
              <button className="btn btn-outline" style={{ marginTop: 14, width: "100%", justifyContent: "center" }}>
                Racheter mon gap (Buyback)
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>📋 Règles de compensation</div>
            {[
              "Clôture automatique le 31/12 à 23h59",
              "Fenêtre de vente : 1 au 15 janvier",
              "Buyback disponible jusqu'au 10 janvier",
              "Prix de vente = montant du gap exact",
              "1 achat par membre par campagne",
            ].map(r => (
              <div key={r} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.slateLight }}>
                <Icon d={Icons.check} color={COLORS.emerald} size={14} />
                {r}
              </div>
            ))}
          </div>

          {/* Stat anonymisée visible par tous */}
          <div className="card" style={{ marginTop: 16, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>📊 Statistiques gaps</div>
            {[
              { label: "Gaps listés", value: listedGaps.length, color: COLORS.gold },
              { label: "Total disponible", value: fmt(listedGaps.reduce((s, g) => s + g.amount, 0)), color: COLORS.emerald },
              { label: "Gaps non listés", value: GAPS.filter(g => !g.listed).length, color: COLORS.muted },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
                <span style={{ color: COLORS.muted }}>{label}</span>
                <span style={{ fontWeight: 700, color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsView = () => (
  <div className="animate-in">
    <div className="page-header">
      <h2>Notifications</h2>
      <p>Vos alertes et messages récents</p>
    </div>
    <div className="card">
      <div style={{ padding: 8 }}>
        {NOTIFICATIONS.map(n => (
          <div key={n.id} style={{
            display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px",
            background: n.read ? "white" : "rgba(26,107,74,0.03)",
            borderLeft: n.read ? "3px solid transparent" : `3px solid ${COLORS.emerald}`,
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <div className="stat-ring" style={{ background: COLORS.bg, width: 40, height: 40 }}>
              {n.type === "rappel" ? "⏰" : n.type === "lecture" ? "📖" : n.type === "gap" ? "🔄" : "ℹ️"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: COLORS.slate, lineHeight: 1.5 }}>{n.msg}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{n.time}</div>
            </div>
            {!n.read && <div className="animate-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.emerald, marginTop: 6 }} />}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── ADMIN VIEWS ───────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const pctCollecte = pct(CAMPAIGN.collected, CAMPAIGN.target);

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Tableau de bord Régional</h2>
        <p>Vue d'ensemble — Campagne 2025 • Région Adzopé</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
        {[
          { label: "Collecte totale", value: "87,45M FCFA", sub: `${pctCollecte}% de l'objectif`, color: COLORS.emerald },
          { label: "Membres inscrits", value: "1 749", sub: `sur ${CAMPAIGN.members} cibles`, color: COLORS.blue },
          { label: "Taux de paiement", value: "73%", sub: "ont versé au moins 1 fois", color: COLORS.green },
          { label: "Gaps identifiés", value: "312", sub: "à gérer en janvier", color: COLORS.gold },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-accent" style={{ background: color }} />
            <div className="kpi-label">{label}</div>
            <div className="kpi-value" style={{ color }}>{value}</div>
            <div className="kpi-sub">{sub}</div>
          </div>
        ))}
      </div>

      {/* Gamification + Organisation row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { emoji: "📖", niveau: "Lecteur",     count: 892,  color: COLORS.muted   },
          { emoji: "🌱", niveau: "Disciple",    count: 647,  color: COLORS.blue    },
          { emoji: "⚒️", niveau: "Serviteur",   count: 183,  color: COLORS.emerald },
          { emoji: "🏆", niveau: "Responsable", count: 27,   color: COLORS.gold    },
        ].map(g => (
          <div key={g.niveau} className="kpi-card" style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{g.emoji}</span>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: .5, color: COLORS.muted }}>Niveau</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: g.color, fontFamily: "'Playfair Display', serif" }}>{g.count.toLocaleString("fr-FR")}</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>{g.niveau}</div>
            <div style={{ marginTop: 6, height: 3, background: COLORS.border, borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${pct(g.count, 1749)}%`, background: g.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Collecte mensuelle vs Objectif</span>
            <span className="badge" style={{ background: COLORS.blueLight, color: COLORS.blue }}>Année 2025</span>
          </div>
          <div style={{ padding: 16 }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_DATA}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 10, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                <Tooltip formatter={v => fmt(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="cible" fill={`${COLORS.border}`} name="Objectif mensuel" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collecte" fill={COLORS.emerald} name="Collecte réelle" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Avancement Global</span></div>
          <div style={{ padding: 22, textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={[{ value: pctCollecte }, { value: 100 - pctCollecte }]}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={90} endAngle={-270} dataKey="value">
                    <Cell fill={COLORS.emerald} />
                    <Cell fill={COLORS.border} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", textAlign: "center" }}>
                <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: COLORS.emeraldDark }}>{pctCollecte}%</div>
                <div style={{ fontSize: 10, color: COLORS.muted }}>collecté</div>
              </div>
            </div>
            <div className="font-display" style={{ fontSize: 20, color: COLORS.emeraldDark, fontWeight: 700 }}>87,45M FCFA</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>sur 200 000 000 FCFA</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Performance par Église</span>
          <button className="btn btn-outline btn-sm"><Icon d={Icons.download} size={14} /> Export CSV</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>Église</th><th>Responsable</th><th>Membres</th><th>Taux payeurs</th><th>Gaps</th><th>Statut</th></tr>
          </thead>
          <tbody>
            {CHURCHES.map(c => (
              <tr key={c.name}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>{c.leader}</td>
                <td>{c.members}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="progress-bar-bg" style={{ width: 80, height: 6 }}>
                      <div className="progress-bar-fill" style={{ width: `${c.paid}%`, background: c.paid >= 75 ? COLORS.green : c.paid >= 50 ? COLORS.gold : COLORS.red }} />
                    </div>
                    <span style={{ fontSize: 12 }}>{c.paid}%</span>
                  </div>
                </td>
                <td><span style={{ color: c.gap > 20 ? COLORS.red : COLORS.gold, fontWeight: 600 }}>{c.gap}</span></td>
                <td>
                  <span className="badge" style={{ background: c.paid >= 75 ? COLORS.greenLight : c.paid >= 50 ? "#FFF3CD" : COLORS.redLight, color: c.paid >= 75 ? COLORS.green : c.paid >= 50 ? "#856404" : COLORS.red }}>
                    {c.paid >= 75 ? "Bon rythme" : c.paid >= 50 ? "À surveiller" : "En retard"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Génère un identifiant membre anonyme stable
const memberCode = (idx) => `MBR-${String(idx + 1).padStart(4, "0")}`;

const MembresView = () => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("tous");
  // MembresView est TOUJOURS admin (accessible que depuis adminNav)
  // On génère ici la vue comptabilité avec accès complet
  const filtered = MEMBERS_DATA.filter((m, _i) =>
    (cat === "tous" || m.category.toLowerCase() === cat) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
     memberCode(MEMBERS_DATA.indexOf(m)).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Gestion des Membres</h2>
        <p>Vue comptabilité / pilotage — Données confidentielles</p>
      </div>

      {/* Bandeau admin */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "#FEF3DC", border: `1px solid ${COLORS.gold}`,
        borderRadius: 10, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: "#7A5400"
      }}>
        <Icon d={Icons.shield} color={COLORS.gold} size={16} />
        <span>
          <strong>🔐 Accès Comptabilité / Pilotage uniquement.</strong> Les noms complets sont visibles ici pour les besoins de gestion interne. Ces données ne sont jamais affichées aux autres membres.
        </span>
      </div>

      {/* KPIs catégories — données agrégées uniquement, pas de noms */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {CATEGORY_DATA.map(c => (
          <div key={c.name} className="kpi-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color, fontFamily: "'Playfair Display', serif" }}>{c.value.toLocaleString("fr-FR")}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{c.name}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Registre des membres</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input className="input-field" style={{ padding: "7px 12px", width: 200, fontSize: 13 }} placeholder="🔍 Nom ou ID membre…" value={search} onChange={e => setSearch(e.target.value)} />
            <select className="input-field" style={{ padding: "7px 12px", fontSize: 13 }} value={cat} onChange={e => setCat(e.target.value)}>
              <option value="tous">Toutes catégories</option>
              <option value="homme">Hommes</option>
              <option value="femme">Femmes</option>
              <option value="couple">Couples</option>
              <option value="élève">Élèves</option>
              <option value="travailleur">Travailleurs</option>
            </select>
            <button className="btn btn-outline btn-sm"><Icon d={Icons.download} size={14} /> Export PDF</button>
            <button className="btn btn-primary btn-sm"><Icon d={Icons.plus} size={14} color="white" /> Nouveau</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID Membre</th>
              <th>Nom complet <span style={{ fontSize: 9, background: COLORS.goldPale, color: COLORS.gold, padding: "1px 5px", borderRadius: 4, marginLeft: 4 }}>🔒 CONFIDENTIEL</span></th>
              <th>Catégorie</th>
              <th>Église</th>
              <th>Versé</th>
              <th>Progression</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => {
              const idx = MEMBERS_DATA.indexOf(m);
              return (
                <tr key={m.name}>
                  {/* ID système toujours visible */}
                  <td style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.muted, fontWeight: 600 }}>
                    {memberCode(idx)}
                  </td>
                  {/* Nom : vue admin uniquement — cellule avec indicateur confidentiel */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="avatar" style={{ background: getAvatarColor(m.name), color: "white", fontSize: 11 }}>
                        {m.name.split(" ").map(x => x[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                        <div style={{ fontSize: 10, color: COLORS.muted }}>Usage interne uniquement</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="chip" style={{ background: COLORS.bg, color: COLORS.slateLight }}>{m.category}</span></td>
                  <td style={{ fontSize: 12, color: COLORS.muted }}>{m.church}</td>
                  <td style={{ fontWeight: 600, color: COLORS.emerald }}>{fmt(m.paid)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar-bg" style={{ width: 70, height: 5 }}>
                        <div className="progress-bar-fill" style={{ width: `${pct(m.paid, 50000)}%`, background: COLORS.emerald }} />
                      </div>
                      <span style={{ fontSize: 11, color: COLORS.muted }}>{pct(m.paid, 50000)}%</span>
                    </div>
                  </td>
                  <td><StatusBadge status={m.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Note de bas de tableau */}
        <div style={{ padding: "10px 18px 14px", borderTop: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon d={Icons.shield} color={COLORS.muted} size={13} />
          <span style={{ fontSize: 11, color: COLORS.muted }}>
            Ces données sont réservées à l'équipe de pilotage. Les membres ne voient que leur propre compte. Conforme RGPD — registre des traitements disponible dans Gouvernance.
          </span>
        </div>
      </div>
    </div>
  );
};

const StatistiquesView = () => (
  <div className="animate-in">
    <div className="page-header">
      <h2>Statistiques Régionales</h2>
      <p>Analyse démographique et spirituelle de la communauté</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
      <div className="card">
        <div className="card-header"><span className="card-title">Répartition par Catégorie</span></div>
        <div style={{ padding: 16, display: "flex", alignItems: "center" }}>
          <ResponsiveContainer width="50%" height={200}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {CATEGORY_DATA.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v.toLocaleString("fr-FR"), n]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {CATEGORY_DATA.map(c => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{c.name}</span>
                <strong>{c.value.toLocaleString("fr-FR")}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Engagement Spirituel — Cohortes</span></div>
        <div style={{ padding: 22 }}>
          {[
            { label: "Membres inscrits en cohorte", value: 147, total: 1749, color: COLORS.emerald },
            { label: "Lectures validées ce mois", value: 89, total: 147, color: COLORS.gold },
            { label: "QCM complétés", value: 67, total: 147, color: COLORS.blue },
            { label: "Certifiés (cohortes précédentes)", value: 23, total: null, color: COLORS.purple },
          ].map(({ label, value, total, color }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span>{label}</span>
                <strong style={{ color }}>{value}{total ? `/${total}` : ""}</strong>
              </div>
              {total && (
                <div className="progress-bar-bg" style={{ height: 6 }}>
                  <div className="progress-bar-fill" style={{ width: `${pct(value, total)}%`, background: color }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-header">
        <span className="card-title">Évolution mensuelle de la collecte (2025)</span>
      </div>
      <div style={{ padding: 16 }}>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={MONTHLY_DATA}>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 10, fill: COLORS.muted }} axisLine={false} tickLine={false} />
            <Tooltip formatter={v => fmt(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Area type="monotone" dataKey="cible" stroke={COLORS.border} fill={`${COLORS.border}40`} name="Objectif" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="collecte" stroke={COLORS.emerald} fill={`${COLORS.emerald}18`} name="Collecte" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const CommunicationsView = () => {
  const [sent, setSent] = useState(false);
  const [msgType, setMsgType] = useState("annonce");
  const MSG_TYPES = [
    { id: "annonce",  label: "📢 Annonce",  color: COLORS.gold,    bg: "#FFF3CD" },
    { id: "priere",   label: "🙏 Prière",   color: COLORS.emerald, bg: COLORS.greenLight },
    { id: "sos",      label: "🆘 SOS",      color: COLORS.red,     bg: COLORS.redLight },
    { id: "info",     label: "ℹ️ Info",     color: COLORS.blue,    bg: COLORS.blueLight },
  ];
  const t = MSG_TYPES.find(t => t.id === msgType);
  const COMM_HIST = [
    { type: "annonce", title: "Lancement Campagne 2025", date: "01 jan. 2025", dest: "4 000 membres", canal: "Push + SMS" },
    { type: "priere",  title: "Prière collective — Avancement chantier", date: "15 fév. 2025", dest: "1 749 membres", canal: "Push" },
    { type: "info",    title: "Rappel Q1 — Fin de trimestre", date: "28 mar. 2025", dest: "1 312 membres", canal: "SMS + Email" },
    { type: "sos",     title: "Alerte retard paiement Daoukro", date: "10 mar. 2025", dest: "334 membres", canal: "SMS" },
    { type: "annonce", title: "Résultats cohorte Déc. 2024", date: "05 jan. 2025", dest: "147 membres", canal: "Email" },
  ];

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Communications</h2>
        <p>Envoyez des messages ciblés à vos membres</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Nouveau Message</span></div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {sent && <div style={{ background: COLORS.greenLight, color: COLORS.green, padding: "12px 16px", borderRadius: 8, fontSize: 14 }}>✅ Message envoyé avec succès !</div>}
            <div>
              <div className="input-label" style={{ marginBottom: 8 }}>Type de message</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                {MSG_TYPES.map(mt => (
                  <div key={mt.id} onClick={() => setMsgType(mt.id)} style={{ padding: "10px 8px", border: `2px solid ${msgType === mt.id ? mt.color : COLORS.border}`, borderRadius: 10, cursor: "pointer", textAlign: "center", background: msgType === mt.id ? mt.bg : "white" }}>
                    <div style={{ fontSize: 18 }}>{mt.label.split(" ")[0]}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: msgType === mt.id ? mt.color : COLORS.muted }}>{mt.label.split(" ").slice(1).join(" ")}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="input-group">
              <div className="input-label">Titre du message</div>
              <input className="input-field" defaultValue="Rappel — Campagne 2025 : votre contribution" />
            </div>
            <div className="input-group">
              <div className="input-label">Canaux d'envoi</div>
              <div style={{ display: "flex", gap: 14 }}>
                {["📱 Push", "💬 SMS", "📧 Email"].map(c => (
                  <label key={c} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: COLORS.emerald }} /> {c}
                  </label>
                ))}
              </div>
            </div>
            <div className="input-group">
              <div className="input-label">Ciblage</div>
              <select className="input-field">
                <option>Tous les membres actifs (1 749)</option>
                <option>Membres en retard de paiement (487)</option>
                <option>Cohorte Janvier 2025 — Adzopé Centre A (11)</option>
                <option>Toutes les cohortes actives (127)</option>
                <option>Église Adzopé Centre seulement (412)</option>
                <option>Niveau Lecteur uniquement (892)</option>
                <option>Membres sans paiement ce mois (312)</option>
              </select>
            </div>
            <div className="input-group">
              <div className="input-label">Contenu du message</div>
              <textarea className="input-field" rows={4} style={{ resize: "none" }} defaultValue={`Cher(e) membre,\n\nNous vous rappelons que la campagne 2025 est en cours. Votre contribution est essentielle pour atteindre notre objectif commun de 200 millions FCFA.\n\nEnsemble, construisons l'avenir de nos enfants !\n\n— Équipe Église-École Adzopé`} />
            </div>
            <button className="btn btn-primary" style={{ justifyContent: "center", background: t?.color }} onClick={() => { setSent(true); setTimeout(() => setSent(false), 4000); }}>
              <Icon d={Icons.send} size={15} color="white" /> Envoyer {t?.label}
            </button>
          </div>
        </div>

        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {MSG_TYPES.map(mt => {
              const count = COMM_HIST.filter(h => h.type === mt.id).length;
              return (
                <div key={mt.id} style={{ background: mt.bg, borderRadius: 12, padding: 14, borderLeft: `3px solid ${mt.color}` }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{mt.label.split(" ")[0]}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: mt.color, fontFamily: "'Playfair Display', serif" }}>{count}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{mt.label.split(" ").slice(1).join(" ")} envoyé{count > 1 ? "s" : ""}</div>
                </div>
              );
            })}
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Historique d'envois</span></div>
            <div style={{ padding: 12 }}>
              {COMM_HIST.map((m, i) => {
                const mt = MSG_TYPES.find(t => t.id === m.type);
                return (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot" style={{ background: mt?.color || COLORS.emerald }} />
                    <div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: mt?.bg, color: mt?.color, fontWeight: 700 }}>{mt?.label}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{m.title}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>{m.date} • {m.dest} • {m.canal}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ParametresView = () => (
  <div className="animate-in">
    <div className="page-header">
      <h2>Paramètres & Sécurité</h2>
      <p>Configuration de la plateforme, campagne et sécurité des sessions</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div className="card">
        <div className="card-header"><span className="card-title">Paramètres Campagne 2025</span></div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Objectif annuel (FCFA)", value: "200 000 000" },
            { label: "Part annuelle / membre", value: "50 000" },
            { label: "Montant minimum par versement", value: "500" },
            { label: "Date de clôture", value: "31/12/2025" },
            { label: "Fenêtre vente gaps (début)", value: "01/01/2026" },
            { label: "Fenêtre vente gaps (fin)", value: "15/01/2026" },
          ].map(({ label, value }) => (
            <div key={label} className="input-group">
              <div className="input-label">{label}</div>
              <input className="input-field" defaultValue={value} />
            </div>
          ))}
          <button className="btn btn-primary" style={{ justifyContent: "center" }}>Enregistrer les paramètres</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">🔐 Sécurité & Sessions</span></div>
          <div style={{ padding: 18 }}>
            {[
              { icon: "📱", label: "Connexion : Téléphone + Code PIN", status: true },
              { icon: "⏱️", label: "Timeout session automatique : 15 min", status: true },
              { icon: "🔒", label: "Chiffrement données religieuses (AES-256)", status: true },
              { icon: "🔐", label: "Authentification 2FA activée", status: false },
              { icon: "📊", label: "Audit logs activés", status: true },
              { icon: "🌐", label: "TLS/HTTPS partout", status: true },
            ].map(({ icon, label, status }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ flex: 1, fontSize: 13 }}>{label}</span>
                <span className="badge" style={{ background: status ? COLORS.greenLight : COLORS.redLight, color: status ? COLORS.green : COLORS.red }}>
                  {status ? "Actif" : "Inactif"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">🌍 Structure hiérarchique</span></div>
          <div style={{ padding: 18 }}>
            {[
              { label: "Individu → Église → Région → District → National", ok: true },
              { label: "Cohortes : 10-12 membres / groupe", ok: true },
              { label: "Responsables cohorte validés", ok: true },
              { label: "Consentements RGPD enregistrés", ok: true },
            ].map(({ label, ok }) => (
              <div key={label} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.slate }}>
                <span style={{ color: ok ? COLORS.green : COLORS.muted }}>{ok ? "✅" : "⬜"}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── GOUVERNANCE & ORG VIEW ────────────────────────────────────────────────────
const GouvernanceView = () => {
  const [rbacTab, setRbacTab] = useState("structure");
  const ORG = [
    { level: "🌍 National",    count: 1,    color: COLORS.emeraldDark, desc: "Direction nationale — accès global anonymisé" },
    { level: "🗺️ District",    count: 3,    color: COLORS.emerald,     desc: "Coordination inter-régionale" },
    { level: "📍 Région",      count: 8,    color: COLORS.blue,        desc: "Président régional — stats agrégées" },
    { level: "⛪ Église",      count: 42,   color: COLORS.gold,        desc: "Pasteur — statistiques église (anonymisé)" },
    { level: "👥 Cohorte",     count: 127,  color: COLORS.green,       desc: "10-12 membres par groupe" },
    { level: "🙍 Individu",    count: 4000, color: COLORS.muted,       desc: "Membre — accès à ses données uniquement" },
  ];
  const RBAC_RULES = [
    { role: "MEMBRE",           voit: ["Ses contributions", "Sa progression", "Ses badges", "Son QCM"], neVoitPas: ["Contributions des autres", "Statistiques église", "Logs d'audit"] },
    { role: "PASTEUR LOCAL",    voit: ["Nb contributeurs église", "Total collecté église", "Taux participation"], neVoitPas: ["Montants individuels", "Identités contributeurs"] },
    { role: "RESP. RÉGIONAL",   voit: ["Stats régionales agrégées", "Progression cohortes", "Ranking églises"], neVoitPas: ["Contributions individuelles", "Détails membres"] },
    { role: "ADMIN NATIONAL",   voit: ["Statistiques globales", "Rapports financiers", "Gestion utilisateurs", "Logs d'audit"], neVoitPas: ["Données identifiantes inutiles"] },
  ];
  const CONDITIONS = [
    { step: 1, label: "Inscription membre", detail: "Numéro téléphone + code PIN", icon: "📱", ok: 3840 },
    { step: 2, label: "Programme lecture (6 mois)", detail: "Bible complète — validation quotidienne", icon: "📖", ok: 1749 },
    { step: 3, label: "Baptême validé", detail: "Confirmation par pasteur local", icon: "💧", ok: 1420 },
    { step: 4, label: "Accès cotisation débloqué", detail: "Part annuelle 50 000 FCFA", icon: "✅", ok: 1312 },
  ];

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Gouvernance & Organisation</h2>
        <p>Structure hiérarchique, RBAC et confidentialité des données</p>
      </div>

      <div className="tab-bar" style={{ marginBottom: 24 }}>
        {[["structure","🌐 Structure org."],["rbac","🔐 RBAC & Confidentialité"],["conditions","🔓 Conditions accès"],["principes","⚖️ Principes"]].map(([k,l]) => (
          <div key={k} className={`tab-item ${rbacTab===k?"active":""}`} onClick={() => setRbacTab(k)}>{l}</div>
        ))}
      </div>

      {rbacTab === "structure" && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><span className="card-title">Hiérarchie organisationnelle</span></div>
            <div style={{ padding: 24 }}>
              {ORG.map((o, i) => (
                <div key={o.level} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: i < ORG.length-1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <div style={{ width: `${100 - i*12}%`, maxWidth: 200, minWidth: 100 }}>
                    <div style={{ height: 6, background: o.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.slate }}>{o.level}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{o.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: o.color, fontFamily: "'Playfair Display', serif" }}>{o.count.toLocaleString("fr-FR")}</div>
                    <div style={{ fontSize: 10, color: COLORS.muted }}>entités</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { label: "Principe cardinal", value: "1 membre = 1 voix", sub: "En Assemblée Générale", icon: "⚖️", color: COLORS.emerald },
              { label: "Séparation pouvoirs", value: "Bureau ≠ Gestion", sub: "Entité projet distincte", icon: "🏛️", color: COLORS.blue },
              { label: "Tolérance zéro", value: "Malversations", sub: "Sanctions intégrées", icon: "🛡️", color: COLORS.red },
            ].map(k => (
              <div key={k.label} className="kpi-card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{k.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{k.sub}</div>
                <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 4, textTransform: "uppercase", letterSpacing: .5 }}>{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rbacTab === "rbac" && (
        <div>
          <div style={{ background: COLORS.blueLight, border: `1px solid ${COLORS.blue}`, borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: COLORS.blue }}>
            🔒 <strong>Principe fondamental :</strong> Les responsables voient uniquement le nombre de contributeurs, le total collecté et la progression. Aucun montant individuel n'est visible.
          </div>
          {RBAC_RULES.map(r => (
            <div key={r.role} className="card" style={{ marginBottom: 14 }}>
              <div className="card-header">
                <span className="card-title">{r.role}</span>
              </div>
              <div style={{ padding: "14px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.green, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>✅ Peut voir</div>
                  {r.voit.map(v => (
                    <div key={v} style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 13, color: COLORS.slate }}>
                      <span style={{ color: COLORS.green }}>•</span>{v}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.red, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>🚫 Ne voit PAS</div>
                  {r.neVoitPas.map(v => (
                    <div key={v} style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 13, color: COLORS.slateLight }}>
                      <span style={{ color: COLORS.red }}>•</span>{v}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rbacTab === "conditions" && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><span className="card-title">Entonnoir d'accès à la cotisation</span></div>
            <div style={{ padding: 24 }}>
              {CONDITIONS.map((c, i) => (
                <div key={c.step} style={{ display: "flex", gap: 16, marginBottom: i < CONDITIONS.length - 1 ? 0 : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.emerald, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{c.icon}</div>
                    {i < CONDITIONS.length - 1 && <div style={{ width: 2, flex: 1, background: COLORS.border, minHeight: 24, marginTop: 4, marginBottom: 4 }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: i < CONDITIONS.length - 1 ? 20 : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.slate }}>Étape {c.step} — {c.label}</div>
                        <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>{c.detail}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.emerald, fontFamily: "'Playfair Display', serif" }}>{c.ok.toLocaleString("fr-FR")}</div>
                        <div style={{ fontSize: 10, color: COLORS.muted }}>membres</div>
                      </div>
                    </div>
                    <div style={{ height: 6, background: COLORS.border, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct(c.ok, 4000)}%`, background: `linear-gradient(90deg, ${COLORS.emerald}, ${COLORS.emeraldLight})`, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{pct(c.ok, 4000)}% des 4 000 membres cibles</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {rbacTab === "principes" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { title: "RGPD & Données sensibles", icon: "🔒", items: ["Consentement explicite (case vide)", "Registre des traitements", "Chiffrement données religieuses", "Droit accès/rectification/suppression", "Durées conservation définies"] },
            { title: "Sécurité session", icon: "⏱️", items: ["Connexion : Téléphone + Code PIN", "Déconnexion auto après 15 min", "Timeout sur inactivité", "Chiffrement TLS/HTTPS", "Logs d'accès et d'audit"] },
            { title: "Gouvernance financière", icon: "💰", items: ["Fonds projet séparés des opérations", "Audit annuel par vérificateur qualifié", "Rapport mensuel transparence chantier", "Tolérance zéro malversations", "Comité de pilotage indépendant"] },
            { title: "Principe 1 membre = 1 voix", icon: "⚖️", items: ["Indépendant du montant investi", "Vote en Assemblée Générale", "Décision dividendes en Année 5", "Représentation équitable", "Registre des actionnaires éthique"] },
          ].map(g => (
            <div key={g.title} className="card">
              <div className="card-header">
                <span className="card-title">{g.icon} {g.title}</span>
              </div>
              <div style={{ padding: "12px 22px" }}>
                {g.items.map(item => (
                  <div key={item} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.slate }}>
                    <span style={{ color: COLORS.emerald, flexShrink: 0 }}>✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ADMIN COHORTES VIEW ───────────────────────────────────────────────────────
const AdminCohortesView = () => {
  const COHORTES_ADMIN = [
    { id: "C-AA", nom: "Adzopé Centre A", taille: 11, actifs: 8, scoreM: 72, jourM: 89, responsable: "Adjoua Céleste", eglise: "Adzopé Centre" },
    { id: "C-AB", nom: "Adzopé Centre B", taille: 12, actifs: 11, scoreM: 85, jourM: 91, responsable: "Yao Rodrigue", eglise: "Adzopé Centre" },
    { id: "C-BE", nom: "Abengourou Est A", taille: 10, actifs: 9, scoreM: 68, jourM: 87, responsable: "Koffi Jean", eglise: "Abengourou Est" },
    { id: "C-DA", nom: "Daoukro A", taille: 11, actifs: 7, scoreM: 61, jourM: 82, responsable: "Brou Marina", eglise: "Daoukro" },
    { id: "C-MB", nom: "M'Batto A", taille: 10, actifs: 10, scoreM: 90, jourM: 90, responsable: "N'Goran Esther", eglise: "M'Batto" },
  ];
  const GAMIF_STATS = [
    { niveau: "Lecteur 📖",    count: 892, color: COLORS.muted  },
    { niveau: "Disciple 🌱",   count: 647, color: COLORS.blue   },
    { niveau: "Serviteur ⚒️",  count: 183, color: COLORS.emerald},
    { niveau: "Responsable 🏆",count: 27,  color: COLORS.gold   },
  ];

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Gestion des Cohortes</h2>
        <p>Suivi des groupes d'apprentissage et de la gamification</p>
      </div>

      {/* KPIs gamification */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {GAMIF_STATS.map(g => (
          <div key={g.niveau} className="kpi-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: g.color, fontFamily: "'Playfair Display', serif" }}>{g.count.toLocaleString("fr-FR")}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{g.niveau}</div>
            <div style={{ marginTop: 8, height: 4, background: COLORS.border, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct(g.count, 1749)}%`, background: g.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">Toutes les cohortes actives</span>
          <button className="btn btn-primary btn-sm"><Icon d={Icons.plus} size={14} color="white" /> Créer cohorte</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>Cohorte</th><th>Église</th><th>Responsable</th><th>Membres actifs</th><th>Score moyen</th><th>Avancement</th><th>Statut</th></tr>
          </thead>
          <tbody>
            {COHORTES_ADMIN.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.nom}</td>
                <td style={{ fontSize: 12, color: COLORS.muted }}>{c.eglise}</td>
                <td>{c.responsable}</td>
                <td>
                  <span style={{ fontWeight: 700, color: c.actifs >= c.taille * 0.8 ? COLORS.green : COLORS.gold }}>{c.actifs}/{c.taille}</span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 60, height: 5, background: COLORS.border, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${c.scoreM}%`, background: c.scoreM >= 80 ? COLORS.green : c.scoreM >= 70 ? COLORS.gold : COLORS.red }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{c.scoreM}%</span>
                  </div>
                </td>
                <td style={{ fontSize: 12 }}>Jour {c.jourM}/180</td>
                <td>
                  <span className="badge" style={{ background: c.scoreM >= 80 ? COLORS.greenLight : c.scoreM >= 70 ? "#FFF3CD" : COLORS.redLight, color: c.scoreM >= 80 ? COLORS.green : c.scoreM >= 70 ? "#856404" : COLORS.red }}>
                    {c.scoreM >= 80 ? "Excellent" : c.scoreM >= 70 ? "Bon rythme" : "À accompagner"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Conditions responsable cohorte</span></div>
          <div style={{ padding: 18 }}>
            {[
              { cond: "Membre actif depuis 6+ mois", ok: true },
              { cond: "Baptisé et validé par pasteur", ok: true },
              { cond: "Score lecture ≥ 70%", ok: true },
              { cond: "Formation animateur cohorte", ok: false },
              { cond: "Validation responsable régional", ok: false },
            ].map(c => (
              <div key={c.cond} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
                <span style={{ color: c.ok ? COLORS.green : COLORS.muted }}>{ c.ok ? "✅" : "⬜"}</span>
                <span style={{ color: c.ok ? COLORS.slate : COLORS.muted }}>{c.cond}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Messages cohortes récents</span></div>
          <div style={{ padding: 14 }}>
            {[
              { type: "🙏", msg: "Prière collective ce soir 20h — Cohorte M'Batto A", from: "N'Goran Esther", time: "15h23" },
              { type: "📢", msg: "Rappel : QCM Psaumes deadline demain", from: "Système", time: "12h00" },
              { type: "🆘", msg: "Besoin aide pour Lévitique — Cohorte DA", from: "Brou Marina", time: "09h41" },
              { type: "ℹ️", msg: "5 membres certifiés cette semaine !", from: "Admin", time: "08h00" },
            ].map(m => (
              <div key={m.msg} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18 }}>{m.type}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: COLORS.slate }}>{m.msg}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{m.from} · {m.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function DashboardApp({ onBack }) {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      setView(user.role === "MEMBRE" ? "dashboard" : "admin_dashboard");
    }
  }, [user]);

  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  if (!user) return (
    <>
      <style>{styles}</style>
      {onBack && (
        <button onClick={onBack} style={{ position: "fixed", top: 16, left: 16, zIndex: 999, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(4px)" }}>
          ← Accueil
        </button>
      )}
      <LoginView onLogin={setUser} />
    </>
  );

  const renderView = () => {
    if (user.role === "MEMBRE") {
      switch (view) {
        case "dashboard": return <MemberDashboard user={user} />;
        case "paiements": return <PayementsView />;
        case "lecture": return <LectureView />;
        case "gaps": return <GapsView isAdmin={false} />;
        case "notifications": return <NotificationsView />;
        default: return <MemberDashboard user={user} />;
      }
    } else {
      switch (view) {
        case "admin_dashboard": return <AdminDashboard />;
        case "membres": return <MembresView />;
        case "campagne": return <StatistiquesView />;
        case "admin_gaps": return <GapsView isAdmin={true} />;
        case "admin_lecture": return <LectureView />;
        case "admin_cohortes": return <AdminCohortesView />;
        case "gouvernance": return <GouvernanceView />;
        case "statistiques": return <StatistiquesView />;
        case "communications": return <CommunicationsView />;
        case "parametres": return <ParametresView />;
        default: return <AdminDashboard />;
      }
    }
  };

  return (
    <>
      <style>{styles}</style>
      <Sidebar user={user} current={view} onChange={setView} onLogout={() => { setUser(null); }} />
      <Topbar user={user} unreadCount={unread} onNotif={() => setShowNotifs(s => !s)} onBack={onBack} />
      {showNotifs && (
        <div style={{
          position: "fixed", top: 72, right: 20, width: 360, background: "white",
          borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 200,
          border: `1px solid ${COLORS.border}`, overflow: "hidden"
        }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
            <span className="badge" style={{ background: COLORS.redLight, color: COLORS.red }}>{unread} non lues</span>
          </div>
          {NOTIFICATIONS.slice(0, 4).map(n => (
            <div key={n.id} style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.border}`, background: n.read ? "white" : "rgba(26,107,74,0.03)" }}>
              <div style={{ fontSize: 13, color: COLORS.slate }}>{n.msg}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{n.time}</div>
            </div>
          ))}
          <div style={{ padding: "10px 18px", textAlign: "center" }}>
            <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={() => { setShowNotifs(false); setView("notifications"); }}>
              Voir toutes les notifications
            </button>
          </div>
        </div>
      )}
      <div className="main main-with-topbar">
        {renderView()}
      </div>
    </>
  );
}
