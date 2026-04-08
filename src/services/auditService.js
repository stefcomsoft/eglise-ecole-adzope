// src/services/auditService.js
// ─────────────────────────────────────────────────────────────
// Journalisation de toutes les opérations sensibles (RGPD)
// ─────────────────────────────────────────────────────────────

import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../firebase'

export const logAudit = async (action, entity, entityId, meta = {}) => {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      actorUid:  auth.currentUser?.uid || 'system',
      action,              // ex: 'PAYMENT', 'LOGIN', 'GAP_PURCHASE'
      entity,              // ex: 'payment', 'gap', 'user'
      entityId,
      meta,                // données contextuelles
      ip: null,            // à remplir côté serveur si backend
      createdAt: serverTimestamp(),
    })
  } catch (e) {
    // Ne pas bloquer l'opération principale si le log échoue
    console.warn('Audit log failed:', e.message)
  }
}
