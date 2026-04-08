import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

/* ─── PALETTE ─────────────────────────────────────────────────────────────── */
const C = {
  emerald: "#1A6B4A", emeraldD: "#0F4530", emeraldL: "#2D9467",
  gold: "#C9952A", goldL: "#E8B84B", goldPale: "#FEF3DC",
  cream: "#FDFAF4", bg: "#F2EFE8", border: "#E2D9C8",
  slate: "#2C3E50", muted: "#8FA3A0", light: "#C5D0CE",
  red: "#C0392B", redL: "#FADBD8",
  green: "#27AE60", greenL: "#D5F5E3",
  blue: "#2471A3", blueL: "#D6EAF8",
  white: "#FFFFFF", black: "#1A1A1A",
};

/* ─── FONT + GLOBAL STYLES ────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');

*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
body{font-family:'Nunito',sans-serif;background:#1A1A1A;display:flex;align-items:center;justify-content:center;min-height:100vh;}

.phone-wrap{display:flex;align-items:center;justify-content:center;padding:24px;}
.phone{
  width:393px;height:852px;background:${C.bg};border-radius:52px;
  box-shadow:0 0 0 12px #111,0 0 0 14px #333,0 32px 80px rgba(0,0,0,0.7);
  overflow:hidden;position:relative;display:flex;flex-direction:column;
}
.phone-notch{
  position:absolute;top:0;left:50%;transform:translateX(-50%);
  width:126px;height:34px;background:#111;border-radius:0 0 20px 20px;z-index:200;
}
.screen{flex:1;overflow-y:auto;overflow-x:hidden;scroll-behavior:smooth;padding-bottom:80px;}
.screen::-webkit-scrollbar{display:none;}

.nav-bar{
  position:absolute;bottom:0;left:0;right:0;height:78px;
  background:white;border-top:1px solid ${C.border};
  display:flex;align-items:flex-start;justify-content:space-around;
  padding:10px 0 0;z-index:100;border-radius:0 0 52px 52px;
}
.nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;transition:all .2s;padding:0 14px;min-width:60px;}
.nav-label{font-size:10px;font-weight:600;letter-spacing:.3px;}

.status-bar{height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 28px 0 24px;z-index:150;margin-top:8px;}
.status-time{font-size:15px;font-weight:700;color:${C.slate};}
.status-icons{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:${C.slate};}

.serif{font-family:'Cormorant Garamond',serif;}

.card{background:white;border-radius:20px;box-shadow:0 2px 16px rgba(0,0,0,.06);overflow:hidden;}
.card-sm{background:white;border-radius:14px;box-shadow:0 1px 8px rgba(0,0,0,.05);overflow:hidden;}

.pill{display:inline-flex;align-items:center;gap:4px;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;}

.btn{display:flex;align-items:center;justify-content:center;gap:8px;border:none;cursor:pointer;transition:all .2s;font-family:'Nunito',sans-serif;font-weight:700;}
.btn-em{background:${C.emerald};color:white;border-radius:14px;padding:15px;font-size:15px;}
.btn-em:active{background:${C.emeraldD};transform:scale(0.98);}
.btn-gold{background:${C.gold};color:white;border-radius:14px;padding:15px;font-size:15px;}
.btn-gold:active{background:#B5841F;transform:scale(0.98);}
.btn-out{background:transparent;color:${C.emerald};border:2px solid ${C.emerald};border-radius:14px;padding:14px;font-size:14px;}

.input{width:100%;padding:14px 16px;border:2px solid ${C.border};border-radius:12px;font-size:15px;font-family:'Nunito',sans-serif;outline:none;background:${C.bg};color:${C.slate};transition:border-color .2s;}
.input:focus{border-color:${C.emerald};}

.hero{
  background:linear-gradient(155deg,${C.emeraldD} 0%,${C.emerald} 55%,#2D9467 100%);
  position:relative;overflow:hidden;padding:20px 24px 28px;
}
.hero::before{
  content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;
  background:rgba(201,149,42,.15);border-radius:50%;
}
.hero::after{
  content:'';position:absolute;bottom:-40px;left:-30px;width:140px;height:140px;
  background:rgba(255,255,255,.04);border-radius:50%;
}

.prog-ring-bg{stroke:rgba(255,255,255,.15);}
.prog-ring-fill{stroke:${C.goldL};stroke-linecap:round;transition:stroke-dashoffset 1s ease;}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .35s ease both;}

@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.slide-in{animation:slideIn .3s ease both;}

@keyframes pulse2{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
.pulse{animation:pulse2 2s infinite;}

@keyframes spin{to{transform:rotate(360deg)}}
.spinner{animation:spin .8s linear infinite;border:3px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;width:22px;height:22px;}

.step-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid ${C.border};}
.step-row:last-child{border-bottom:none;}

.tag-mm{background:#FFE4B5;color:#B8860B;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;}
.tag-wave{background:#E0F2FE;color:#0369A1;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;}
.tag-orange{background:#FEE2E2;color:#B91C1C;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;}

.chantier-photo{
  width:100%;height:180px;object-fit:cover;border-radius:16px;
  background:linear-gradient(135deg,#2C3E50,#4A5568);
  display:flex;align-items:center;justify-content:center;
  font-size:48px;color:rgba(255,255,255,.6);
}

.timeline-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;margin-top:2px;}
.timeline-line{width:2px;background:${C.border};flex-shrink:0;margin:0 5px;}

.roi-slider{width:100%;appearance:none;height:6px;border-radius:3px;background:${C.border};outline:none;cursor:pointer;}
.roi-slider::-webkit-slider-thumb{appearance:none;width:22px;height:22px;border-radius:50%;background:${C.emerald};box-shadow:0 2px 8px rgba(26,107,74,.4);cursor:pointer;}
`;

/* ─── DATA ────────────────────────────────────────────────────────────────── */
const USER = { name: "Konan Emmanuel", phone: "07 58 23 41", paid: 32000, total: 50000, church: "Adzopé Centre", avatar: "KE" };
const fmt = n => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
const fmtM = n => (n >= 1000000 ? (n / 1000000).toFixed(1) + " M" : new Intl.NumberFormat("fr-FR").format(n)) + " FCFA";
const pct = (a, b) => Math.round((a / b) * 100);

const COLLECTE = [
  { m: "Jan", v: 8.2 }, { m: "Fév", v: 14.1 }, { m: "Mar", v: 18.9 },
  { m: "Avr", v: 22.3 }, { m: "Mai", v: 19.8 }, { m: "Juin", v: 4.2 },
];
const PAIEMENTS = [
  { id: 1, date: "15/01/2025", montant: 5000, methode: "MTN", ref: "TXN-00142", ok: true },
  { id: 2, date: "03/02/2025", montant: 5000, methode: "MTN", ref: "TXN-00298", ok: true },
  { id: 3, date: "01/03/2025", montant: 5000, methode: "Wave", ref: "TXN-00412", ok: true },
  { id: 4, date: "10/04/2025", montant: 10000, methode: "Virement", ref: "TXN-00589", ok: true },
  { id: 5, date: "05/05/2025", montant: 7000, methode: "MTN", ref: "TXN-00702", ok: true },
];
const CHANTIER = [
  { phase: "Terrassement", pct: 100, date: "Terminé — Oct 2024", color: C.green, icon: "🏗️" },
  { phase: "Fondations", pct: 100, date: "Terminé — Déc 2024", color: C.green, icon: "⚒️" },
  { phase: "Élévation Rez-de-chaussée", pct: 65, date: "En cours — Fév 2025", color: C.gold, icon: "🧱" },
  { phase: "Toiture", pct: 0, date: "Prévu — Sep 2025", color: C.muted, icon: "🏠" },
  { phase: "Second œuvre", pct: 0, date: "Prévu — Déc 2025", color: C.muted, icon: "🪟" },
];
const UPDATES = [
  { date: "28 mai 2025", titre: "Murs R+1 à 80%", desc: "Les murs du premier étage atteignent 80% de hauteur. 42 ouvriers mobilisés.", photos: ["🧱","🏗️","👷"] },
  { date: "15 mai 2025", titre: "Coulage dalle R+1", desc: "Le coulage de la dalle du premier étage s'est terminé avec succès.", photos: ["🏛️","⚙️","📐"] },
  { date: "02 mai 2025", titre: "Livraison matériaux", desc: "230 tonnes de ciment et 4,2 km d'armature livrés sur le chantier.", photos: ["🚛","📦","✅"] },
];
const VERSETS = [
  { ref: "Jérémie 29:11", texte: "« Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance. »" },
  { ref: "Matthieu 7:24", texte: "« Quiconque entend ces paroles que je dis et les met en pratique sera semblable à un homme prudent qui a bâti sa maison sur le roc. »" },
  { ref: "Néhémie 2:20", texte: "« Le Dieu des cieux nous donnera le succès. Nous, ses serviteurs, nous nous lèverons et nous bâtirons. »" },
];

/* ─── GAMIFICATION ────────────────────────────────────────────────────────── */
const LEVELS = [
  { id: 1, label: "Lecteur",      emoji: "📖", xpMin: 0,    xpMax: 500,  color: C.muted },
  { id: 2, label: "Disciple",     emoji: "🌱", xpMin: 500,  xpMax: 1500, color: C.blue },
  { id: 3, label: "Serviteur",    emoji: "⚒️", xpMin: 1500, xpMax: 3000, color: C.emerald },
  { id: 4, label: "Responsable",  emoji: "🏆", xpMin: 3000, xpMax: 5000, color: C.gold },
];
const USER_XP = 870;
const USER_LEVEL = LEVELS.find(l => USER_XP >= l.xpMin && USER_XP < l.xpMax) || LEVELS[1];
const NEXT_LEVEL = LEVELS[USER_LEVEL.id] || null;

/* ─── COHORTE DATA ────────────────────────────────────────────────────────── */
const COHORTE_INFO = { id: "C-2025-01", nom: "Cohorte Adzopé Centre A", size: 11, jour: 89, plan: "Bible 6 mois" };
// Les noms réels sont masqués pour les membres — seul "moi" voit son propre nom.
// Les autres apparaissent sous pseudonyme + code anonyme.
const COHORTE_MEMBRES = [
  { nom: "Konan Emmanuel",  pseudo: "Konan Emmanuel", initiales: "KE", code: "MBR-0001", score: 76, jours: 89, actif: true,  moi: true  },
  { nom: "Membre anonyme",  pseudo: "Membre A",       initiales: "🔒", code: "MBR-0042", score: 94, jours: 89, actif: true,  moi: false },
  { nom: "Membre anonyme",  pseudo: "Membre B",       initiales: "🔒", code: "MBR-0017", score: 88, jours: 88, actif: true,  moi: false },
  { nom: "Membre anonyme",  pseudo: "Membre C",       initiales: "🔒", code: "MBR-0083", score: 71, jours: 85, actif: true,  moi: false },
  { nom: "Membre anonyme",  pseudo: "Membre D",       initiales: "🔒", code: "MBR-0056", score: 68, jours: 82, actif: false, moi: false },
  { nom: "Membre anonyme",  pseudo: "Membre E",       initiales: "🔒", code: "MBR-0029", score: 65, jours: 80, actif: true,  moi: false },
  { nom: "Membre anonyme",  pseudo: "Membre F",       initiales: "🔒", code: "MBR-0071", score: 60, jours: 79, actif: true,  moi: false },
  { nom: "Membre anonyme",  pseudo: "Membre G",       initiales: "🔒", code: "MBR-0094", score: 55, jours: 77, actif: false, moi: false },
  { nom: "Membre anonyme",  pseudo: "Membre H",       initiales: "🔒", code: "MBR-0038", score: 52, jours: 74, actif: true,  moi: false },
  { nom: "Membre anonyme",  pseudo: "Membre I",       initiales: "🔒", code: "MBR-0062", score: 48, jours: 70, actif: true,  moi: false },
  { nom: "Membre anonyme",  pseudo: "Membre J",       initiales: "🔒", code: "MBR-0015", score: 40, jours: 65, actif: false, moi: false },
];
// Chat : noms anonymisés sauf "moi"
const COHORTE_CHAT = [
  { auteur: "Membre A", initiales: "🔒", msg: "Amen ! Psaumes 91 m'a vraiment touché aujourd'hui 🙏", time: "08:12", moi: false },
  { auteur: "Membre B", initiales: "🔒", msg: "Moi aussi. Verset 1 : 'Celui qui demeure sous l'abri du Très-Haut...' Quelle promesse !", time: "08:25", moi: false },
  { auteur: "Konan Emmanuel", initiales: "KE", msg: "Bonne lecture à tous ! J'ai validé mes 7 chapitres 💪", time: "08:47", moi: true  },
  { auteur: "Membre C", initiales: "🔒", msg: "Bravo ! Je commence maintenant. Priez pour moi 🌿", time: "09:02", moi: false },
  { auteur: "Membre D", initiales: "🔒", msg: "Jérémie 29:11 — c'est mon verset préféré de la semaine ✨", time: "09:15", moi: false },
];

