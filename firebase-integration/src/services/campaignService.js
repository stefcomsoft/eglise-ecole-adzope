// src/services/campaignService.js
// ─────────────────────────────────────────────────────────────
// Gestion des campagnes annuelles et allocations membres
// ─────────────────────────────────────────────────────────────

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  writeBatch,
} from 'firebase/firestore'

import { db } from '../firebase'
import { logAudit } from './auditService'

// ── Récupérer la campagne en cours ────────────────────────────
export const getCurrentCampaign = async () => {
  const q = query(
    collection(db, 'campaigns'),
    where('status', '==', 'active'),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

// ── Écouter la campagne en temps réel (pour le dashboard) ─────
export const subscribeToCampaign = (campaignId, callback) => {
  return onSnapshot(doc(db, 'campaigns', campaignId), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() })
  })
}

// ── Récupérer l'allocation d'un membre ────────────────────────
export const getMemberAllocation = async (memberId, campaignId) => {
  const q = query(
    collection(db, 'allocations'),
    where('memberId', '==', memberId),
    where('campaignId', '==', campaignId),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

// ── Écouter l'allocation en temps réel ───────────────────────
export const subscribeToAllocation = (memberId, campaignId, callback) => {
  const q = query(
    collection(db, 'allocations'),
    where('memberId', '==', memberId),
    where('campaignId', '==', campaignId),
    limit(1)
  )
  return onSnapshot(q, (snap) => {
    if (!snap.empty) {
      callback({ id: snap.docs[0].id, ...snap.docs[0].data() })
    }
  })
}

// ── Enregistrer un paiement ───────────────────────────────────
export const recordPayment = async ({
  memberId,
  memberCode,     // identifiant anonyme
  campaignId,
  amount,
  method,         // 'mtn' | 'wave' | 'orange' | 'virement' | 'especes'
  reference,      // référence opérateur
}) => {
  // Règle métier : montant minimum 500 FCFA
  if (amount < 500) throw new Error('Le montant minimum est de 500 FCFA.')

  return await runTransaction(db, async (tx) => {
    // 1. Lire l'allocation actuelle
    const allocQuery = query(
      collection(db, 'allocations'),
      where('memberId', '==', memberId),
      where('campaignId', '==', campaignId)
    )
    const allocSnap = await getDocs(allocQuery)
    if (allocSnap.empty) throw new Error('Aucune allocation trouvée pour ce membre.')

    const allocDoc = allocSnap.docs[0]
    const alloc = allocDoc.data()

    // 2. Calculer le nouveau total payé
    const newPaid = (alloc.paidAmount || 0) + amount
    const newStatus = newPaid >= alloc.allocatedAmount ? 'complete' : 'en_cours'

    // 3. Créer le paiement
    const paymentRef = doc(collection(db, 'payments'))
    tx.set(paymentRef, {
      memberId,
      memberCode,         // pour les vues anonymisées
      campaignId,
      amount,
      method,
      reference,
      status: 'valide',
      paidAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    })

    // 4. Mettre à jour l'allocation
    tx.update(allocDoc.ref, {
      paidAmount: newPaid,
      status: newStatus,
      lastPaymentAt: serverTimestamp(),
    })

    // 5. Mettre à jour le total collecté de la campagne
    const campaignRef = doc(db, 'campaigns', campaignId)
    const campaignSnap = await tx.get(campaignRef)
    tx.update(campaignRef, {
      collected: (campaignSnap.data().collected || 0) + amount
    })

    await logAudit('PAYMENT', 'payment', paymentRef.id, { amount, method, memberCode })
    return { paymentId: paymentRef.id, newPaid, status: newStatus }
  })
}

// ── Historique des paiements d'un membre ─────────────────────
export const getMemberPayments = async (memberId, campaignId = null) => {
  let q = query(
    collection(db, 'payments'),
    where('memberId', '==', memberId),
    orderBy('paidAt', 'desc')
  )
  if (campaignId) {
    q = query(q, where('campaignId', '==', campaignId))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── Clôture de campagne (ADMIN) ───────────────────────────────
// Calcule automatiquement les gaps au 31/12
export const closeCampaign = async (campaignId) => {
  const batch = writeBatch(db)

  // 1. Récupérer toutes les allocations non soldées
  const allocSnap = await getDocs(query(
    collection(db, 'allocations'),
    where('campaignId', '==', campaignId),
    where('status', '!=', 'complete')
  ))

  let gapsCreated = 0

  for (const allocDoc of allocSnap.docs) {
    const alloc = allocDoc.data()
    const gapAmount = alloc.allocatedAmount - (alloc.paidAmount || 0)

    if (gapAmount > 0) {
      // 2. Créer un gap pour chaque allocation incomplète
      const gapRef = doc(collection(db, 'gaps'))
      batch.set(gapRef, {
        campaignId,
        memberId:   alloc.memberId,
        memberCode: alloc.memberCode,  // ⚠️ anonyme — utilisé dans les vues publiques
        gapAmount,
        status:    'listed',
        listedAt:  serverTimestamp(),
        buyerId:   null,
        purchasedAt: null,
      })

      // 3. Marquer l'allocation comme "clôturée avec gap"
      batch.update(allocDoc.ref, { status: 'gap', closedAt: serverTimestamp() })
      gapsCreated++
    }
  }

  // 4. Marquer la campagne comme clôturée
  batch.update(doc(db, 'campaigns', campaignId), {
    status: 'closed',
    closedAt: serverTimestamp(),
  })

  await batch.commit()
  await logAudit('CAMPAIGN_CLOSE', 'campaign', campaignId, { gapsCreated })
  return { gapsCreated }
}

// ── Statistiques régionales ───────────────────────────────────
export const getRegionStats = async (campaignId) => {
  const [allocSnap, paySnap] = await Promise.all([
    getDocs(query(collection(db, 'allocations'), where('campaignId', '==', campaignId))),
    getDocs(query(collection(db, 'payments'),    where('campaignId', '==', campaignId))),
  ])

  const total     = allocSnap.size
  const complete  = allocSnap.docs.filter(d => d.data().status === 'complete').length
  const totalPaid = paySnap.docs.reduce((s, d) => s + d.data().amount, 0)

  return { total, complete, totalPaid, paymentRate: Math.round((complete / total) * 100) }
}
