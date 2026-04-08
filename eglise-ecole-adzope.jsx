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
  membre: { id: 1, name: "Konan Emmanuel", email: "k.emmanuel@gmail.com", role: "MEMBRE", church: "Église Adzopé Centre", sector: "Secteur Nord", avatar: "KE", paid: 32000, total: 73000, status: "en_cours", baptise: true, cycle_biblique: true, eligible_cotisation: true },
  responsable: { id: 2, name: "Adjoua Marie-Claire", email: "mc.adjoua@gmail.com", role: "RESPONSABLE_LOCAL", church: "Église Adzopé Centre", sector: "Secteur Nord", avatar: "AM" },
  admin: { id: 3, name: "Président Kouassi", email: "president@eglise-adzope.ci", role: "ADMIN", church: "Région Adzopé", avatar: "PK" },
};

// D4 — Objectif individuel 73 000 FCFA, montants flexibles
const INDIVIDUAL_SHARE = 73000;
const FLEXIBLE_AMOUNTS = [1000, 1500, 3000, 6000];

const CAMPAIGN = { year: 2025, target: 200000000, collected: 87450000, members: 4000, enrolled: 1749, share: 73000, minPayment: 1000 };

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

// D1 — Hiérarchie Région > Secteur > Église
const SECTORS = [
  { name: "Secteur Nord", leader: "Diacre Kouadio Germain", churches: ["Adzopé Centre", "Yakassé-Attobrou"], members: 613 },
  { name: "Secteur Est", leader: "Diacre Assi Raymond", churches: ["Abengourou Est", "Agnibilékrou"], members: 515 },
  { name: "Secteur Ouest", leader: "Diacre Brou Christophe", churches: ["Daoukro", "M'Batto"], members: 621 },
];

