// src/services/gapService.js
// ─────────────────────────────────────────────────────────────
// Gestion des gaps (compensations) — achat et rachat
// ─────────────────────────────────────────────────────────────

import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'

import { db } from '../firebase'
import { logAudit } from './auditService'

// ── Vérifier si la fenêtre de vente est ouverte ──────────────
// Règle : 1er au 15 janvier de l'année suivante
export const isSaleWindowOpen = () => {
  const now = new Date()
  const month = now.getMonth() // 0 = janvier
  const day   = now.getDate()
  return month === 0 && day >= 1 && day <= 15
}

// ── Vérifier si le buyback est possible ──────────────────────
// Règle : 1er au 10 janvier
export const isBuybackWindowOpen = () => {
  const now = new Date()
  return now.getMonth() === 0 && now.getDate() <= 10
}

// ── Écouter les gaps disponibles en temps réel ───────────────
// ⚠️ ANONYMISÉ : retourne memberCode, jamais le nom
export const subscribeToListedGaps = (campaignId, callback) => {
  const q = query(
    collection(db, 'gaps'),
    where('campaignId', '==', campaignId),
    where('status', '==', 'listed'),
    orderBy('listedAt', 'asc')
  )
  return onSnapshot(q, (snap) => {
    const gaps = snap.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        // ⚠️ Seul le code anonyme est exposé, jamais memberId ou name
        memberCode:  data.memberCode,
        churchId:    data.churchId,   // église d'origine (non identifiante)
        gapAmount:   data.gapAmount,
        status:      data.status,
        listedAt:    data.listedAt,
      }
    })
    callback(gaps)
  })
}

// ── Récupérer les gaps d'un membre (vue admin comptabilité) ───
// ADMIN UNIQUEMENT — contient memberId
export const getMemberGapsAdmin = async (campaignId) => {
  const snap = await getDocs(query(
    collection(db, 'gaps'),
    where('campaignId', '==', campaignId),
    orderBy('listedAt', 'desc')
  ))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── Gap d'un membre spécifique ────────────────────────────────
export const getMyGap = async (memberId, campaignId) => {
  const q = query(
    collection(db, 'gaps'),
    where('memberId', '==', memberId),
    where('campaignId', '==', campaignId)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

// ── Acheter un gap ────────────────────────────────────────────
export const purchaseGap = async ({ gapId, buyerId, buyerCode, campaignId }) => {
  if (!isSaleWindowOpen()) {
    throw new Error("La fenêtre d'achat est fermée (1-15 janvier uniquement).")
  }

  return await runTransaction(db, async (tx) => {
    const gapRef  = doc(db, 'gaps', gapId)
    const gapSnap = await tx.get(gapRef)

    if (!gapSnap.exists()) throw new Error('Gap introuvable.')
    const gap = gapSnap.data()

    if (gap.status !== 'listed') throw new Error('Ce gap n\'est plus disponible.')
    if (gap.memberId === buyerId) throw new Error('Vous ne pouvez pas acheter votre propre gap.')

    // Vérifier que l'acheteur n'a pas déjà acheté un gap cette campagne
    const existingPurchase = await getDocs(query(
      collection(db, 'gaps'),
      where('campaignId', '==', campaignId),
      where('buyerId',    '==', buyerId),
      where('status',     '==', 'sold')
    ))
    if (!existingPurchase.empty) {
      throw new Error('Vous avez déjà acheté un gap cette campagne (limite : 1 par campagne).')
    }

    // Marquer le gap comme vendu
    tx.update(gapRef, {
      status:       'sold',
      buyerId,
      buyerCode,    // code anonyme de l'acheteur
      purchasedAt:  serverTimestamp(),
    })

    // Créer le paiement correspondant au gap
    const payRef = doc(collection(db, 'payments'))
    tx.set(payRef, {
      memberId:   buyerId,
      memberCode: buyerCode,
      campaignId,
      amount:     gap.gapAmount,
      method:     'gap_purchase',
      reference:  `GAP-${gapId.slice(0, 8)}`,
      status:     'valide',
      paidAt:     serverTimestamp(),
      createdAt:  serverTimestamp(),
    })

    await logAudit('GAP_PURCHASE', 'gap', gapId, { buyerCode, amount: gap.gapAmount })
    return { success: true, amount: gap.gapAmount }
  })
}

// ── Racheter son propre gap (buyback) ─────────────────────────
export const buybackGap = async ({ gapId, memberId, memberCode }) => {
  if (!isBuybackWindowOpen()) {
    throw new Error("La fenêtre de rachat est fermée (1-10 janvier uniquement).")
  }

  return await runTransaction(db, async (tx) => {
    const gapRef  = doc(db, 'gaps', gapId)
    const gapSnap = await tx.get(gapRef)

    if (!gapSnap.exists()) throw new Error('Gap introuvable.')
    const gap = gapSnap.data()

    if (gap.memberId !== memberId) throw new Error('Ce gap ne vous appartient pas.')
    if (gap.status !== 'listed')  throw new Error('Ce gap n\'est plus disponible au rachat.')

    tx.update(gapRef, {
      status:      'bought_back',
      buybackAt:   serverTimestamp(),
    })

    await logAudit('GAP_BUYBACK', 'gap', gapId, { memberCode, amount: gap.gapAmount })
    return { success: true }
  })
}