/* ─── COMMUNICATION DATA ──────────────────────────────────────────────────── */
const COMM_TYPES = [
  { id: "priere",   label: "🙏 Prière",    color: C.emerald,  bg: C.greenL   },
  { id: "sos",      label: "🆘 SOS",       color: C.red,      bg: C.redL     },
  { id: "info",     label: "ℹ️ Info",      color: C.blue,     bg: C.blueL    },
  { id: "annonce",  label: "📢 Annonce",   color: C.gold,     bg: C.goldPale },
];
const COMM_MESSAGES = [
  { type: "annonce", auteur: "Pasteur — Adzopé Centre",  msg: "Réunion cohorte samedi 10h à l'église. Présence obligatoire.", time: "Il y a 2h",  lu: false },
  { type: "priere",  auteur: "Membre anonyme",            msg: "Priez pour ma famille. Mon père est hospitalisé depuis hier.", time: "Il y a 4h",  lu: false },
  { type: "info",    auteur: "Système",                   msg: "Votre niveau est passé à Disciple 🌱 ! Vous avez gagné 120 XP ce mois.", time: "Il y a 6h",  lu: true  },
  { type: "sos",     auteur: "Membre anonyme",            msg: "Besoin d'aide urgente : je suis bloqué au QCM de Lévitique. Quelqu'un peut m'aider ?", time: "Il y a 1j", lu: true  },
  { type: "annonce", auteur: "Président — Région Adzopé", msg: "Objectif janvier dépassé ! 12,4M FCFA collectés. Merci à tous !", time: "Il y a 2j", lu: true  },
];

/* ─── ICONS SVG ───────────────────────────────────────────────────────────── */
const Ic = ({ path, size = 22, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {path.split("|").map((d, i) => <path key={i} d={d} />)}
  </svg>
);
const I = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|M9 22V12h6v10",
  pay: "M12 2v20|M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  build: "M3 21h18|M5 21V7l8-4 8 4v14|M9 21V9h6v12",
  roi: "M22 12h-4l-3 9L9 3l-3 9H2",
  bible: "M4 19.5A2.5 2.5 0 016.5 17H20|M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9|M13.73 21a2 2 0 01-3.46 0",
  back: "M19 12H5|M12 19l-7-7 7-7",
  check: "M20 6L9 17l-5-5",
  send: "M22 2L11 13|M22 2L15 22 8.5 13.5 2 11l20-9z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|M12 9a3 3 0 100 6 3 3 0 000-6",
  camera: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z|M12 13a3 3 0 100-6 3 3 0 000 6",
  chart: "M18 20V10|M12 20V4|M6 20v-6",
  ok: "M22 11.08V12a10 10 0 11-5.93-9.14|M22 4L12 14.01l-3-3",
  group: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2|M23 21v-2a4 4 0 00-3-3.87|M16 3.13a4 4 0 010 7.75",
  chat: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  pray: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
  sos: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z|M12 9v4|M12 17h.01",
  comm: "M8 12h.01|M12 12h.01|M16 12h.01|M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  award: "M12 15a7 7 0 100-14 7 7 0 000 14z|M8.21 13.89L7 23l5-3 5 3-1.21-9.12",
  profile: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2|M12 3a4 4 0 100 8 4 4 0 000-8",
  heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
};