const CHURCHES = [
  { name: "Adzopé Centre", sector: "Secteur Nord", members: 412, paid: 87, gap: 23, leader: "Pasteur Yao" },
  { name: "Abengourou Est", sector: "Secteur Est", members: 389, paid: 72, gap: 31, leader: "Pasteur Koffi" },
  { name: "Daoukro", sector: "Secteur Ouest", members: 334, paid: 65, gap: 18, leader: "Pasteur Brou" },
  { name: "M'Batto", sector: "Secteur Ouest", members: 287, paid: 58, gap: 27, leader: "Pasteur Ama" },
  { name: "Yakassé-Attobrou", sector: "Secteur Nord", members: 201, paid: 44, gap: 12, leader: "Pasteur Gneke" },
  { name: "Agnibilékrou", sector: "Secteur Est", members: 126, paid: 31, gap: 9, leader: "Pasteur Assi" },
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

// D3 — Statuts évolutifs membres (pastoral séparé du financier)
const MEMBERS_DATA = [
  { name: "Konan Emmanuel", code: "MBR-0142", category: "Travailleur", church: "Adzopé Centre", sector: "Secteur Nord", status: "actif", paid: 32000, baptise: true, cycle_biblique: true, eligible_cotisation: true },
  { name: "Adjoua Céleste", code: "MBR-0203", category: "Femme", church: "Adzopé Centre", sector: "Secteur Nord", status: "actif", paid: 73000, baptise: true, cycle_biblique: true, eligible_cotisation: true },
  { name: "Yao Rodrigue", code: "MBR-0317", category: "Homme", church: "Daoukro", sector: "Secteur Ouest", status: "actif", paid: 18000, baptise: true, cycle_biblique: false, eligible_cotisation: true },
  { name: "Brou Marina", code: "MBR-0489", category: "Couple", church: "M'Batto", sector: "Secteur Ouest", status: "en_retard", paid: 5000, baptise: false, cycle_biblique: false, eligible_cotisation: false },
  { name: "Koffi Alain", code: "MBR-0551", category: "Élève", church: "Abengourou Est", sector: "Secteur Est", status: "actif", paid: 25000, baptise: true, cycle_biblique: true, eligible_cotisation: true },
  { name: "N'Goran Rose", code: "MBR-0612", category: "Femme", church: "Agnibilékrou", sector: "Secteur Est", status: "actif", paid: 73000, baptise: true, cycle_biblique: true, eligible_cotisation: true },
  { name: "Assi Bertin", code: "MBR-0708", category: "Travailleur", church: "Yakassé", sector: "Secteur Nord", status: "en_retard", paid: 8000, baptise: true, cycle_biblique: false, eligible_cotisation: true },
  { name: "Ama Joëlle", code: "MBR-0834", category: "Couple", church: "Adzopé Centre", sector: "Secteur Nord", status: "actif", paid: 42000, baptise: true, cycle_biblique: true, eligible_cotisation: true },
];

const CATEGORY_DATA = [
  { name: "Hommes", value: 1089, color: COLORS.emerald },
  { name: "Femmes", value: 1243, color: COLORS.gold },
  { name: "Couples", value: 387, color: COLORS.blue },
  { name: "Élèves", value: 621, color: COLORS.purple },
  { name: "Travailleurs", value: 409, color: COLORS.green },
];

const NOTIFICATIONS = [
  { id: 1, type: "rappel", msg: "Votre prochaine échéance est dans 3 jours (6 000 FCFA)", time: "Il y a 2h", read: false },
  { id: 2, type: "lecture", msg: "Vous avez un QCM en attente pour Genèse 1-5", time: "Il y a 5h", read: false },
  { id: 3, type: "info", msg: "La campagne 2025 est ouverte. Objectif individuel : 73 000 FCFA", time: "Il y a 1j", read: true },
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
    // D3 — Statuts pastoraux
    baptise: { bg: COLORS.blueLight, color: COLORS.blue, label: "✝ Baptisé" },
    non_baptise: { bg: COLORS.bg, color: COLORS.muted, label: "Non baptisé" },
    en_cycle: { bg: COLORS.purpleLight, color: COLORS.purple, label: "📖 En cycle" },
    eligible: { bg: "#FFF3CD", color: "#856404", label: "⭐ Éligible" },
    non_eligible: { bg: COLORS.redLight, color: COLORS.red, label: "Non éligible" },
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
            { v: "73K", l: "Part / membre" },
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
const Topbar = ({ user, unreadCount, onNotif }) => (
  <div className="topbar">
    <div style={{ fontSize: 13, color: COLORS.muted }}>
      {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
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
    { id: "membres", label: "Membres", icon: Icons.users },
    { id: "campagne", label: "Campagne", icon: Icons.chart },
    { id: "admin_gaps", label: "Gestion Gaps", icon: Icons.gift },
    { id: "admin_lecture", label: "Cohortes", icon: Icons.bible },
    { id: "gouvernance", label: "Gouvernance", icon: Icons.map },
    { id: "statistiques", label: "Statistiques", icon: Icons.trending },
    { id: "communications", label: "Communications", icon: Icons.mail },
    { id: "parametres", label: "Paramètres", icon: Icons.settings },
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

const PayementsView = () => {
  const [amount, setAmount] = useState("");
  const [freq, setFreq] = useState("mensuel");
  const [method, setMethod] = useState("mtn");
  const [done, setDone] = useState(false);

  const handlePay = () => { setDone(true); setTimeout(() => setDone(false), 3000); };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Mes Paiements</h2>
        <p>Effectuez un versement ou planifiez votre périodicité — Objectif : {fmt(INDIVIDUAL_SHARE)}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Effectuer un Versement</span></div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {done && (
              <div style={{ background: COLORS.greenLight, color: COLORS.green, padding: "12px 16px", borderRadius: 8, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon d={Icons.check} color={COLORS.green} size={16} /> Paiement initié avec succès !
              </div>
            )}
            <div className="input-group">
              <div className="input-label">Montant rapide</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {FLEXIBLE_AMOUNTS.map(a => (
                  <button key={a}
                    onClick={() => setAmount(String(a))}
                    style={{
                      padding: "9px 4px", border: `2px solid ${amount === String(a) ? COLORS.emerald : COLORS.border}`,
                      borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
                      background: amount === String(a) ? "rgba(26,107,74,0.07)" : "white",
                      color: amount === String(a) ? COLORS.emerald : COLORS.slateLight,
                    }}>
                    {a.toLocaleString("fr-FR")}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>ou saisissez un montant libre (min. {fmt(CAMPAIGN.minPayment)})</div>
            </div>
            <div className="input-group">
              <div className="input-label">Montant (FCFA)</div>
              <input className="input-field" type="number" placeholder={`Min. ${CAMPAIGN.minPayment} FCFA`} value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="input-group">
              <div className="input-label">Méthode de paiement</div>
              <select className="input-field" value={method} onChange={e => setMethod(e.target.value)}>
                <option value="mtn">📱 MTN Mobile Money</option>
                <option value="wave">🌊 Wave</option>
                <option value="orange">🟠 Orange Money</option>
                <option value="virement">🏦 Virement Bancaire</option>
                <option value="especes">💵 Espèces (auprès du responsable)</option>
              </select>
            </div>
            <div className="input-group">
              <div className="input-label">Numéro de téléphone / référence</div>
              <input className="input-field" placeholder="Ex: 07 00 00 00 00" />
            </div>
            <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={handlePay}>
              <Icon d={Icons.send} size={15} color="white" /> Valider le paiement
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Planifier ma Périodicité</span></div>
          <div style={{ padding: 24 }}>
            <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20 }}>
              Choisissez votre rythme de versement pour atteindre votre objectif de <strong style={{ color: COLORS.emeraldDark }}>{fmt(INDIVIDUAL_SHARE)}</strong> d'ici le 31 déc. 2025.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { key: "hebdo", label: "Hebdomadaire", amount: "1 500 FCFA/sem." },
                { key: "mensuel", label: "Mensuel", amount: "6 000 FCFA/mois" },
                { key: "trimestriel", label: "Trimestriel", amount: "18 250 FCFA/trim." },
                { key: "unique", label: "Versement unique", amount: "73 000 FCFA" },
              ].map(({ key, label, amount }) => (
                <div key={key}
                  onClick={() => setFreq(key)}
                  style={{
                    padding: "14px", border: `2px solid ${freq === key ? COLORS.emerald : COLORS.border}`,
                    borderRadius: 10, cursor: "pointer", textAlign: "center",
                    background: freq === key ? "rgba(26,107,74,0.04)" : "white"
                  }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: freq === key ? COLORS.emerald : COLORS.slate }}>{label}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{amount}</div>
                </div>
              ))}
            </div>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <div className="input-label">Heure de rappel préférée</div>
              <input className="input-field" type="time" defaultValue="09:00" />
            </div>
            <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}>
              Enregistrer la préférence
            </button>
          </div>
        </div>

        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-header">
            <span className="card-title">Récapitulatif annuel — Campagne 2025</span>
          </div>
          <div style={{ padding: 22 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Part allouée", value: fmt(INDIVIDUAL_SHARE), color: COLORS.slate },
                { label: "Total versé", value: fmt(32000), color: COLORS.green },
                { label: "Reste à payer", value: fmt(INDIVIDUAL_SHARE - 32000), color: COLORS.gold },
                { label: "Progression", value: `${pct(32000, INDIVIDUAL_SHARE)}%`, color: COLORS.blue },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: "center", padding: "14px", background: COLORS.bg, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'Playfair Display', serif" }}>{value}</div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={PAYMENTS}>
                <XAxis dataKey="date" tickFormatter={d => d.slice(5)} tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="amount" fill={COLORS.emerald} radius={[4, 4, 0, 0]} name="Montant" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
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

const GapsView = () => {
  const [bought, setBought] = useState({});

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Compensation (Gaps)</h2>
        <p>Parts non libérées disponibles à l'achat — Fenêtre : 1–15 janvier 2025</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Parts disponibles à l'achat</span>
              <span className="badge" style={{ background: "#FFF3CD", color: "#856404" }}>{GAPS.filter(g => g.listed).length} disponibles</span>
            </div>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              {GAPS.filter(g => g.listed).map(gap => (
                <div key={gap.id} className="gap-item">
                  <div style={{ display: "flex", align: "center", gap: 12 }}>
                    <div className="avatar" style={{ background: getAvatarColor(gap.member), color: "white", fontSize: 12 }}>
                      {gap.member.split(" ").map(x => x[0]).join("")}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{gap.member}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{gap.church} • En vente depuis le {new Date(gap.listed_at).toLocaleDateString("fr-FR")}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: COLORS.gold, fontFamily: "'Playfair Display', serif" }}>{fmt(gap.amount)}</div>
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
          </div>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
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
              <tr><th>Secteur</th><th>Église</th><th>Responsable</th><th>Membres</th><th>Taux payeurs</th><th>Gaps</th><th>Statut</th></tr>
            </thead>
            <tbody>
              {CHURCHES.map(c => (
                <tr key={c.name}>
                  <td style={{ fontSize: 11, color: COLORS.muted }}>{c.sector}</td>
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

const MembresView = () => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("tous");
  const [tab, setTab] = useState("financier");

  const filtered = MEMBERS_DATA.filter(m =>
    (cat === "tous" || m.category.toLowerCase() === cat) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.code.includes(search))
  );

  const PastoralDot = ({ ok }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: ok ? COLORS.green : COLORS.muted }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: ok ? COLORS.green : COLORS.border, display: "inline-block" }} />
      {ok ? "Oui" : "Non"}
    </span>
  );

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Gestion des Membres</h2>
        <p>Recensement, suivi financier et pastoral — {MEMBERS_DATA.length} membres affichés</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {CATEGORY_DATA.map(c => (
          <div key={c.name} className="kpi-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color, fontFamily: "'Playfair Display', serif" }}>{c.value.toLocaleString("fr-FR")}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{c.name}</div>
          </div>
        ))}
      </div>

      {/* D3 — KPIs pastoraux */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Membres baptisés", value: MEMBERS_DATA.filter(m => m.baptise).length, total: MEMBERS_DATA.length, color: COLORS.blue, icon: "✝" },
          { label: "En cycle biblique", value: MEMBERS_DATA.filter(m => m.cycle_biblique).length, total: MEMBERS_DATA.length, color: COLORS.purple, icon: "📖" },
          { label: "Éligibles cotisation", value: MEMBERS_DATA.filter(m => m.eligible_cotisation).length, total: MEMBERS_DATA.length, color: COLORS.gold, icon: "⭐" },
        ].map(({ label, value, total, color, icon }) => (
          <div key={label} className="kpi-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="kpi-label">{label}</div>
                <div className="kpi-value" style={{ color }}>{icon} {value}<span style={{ fontSize: 14, color: COLORS.muted }}>/{total}</span></div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color, opacity: 0.15, fontFamily: "'Playfair Display', serif" }}>{pct(value, total)}%</div>
            </div>
            <div className="progress-bar-bg" style={{ marginTop: 8 }}>
              <div className="progress-bar-fill" style={{ width: `${pct(value, total)}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="card-title">Liste des Membres</span>
            <div className="tab-bar" style={{ margin: 0, background: COLORS.bg, padding: "3px", borderRadius: 8 }}>
              {[{ k: "financier", l: "💰 Financier" }, { k: "pastoral", l: "✝ Pastoral" }].map(({ k, l }) => (
                <div key={k} className={`tab-item ${tab === k ? "active" : ""}`} style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => setTab(k)}>{l}</div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input className="input-field" style={{ padding: "7px 12px", width: 220, fontSize: 13 }} placeholder="🔍 Nom ou code MBR-..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="input-field" style={{ padding: "7px 12px", fontSize: 13 }} value={cat} onChange={e => setCat(e.target.value)}>
              <option value="tous">Toutes catégories</option>
              <option value="homme">Hommes</option>
              <option value="femme">Femmes</option>
              <option value="couple">Couples</option>
              <option value="élève">Élèves</option>
              <option value="travailleur">Travailleurs</option>
            </select>
            <button className="btn btn-primary btn-sm"><Icon d={Icons.plus} size={14} color="white" /> Nouveau</button>
          </div>
        </div>
        {tab === "financier" ? (
          <table className="table">
            <thead>
              <tr><th>Code</th><th>Membre</th><th>Secteur / Église</th><th>Montant versé</th><th>Progression / 73K</th><th>Statut</th></tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.code}>
                  <td style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.muted }}>{m.code}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="avatar" style={{ background: getAvatarColor(m.name), color: "white", fontSize: 11 }}>
                        {m.name.split(" ").map(x => x[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{m.name}</div>
                        <span className="chip" style={{ background: COLORS.bg, color: COLORS.slateLight, fontSize: 10 }}>{m.category}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.slate }}>{m.sector}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>{m.church}</div>
                  </td>
                  <td style={{ fontWeight: 600, color: COLORS.emerald }}>{fmt(m.paid)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar-bg" style={{ width: 80, height: 5 }}>
                        <div className="progress-bar-fill" style={{ width: `${Math.min(pct(m.paid, INDIVIDUAL_SHARE), 100)}%`, background: pct(m.paid, INDIVIDUAL_SHARE) >= 100 ? COLORS.green : COLORS.emerald }} />
                      </div>
                      <span style={{ fontSize: 11, color: COLORS.muted }}>{Math.min(pct(m.paid, INDIVIDUAL_SHARE), 100)}%</span>
                    </div>
                  </td>
                  <td><StatusBadge status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Code</th><th>Membre</th><th>Secteur / Église</th><th>Baptisé</th><th>Cycle biblique</th><th>Éligible cotisation</th></tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.code}>
                  <td style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.muted }}>{m.code}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="avatar" style={{ background: getAvatarColor(m.name), color: "white", fontSize: 11 }}>
                        {m.name.split(" ").map(x => x[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{m.name}</div>
                        <span className="chip" style={{ background: COLORS.bg, color: COLORS.slateLight, fontSize: 10 }}>{m.category}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.slate }}>{m.sector}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>{m.church}</div>
                  </td>
                  <td><PastoralDot ok={m.baptise} /></td>
                  <td><PastoralDot ok={m.cycle_biblique} /></td>
                  <td>
                    <span className="badge" style={{ background: m.eligible_cotisation ? COLORS.greenLight : COLORS.redLight, color: m.eligible_cotisation ? COLORS.green : COLORS.red, fontSize: 11 }}>
                      {m.eligible_cotisation ? "✓ Éligible" : "✗ Non éligible"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

// D1 — Vue Gouvernance : Région > Secteur > Église
const GovernanceView = () => {
  const [selectedSector, setSelectedSector] = useState(null);

  const sectorChurches = selectedSector
    ? CHURCHES.filter(c => c.sector === selectedSector)
    : [];

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Gouvernance</h2>
        <p>Structure hiérarchique — Région Adzopé</p>
      </div>

      {/* Carte hiérarchique visuelle */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {/* Région */}
          <div style={{ background: COLORS.emeraldDark, color: "white", padding: "16px 24px", borderRadius: "12px 0 0 12px", minWidth: 160, textAlign: "center" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Niveau 1</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: COLORS.goldLight }}>Région Adzopé</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>4 000 membres</div>
          </div>
          <div style={{ width: 24, height: 2, background: COLORS.border }} />
          {/* Secteurs */}
          <div style={{ display: "flex", gap: 10, flex: 1 }}>
            {SECTORS.map(s => {
              const isSelected = selectedSector === s.name;
              const sChurches = CHURCHES.filter(c => c.sector === s.name);
              const totalPaid = sChurches.reduce((acc, c) => acc + c.members * c.paid / 100, 0);
              return (
                <div key={s.name}
                  onClick={() => setSelectedSector(isSelected ? null : s.name)}
                  style={{
                    flex: 1, border: `2px solid ${isSelected ? COLORS.emerald : COLORS.border}`,
                    borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s",
                    background: isSelected ? "rgba(26,107,74,0.05)" : "white",
                  }}>
                  <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1, textTransform: "uppercase" }}>Niveau 2</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: isSelected ? COLORS.emerald : COLORS.slate, margin: "4px 0" }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{s.leader}</div>
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700, color: COLORS.emeraldDark, fontFamily: "'Playfair Display', serif" }}>{s.churches.length}</div>
                      <div style={{ fontSize: 10, color: COLORS.muted }}>Églises</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700, color: COLORS.emeraldDark, fontFamily: "'Playfair Display', serif" }}>{s.members}</div>
                      <div style={{ fontSize: 10, color: COLORS.muted }}>Membres</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Détail secteur sélectionné */}
      {selectedSector && (
        <div className="card animate-in" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <span className="card-title">📍 {selectedSector} — Églises locales</span>
            <button className="btn btn-outline btn-sm" onClick={() => setSelectedSector(null)}>
              <Icon d={Icons.x} size={13} /> Fermer
            </button>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {sectorChurches.map(c => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", border: `1.5px solid ${COLORS.border}`, borderRadius: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Niveau 3</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.slate }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{c.leader} • {c.members} membres</div>
                </div>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: 700, color: c.paid >= 75 ? COLORS.green : c.paid >= 50 ? COLORS.gold : COLORS.red, fontFamily: "'Playfair Display', serif", fontSize: 18 }}>{c.paid}%</div>
                    <div style={{ fontSize: 10, color: COLORS.muted }}>payeurs</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: 700, color: c.gap > 20 ? COLORS.red : COLORS.gold, fontFamily: "'Playfair Display', serif", fontSize: 18 }}>{c.gap}</div>
                    <div style={{ fontSize: 10, color: COLORS.muted }}>gaps</div>
                  </div>
                  <span className="badge" style={{ background: c.paid >= 75 ? COLORS.greenLight : c.paid >= 50 ? "#FFF3CD" : COLORS.redLight, color: c.paid >= 75 ? COLORS.green : c.paid >= 50 ? "#856404" : COLORS.red }}>
                    {c.paid >= 75 ? "✓ Bon rythme" : c.paid >= 50 ? "⚠ À surveiller" : "✗ En retard"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tableau récapitulatif tous secteurs */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Vue consolidée par Secteur</span>
        </div>
        <table className="table">
          <thead>
            <tr><th>Secteur</th><th>Responsable</th><th>Nb Églises</th><th>Membres</th><th>Taux moyen payeurs</th><th>Gaps totaux</th></tr>
          </thead>
          <tbody>
            {SECTORS.map(s => {
              const sChurches = CHURCHES.filter(c => c.sector === s.name);
              const avgPaid = Math.round(sChurches.reduce((acc, c) => acc + c.paid, 0) / sChurches.length);
              const totalGaps = sChurches.reduce((acc, c) => acc + c.gap, 0);
              return (
                <tr key={s.name} style={{ cursor: "pointer" }} onClick={() => setSelectedSector(s.name === selectedSector ? null : s.name)}>
                  <td style={{ fontWeight: 600, color: COLORS.emeraldDark }}>{s.name}</td>
                  <td>{s.leader}</td>
                  <td style={{ textAlign: "center" }}>{sChurches.length}</td>
                  <td style={{ fontWeight: 600 }}>{s.members.toLocaleString("fr-FR")}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar-bg" style={{ width: 80, height: 6 }}>
                        <div className="progress-bar-fill" style={{ width: `${avgPaid}%`, background: avgPaid >= 75 ? COLORS.green : avgPaid >= 50 ? COLORS.gold : COLORS.red }} />
                      </div>
                      <span style={{ fontSize: 12 }}>{avgPaid}%</span>
                    </div>
                  </td>
                  <td><span style={{ color: totalGaps > 50 ? COLORS.red : COLORS.gold, fontWeight: 600 }}>{totalGaps}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CommunicationsView = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Communications</h2>
        <p>Envoyez des messages ciblés à vos membres</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Nouvelle Campagne de Communication</span></div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {sent && (
              <div style={{ background: COLORS.greenLight, color: COLORS.green, padding: "12px 16px", borderRadius: 8, fontSize: 14 }}>
                ✅ Message envoyé avec succès à 1 749 membres !
              </div>
            )}
            <div className="input-group">
              <div className="input-label">Titre du message</div>
              <input className="input-field" defaultValue="Rappel — Campagne 2025 : votre contribution" />
            </div>
            <div className="input-group">
              <div className="input-label">Canaux d'envoi</div>
              <div style={{ display: "flex", gap: 10 }}>
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
                <option>Cohorte Janvier 2025 (147)</option>
                <option>Église Adzopé Centre seulement (412)</option>
                <option>Membres sans paiement ce mois (312)</option>
              </select>
            </div>
            <div className="input-group">
              <div className="input-label">Contenu du message</div>
              <textarea className="input-field" rows={5} style={{ resize: "none" }} defaultValue={`Cher(e) membre,

Nous vous rappelons que la campagne 2025 est en cours. Votre contribution est essentielle pour atteindre notre objectif commun de 200 millions FCFA.

Ensemble, construisons l'avenir de nos enfants !

— Équipe Église-École Adzopé`} />
            </div>
            <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={() => { setSent(true); setTimeout(() => setSent(false), 4000); }}>
              <Icon d={Icons.send} size={15} color="white" /> Envoyer le message
            </button>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><span className="card-title">Historique d'envois</span></div>
            <div style={{ padding: 12 }}>
              {[
                { title: "Lancement Campagne 2025", date: "01 jan. 2025", dest: "4 000 membres", canal: "Push + SMS" },
                { title: "Rappel Q1 — Fin de trimestre", date: "28 mar. 2025", dest: "1 312 membres", canal: "SMS + Email" },
                { title: "Ouverture fenêtre Gaps", date: "01 jan. 2025", dest: "312 membres", canal: "Push" },
                { title: "Résultats cohorte Déc. 2024", date: "05 jan. 2025", dest: "147 membres", canal: "Email" },
              ].map(m => (
                <div key={m.title} className="timeline-item">
                  <div className="timeline-dot" style={{ background: COLORS.emerald }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>{m.date} • {m.dest} • {m.canal}</div>
                  </div>
                </div>
              ))}
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
      <h2>Paramètres</h2>
      <p>Configuration de la plateforme et de la campagne</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div className="card">
        <div className="card-header"><span className="card-title">Paramètres Campagne 2025</span></div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Objectif annuel global (FCFA)", value: "200 000 000" },
            { label: "Part annuelle / membre (FCFA)", value: "73 000" },
            { label: "Plage objectif individuel", value: "73 000 – 75 000" },
            { label: "Montant minimum par versement (FCFA)", value: "1 000" },
            { label: "Montants flexibles disponibles", value: "1 000 / 1 500 / 3 000 / 6 000" },
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
      <div>
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><span className="card-title">Structure Hiérarchique</span></div>
          <div style={{ padding: 20 }}>
            {[
              { level: "Niveau 1", name: "Région Adzopé", count: "1 région" },
              { level: "Niveau 2", name: "Secteurs", count: `${SECTORS.length} secteurs` },
              { level: "Niveau 3", name: "Églises locales", count: `${CHURCHES.length} églises` },
              { level: "Niveau 4", name: "Membres", count: "4 000 membres cibles" },
            ].map(({ level, name, count }) => (
              <div key={level} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span className="badge" style={{ background: COLORS.blueLight, color: COLORS.blue, fontSize: 10 }}>{level}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{name}</span>
                <span style={{ fontSize: 12, color: COLORS.muted }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Sécurité & RGPD</span></div>
          <div style={{ padding: 24 }}>
            {[
              { icon: "🔒", label: "Chiffrement des données activé", status: true },
              { icon: "📋", label: "Registre des traitements à jour", status: true },
              { icon: "✅", label: "Consentements enregistrés", status: true },
              { icon: "🔐", label: "Authentification 2FA activée", status: false },
              { icon: "📊", label: "Audit logs activés", status: true },
              { icon: "🕶", label: "Anonymisation RBAC membres", status: true },
            ].map(({ icon, label, status }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ flex: 1, fontSize: 13 }}>{label}</span>
                <span className="badge" style={{ background: status ? COLORS.greenLight : COLORS.redLight, color: status ? COLORS.green : COLORS.red }}>
                  {status ? "Actif" : "Inactif"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
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
      <LoginView onLogin={setUser} />
    </>
  );

  const renderView = () => {
    if (user.role === "MEMBRE") {
      switch (view) {
        case "dashboard": return <MemberDashboard user={user} />;
        case "paiements": return <PayementsView />;
        case "lecture": return <LectureView />;
        case "gaps": return <GapsView />;
        case "notifications": return <NotificationsView />;
        default: return <MemberDashboard user={user} />;
      }
    } else {
      switch (view) {
        case "admin_dashboard": return <AdminDashboard />;
        case "membres": return <MembresView />;
        case "campagne": return <StatistiquesView />;
        case "admin_gaps": return <GapsView />;
        case "admin_lecture": return <LectureView />;
        case "gouvernance": return <GovernanceView />;
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
      <Sidebar user={user} current={view} onChange={setView} onLogout={() => setUser(null)} />
      <Topbar user={user} unreadCount={unread} onNotif={() => setShowNotifs(s => !s)} />
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
