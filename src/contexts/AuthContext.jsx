// src/contexts/AuthContext.jsx
// ─────────────────────────────────────────────────────────────
// Contexte global d'authentification — à envelopper autour de App
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthChange, logout as firebaseLogout } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession]   = useState(null)   // { user, profile }
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState(null)

  useEffect(() => {
    // Observer Firebase Auth — se déclenche à chaque changement de session
    const unsubscribe = onAuthChange((data) => {
      setSession(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const logout = async () => {
    await firebaseLogout()
    setSession(null)
  }

  const value = {
    user:       session?.user    || null,
    profile:    session?.profile || null,
    role:       session?.profile?.role || null,
    memberCode: session?.profile?.memberCode || null,
    isAdmin:    ['ADMIN', 'RESPONSABLE_REGIONAL'].includes(session?.profile?.role),
    isLoading:  loading,
    error,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook pratique pour consommer le contexte
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
