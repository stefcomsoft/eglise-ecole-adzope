import { useState } from 'react'
import DashboardApp from './dashboard/DashboardApp.jsx'
import MobileApp from './mobile/MobileApp.jsx'

const C = {
  emeraldDark: '#0B3D26',
  emerald:     '#1A6B4A',
  emeraldMid:  '#1E7D57',
  gold:        '#C9952A',
  goldLight:   '#E8B84B',
  goldPale:    '#FFF8E8',
  bg:          '#F4F1EB',
  border:      '#E0D8C8',
  slate:       '#2C3E50',
  muted:       '#8FA3A0',
  white:       '#FFFFFF',
}

// ─── LOGO HOMERIS ──────────────────────────────────────────────────────────────
function HomerisLogo({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      {/* Toit / fronton — symbole maison communautaire */}
      <path d="M4 20L22 6l18 14" stroke={C.goldLight} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Corps du batiment */}
      <rect x="8" y="20" width="28" height="18" rx="1.5" stroke="white" strokeWidth="2" fill="none"/>
      {/* Piliers / colonnes (3 projets) */}
      <rect x="12" y="24" width="4" height="10" rx="1" fill={C.goldLight} opacity="0.9"/>
      <rect x="20" y="24" width="4" height="10" rx="1" fill={C.goldLight} opacity="0.6"/>
      <rect x="28" y="24" width="4" height="10" rx="1" fill={C.goldLight} opacity="0.3"/>
    </svg>
  )
}

// ─── PROJET CARD (catalogue vitrine) ──────────────────────────────────────────
function ProjetBadge({ label, statut, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 14px', borderRadius: 10,
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.12)',
      marginBottom: 8,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 10, color, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{statut}</span>
    </div>
  )
}

// ─── ENTRY CARD ───────────────────────────────────────────────────────────────
function EntryCard({ icon, title, description, tags, tagColor, tagBg, actionLabel, accentColor, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 280, background: C.white, borderRadius: 22, padding: 28,
        cursor: 'pointer',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 24px 56px rgba(0,0,0,0.22)'
          : '0 8px 32px rgba(0,0,0,0.12)',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{
        width: 52, height: 52, background: accentColor, borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        boxShadow: `0 6px 18px ${accentColor}55`,
      }}>
        {icon}
      </div>

      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.slate, marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 18, flex: 1 }}>
        {description}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {tags.map(t => (
          <span key={t} style={{ fontSize: 10, background: tagBg, color: tagColor, padding: '3px 11px', borderRadius: 20, fontWeight: 700 }}>{t}</span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: accentColor, fontSize: 13, fontWeight: 700 }}>
        {actionLabel}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  )
}

// ─── SEPARATEUR ───────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '8px 0 32px' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase' }}>Acces plateforme</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState(null) // null | 'dashboard' | 'mobile'

  if (mode === 'dashboard') return <DashboardApp onBack={() => setMode(null)} />
  if (mode === 'mobile')    return <MobileApp    onBack={() => setMode(null)} />

  return (
    <div style={{
      minHeight: '100dvh',
      background: `linear-gradient(150deg, ${C.emeraldDark} 0%, ${C.emerald} 45%, ${C.emeraldMid} 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Cercles decoratifs fond */}
      <div style={{ position: 'absolute', top: -120, right: -120, width: 480, height: 480, borderRadius: '50%', background: 'rgba(201,149,42,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

      {/* ── EN-TETE HOMERIS ─────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 48, zIndex: 1 }}>

        {/* Logo */}
        <div style={{
          width: 80, height: 80, background: 'rgba(201,149,42,0.15)',
          border: '1.5px solid rgba(201,149,42,0.35)',
          borderRadius: 22, display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 22px',
          backdropFilter: 'blur(8px)',
        }}>
          <HomerisLogo size={44} />
        </div>

        {/* Eyebrow */}
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
          Cote d'Ivoire &nbsp;·&nbsp; Plateforme communautaire
        </div>

        {/* Nom */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 54, fontWeight: 700, color: C.white,
          lineHeight: 1, marginBottom: 6, letterSpacing: -1,
        }}>
          Hom<span style={{ color: C.goldLight }}>é</span>ris
        </h1>

        {/* Tagline */}
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32, letterSpacing: 0.2 }}>
          Financement participatif &amp; gouvernance de projets communautaires
        </p>

        {/* Projets actifs — vitrine */}
        <div style={{ maxWidth: 340, margin: '0 auto', textAlign: 'left' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
            Projets sur la plateforme
          </div>
          <ProjetBadge label="Eglise-Ecole Adzope"      statut="Actif"    color={C.goldLight} />
          <ProjetBadge label="Dispensaire communautaire" statut="Sondage"  color="#60A5FA"     />
          <ProjetBadge label="Centre de formation"       statut="A venir"  color={C.muted}     />
        </div>
      </div>

      {/* ── KPIs ─────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 40, marginBottom: 44, zIndex: 1 }}>
        {[
          ['3',     'Projets'],
          ['7 000', 'Membres cibles'],
          ['Multi', 'Region'],
        ].map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: C.goldLight }}>{v}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── CARTES D'ACCES ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>

        {/* Dashboard Admin */}
        <EntryCard
          onClick={() => setMode('dashboard')}
          accentColor={C.emerald}
          tagColor={C.emerald}
          tagBg="#E8F5EE"
          actionLabel="Ouvrir le Dashboard"
          title="Dashboard Admin"
          description="Gestion multi-projets, sondages, membres, cohortes, gouvernance et statistiques consolidees."
          tags={['President', 'Responsables', 'Comptabilite']}
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
            </svg>
          }
        />

        {/* App Mobile */}
        <EntryCard
          onClick={() => setMode('mobile')}
          accentColor={C.gold}
          tagColor={C.gold}
          tagBg={C.goldPale}
          actionLabel="Ouvrir l'App Mobile"
          title="Application Mobile"
          description="Catalogue projets, sondages, cotisations, lecture biblique, cohortes et suivi chantier."
          tags={['Membres', 'iOS / Android', 'IA Koffi']}
          icon={
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2"/>
              <path d="M12 18h.01"/>
            </svg>
          }
        />

      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 52, textAlign: 'center', zIndex: 1 }}>
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: 1 }}>
          HOMERIS v2.0 &nbsp;·&nbsp; PROJET THOM &nbsp;·&nbsp; EduCI Initiative &nbsp;·&nbsp; Cote d'Ivoire
        </div>
        <div style={{ color: 'rgba(255,255,255,0.12)', fontSize: 10, marginTop: 6 }}>
          Branche : homeris &nbsp;·&nbsp; Base : v1.0-eglise-ecole
        </div>
      </div>

    </div>
  )
}
