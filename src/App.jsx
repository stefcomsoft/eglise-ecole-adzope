import { useState } from 'react'
import DashboardApp from './dashboard/DashboardApp.jsx'
import MobileApp from './mobile/MobileApp.jsx'

const COLORS = {
  emeraldDark: '#0F4530',
  emerald: '#1A6B4A',
  gold: '#C9952A',
  goldLight: '#E8B84B',
  bg: '#F4F1EB',
  border: '#E0D8C8',
  slate: '#2C3E50',
  muted: '#8FA3A0',
}

export default function App() {
  const [mode, setMode] = useState(null) // null | 'dashboard' | 'mobile'

  if (mode === 'dashboard') return <DashboardApp onBack={() => setMode(null)} />
  if (mode === 'mobile')    return <MobileApp    onBack={() => setMode(null)} />

  // Launcher screen
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${COLORS.emeraldDark} 0%, ${COLORS.emerald} 55%, #1B5E3A 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32, fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{ width: 72, height: 72, background: COLORS.gold, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          </svg>
        </div>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
          Région Adzopé • Côte d'Ivoire
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: 10 }}>
          Église-École
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, maxWidth: 420, lineHeight: 1.7 }}>
          Plateforme numérique intégrée — Financement participatif
          & renforcement de la maturité spirituelle
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 36, marginBottom: 56 }}>
        {[['200M', 'Objectif FCFA'], ['4 000', 'Membres cibles'], ['5 ans', 'Horizon projet']].map(([v, l]) => (
          <div key={v} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: COLORS.goldLight }}>{v}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* App selectors */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Dashboard */}
        <div
          onClick={() => setMode('dashboard')}
          style={{
            width: 280, background: 'white', borderRadius: 20, padding: 28,
            cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)' }}
        >
          <div style={{ width: 48, height: 48, background: COLORS.emerald, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: COLORS.emeraldDark, marginBottom: 6 }}>
            Dashboard Admin
          </div>
          <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, marginBottom: 18 }}>
            Tableau de bord régional, gestion des membres, campagnes, gaps, cohortes et statistiques.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Président', 'Responsables', 'Comptabilité'].map(r => (
              <span key={r} style={{ fontSize: 10, background: '#E8F5EE', color: COLORS.emerald, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{r}</span>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, color: COLORS.emerald, fontSize: 13, fontWeight: 600 }}>
            Ouvrir le Dashboard
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        {/* Mobile App */}
        <div
          onClick={() => setMode('mobile')}
          style={{
            width: 280, background: 'white', borderRadius: 20, padding: 28,
            cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)' }}
        >
          <div style={{ width: 48, height: 48, background: COLORS.gold, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <path d="M12 18h.01"/>
            </svg>
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: COLORS.emeraldDark, marginBottom: 6 }}>
            Application Mobile
          </div>
          <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, marginBottom: 18 }}>
            Interface membre : cotisations, lecture biblique, cohortes, QCM IA, gamification et suivi chantier.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Membres', 'iOS / Android', 'IA Koffi'].map(r => (
              <span key={r} style={{ fontSize: 10, background: '#FFF8E8', color: COLORS.gold, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{r}</span>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, color: COLORS.gold, fontSize: 13, fontWeight: 600 }}>
            Ouvrir l'App Mobile
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 48, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
        PROJET THOM • EduCI Initiative • v1.0.0
      </div>
    </div>
  )
}