/* ─── RING DE PROGRESSION ─────────────────────────────────────────────────── */
const Ring = ({ pct: p, r = 42, sw = 8, color = C.goldL }) => {
  const circ = 2 * Math.PI * r;
  const offset = circ - (p / 100) * circ;
  return (
    <svg width={(r + sw) * 2} height={(r + sw) * 2}>
      <circle cx={r + sw} cy={r + sw} r={r} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={sw} />
      <circle cx={r + sw} cy={r + sw} r={r} fill="none" stroke={color}
        strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${r + sw} ${r + sw})`} />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  ÉCRANS                                                                      */
/* ═══════════════════════════════════════════════════════════════════════════ */

/* ── LOGIN ─────────────────────────────────────────────────────────────────── */
const LoginScreen = ({ onLogin }) => {
  const [tel, setTel] = useState("07 58 23 41");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handle = () => {
    if (pin.length < 4) { setErr("Code PIN incomplet (4 chiffres min.)"); return; }
    setLoading(true); setErr("");
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div style={{ minHeight: "100%", background: `linear-gradient(175deg,${C.emeraldD},${C.emerald})`, display: "flex", flexDirection: "column" }}>
      <div style={{ height: 44 }} />
      {/* logo */}
      <div style={{ padding: "40px 32px 0", color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: C.gold, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(201,149,42,.4)" }}>
            <Ic path={I.bible} size={26} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: .55, textTransform: "uppercase" }}>Région Adzopé</div>
            <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: C.goldL }}>Église-École</div>
          </div>
        </div>
        <div className="serif" style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>
          Construire.<br /><span style={{ color: C.goldL }}>Digitaliser.</span><br />Édifier.
        </div>
        <div style={{ fontSize: 13, opacity: .6, lineHeight: 1.6, marginBottom: 32 }}>
          Votre plateforme de contribution et de suivi du complexe scolaire d'Adzopé.
        </div>
        {/* stats */}
        <div style={{ display: "flex", gap: 24, marginBottom: 40 }}>
          {[["200M","Objectif FCFA"],["4 000","Membres"],["5 ans","Horizon"]].map(([v,l]) => (
            <div key={v}>
              <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: C.goldL }}>{v}</div>
              <div style={{ fontSize: 10, opacity: .45, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* form */}
      <div style={{ flex: 1, background: C.bg, borderRadius: "28px 28px 0 0", padding: "32px 24px 0" }}>
        <div className="serif" style={{ fontSize: 24, fontWeight: 700, color: C.emeraldD, marginBottom: 4 }}>Bienvenue 👋</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Connectez-vous à votre espace membre</div>

        {err && <div style={{ background: C.redL, color: C.red, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 14 }}>{err}</div>}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>Numéro de téléphone</div>
          <input className="input" value={tel} onChange={e => setTel(e.target.value)} placeholder="07 XX XX XX XX" type="tel" />
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>Code PIN (4 chiffres)</div>
          <input className="input" value={pin} onChange={e => setPin(e.target.value.slice(0,6))} placeholder="••••" type="password" inputMode="numeric" />
        </div>
        <button className="btn btn-em" style={{ width: "100%" }} onClick={handle}>
          {loading ? <div className="spinner" /> : "Se connecter"}
        </button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: C.muted }}>
          Problème de connexion ? <span style={{ color: C.emerald, fontWeight: 700 }}>Contacter le responsable</span>
        </div>
      </div>
    </div>
  );
};

/* ── ACCUEIL ───────────────────────────────────────────────────────────────── */
const HomeScreen = ({ onNav }) => {
  const p = pct(USER.paid, USER.total);
  const verset = VERSETS[0];
  const [collectTot] = useState(87450000);

  return (
    <div className="fade-up">
      {/* HERO */}
      <div className="hero">
        <div style={{ height: 10 }} />
        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, opacity: .55, color: "white" }}>Bonjour,</div>
            <div className="serif" style={{ fontSize: 22, color: "white", fontWeight: 700 }}>{USER.name.split(" ")[0]} 👋</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Level badge */}
            <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 10, padding: "6px 10px", display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
              <span style={{ fontSize: 14 }}>{USER_LEVEL.emoji}</span>
              <div>
                <div style={{ fontSize: 9, opacity: .6, color: "white", lineHeight: 1 }}>NIVEAU</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.goldL, lineHeight: 1.2 }}>{USER_LEVEL.label}</div>
              </div>
            </div>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => {}}>
              <div style={{ width: 38, height: 38, background: "rgba(255,255,255,.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic path={I.bell} size={20} color="white" />
              </div>
              <div style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, background: C.gold, borderRadius: "50%", border: "2px solid" + C.emeraldD }} />
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div style={{ marginBottom: 14, background: "rgba(255,255,255,.08)", borderRadius: 10, padding: "8px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,.55)", marginBottom: 5 }}>
            <span>{USER_LEVEL.emoji} {USER_LEVEL.label} — {USER_XP} XP</span>
            {NEXT_LEVEL && <span>→ {NEXT_LEVEL.label} à {NEXT_LEVEL.xpMin} XP</span>}
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,.15)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct(USER_XP - USER_LEVEL.xpMin, USER_LEVEL.xpMax - USER_LEVEL.xpMin)}%`, background: C.goldL, borderRadius: 2, transition: "width 1s ease" }} />
          </div>
        </div>

        {/* ring + montants */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Ring pct={p} r={44} sw={9} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: "white" }}>{p}%</div>
              <div style={{ fontSize: 9, opacity: .6, color: "white", letterSpacing: .5 }}>ACCOMPLI</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, opacity: .5, color: "white", textTransform: "uppercase", letterSpacing: .8, marginBottom: 2 }}>Ma Part 2025</div>
              <div className="serif" style={{ fontSize: 26, fontWeight: 700, color: "white" }}>{fmt(USER.total)}</div>
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: C.goldL, opacity: .9 }}>Versé</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.goldL }}>{fmt(USER.paid)}</div>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,.15)" }} />
              <div>
                <div style={{ fontSize: 10, opacity: .5, color: "white" }}>Restant</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{fmt(USER.total - USER.paid)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* action rapide */}
        <div style={{ marginTop: 20 }}>
          <button className="btn btn-gold" style={{ width: "100%", padding: 14, fontSize: 15 }} onClick={() => onNav("pay")}>
            <Ic path={I.pay} size={18} color="white" /> Cotiser maintenant
          </button>
        </div>
      </div>

      <div style={{ padding: "18px 16px 0" }}>
        {/* Collecte régionale */}
        <div className="card" style={{ padding: 18, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="serif" style={{ fontSize: 16, fontWeight: 700, color: C.emeraldD }}>Collecte Régionale 2025</div>
            <div className="pill" style={{ background: C.greenL, color: C.green }}>{pct(collectTot,200000000)}%</div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 6 }}>
              <span>{fmtM(collectTot)} collectés</span>
              <span>Objectif : 200 M FCFA</span>
            </div>
            <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct(collectTot,200000000)}%`, background: `linear-gradient(90deg,${C.emerald},${C.emeraldL})`, borderRadius: 4, transition: "width 1s ease" }} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={COLLECTE} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gca" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.emerald} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.emerald} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip formatter={v => [v + " M FCFA", "Collecte"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Area type="monotone" dataKey="v" stroke={C.emerald} fill="url(#gca)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chantier aperçu */}
        <div className="card" style={{ marginBottom: 14, cursor: "pointer" }} onClick={() => onNav("build")}>
          <div style={{ background: `linear-gradient(135deg,${C.slate},#3D5066)`, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginBottom: 2 }}>CHANTIER EN DIRECT</div>
              <div className="serif" style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Élévation RDC : 65%</div>
            </div>
            <div style={{ fontSize: 32 }}>🏗️</div>
          </div>
          <div style={{ padding: "12px 18px" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {CHANTIER.slice(0,3).map(ch => (
                <div key={ch.phase} style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ch.icon} {ch.phase.split(" ")[0]}</div>
                  <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${ch.pct}%`, background: ch.color }} />
                  </div>
                  <div style={{ fontSize: 9, color: ch.color, marginTop: 2, fontWeight: 700 }}>{ch.pct}%</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "right", fontSize: 11, color: C.emerald, fontWeight: 700, marginTop: 8 }}>Voir toutes les phases →</div>
          </div>
        </div>

        {/* Verset */}
        <div style={{ background: `linear-gradient(135deg,${C.emeraldD},${C.emerald})`, borderRadius: 18, padding: "18px 20px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, left: 8, fontSize: 80, opacity: .08, fontFamily: "serif", lineHeight: 1 }}>"</div>
          <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 10 }}>Verset de la semaine</div>
          <div className="serif" style={{ fontSize: 15, lineHeight: 1.7, color: "white", position: "relative" }}>{verset.texte}</div>
          <div style={{ marginTop: 12, fontSize: 12, color: C.goldL, fontWeight: 700 }}>{verset.ref}</div>
        </div>

        {/* Raccourcis */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { icon: "📖", label: "Lecture Biblique", sub: "Jour 89/180", action: "bible", dot: false },
            { icon: "👥", label: "Ma Cohorte", sub: "11 membres · Classe #3", action: "cohorte", dot: false },
            { icon: "📢", label: "Communication", sub: "2 messages non lus", action: "comm", dot: true },
            { icon: "🏗️", label: "Chantier", sub: "Élévation RDC 65%", action: "build", dot: false },
          ].map(s => (
            <div key={s.label} className="card-sm" style={{ padding: 14, cursor: "pointer", position: "relative" }} onClick={() => onNav(s.action)}>
              {s.dot && <div style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, background: C.red, borderRadius: "50%" }} />}
              <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.slate }}>{s.label}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── PAIEMENT ──────────────────────────────────────────────────────────────── */
const METHODES = [
  { id: "mtn",    label: "MTN Mobile Money", emoji: "📱", color: "#FFB900", badge: "tag-mm" },
  { id: "wave",   label: "Wave",             emoji: "🌊", color: "#0070BA", badge: "tag-wave" },
  { id: "orange", label: "Orange Money",     emoji: "🟠", color: "#FF6200", badge: "tag-orange" },
];
const PayScreen = () => {
  const [step, setStep] = useState(0); // 0=form 1=confirm 2=processing 3=done
  const [methode, setMethode] = useState("mtn");
  const [montant, setMontant] = useState("");
  const [tel, setTel] = useState("07 58 23 41");
  const [freq, setFreq] = useState("mensuel");
  const [tab, setTab] = useState("cotiser"); // cotiser | historique

  const mtd = METHODES.find(m => m.id === methode);

  const reste = USER.total - USER.paid;
  const suggestions = [2000, 5000, 10000, reste].filter(v => v > 0);

  const handleConfirm = () => {
    setStep(2);
    setTimeout(() => setStep(3), 2200);
  };

  if (step === 3) return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", padding: 32, textAlign: "center" }}>
      <div style={{ width: 80, height: 80, background: C.greenL, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 36 }}>✅</div>
      <div className="serif" style={{ fontSize: 26, fontWeight: 700, color: C.emeraldD, marginBottom: 8 }}>Paiement réussi !</div>
      <div style={{ fontSize: 36, fontWeight: 700, color: C.emerald, marginBottom: 4, fontFamily: "Cormorant Garamond" }}>{fmt(Number(montant))}</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>via {mtd.label}</div>
      <div style={{ background: C.bg, borderRadius: 14, padding: "14px 20px", width: "100%", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: C.muted }}>Référence</span>
          <span style={{ fontWeight: 700, fontFamily: "monospace" }}>TXN-{Math.random().toString().slice(2,8)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: C.muted }}>Nouveau solde versé</span>
          <span style={{ fontWeight: 700, color: C.green }}>{fmt(USER.paid + Number(montant))}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: C.muted }}>Reste à verser</span>
          <span style={{ fontWeight: 700, color: C.gold }}>{fmt(Math.max(0, USER.total - USER.paid - Number(montant)))}</span>
        </div>
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>Un SMS de confirmation a été envoyé au {tel}</div>
      <button className="btn btn-em" style={{ width: "100%" }} onClick={() => { setStep(0); setMontant(""); }}>
        Faire un autre versement
      </button>
    </div>
  );

  if (step === 2) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", gap: 16 }}>
      <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4, borderColor: C.border, borderTopColor: C.emerald }} />
      <div className="serif" style={{ fontSize: 20, fontWeight: 700, color: C.emeraldD }}>Traitement en cours…</div>
      <div style={{ fontSize: 13, color: C.muted }}>Connexion à {mtd.label}…</div>
    </div>
  );

  if (step === 1) return (
    <div className="fade-up" style={{ padding: "20px 16px" }}>
      <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: C.emeraldD, marginBottom: 4 }}>Confirmer le paiement</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Vérifiez les détails avant de valider</div>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        {[
          ["Montant", fmt(Number(montant))],
          ["Méthode", `${mtd.emoji} ${mtd.label}`],
          ["Téléphone", tel],
          ["Campagne", "Actions 2025"],
          ["Bénéficiaire", "Église-École Adzopé"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 13, color: C.muted }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.slate }}>{v}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.slate }}>Total débité</span>
          <span className="serif" style={{ fontSize: 20, fontWeight: 700, color: C.emeraldD }}>{fmt(Number(montant))}</span>
        </div>
      </div>

      <div style={{ background: "#FEF3DC", borderRadius: 12, padding: "12px 16px", fontSize: 12, color: "#92640A", marginBottom: 20 }}>
        ⚠️ Vous allez recevoir une demande d'autorisation sur votre téléphone {mtd.label}. Entrez votre PIN mobile pour valider.
      </div>

      <button className="btn btn-em" style={{ width: "100%", marginBottom: 12 }} onClick={handleConfirm}>
        <Ic path={I.send} size={16} color="white" /> Confirmer et Payer
      </button>
      <button className="btn btn-out" style={{ width: "100%" }} onClick={() => setStep(0)}>
        Modifier
      </button>
    </div>
  );

  return (
    <div className="fade-up">
      {/* tabs */}
      <div style={{ display: "flex", background: C.bg, padding: "12px 16px 0", gap: 4 }}>
        {[["cotiser","💳 Cotiser"],["historique","📋 Historique"]].map(([k,l]) => (
          <div key={k} onClick={() => setTab(k)} style={{ flex: 1, textAlign: "center", padding: "10px 0", borderRadius: "10px 10px 0 0", cursor: "pointer", fontSize: 13, fontWeight: 700, background: tab === k ? "white" : "transparent", color: tab === k ? C.emerald : C.muted, borderBottom: tab === k ? "2px solid " + C.emerald : "none" }}>
            {l}
          </div>
        ))}
      </div>

      {tab === "cotiser" && (
        <div style={{ padding: "20px 16px", background: "white" }}>
          {/* solde */}
          <div style={{ background: `linear-gradient(135deg,${C.emeraldD},${C.emerald})`, borderRadius: 18, padding: "18px 20px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, opacity: .55, color: "white", marginBottom: 4 }}>Reste à verser — Campagne 2025</div>
            <div className="serif" style={{ fontSize: 30, fontWeight: 700, color: "white" }}>{fmt(reste)}</div>
            <div style={{ marginTop: 10, height: 5, background: "rgba(255,255,255,.2)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct(USER.paid, USER.total)}%`, background: C.goldL, borderRadius: 3 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 10, opacity: .55, color: "white" }}>Versé : {fmt(USER.paid)}</span>
              <span style={{ fontSize: 10, color: C.goldL, fontWeight: 700 }}>{pct(USER.paid, USER.total)}%</span>
            </div>
          </div>

          {/* méthode */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8 }}>Méthode de paiement</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {METHODES.map(m => (
                <div key={m.id} onClick={() => setMethode(m.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: `2px solid ${methode === m.id ? m.color : C.border}`, borderRadius: 12, cursor: "pointer", background: methode === m.id ? m.color + "0D" : "white", transition: "all .2s" }}>
                  <div style={{ width: 36, height: 36, background: m.color + "20", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{m.emoji}</div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.slate }}>{m.label}</div>
                  {methode === m.id && <div style={{ width: 20, height: 20, background: m.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Ic path={I.check} size={12} color="white" sw={3} />
                  </div>}
                </div>
              ))}
            </div>
          </div>

          {/* montant */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8 }}>Montant (min. 500 FCFA)</div>
            <div style={{ position: "relative" }}>
              <input className="input" type="number" min="500" placeholder="Ex : 5 000" value={montant} onChange={e => setMontant(e.target.value)} style={{ paddingRight: 70 }} />
              <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 12, fontWeight: 700, color: C.muted }}>FCFA</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {suggestions.map(s => (
                <div key={s} onClick={() => setMontant(String(s))} style={{ padding: "5px 12px", background: montant == s ? C.emerald : C.bg, color: montant == s ? "white" : C.slate, borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", border: `1px solid ${montant == s ? C.emerald : C.border}` }}>
                  {s === reste ? "🎯 Solde total" : fmt(s).replace(" FCFA", "")}
                </div>
              ))}
            </div>
          </div>

          {/* téléphone */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8 }}>Numéro {mtd.label}</div>
            <input className="input" type="tel" value={tel} onChange={e => setTel(e.target.value)} placeholder="07 XX XX XX XX" />
          </div>

          {/* périodicité rappels */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8 }}>Planifier des rappels</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["hebdo","Hebdo","961 FCFA/sem"],["mensuel","Mensuel","4 167 FCFA/mois"],["trimestriel","Trimestriel","12 500 FCFA/trim"],["unique","Unique","50 000 FCFA"]].map(([k,l,s]) => (
                <div key={k} onClick={() => setFreq(k)} style={{ padding: "10px 12px", border: `2px solid ${freq === k ? C.emerald : C.border}`, borderRadius: 10, cursor: "pointer", background: freq === k ? C.emerald + "0D" : "white" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: freq === k ? C.emerald : C.slate }}>{l}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-em" style={{ width: "100%" }}
            onClick={() => { if (!montant || Number(montant) < 500) return; setStep(1); }}
            disabled={!montant || Number(montant) < 500}
          >
            <Ic path={I.send} size={16} color="white" /> Procéder au paiement
          </button>
        </div>
      )}

      {tab === "historique" && (
        <div style={{ padding: "16px 16px", background: "white" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[[fmt(USER.paid),"Total versé",C.green],[fmt(USER.total - USER.paid),"Reste",C.gold],["64%","Progression",C.blue],[PAIEMENTS.length+" versements","Transactions",C.emerald]].map(([v,l,col]) => (
              <div key={l} style={{ background: C.bg, borderRadius: 12, padding: 14 }}>
                <div className="serif" style={{ fontSize: 16, fontWeight: 700, color: col }}>{v}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={PAIEMENTS.map(p => ({ ref: p.ref.slice(-3), v: p.montant / 1000 }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="ref" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} unit="k" />
              <Tooltip formatter={v => [v + " k FCFA"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="v" fill={C.emerald} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 16 }}>
            {PAIEMENTS.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 38, height: 38, background: C.greenL, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic path={I.check} size={18} color={C.green} sw={2.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.slate }}>{fmt(p.montant)}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{p.date} · {p.methode} · <span style={{ fontFamily: "monospace", fontSize: 10 }}>{p.ref}</span></div>
                </div>
                <div className="pill" style={{ background: C.greenL, color: C.green }}>✓ Validé</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── CHANTIER ──────────────────────────────────────────────────────────────── */
const BuildScreen = () => {
  const [tab, setTab] = useState("avancement");
  const budget = { total: 200000000, engage: 87450000, depense: 54200000 };

  return (
    <div className="fade-up">
      <div style={{ background: `linear-gradient(135deg,${C.slate},#3D5066)`, padding: "16px 20px 20px" }}>
        <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 4 }}>Chantier en Direct 🏗️</div>
        <div style={{ fontSize: 12, opacity: .55, color: "white" }}>Suivi transparent de la construction — Adzopé</div>
        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          {[["54,2M","Dépensé"],["87,4M","Collecté"],["65%","Avancement"]].map(([v,l]) => (
            <div key={l} style={{ flex: 1, background: "rgba(255,255,255,.08)", borderRadius: 10, padding: "10px 12px" }}>
              <div className="serif" style={{ fontSize: 18, fontWeight: 700, color: C.goldL }}>{v}</div>
              <div style={{ fontSize: 9, opacity: .5, color: "white", textTransform: "uppercase", letterSpacing: .5 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", background: "white", padding: "8px 16px 0", gap: 4, borderBottom: `1px solid ${C.border}` }}>
        {[["avancement","📐 Phases"],["finances","💰 Finances"],["updates","📸 Actualités"]].map(([k,l]) => (
          <div key={k} onClick={() => setTab(k)} style={{ flex: 1, textAlign: "center", padding: "9px 0", fontSize: 12, fontWeight: 700, color: tab === k ? C.emerald : C.muted, borderBottom: `2px solid ${tab === k ? C.emerald : "transparent"}`, cursor: "pointer" }}>
            {l}
          </div>
        ))}
      </div>

      {tab === "avancement" && (
        <div style={{ padding: "16px 16px", background: "white" }}>
          <div className="serif" style={{ fontSize: 16, fontWeight: 700, color: C.emeraldD, marginBottom: 14 }}>Avancement par Phase</div>
          {CHANTIER.map((ch, i) => (
            <div key={ch.phase} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, background: ch.pct === 100 ? C.greenL : ch.pct > 0 ? C.goldPale : C.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{ch.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.slate }}>{ch.phase}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{ch.date}</div>
                </div>
                <div className="pill" style={{ background: ch.pct === 100 ? C.greenL : ch.pct > 0 ? C.goldPale : C.bg, color: ch.pct === 100 ? C.green : ch.pct > 0 ? C.gold : C.muted }}>
                  {ch.pct === 100 ? "✓ Terminé" : ch.pct > 0 ? ch.pct + "%" : "À venir"}
                </div>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${ch.pct}%`, background: ch.color, borderRadius: 3, transition: "width 1.2s ease" }} />
              </div>
            </div>
          ))}

          <div style={{ background: C.bg, borderRadius: 14, padding: 16, marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.slate, marginBottom: 10 }}>📅 Calendrier prévisionnel</div>
            {[["Oct 2024","Démarrage terrassement","✅"],["Déc 2024","Fondations terminées","✅"],["Fév 2025","Élévation RDC (en cours)","🔄"],["Sep 2025","Toiture","⏳"],["Déc 2025","Second œuvre","⏳"],["Mar 2026","Réception des travaux","🎓"]].map(([d,l,ico]) => (
              <div key={l} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 14 }}>{ico}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.slate }}>{l}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "finances" && (
        <div style={{ padding: "16px 16px", background: "white" }}>
          <div className="serif" style={{ fontSize: 16, fontWeight: 700, color: C.emeraldD, marginBottom: 14 }}>Transparence Financière</div>

          <div style={{ background: `linear-gradient(135deg,${C.emeraldD},${C.emerald})`, borderRadius: 16, padding: 18, marginBottom: 16, color: "white" }}>
            <div style={{ fontSize: 11, opacity: .55, marginBottom: 4 }}>Budget total du projet</div>
            <div className="serif" style={{ fontSize: 28, fontWeight: 700, color: C.goldL }}>200 000 000 FCFA</div>
            <div style={{ height: 6, background: "rgba(255,255,255,.2)", borderRadius: 3, overflow: "hidden", margin: "12px 0 8px" }}>
              <div style={{ height: "100%", width: `${pct(budget.engage,budget.total)}%`, background: C.goldL, borderRadius: 3 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: .7 }}>
              <span>Collecté : {fmtM(budget.engage)}</span>
              <span>{pct(budget.engage, budget.total)}%</span>
            </div>
          </div>

          {[
            { label: "Terrassement & fondations", montant: 18400000, pct: 100, color: C.green },
            { label: "Matériaux (ciment, fer, bois)", montant: 24300000, pct: 85, color: C.gold },
            { label: "Main-d'œuvre qualifiée", montant: 8700000, pct: 60, color: C.blue },
            { label: "Installations électriques", montant: 2800000, pct: 0, color: C.muted },
            { label: "Plomberie & sanitaires", montant: 3500000, pct: 0, color: C.muted },
            { label: "Équipements scolaires", montant: 6200000, pct: 0, color: C.muted },
          ].map(line => (
            <div key={line.label} style={{ padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: C.slate, fontWeight: 600 }}>{line.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: line.color }}>{line.pct > 0 ? fmtM(line.montant * line.pct / 100) : "—"}</span>
              </div>
              <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${line.pct}%`, background: line.color }} />
              </div>
            </div>
          ))}

          <div style={{ background: "#FEF3DC", borderRadius: 12, padding: 14, marginTop: 14, fontSize: 12, color: "#92640A", lineHeight: 1.6 }}>
            🔒 <strong>Séparation stricte des fonds :</strong> Les contributions sont déposées sur un compte dédié contrôlé par le comité de pilotage. Aucun retrait n'est possible sans co-signature de 3 membres.
          </div>
        </div>
      )}

      {tab === "updates" && (
        <div style={{ padding: "16px 16px", background: "white" }}>
          <div className="serif" style={{ fontSize: 16, fontWeight: 700, color: C.emeraldD, marginBottom: 14 }}>Actualités du Chantier</div>
          {UPDATES.map((u, i) => (
            <div key={i} className="card" style={{ marginBottom: 14 }}>
              <div className="chantier-photo">
                <span>{u.photos[0]}</span>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div className="serif" style={{ fontSize: 15, fontWeight: 700, color: C.emeraldD, flex: 1 }}>{u.titre}</div>
                  <div style={{ fontSize: 10, color: C.muted, whiteSpace: "nowrap", marginLeft: 8 }}>{u.date}</div>
                </div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>{u.desc}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {u.photos.map((p, j) => (
                    <div key={j} style={{ width: 64, height: 48, background: C.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{p}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── ROI / RSI SIMULATEUR ──────────────────────────────────────────────────── */
const RoiScreen = () => {
  const [parts, setParts] = useState(1);
  const [horizon, setHorizon] = useState(5);
  const [mode, setMode] = useState("obligataire"); // obligataire | actionnaire

  const partValue = 50000;
  const tauxOblig = 0.06; // 6%
  const tauxDiv = 0.10;   // 10% dividendes estimés post-construction

  const invest = parts * partValue;
  const gains = mode === "obligataire"
    ? invest * tauxOblig * horizon
    : invest * tauxDiv * (horizon - 3 > 0 ? horizon - 3 : 0); // dividendes dès année 4
  const total = invest + gains;
  const rsi = invest > 0 ? ((gains / invest) * 100).toFixed(1) : 0;

  const projData = Array.from({ length: horizon }, (_, i) => {
    const yr = i + 1;
    const g = mode === "obligataire"
      ? invest * tauxOblig * yr
      : invest * tauxDiv * (yr - 3 > 0 ? yr - 3 : 0);
    return { an: "An " + yr, invest: invest / 1000, total: (invest + g) / 1000 };
  });

  const impacts = [
    { icon: "🎓", label: "Bourses financées / an", val: Math.floor(parts * 2) + " élèves" },
    { icon: "👩‍🏫", label: "Emplois générés", val: Math.floor(parts * 0.15) + " postes" },
    { icon: "🏫", label: "Salles de classe", val: Math.ceil(parts / 20) + " salle(s)" },
  ];

  return (
    <div className="fade-up" style={{ padding: "20px 16px" }}>
      <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: C.emeraldD, marginBottom: 4 }}>Simulateur RSI 📈</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Calculez le retour sur votre investissement dans le projet</div>

      {/* mode */}
      <div style={{ display: "flex", background: C.bg, padding: 4, borderRadius: 12, marginBottom: 20, gap: 4 }}>
        {[["obligataire","🏦 Obligataire (6%)"],["actionnaire","📊 Actionnariat"]].map(([k,l]) => (
          <div key={k} onClick={() => setMode(k)} style={{ flex: 1, textAlign: "center", padding: "10px 8px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", background: mode === k ? "white" : "transparent", color: mode === k ? C.emerald : C.muted, boxShadow: mode === k ? "0 1px 6px rgba(0,0,0,.08)" : "none", transition: "all .2s" }}>
            {l}
          </div>
        ))}
      </div>

      {/* sliders */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.slate }}>Nombre de parts</div>
            <div className="serif" style={{ fontSize: 18, fontWeight: 700, color: C.emerald }}>{parts} part{parts > 1 ? "s" : ""}</div>
          </div>
          <input type="range" className="roi-slider" min={1} max={20} value={parts} onChange={e => setParts(Number(e.target.value))} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.light, marginTop: 4 }}>
            <span>1 part = {fmt(partValue)}</span>
            <span>Max 20 parts</span>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.slate }}>Horizon de projection</div>
            <div className="serif" style={{ fontSize: 18, fontWeight: 700, color: C.emerald }}>{horizon} ans</div>
          </div>
          <input type="range" className="roi-slider" min={1} max={10} value={horizon} onChange={e => setHorizon(Number(e.target.value))} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.light, marginTop: 4 }}>
            <span>1 an</span>
            <span>10 ans</span>
          </div>
        </div>
      </div>

      {/* résultats */}
      <div style={{ background: `linear-gradient(135deg,${C.emeraldD},${C.emerald})`, borderRadius: 18, padding: 20, marginBottom: 16, color: "white" }}>
        <div style={{ fontSize: 11, opacity: .55, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Résultats de simulation</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            ["Investissement", fmt(invest), "white"],
            ["Gains estimés", fmt(Math.round(gains)), C.goldL],
            ["Valeur totale", fmt(Math.round(total)), C.goldL],
            ["RSI", rsi + "%", rsi > 0 ? C.goldL : "rgba(255,255,255,.4)"],
          ].map(([l, v, col]) => (
            <div key={l} style={{ background: "rgba(255,255,255,.08)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, opacity: .55, marginBottom: 4 }}>{l}</div>
              <div className="serif" style={{ fontSize: 16, fontWeight: 700, color: col }}>{v}</div>
            </div>
          ))}
        </div>
        {mode === "actionnaire" && (
          <div style={{ fontSize: 11, opacity: .55, marginTop: 12, lineHeight: 1.5 }}>
            * Les dividendes démarrent à l'Année 4 (post-construction). Taux estimé 10%/an sur la valeur investie.
          </div>
        )}
        {mode === "obligataire" && (
          <div style={{ fontSize: 11, opacity: .55, marginTop: 12, lineHeight: 1.5 }}>
            * Taux obligataire indicatif : 6%/an sur la valeur investie, remboursement en Année 5.
          </div>
        )}
      </div>

      {/* graphique */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 10 }}>Projection sur {horizon} ans</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={projData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="an" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} unit="k" />
            <Tooltip formatter={v => [v + " k FCFA"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Line type="monotone" dataKey="invest" stroke={C.border} strokeWidth={2} dot={false} name="Investi" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="total" stroke={C.emerald} strokeWidth={2.5} dot={{ fill: C.emerald, r: 3 }} name="Total projeté" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* impact social */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 12 }}>Impact socio-éducatif estimé</div>
        {impacts.map(imp => (
          <div key={imp.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 24 }}>{imp.icon}</span>
            <div style={{ flex: 1, fontSize: 12, color: C.muted }}>{imp.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.emerald }}>{imp.val}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.goldPale, borderRadius: 12, padding: 14, fontSize: 12, color: "#7A5C1E", lineHeight: 1.6 }}>
        ⚠️ <strong>Avertissement :</strong> Ce simulateur est indicatif. Les rendements réels dépendent du succès de la collecte, des coûts de construction et de décisions prises en Assemblée Générale. Principe « 1 membre = 1 voix ».
      </div>
    </div>
  );
};

/* ── BIBLE DATA ────────────────────────────────────────────────────────────── */
const BIBLE_BOOKS = [
  ["Genèse",50],["Exode",40],["Lévitique",27],["Nombres",36],["Deutéronome",34],
  ["Josué",24],["Juges",21],["Ruth",4],["1 Samuel",31],["2 Samuel",24],
  ["1 Rois",22],["2 Rois",25],["1 Chroniques",29],["2 Chroniques",36],
  ["Esdras",10],["Néhémie",13],["Esther",10],["Job",42],["Psaumes",150],
  ["Proverbes",31],["Ecclésiaste",12],["Cantique",8],["Ésaïe",66],["Jérémie",52],
  ["Lamentations",5],["Ézéchiel",48],["Daniel",12],["Osée",14],["Joël",3],
  ["Amos",9],["Abdias",1],["Jonas",4],["Michée",7],["Nahoum",3],["Habacuc",3],
  ["Sophonie",3],["Aggée",2],["Zacharie",14],["Malachie",4],
  ["Matthieu",28],["Marc",16],["Luc",24],["Jean",21],["Actes",28],
  ["Romains",16],["1 Corinthiens",16],["2 Corinthiens",13],["Galates",6],
  ["Éphésiens",6],["Philippiens",4],["Colossiens",4],["1 Thessaloniciens",5],
  ["2 Thessaloniciens",3],["1 Timothée",6],["2 Timothée",4],["Tite",3],
  ["Philémon",1],["Hébreux",13],["Jacques",5],["1 Pierre",5],["2 Pierre",3],
  ["1 Jean",5],["2 Jean",1],["3 Jean",1],["Jude",1],["Apocalypse",22],
];

// Génère le plan de lecture complet 180 jours (1189 chapitres)
function buildReadingPlan() {
  const all = [];
  BIBLE_BOOKS.forEach(([book, count]) => {
    for (let ch = 1; ch <= count; ch++) all.push({ book, ch });
  });
  const plan = [];
  let idx = 0;
  for (let day = 1; day <= 180; day++) {
    const n = day <= 109 ? 7 : 6;
    const reading = [];
    for (let i = 0; i < n && idx < all.length; i++) reading.push(all[idx++]);
    plan.push({ day, reading });
  }
  return plan;
}
const PLAN = buildReadingPlan();

// Texte biblique intégré (Louis Segond 1910 — domaine public)
const BIBLE_TEXT = {
  "Genèse 1": { title: "La Création", verses: [
    {v:1,t:"Au commencement, Dieu créa les cieux et la terre."},
    {v:2,t:"La terre était informe et vide; il y avait des ténèbres à la surface de l'abîme, et l'esprit de Dieu se mouvait au-dessus des eaux."},
    {v:3,t:"Dieu dit: Que la lumière soit! Et la lumière fut."},
    {v:4,t:"Dieu vit que la lumière était bonne; et Dieu sépara la lumière d'avec les ténèbres."},
    {v:5,t:"Dieu appela la lumière jour, et il appela les ténèbres nuit. Ainsi, il y eut un soir, et il y eut un matin: ce fut le premier jour."},
    {v:6,t:"Dieu dit: Qu'il y ait une étendue entre les eaux, et qu'elle sépare les eaux d'avec les eaux."},
    {v:7,t:"Et Dieu fit l'étendue, et il sépara les eaux qui sont au-dessous de l'étendue d'avec les eaux qui sont au-dessus de l'étendue. Et cela fut ainsi."},
    {v:8,t:"Dieu appela l'étendue ciel. Ainsi, il y eut un soir, et il y eut un matin: ce fut le second jour."},
    {v:9,t:"Dieu dit: Que les eaux qui sont au-dessous du ciel se rassemblent en un seul lieu, et que le sec paraisse. Et cela fut ainsi."},
    {v:10,t:"Dieu appela le sec terre, et il appela l'amas des eaux mers. Dieu vit que cela était bon."},
    {v:11,t:"Puis Dieu dit: Que la terre produise de la verdure, de l'herbe portant de la semence, des arbres fruitiers donnant du fruit selon leur espèce et ayant en eux leur semence sur la terre. Et cela fut ainsi."},
    {v:14,t:"Dieu dit: Qu'il y ait des luminaires dans l'étendue du ciel, pour séparer le jour d'avec la nuit; que ce soient des signes pour marquer les époques, les jours et les années."},
    {v:16,t:"Dieu fit les deux grands luminaires, le plus grand luminaire pour présider au jour, et le plus petit luminaire pour présider à la nuit; il fit aussi les étoiles."},
    {v:20,t:"Dieu dit: Que les eaux produisent en abondance des animaux vivants, et que des oiseaux volent sur la terre vers l'étendue du ciel."},
    {v:26,t:"Puis Dieu dit: Faisons l'homme à notre image, selon notre ressemblance, et qu'il domine sur les poissons de la mer, sur les oiseaux du ciel, sur le bétail, sur toute la terre, et sur tous les reptiles qui rampent sur la terre."},
    {v:27,t:"Dieu créa l'homme à son image, il le créa à l'image de Dieu, il créa l'homme et la femme."},
    {v:28,t:"Dieu les bénit, et Dieu leur dit: Soyez féconds, multipliez, remplissez la terre, et l'assujettissez; et dominez sur les poissons de la mer, sur les oiseaux du ciel, et sur tout animal qui se meut sur la terre."},
    {v:31,t:"Dieu vit tout ce qu'il avait fait et voici, cela était très bon. Ainsi, il y eut un soir, et il y eut un matin: ce fut le sixième jour."},
  ]},
  "Psaumes 23": { title: "L'Éternel est mon berger", verses: [
    {v:1,t:"L'Éternel est mon berger: je ne manquerai de rien."},
    {v:2,t:"Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles."},
    {v:3,t:"Il restaure mon âme, Il me conduit dans les sentiers de la justice, À cause de son nom."},
    {v:4,t:"Quand je marche dans la vallée de l'ombre de la mort, Je ne crains aucun mal, car tu es avec moi: Ta houlette et ton bâton me rassurent."},
    {v:5,t:"Tu dresses devant moi une table, En face de mes adversaires; Tu oins d'huile ma tête, Et ma coupe déborde."},
    {v:6,t:"Oui, le bonheur et la grâce m'accompagneront Tous les jours de ma vie; Et j'habiterai dans la maison de l'Éternel Jusqu'à la fin de mes jours."},
  ]},
  "Psaumes 89": { title: "Grâces éternelles de l'Éternel", verses: [
    {v:1,t:"Je célébrerai à jamais les grâces de l'Éternel; Ma bouche annoncera ta fidélité d'âge en âge."},
    {v:2,t:"Je dis: C'est une chose établie que ta bonté; Tu l'as fondée dans les cieux, elle est inébranlable."},
    {v:3,t:"J'ai fait une alliance avec mon élu, J'ai juré à David, mon serviteur:"},
    {v:4,t:"J'affermirai à jamais ta postérité, Et j'élèverai ton trône de génération en génération!"},
    {v:5,t:"Les cieux célèbrent tes merveilles, ô Éternel! Et ta fidélité, dans l'assemblée des saints."},
    {v:6,t:"Car qui, dans les nues, est comparable à l'Éternel? Qui est semblable à l'Éternel parmi les fils des dieux?"},
    {v:7,t:"Dieu est redoutable dans l'assemblée des saints; Il est grand et terrible pour tous ceux qui l'entourent."},
    {v:8,t:"Éternel, Dieu des armées, qui est fort comme toi? Ta fidélité t'environne, ô Éternel!"},
    {v:11,t:"Les cieux sont à toi, la terre est à toi aussi: Tu as fondé le monde et ce qu'il renferme."},
    {v:14,t:"La justice et l'équité sont la base de ton trône; La bonté et la fidélité marchent devant ta face."},
    {v:15,t:"Heureux le peuple qui connaît le son de la trompette! Il marche, ô Éternel, à la lumière de ta face."},
    {v:16,t:"Il se réjouit en ton nom tout le jour, Et ta justice est l'objet de son triomphe."},
    {v:26,t:"Il m'invoquera: Tu es mon père, Mon Dieu et le rocher de mon salut!"},
    {v:52,t:"Béni soit à jamais l'Éternel! Amen! Amen!"},
  ]},
  "Psaumes 90": { title: "La brièveté de la vie humaine", verses: [
    {v:1,t:"Seigneur, tu as été notre refuge De génération en génération."},
    {v:2,t:"Avant que les montagnes fussent nées, Avant que tu eusses créé la terre et le monde, Depuis toujours et à jamais tu es Dieu."},
    {v:4,t:"Car mille ans, à tes yeux, sont comme le jour d'hier, qui est passé, Comme une veille de la nuit."},
    {v:10,t:"Les jours de nos années s'élèvent à soixante-dix ans, Et si l'on est plus vigoureux, à quatre-vingts ans; Et l'orgueil qu'ils procurent n'est que peine et misère, Car il passe vite, et nous nous envolons."},
    {v:12,t:"Enseigne-nous à bien compter nos jours, Afin que nous appliquions notre coeur à la sagesse."},
    {v:14,t:"Rassasie-nous dès le matin de ta bonté, Et nous serons toute notre vie dans la joie et l'allégresse."},
    {v:17,t:"Que la grâce du Seigneur notre Dieu soit sur nous! Affermis sur nous l'oeuvre de nos mains; Oui, affermis l'oeuvre de nos mains!"},
  ]},
  "Psaumes 91": { title: "La protection divine", verses: [
    {v:1,t:"Celui qui demeure sous l'abri du Très-Haut Repose à l'ombre du Tout-Puissant."},
    {v:2,t:"Je dis à l'Éternel: Mon refuge et ma forteresse, Mon Dieu en qui je me confie!"},
    {v:3,t:"Car c'est lui qui te délivre du filet de l'oiseleur, De la peste et de ses ravages."},
    {v:4,t:"Il te couvrira de ses plumes, Et tu trouveras un refuge sous ses ailes; Sa fidélité est un bouclier et une armure."},
    {v:11,t:"Car il ordonnera à ses anges De te garder dans toutes tes voies;"},
    {v:14,t:"Puisqu'il m'aime, je le délivrerai; Je le protégerai, parce qu'il connaît mon nom."},
    {v:15,t:"Il m'invoquera, et je lui répondrai; Je serai avec lui dans la détresse, Je le délivrerai et je le glorifierai."},
    {v:16,t:"Je le rassasierai de longs jours, Et je lui ferai voir mon salut."},
  ]},
  "Proverbes 12": { title: "Sagesse et discipline", verses: [
    {v:1,t:"Celui qui aime la correction aime la connaissance, Mais celui qui hait la réprimande est stupide."},
    {v:4,t:"La femme vertueuse est la couronne de son mari, Mais celle qui le déshonore est comme la carie dans ses os."},
    {v:10,t:"Le juste a soin de la vie de son animal, Mais les entrailles des méchants sont cruelles."},
    {v:11,t:"Celui qui cultive son champ sera rassasié de pain, Mais celui qui court après les choses vaines est dépourvu de sens."},
    {v:15,t:"La voie du fou est droite à ses propres yeux, Mais celui qui écoute les conseils est sage."},
    {v:17,t:"Celui qui dit la vérité est un témoin fidèle, Mais le faux témoin trompe."},
    {v:22,t:"Les lèvres menteuses sont en horreur à l'Éternel, Mais ceux qui agissent fidèlement lui sont agréables."},
    {v:25,t:"La tristesse dans le coeur de l'homme l'abat, Mais une bonne parole le réjouit."},
  ]},
};

// Retourne le texte d'un passage pour l'IA (résumé concis)
function passageToText(refs) {
  let txt = "";
  refs.forEach(({ book, ch }) => {
    const key = `${book} ${ch}`;
    const d = BIBLE_TEXT[key];
    if (d) {
      txt += `\n--- ${key}: ${d.title} ---\n`;
      d.verses.forEach(vv => { txt += `v${vv.v}: ${vv.t}\n`; });
    }
  });
  return txt || refs.map(r => `${r.book} chapitre ${r.ch}`).join(", ");
}

/* ── BIBLE SCREEN ──────────────────────────────────────────────────────────── */
const BibleScreen = () => {
  const CURRENT_DAY = 89;
  const [tab, setTab] = useState("plan");
  const [viewDay, setViewDay] = useState(CURRENT_DAY);
  const [readerChapter, setReaderChapter] = useState(null); // { book, ch }
  const [fontSize, setFontSize] = useState(15);
  const [readingConfirmed, setReadingConfirmed] = useState(false);

  // QCM IA
  const [aiQuestions, setAiQuestions] = useState(null);
  const [loadingQCM, setLoadingQCM] = useState(false);
  const [aiError, setAiError] = useState("");
  const [qIdx, setQIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [validated, setValidated] = useState(false);
  const [score, setScore] = useState(0);
  const [qcmDone, setQcmDone] = useState(false);

  const dayPlan = PLAN[viewDay - 1];
  const todayPlan = PLAN[CURRENT_DAY - 1];
  const chaptersWithText = dayPlan.reading.filter(r => BIBLE_TEXT[`${r.book} ${r.ch}`]);

  // Génère les QCM via l'API Anthropic
  const generateQCM = async () => {
    setLoadingQCM(true);
    setAiError("");
    setAiQuestions(null);
    setQIdx(0); setSel(null); setValidated(false);
    setScore(0); setQcmDone(false);

    const passage = passageToText(dayPlan.reading);
    const prompt = `Tu es un assistant pédagogique biblique. Génère exactement 4 questions QCM en français basées UNIQUEMENT sur ce passage lu aujourd'hui. Chaque question doit tester la compréhension réelle du texte.

Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans explication, sans balises \`\`\`. Format exact:
{"questions":[{"q":"question?","opts":["Réponse A","Réponse B","Réponse C","Réponse D"],"ok":0,"explication":"Explication courte de la bonne réponse en 1-2 phrases."}]}

L'index "ok" est l'index (0-3) de la bonne réponse dans "opts".

Passage biblique:
${passage.slice(0, 3000)}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAiQuestions(parsed.questions);
    } catch (e) {
      setAiError("Impossible de générer les questions. Vérifiez votre connexion et réessayez.");
    }
    setLoadingQCM(false);
  };

  const handleValidate = () => {
    if (sel === null) return;
    setValidated(true);
    if (sel === aiQuestions[qIdx].ok) setScore(s => s + 1);
  };
  const handleNext = () => {
    if (qIdx < aiQuestions.length - 1) {
      setQIdx(i => i + 1); setSel(null); setValidated(false);
    } else {
      setQcmDone(true);
    }
  };

  const q = aiQuestions?.[qIdx];
  const chapLabel = (refs) => {
    if (!refs.length) return "";
    const groups = {};
    refs.forEach(({ book, ch }) => {
      if (!groups[book]) groups[book] = [];
      groups[book].push(ch);
    });
    return Object.entries(groups).map(([book, chs]) => {
      if (chs.length === 1) return `${book} ${chs[0]}`;
      return `${book} ${chs[0]}–${chs[chs.length - 1]}`;
    }).join(" + ");
  };

  // Vue Lecteur d'un chapitre
  if (readerChapter) {
    const key = `${readerChapter.book} ${readerChapter.ch}`;
    const data = BIBLE_TEXT[key];
    const idx = dayPlan.reading.findIndex(r => r.book === readerChapter.book && r.ch === readerChapter.ch);
    const prev = dayPlan.reading[idx - 1];
    const next = dayPlan.reading[idx + 1];

    return (
      <div className="fade-up">
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg,${C.emeraldD},${C.emerald})`, padding: "16px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div onClick={() => setReaderChapter(null)} style={{ width: 36, height: 36, background: "rgba(255,255,255,.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <Ic path={I.back} size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: .55, color: "white" }}>Jour {viewDay} · {idx + 1}/{dayPlan.reading.length}</div>
              <div className="serif" style={{ fontSize: 18, fontWeight: 700, color: "white" }}>{key}</div>
              {data && <div style={{ fontSize: 11, color: C.goldL }}>{data.title}</div>}
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              <div onClick={() => setFontSize(s => Math.max(12, s - 1))} style={{ width: 30, height: 30, background: "rgba(255,255,255,.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "white" }}>A</div>
              <div onClick={() => setFontSize(s => Math.min(22, s + 1))} style={{ width: 30, height: 30, background: "rgba(255,255,255,.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 20, fontWeight: 700, color: "white" }}>A</div>
            </div>
          </div>
        </div>

        <div style={{ background: "white", padding: "20px 18px", minHeight: 400 }}>
          {data ? (
            <>
              <div className="serif" style={{ fontSize: 20, fontWeight: 700, color: C.emeraldD, marginBottom: 18, lineHeight: 1.3 }}>{data.title}</div>
              {data.verses.map(vv => (
                <div key={vv.v} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, minWidth: 22, paddingTop: 3, flexShrink: 0 }}>{vv.v}</div>
                  <div style={{ fontSize: fontSize, lineHeight: 1.75, color: C.slate, fontFamily: "'Cormorant Garamond', serif" }}>{vv.t}</div>
                </div>
              ))}
              <div style={{ background: C.bg, borderRadius: 10, padding: 12, marginTop: 8, fontSize: 11, color: C.muted, textAlign: "center" }}>
                Louis Segond 1910 — Domaine public
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
              <div className="serif" style={{ fontSize: 18, fontWeight: 700, color: C.emeraldD, marginBottom: 8 }}>{key}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                Le texte intégral de ce chapitre sera disponible dans la version complète de l'application.
              </div>
            </div>
          )}
        </div>

        {/* Navigation inter-chapitres */}
        <div style={{ background: "white", padding: "12px 18px 16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
          {prev ? (
            <button className="btn btn-out" style={{ flex: 1, padding: "10px 8px", fontSize: 12 }} onClick={() => setReaderChapter(prev)}>
              ← {prev.book} {prev.ch}
            </button>
          ) : <div style={{ flex: 1 }} />}
          {next ? (
            <button className="btn btn-em" style={{ flex: 1, padding: "10px 8px", fontSize: 12 }} onClick={() => setReaderChapter(next)}>
              {next.book} {next.ch} →
            </button>
          ) : (
            <button className="btn btn-gold" style={{ flex: 1, fontSize: 12 }} onClick={() => { setReadingConfirmed(true); setReaderChapter(null); setTab("qcm"); }}>
              ✅ J'ai tout lu !
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up">
      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg,${C.emeraldD},${C.emerald})`, padding: "16px 20px 20px" }}>
        <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 4 }}>Lecture Biblique 📖</div>
        <div style={{ fontSize: 12, opacity: .55, color: "white", marginBottom: 14 }}>Programme 180 jours — Bible complète</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[[`${CURRENT_DAY}/180`,"Jours"],["237/1189","Chapitres"],["68%","Avancement"]].map(([v,l]) => (
            <div key={l} style={{ flex: 1, background: "rgba(255,255,255,.1)", borderRadius: 10, padding: "10px 8px" }}>
              <div className="serif" style={{ fontSize: 15, fontWeight: 700, color: C.goldL }}>{v}</div>
              <div style={{ fontSize: 9, opacity: .5, color: "white", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", background: "white", padding: "6px 16px 0", borderBottom: `1px solid ${C.border}`, gap: 2 }}>
        {[["plan","📅 Programme"],["lire","📖 Lire"],["qcm","✏️ QCM IA"],["palmares","🏅 Palmarès"]].map(([k,l]) => (
          <div key={k} onClick={() => setTab(k)} style={{ flex: 1, textAlign: "center", padding: "9px 0", fontSize: 10, fontWeight: 700, color: tab === k ? C.emerald : C.muted, borderBottom: `2px solid ${tab === k ? C.emerald : "transparent"}`, cursor: "pointer" }}>
            {l}
          </div>
        ))}
      </div>

      {/* ── TAB: PROGRAMME ── */}
      {tab === "plan" && (
        <div style={{ padding: "16px", background: "white" }}>
          {/* Lecture du jour mise en avant */}
          <div style={{ background: `linear-gradient(135deg,${C.emeraldD},${C.emerald})`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 8 }}>📅 Aujourd'hui — Jour {CURRENT_DAY}</div>
            <div className="serif" style={{ fontSize: 17, fontWeight: 700, color: "white", marginBottom: 4 }}>{chapLabel(todayPlan.reading)}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginBottom: 14 }}>{todayPlan.reading.length} chapitres · ~{todayPlan.reading.length * 7} minutes estimées</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-gold" style={{ flex: 1, padding: "11px 8px", fontSize: 13 }} onClick={() => { setViewDay(CURRENT_DAY); setTab("lire"); }}>
                Commencer la lecture
              </button>
              {readingConfirmed && (
                <button className="btn" style={{ background: "rgba(255,255,255,.15)", color: "white", padding: "11px 14px", borderRadius: 12, fontSize: 13 }} onClick={() => setTab("qcm")}>
                  ✏️ QCM
                </button>
              )}
            </div>
          </div>

          {/* Progression globale */}
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 12 }}>Ma progression</div>
            {[["Jours complétés", CURRENT_DAY - 1, 180, C.emerald],["Chapitres lus", 237, 1189, C.gold],["QCM validés", 14, 180, C.blue]].map(([l, v, t, col]) => (
              <div key={l} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: C.muted }}>{l}</span>
                  <span style={{ fontWeight: 700, color: col }}>{v}/{t}</span>
                </div>
                <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct(v, t)}%`, background: col, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Calendrier des 7 prochains jours */}
          <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 10 }}>Prochains jours</div>
          {PLAN.slice(CURRENT_DAY - 1, CURRENT_DAY + 6).map((dp, i) => {
            const isToday = dp.day === CURRENT_DAY;
            const isDone = dp.day < CURRENT_DAY;
            return (
              <div key={dp.day} onClick={() => { setViewDay(dp.day); setTab("lire"); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, marginBottom: 8, cursor: "pointer", background: isToday ? C.emerald + "12" : "white", border: `1px solid ${isToday ? C.emerald : C.border}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: isDone ? C.greenL : isToday ? C.emerald : C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {isDone ? <Ic path={I.check} size={16} color={C.green} sw={2.5} /> : <span style={{ fontSize: 12, fontWeight: 700, color: isToday ? "white" : C.muted }}>{dp.day}</span>}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isToday ? C.emerald : C.slate, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {chapLabel(dp.reading)}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted }}>{dp.reading.length} ch · ~{dp.reading.length * 7} min</div>
                </div>
                {isToday && <div className="pill" style={{ background: C.emerald, color: "white" }}>Auj.</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB: LIRE ── */}
      {tab === "lire" && (
        <div style={{ background: "white", minHeight: 400 }}>
          {/* Sélecteur de jour */}
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => setViewDay(d => Math.max(1, d - 1))} style={{ width: 32, height: 32, background: C.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Ic path={I.back} size={16} color={C.muted} />
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.slate }}>Jour {viewDay}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{chapLabel(PLAN[viewDay - 1].reading)}</div>
            </div>
            <div onClick={() => setViewDay(d => Math.min(180, d + 1))} style={{ width: 32, height: 32, background: C.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transform: "rotate(180deg)" }}>
              <Ic path={I.back} size={16} color={C.muted} />
            </div>
          </div>

          {/* Info lecture */}
          <div style={{ padding: "14px 16px 8px" }}>
            <div style={{ background: C.bg, borderRadius: 12, padding: "12px 14px", marginBottom: 14, display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 24 }}>⏱️</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.slate }}>Temps estimé : {dayPlan.reading.length * 7} min</div>
                <div style={{ fontSize: 11, color: C.muted }}>{dayPlan.reading.length} chapitres · Lisez à votre rythme</div>
              </div>
            </div>

            {/* Liste des chapitres */}
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8 }}>Chapitres du jour</div>
            {dayPlan.reading.map((r, i) => {
              const key = `${r.book} ${r.ch}`;
              const hasText = !!BIBLE_TEXT[key];
              return (
                <div key={i} onClick={() => setReaderChapter(r)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, marginBottom: 8, cursor: "pointer", border: `1px solid ${C.border}`, transition: "all .15s" }}>
                  <div style={{ width: 38, height: 38, background: hasText ? C.emerald + "12" : C.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {hasText ? "📖" : "📄"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.slate }}>{key}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>
                      {BIBLE_TEXT[key] ? BIBLE_TEXT[key].title : "Texte disponible dans l'app complète"}
                    </div>
                  </div>
                  <Ic path={I.back} size={16} color={C.muted} sw={2} style={{ transform: "rotate(180deg)" }} />
                </div>
              );
            })}

            {/* Bouton valider lecture */}
            <div style={{ marginTop: 8 }}>
              {!readingConfirmed ? (
                <button className="btn btn-em" style={{ width: "100%", fontSize: 14 }}
                  onClick={() => { setReadingConfirmed(true); setTab("qcm"); }}>
                  <Ic path={I.check} size={16} color="white" sw={2.5} /> J'ai terminé ma lecture du jour
                </button>
              ) : (
                <div style={{ background: C.greenL, borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>✅ Lecture validée !</div>
                  <div style={{ fontSize: 12, color: C.green, marginTop: 4 }}>Passez au QCM pour tester votre compréhension</div>
                  <button className="btn btn-em" style={{ width: "100%", marginTop: 10, fontSize: 13 }} onClick={() => setTab("qcm")}>
                    Passer au QCM IA →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: QCM IA ── */}
      {tab === "qcm" && (
        <div style={{ padding: "16px", background: "white" }}>
          {!readingConfirmed ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <div className="serif" style={{ fontSize: 20, fontWeight: 700, color: C.emeraldD, marginBottom: 8 }}>QCM verrouillé</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
                Lisez d'abord les chapitres du jour et validez votre lecture pour débloquer le QCM généré par l'IA.
              </div>
              <button className="btn btn-em" style={{ width: "100%" }} onClick={() => setTab("lire")}>
                Aller à la lecture →
              </button>
            </div>
          ) : qcmDone ? (
            <div style={{ textAlign: "center", padding: "32px 16px" }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
              <div className="serif" style={{ fontSize: 24, fontWeight: 700, color: C.emeraldD, marginBottom: 6 }}>QCM terminé !</div>
              <div className="serif" style={{ fontSize: 44, fontWeight: 700, color: score >= 3 ? C.green : score >= 2 ? C.gold : C.red, marginBottom: 8 }}>
                {score}/{aiQuestions.length}
              </div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>
                {score === aiQuestions.length ? "Parfait ! Excellente maîtrise du passage." : score >= aiQuestions.length * 0.75 ? "Très bien ! Bonne compréhension." : score >= aiQuestions.length * 0.5 ? "Bien. Relisez les passages difficiles." : "Reprenez la lecture et réessayez."}
              </div>
              {score >= aiQuestions.length * 0.75 && (
                <div style={{ background: C.greenL, borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 13, color: C.green }}>
                  🏅 Score enregistré ! +{score} points de progression
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-out" style={{ flex: 1, fontSize: 13 }} onClick={() => { setAiQuestions(null); setQcmDone(false); setScore(0); }}>
                  Nouveau QCM IA
                </button>
                <button className="btn btn-em" style={{ flex: 1, fontSize: 13 }} onClick={() => setTab("plan")}>
                  Programme →
                </button>
              </div>
            </div>
          ) : !aiQuestions ? (
            <div>
              <div style={{ background: `linear-gradient(135deg,${C.emeraldD},${C.emerald})`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
                <div style={{ fontSize: 11, opacity: .55, color: "white", marginBottom: 6 }}>🤖 QCM généré par l'IA</div>
                <div className="serif" style={{ fontSize: 17, fontWeight: 700, color: "white", marginBottom: 4 }}>Lecture du Jour {CURRENT_DAY}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", lineHeight: 1.6 }}>
                  {chapLabel(todayPlan.reading)}
                </div>
              </div>

              <div style={{ background: C.bg, borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                ✅ Lecture validée ! L'IA va analyser les passages que vous avez lus et générer <strong style={{ color: C.slate }}>4 questions personnalisées</strong> pour vérifier votre compréhension.
              </div>

              {aiError && (
                <div style={{ background: C.redL, color: C.red, borderRadius: 10, padding: 12, fontSize: 13, marginBottom: 14 }}>{aiError}</div>
              )}

              <button className="btn btn-em" style={{ width: "100%" }} onClick={generateQCM} disabled={loadingQCM}>
                {loadingQCM ? (
                  <><div className="spinner" /> Génération en cours…</>
                ) : (
                  <><span>🤖</span> Générer mon QCM avec l'IA</>
                )}
              </button>

              {loadingQCM && (
                <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: C.muted }}>
                  L'IA analyse {chapLabel(todayPlan.reading)}…<br />Cela prend quelques secondes.
                </div>
              )}
            </div>
          ) : (
            <div className="slide-in">
              {/* Header question */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: C.muted }}>Question {qIdx + 1}/{aiQuestions.length}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.emerald }}>QCM IA — Jour {CURRENT_DAY}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {aiQuestions.map((_, i) => (
                    <div key={i} style={{ width: 28, height: 5, borderRadius: 3, background: i < qIdx ? C.green : i === qIdx ? C.emerald : C.border }} />
                  ))}
                </div>
              </div>

              {/* Question */}
              <div style={{ background: C.bg, borderRadius: 14, padding: "16px 18px", marginBottom: 16, fontSize: 14, fontWeight: 600, color: C.slate, lineHeight: 1.65 }}>
                {q.q}
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                {q.opts.map((opt, i) => {
                  let bg = "white", border = C.border, col = C.slate;
                  if (validated) {
                    if (i === q.ok) { bg = C.greenL; border = C.green; col = C.green; }
                    else if (i === sel) { bg = C.redL; border = C.red; col = C.red; }
                  } else if (i === sel) { bg = C.emerald + "0E"; border = C.emerald; col = C.emerald; }
                  return (
                    <div key={i} onClick={() => { if (!validated) setSel(i); }}
                      style={{ padding: "13px 16px", border: `2px solid ${border}`, borderRadius: 12, cursor: validated ? "default" : "pointer", background: bg, transition: "all .15s" }}>
                      <span style={{ fontWeight: 700, marginRight: 10, opacity: .4, fontSize: 12, color: col }}>{["A","B","C","D"][i]}.</span>
                      <span style={{ fontSize: 13, color: col, fontWeight: validated && i === q.ok ? 700 : 400 }}>{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explication IA après validation */}
              {validated && (
                <div style={{ background: sel === q.ok ? C.greenL : C.bg, borderRadius: 12, padding: "12px 14px", marginBottom: 14, borderLeft: `3px solid ${sel === q.ok ? C.green : C.gold}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: sel === q.ok ? C.green : C.gold, marginBottom: 4 }}>
                    {sel === q.ok ? "✅ Bonne réponse !" : "ℹ️ Explication"}
                  </div>
                  <div style={{ fontSize: 12, color: C.slate, lineHeight: 1.6 }}>{q.explication}</div>
                </div>
              )}

              {!validated ? (
                <button className="btn btn-em" style={{ width: "100%" }} disabled={sel === null} onClick={handleValidate}>
                  Valider ma réponse
                </button>
              ) : (
                <button className="btn btn-em" style={{ width: "100%" }} onClick={handleNext}>
                  {qIdx < aiQuestions.length - 1 ? "Question suivante →" : "Voir mon résultat"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: PALMARÈS ── */}
      {tab === "palmares" && (
        <div style={{ padding: "16px", background: "white" }}>
          {/* Certification */}
          <div style={{ background: `linear-gradient(135deg,${C.emeraldD},${C.emerald})`, borderRadius: 16, padding: 20, marginBottom: 16, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, border: `2px solid ${C.gold}`, borderRadius: "50%", opacity: .2 }} />
            <Ic path={I.bible} size={36} color={C.goldL} />
            <div className="serif" style={{ fontSize: 18, fontWeight: 700, color: "white", margin: "10px 0 4px" }}>Certification en cours</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginBottom: 14 }}>
              Score QCM moyen : <strong style={{ color: C.goldL }}>76%</strong> · Seuil requis : 70%
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,.2)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "68%", background: C.goldL }} />
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 6 }}>68% du programme accompli</div>
          </div>

          {/* Badges */}
          <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 12 }}>🏅 Mes Badges</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { ico: "⭐", label: "Fidèle 7 jours", sub: "7 jours consécutifs", ok: true },
              { ico: "📖", label: "Psaumes complet", sub: "150 chapitres lus", ok: true },
              { ico: "🔥", label: "30 jours consécutifs", sub: "Objectif : 30 jours", ok: false },
              { ico: "🏆", label: "Mi-parcours", sub: "90 jours complétés", ok: false },
              { ico: "💡", label: "QCM parfait", sub: "Score 100% au QCM", ok: false },
              { ico: "🎓", label: "Certifié", sub: "180 jours + 70% QCM", ok: false },
            ].map(b => (
              <div key={b.label} style={{ background: b.ok ? C.greenL : C.bg, borderRadius: 14, padding: "14px 12px", textAlign: "center", opacity: b.ok ? 1 : .5 }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>{b.ico}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: b.ok ? C.green : C.muted }}>{b.label}</div>
                <div style={{ fontSize: 10, color: b.ok ? C.green : C.light, marginTop: 2 }}>{b.sub}</div>
                <div className="pill" style={{ marginTop: 8, background: b.ok ? C.green + "20" : C.border, color: b.ok ? C.green : C.muted }}>
                  {b.ok ? "Obtenu ✓" : "🔒"}
                </div>
              </div>
            ))}
          </div>

          {/* Classement cohorte */}
          <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 10 }}>🏆 Classement Cohorte Janv. 2025</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#EEF6FF", border: `1px solid #90C8F0`, borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 11, color: "#2471A3" }}>
            🔒 Identités anonymisées — seul votre rang vous est attribué nominativement.
          </div>
          {[
            { rang: 1, nom: "MBR-0042", score: 94, jours: 89, me: false },
            { rang: 2, nom: "MBR-0017", score: 88, jours: 88, me: false },
            { rang: 3, nom: "Konan Emmanuel", score: 76, jours: 89, me: true },
            { rang: 4, nom: "MBR-0083", score: 71, jours: 85, me: false },
            { rang: 5, nom: "MBR-0056", score: 68, jours: 82, me: false },
          ].map(r => (
            <div key={r.rang} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, marginBottom: 6, background: r.me ? C.emerald + "10" : C.bg, border: r.me ? `1.5px solid ${C.emerald}` : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: r.rang <= 3 ? [C.gold, "#B0B0B0", "#CD7F32"][r.rang - 1] : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: r.rang <= 3 ? "white" : C.muted, flexShrink: 0 }}>
                {r.rang}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: r.me ? 700 : 500, color: r.me ? C.emerald : C.muted, fontFamily: r.me ? "inherit" : "monospace" }}>
                  {r.nom}{r.me ? " (moi)" : ""}
                </div>
                <div style={{ fontSize: 10, color: C.muted }}>Jour {r.jours} · Score QCM {r.score}%</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: r.score >= 80 ? C.green : r.score >= 70 ? C.gold : C.muted }}>{r.score}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};





/* ═══════════════════════════════════════════════════════════════════════════ */
/*  ÉCRAN COHORTE                                                               */
/* ═══════════════════════════════════════════════════════════════════════════ */
const CohorteScreen = ({ onNav }) => {
  const [tab, setTab] = useState("classe");
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState(COHORTE_CHAT);

  const sendMsg = () => {
    if (!msg.trim()) return;
    setChat(c => [...c, { auteur: "Konan Emmanuel", initiales: "KE", msg: msg.trim(), time: new Date().getHours() + ":" + String(new Date().getMinutes()).padStart(2,"0"), moi: true }]);
    setMsg("");
  };

  const tabs = [["classe","🏆 Classement"],["chat","💬 Chat"],["info","ℹ️ Info"]];

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${C.emeraldD},${C.emerald})`, padding: "16px 18px 0" }}>
        <div style={{ fontSize: 11, opacity: .5, color: "white", letterSpacing: 1, marginBottom: 4 }}>MON GROUPE</div>
        <div className="serif" style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 2 }}>{COHORTE_INFO.nom}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginBottom: 14 }}>{COHORTE_INFO.size} membres · {COHORTE_INFO.plan} · Jour {COHORTE_INFO.jour}</div>
        <div style={{ display: "flex", gap: 0 }}>
          {tabs.map(([k,l]) => (
            <div key={k} onClick={() => setTab(k)} style={{ flex: 1, textAlign: "center", padding: "9px 0", fontSize: 11, fontWeight: 700, color: tab===k ? C.goldL : "rgba(255,255,255,.4)", borderBottom: `2px solid ${tab===k ? C.goldL : "transparent"}`, cursor: "pointer", transition: "all .2s" }}>
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* Classement */}
      {tab === "classe" && (
        <div style={{ padding: "14px 16px", flex: 1 }}>

          {/* Bandeau confidentialité */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#EEF6FF", border: `1px solid #90C8F0`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#2471A3" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🔒</span>
            <span>Les identités des membres sont anonymisées. Seul votre propre classement vous est attribué nominativement.</span>
          </div>

          {/* Podium top 3 */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 10, marginBottom: 20, paddingTop: 10 }}>
            {[COHORTE_MEMBRES[1], COHORTE_MEMBRES[0], COHORTE_MEMBRES[2]].map((m, i) => {
              const pos = [2, 1, 3][i];
              const h = [90, 110, 70][i];
              const col = [C.muted, C.gold, "#CD7F32"][i];
              return (
                <div key={m.code} style={{ textAlign: "center", flex: 1 }}>
                  {/* Avatar : initiales si moi, icône verrou sinon */}
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: m.moi ? C.emerald : "#E8EEF2", border: `2px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontSize: m.moi ? 13 : 18, fontWeight: 700, color: m.moi ? "white" : C.muted }}>
                    {m.moi ? "KE" : "🔒"}
                  </div>
                  {/* Nom : prénom si moi, code anonyme sinon */}
                  <div style={{ fontSize: 10, color: m.moi ? C.emerald : C.muted, fontWeight: m.moi ? 700 : 500, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {m.moi ? "Moi" : m.code}
                  </div>
                  <div style={{ background: col, borderRadius: "6px 6px 0 0", height: h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white" }}>
                    <div style={{ fontSize: 16, fontWeight: 900 }}>#{pos}</div>
                    <div style={{ fontSize: 11, opacity: .9 }}>{m.score}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reste du classement */}
          {COHORTE_MEMBRES.slice(3).map((m, i) => (
            <div key={m.code} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}`, opacity: m.actif ? 1 : .5 }}>
              <div style={{ width: 26, textAlign: "center", fontSize: 13, fontWeight: 700, color: C.muted }}>#{i+4}</div>
              {/* Avatar */}
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: m.moi ? C.emerald : "#E8EEF2", border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: m.moi ? 12 : 16, fontWeight: 700, color: m.moi ? "white" : C.muted }}>
                {m.moi ? "KE" : "🔒"}
              </div>
              <div style={{ flex: 1 }}>
                {/* Identifiant : mon prénom si moi, code anonyme sinon */}
                <div style={{ fontSize: 13, fontWeight: m.moi ? 700 : 500, color: m.moi ? C.emerald : C.slate }}>
                  {m.moi ? "Konan Emmanuel (moi) 👈" : m.code}
                </div>
                <div style={{ fontSize: 10, color: C.muted }}>Jour {m.jours} · {m.actif ? "✅ Actif" : "⚠️ En retard"}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: m.score >= 80 ? C.green : m.score >= 70 ? C.gold : C.muted }}>{m.score}%</div>
            </div>
          ))}

          {/* Note de bas de liste */}
          <div style={{ marginTop: 16, padding: "10px 12px", background: C.bg, borderRadius: 10, fontSize: 11, color: C.muted, display: "flex", gap: 6 }}>
            <span>🔒</span>
            <span>Les codes (MBR-XXXX) sont des identifiants anonymes. Seule l'équipe de pilotage dispose de la correspondance nom ↔ identifiant.</span>
          </div>
        </div>
      )}

      {/* Chat */}
      {tab === "chat" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, padding: "14px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
            {chat.map((c, i) => (
              <div key={i} style={{ display: "flex", flexDirection: c.moi ? "row-reverse" : "row", gap: 8, alignItems: "flex-end" }}>
                {!c.moi && (
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#E8EEF2", color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🔒</div>
                )}
                <div style={{ maxWidth: "72%" }}>
                  {/* Auteur : "moi" montre son prénom, les autres montrent leur pseudonyme anonyme */}
                  {!c.moi && <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{c.auteur}</div>}
                  <div style={{ background: c.moi ? C.emerald : "white", color: c.moi ? "white" : C.slate, padding: "10px 14px", borderRadius: c.moi ? "18px 18px 4px 18px" : "18px 18px 18px 4px", fontSize: 13, lineHeight: 1.5, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
                    {c.msg}
                  </div>
                  <div style={{ fontSize: 9, color: C.muted, marginTop: 3, textAlign: c.moi ? "right" : "left" }}>{c.time}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Input */}
          <div style={{ padding: "12px 16px", background: "white", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "center" }}>
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Message à la cohorte…" style={{ flex: 1, padding: "10px 14px", borderRadius: 22, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "Nunito, sans-serif", outline: "none" }} />
            <button onClick={sendMsg} style={{ width: 40, height: 40, borderRadius: "50%", background: C.emerald, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic path={I.send} size={16} color="white" />
            </button>
          </div>
        </div>
      )}

      {/* Info cohorte */}
      {tab === "info" && (
        <div style={{ padding: "16px" }}>
          <div className="card" style={{ padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 14 }}>📊 Statistiques cohorte</div>
            {[
              ["Membres actifs", `${COHORTE_MEMBRES.filter(m=>m.actif).length}/${COHORTE_MEMBRES.length}`, C.green],
              ["Score moyen QCM", `${Math.round(COHORTE_MEMBRES.reduce((s,m)=>s+m.score,0)/COHORTE_MEMBRES.length)}%`, C.blue],
              ["Jours complétés (moy.)", `${Math.round(COHORTE_MEMBRES.reduce((s,m)=>s+m.jours,0)/COHORTE_MEMBRES.length)}/180`, C.gold],
              ["Certifiés à date", "2/11", C.emerald],
            ].map(([l,v,col]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
                <span style={{ color: C.muted }}>{l}</span>
                <span style={{ fontWeight: 700, color: col }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 12 }}>🎖️ Mon niveau</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: USER_LEVEL.color + "20", border: `2px solid ${USER_LEVEL.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{USER_LEVEL.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: USER_LEVEL.color }}>{USER_LEVEL.label}</div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{USER_XP} XP{NEXT_LEVEL ? ` · ${NEXT_LEVEL.xpMin - USER_XP} XP pour ${NEXT_LEVEL.label}` : " · Niveau max !"}</div>
                <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct(USER_XP - USER_LEVEL.xpMin, USER_LEVEL.xpMax - USER_LEVEL.xpMin)}%`, background: USER_LEVEL.color }} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {LEVELS.map(l => (
                <div key={l.id} style={{ flex: 1, textAlign: "center", opacity: USER_XP >= l.xpMin ? 1 : .35 }}>
                  <div style={{ fontSize: 18 }}>{l.emoji}</div>
                  <div style={{ fontSize: 9, color: USER_XP >= l.xpMin ? l.color : C.muted, fontWeight: 700 }}>{l.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 12 }}>📋 Conditions cotisation</div>
            {[
              { label: "1. Inscription membre", ok: true },
              { label: "2. Programme lecture (6 mois)", ok: true, sub: "En cours — Jour 89/180" },
              { label: "3. Baptême validé", ok: true },
              { label: "4. Accès à la cotisation", ok: true, sub: "✅ Débloqué" },
            ].map(c => (
              <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: c.ok ? C.greenL : C.bg, border: `2px solid ${c.ok ? C.green : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 1 }}>{c.ok ? "✓" : "○"}</div>
                <div>
                  <div style={{ fontSize: 13, color: c.ok ? C.slate : C.muted, fontWeight: c.ok ? 600 : 400 }}>{c.label}</div>
                  {c.sub && <div style={{ fontSize: 11, color: C.muted }}>{c.sub}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  ÉCRAN COMMUNICATION                                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */
const CommScreen = () => {
  const [tab, setTab] = useState("fil");
  const [type, setType] = useState("priere");
  const [msgText, setMsgText] = useState("");
  const [sent, setSent] = useState(false);
  const [msgs, setMsgs] = useState(COMM_MESSAGES);
  const [filter, setFilter] = useState("tous");

  const filtered = filter === "tous" ? msgs : msgs.filter(m => m.type === filter);

  const handleSend = () => {
    if (!msgText.trim()) return;
    const t = COMM_TYPES.find(t => t.id === type);
    setMsgs(m => [{ type, auteur: "Konan Emmanuel", msg: msgText.trim(), time: "À l'instant", lu: true }, ...m]);
    setMsgText("");
    setSent(true);
    setTimeout(() => { setSent(false); setTab("fil"); }, 2000);
  };

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${C.emeraldD},${C.emerald})`, padding: "16px 18px 0" }}>
        <div className="serif" style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 4 }}>Communication 📢</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginBottom: 14 }}>Messages de la communauté</div>
        <div style={{ display: "flex", gap: 0 }}>
          {[["fil","📋 Fil"],["envoyer","✏️ Envoyer"]].map(([k,l]) => (
            <div key={k} onClick={() => setTab(k)} style={{ flex: 1, textAlign: "center", padding: "9px 0", fontSize: 11, fontWeight: 700, color: tab===k ? C.goldL : "rgba(255,255,255,.4)", borderBottom: `2px solid ${tab===k ? C.goldL : "transparent"}`, cursor: "pointer" }}>
              {l}
            </div>
          ))}
        </div>
      </div>

      {tab === "fil" && (
        <div style={{ padding: "14px 16px", flex: 1 }}>
          {/* filtres type */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
            <div onClick={() => setFilter("tous")} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: filter === "tous" ? C.emerald : C.bg, color: filter === "tous" ? "white" : C.muted, cursor: "pointer", flexShrink: 0, border: `1.5px solid ${filter === "tous" ? C.emerald : C.border}` }}>
              Tous ({msgs.length})
            </div>
            {COMM_TYPES.map(t => (
              <div key={t.id} onClick={() => setFilter(t.id)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: filter === t.id ? t.color : t.bg, color: filter === t.id ? "white" : t.color, cursor: "pointer", flexShrink: 0, border: `1.5px solid ${t.color}`, opacity: .9 }}>
                {t.label}
              </div>
            ))}
          </div>

          {/* messages */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((m, i) => {
              const t = COMM_TYPES.find(tt => tt.id === m.type) || COMM_TYPES[2];
              return (
                <div key={i} style={{ background: "white", borderRadius: 14, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,.06)", borderLeft: `4px solid ${t.color}`, opacity: m.lu ? 1 : 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: t.bg, color: t.color }}>{t.label}</div>
                    {!m.lu && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.emerald }} />}
                    <div style={{ flex: 1 }} />
                    <div style={{ fontSize: 10, color: C.muted }}>{m.time}</div>
                  </div>
                  <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.6, marginBottom: 6 }}>{m.msg}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>— {m.auteur}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "envoyer" && (
        <div style={{ padding: "16px", flex: 1 }}>
          {sent && (
            <div style={{ background: C.greenL, color: C.green, padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>
              ✅ Message envoyé avec succès !
            </div>
          )}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, marginBottom: 16 }}>Type de message</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {COMM_TYPES.map(t => (
                <div key={t.id} onClick={() => setType(t.id)} style={{ padding: "14px 12px", borderRadius: 12, border: `2px solid ${type === t.id ? t.color : C.border}`, background: type === t.id ? t.bg : "white", cursor: "pointer", textAlign: "center", transition: "all .2s" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{t.label.split(" ")[0]}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: type === t.id ? t.color : C.slate }}>{t.label.split(" ").slice(1).join(" ")}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}>Destinataires</div>
              <select style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "Nunito, sans-serif", outline: "none", background: "white" }}>
                <option>Ma cohorte ({COHORTE_INFO.nom})</option>
                <option>Toute mon église</option>
                <option>Région Adzopé</option>
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 }}>Message</div>
              <textarea value={msgText} onChange={e => setMsgText(e.target.value)} placeholder={type === "priere" ? "Partagez votre demande de prière…" : type === "sos" ? "Décrivez votre besoin urgent…" : type === "annonce" ? "Votre annonce à la communauté…" : "Votre information…"} rows={5} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "Nunito, sans-serif", resize: "none", outline: "none" }} />
            </div>
            <button onClick={handleSend} style={{ width: "100%", padding: "14px", borderRadius: 12, background: COMM_TYPES.find(t=>t.id===type)?.color || C.emerald, color: "white", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "Nunito, sans-serif" }}>
              <Ic path={I.send} size={18} color="white" /> Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  APP SHELL                                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */
const NAV = [
  { id: "home",    label: "Accueil",  path: I.home  },
  { id: "pay",     label: "Cotiser",  path: I.pay   },
  { id: "bible",   label: "Bible",    path: I.bible },
  { id: "cohorte", label: "Cohorte",  path: I.group },
  { id: "comm",    label: "Comm.",    path: I.comm  },
];

export default function MobileApp({ onBack }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState("home");
  const screenRef = useRef(null);
  const [commDot, setCommDot] = useState(true);

  const navigate = (id) => {
    if (id === "comm") setCommDot(false);
    setScreen(id);
    screenRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const SCREENS = { home: HomeScreen, pay: PayScreen, build: BuildScreen, roi: RoiScreen, bible: BibleScreen, cohorte: CohorteScreen, comm: CommScreen };
  const Screen = SCREENS[screen] || HomeScreen;

  return (
    <>
      <style>{G}</style>
      <div className="phone-wrap" style={{ minHeight: "100vh" }}>
        {onBack && (
          <button onClick={onBack} style={{ position: "fixed", top: 16, left: 16, zIndex: 999, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(4px)" }}>
            ← Accueil
          </button>
        )}
        <div className="phone">
          <div className="phone-notch" />

          {!loggedIn ? (
            <div className="screen" ref={screenRef}>
              <div style={{ height: 44 }} />
              <LoginScreen onLogin={() => setLoggedIn(true)} />
            </div>
          ) : (
            <>
              {/* Status bar */}
              <div className="status-bar" style={{ marginTop: 10 }}>
                <div className="status-time">
                  {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, "0")}
                </div>
                <div className="status-icons">
                  <span>●●●</span><span>WiFi</span><span>🔋</span>
                </div>
              </div>

              {/* Screen content */}
              <div className="screen" ref={screenRef} key={screen}>
                <Screen onNav={navigate} />
              </div>

              {/* Bottom nav */}
              <div className="nav-bar">
                {NAV.map(n => {
                  const active = screen === n.id;
                  return (
                    <div key={n.id} className="nav-btn" onClick={() => navigate(n.id)} style={{ position: "relative" }}>
                      <Ic path={n.path} size={22} color={active ? C.emerald : C.muted} sw={active ? 2.5 : 1.8} />
                      {n.id === "comm" && commDot && <div style={{ position: "absolute", top: 2, right: 8, width: 8, height: 8, background: C.red, borderRadius: "50%", border: "2px solid white" }} />}
                      <span className="nav-label" style={{ color: active ? C.emerald : C.muted }}>{n.label}</span>
                      {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.emerald }} />}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
