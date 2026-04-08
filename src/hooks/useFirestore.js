// src/hooks/useFirestore.js
// ─────────────────────────────────────────────────────────────
// Hooks React pour remplacer les données mockées par Firestore
// Usage : const { data, loading, error } = useCurrentCampaign()
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  getCurrentCampaign,
  subscribeToAllocation,
  getMemberPayments,
  getRegionStats,
  subscribeToCampaign,
} from '../services/campaignService'
import {
  subscribeToListedGaps,
  getMyGap,
} from '../services/gapService'
import {
  getMemberProgress,
  subscribeToCohortRanking,
  getOpenCohorts,
} from '../services/bibleService'

// ── Campagne courante ─────────────────────────────────────────
export const useCurrentCampaign = () => {
  const [campaign, setCampaign] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    let unsub = null
    getCurrentCampaign()
      .then(c => {
        if (c) {
          // Écoute temps réel une fois l'ID connu
          unsub = subscribeToCampaign(c.id, setCampaign)
        }
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
    return () => unsub?.()
  }, [])

  return { campaign, loading, error }
}

// ── Allocation du membre connecté ────────────────────────────
export const useMyAllocation = (campaignId) => {
  const { user } = useAuth()
  const [allocation, setAllocation] = useState(null)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    if (!user || !campaignId) return
    setLoading(true)
    const unsub = subscribeToAllocation(user.uid, campaignId, (data) => {
      setAllocation(data)
      setLoading(false)
    })
    return unsub
  }, [user, campaignId])

  return { allocation, loading }
}

// ── Paiements du membre connecté ─────────────────────────────
export const useMyPayments = (campaignId) => {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!user) return
    getMemberPayments(user.uid, campaignId)
      .then(data => { setPayments(data); setLoading(false) })
  }, [user, campaignId])

  return { payments, loading }
}

// ── Gaps disponibles (anonymisés) ────────────────────────────
export const useListedGaps = (campaignId) => {
  const [gaps,    setGaps]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!campaignId) return
    const unsub = subscribeToListedGaps(campaignId, (data) => {
      setGaps(data)
      setLoading(false)
    })
    return unsub
  }, [campaignId])

  return { gaps, loading }
}

// ── Mon gap personnel ─────────────────────────────────────────
export const useMyGap = (campaignId) => {
  const { user } = useAuth()
  const [gap,     setGap]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !campaignId) return
    getMyGap(user.uid, campaignId)
      .then(data => { setGap(data); setLoading(false) })
  }, [user, campaignId])

  return { gap, loading }
}

// ── Progression dans la cohorte ──────────────────────────────
export const useCohortProgress = (cohortId) => {
  const { user } = useAuth()
  const [progress, setProgress] = useState(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!user || !cohortId) return
    getMemberProgress(cohortId, user.uid)
      .then(data => { setProgress(data); setLoading(false) })
  }, [user, cohortId])

  return { progress, loading }
}

// ── Classement anonymisé de la cohorte ───────────────────────
export const useCohortRanking = (cohortId) => {
  const { user } = useAuth()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !cohortId) return
    const unsub = subscribeToCohortRanking(cohortId, user.uid, (data) => {
      setRanking(data)
      setLoading(false)
    })
    return unsub
  }, [user, cohortId])

  return { ranking, loading }
}

// ── Cohortes ouvertes ─────────────────────────────────────────
export const useOpenCohorts = () => {
  const [cohorts, setCohorts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOpenCohorts()
      .then(data => { setCohorts(data); setLoading(false) })
  }, [])

  return { cohorts, loading }
}

// ── Statistiques régionales (admin) ──────────────────────────
export const useRegionStats = (campaignId) => {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!campaignId) return
    getRegionStats(campaignId)
      .then(data => { setStats(data); setLoading(false) })
  }, [campaignId])

  return { stats, loading }
}
