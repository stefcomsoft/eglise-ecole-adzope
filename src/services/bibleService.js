// src/services/bibleService.js
// ─────────────────────────────────────────────────────────────
// Gestion des cohortes bibliques, lectures et QCM
// ─────────────────────────────────────────────────────────────

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
  runTransaction,
} from 'firebase/firestore'

import { db } from '../firebase'
import { logAudit } from './auditService'

// ── Rejoindre une cohorte ─────────────────────────────────────
export const joinCohort = async (cohortId, memberId, memberCode) => {
  // Vérifier que la cohorte est ouverte
  const cohortSnap = await getDoc(doc(db, 'cohorts', cohortId))
  if (!cohortSnap.exists()) throw new Error('Cohorte introuvable.')

  const cohort = cohortSnap.data()
  if (cohort.status !== 'open') throw new Error('Cette cohorte n\'accepte plus de nouveaux membres.')

  // Vérifier que le membre n'est pas déjà inscrit
  const memberRef = doc(db, 'cohorts', cohortId, 'members', memberId)
  const existSnap = await getDoc(memberRef)
  if (existSnap.exists()) throw new Error('Vous êtes déjà inscrit dans cette cohorte.')

  await setDoc(memberRef, {
    memberId,
    memberCode,     // code anonyme
    joinedAt: serverTimestamp(),
    status: 'actif',
    chapsDone: 0,
    daysComplete: 0,
    lastReadingAt: null,
    xpEarned: 0,
  })

  // Incrémenter le compteur de membres
  await updateDoc(doc(db, 'cohorts', cohortId), {
    memberCount: increment(1)
  })

  await logAudit('COHORT_JOIN', 'cohort', cohortId, { memberCode })
  return { success: true }
}

// ── Valider une lecture ───────────────────────────────────────
export const validateReading = async ({
  cohortId,
  memberId,
  memberCode,
  chapsDone,
  minutesSpent,
  date,            // 'YYYY-MM-DD'
}) => {
  // Règle : minimum 5 minutes par chapitre
  const minMinutes = chapsDone * 5
  if (minutesSpent < minMinutes) {
    throw new Error(`Durée insuffisante. Minimum ${minMinutes} minutes pour ${chapsDone} chapitre(s).`)
  }

  return await runTransaction(db, async (tx) => {
    // 1. Enregistrer la lecture
    const readingRef = doc(collection(db, 'readings'))
    tx.set(readingRef, {
      cohortId,
      memberId,
      memberCode,
      date,
      chapsDone,
      minutesSpent,
      validatedAt: serverTimestamp(),
    })

    // 2. Mettre à jour la progression du membre dans la cohorte
    const memberRef = doc(db, 'cohorts', cohortId, 'members', memberId)
    const memberSnap = await tx.get(memberRef)
    const current = memberSnap.data()

    const xpGained = chapsDone * 10  // 10 XP par chapitre
    tx.update(memberRef, {
      chapsDone:     (current.chapsDone || 0) + chapsDone,
      daysComplete:  (current.daysComplete || 0) + 1,
      lastReadingAt: serverTimestamp(),
      xpEarned:      (current.xpEarned || 0) + xpGained,
      status: 'actif',
    })

    // 3. Mettre à jour le profil utilisateur global (XP total)
    const userRef = doc(db, 'users', memberId)
    const userSnap = await tx.get(userRef)
    const totalXP = (userSnap.data()?.xpTotal || 0) + xpGained
    const level   = computeLevel(totalXP)
    tx.update(userRef, { xpTotal: totalXP, level })

    return { readingId: readingRef.id, xpGained, totalXP, level }
  })
}

// ── Calculer le niveau selon XP ──────────────────────────────
export const computeLevel = (xp) => {
  if (xp >= 3000) return 'Responsable'
  if (xp >= 1500) return 'Serviteur'
  if (xp >= 500)  return 'Disciple'
  return 'Lecteur'
}

// ── Enregistrer un résultat de QCM ───────────────────────────
export const saveQuizAttempt = async ({
  cohortId,
  quizId,
  memberId,
  memberCode,
  answers,        // { questionId: selectedAnswer, ... }
  score,          // 0-100
}) => {
  const attemptRef = await addDoc(collection(db, 'quiz_attempts'), {
    cohortId,
    quizId,
    memberId,
    memberCode,
    answers,
    score,
    submittedAt: serverTimestamp(),
  })

  // XP bonus si score >= 70%
  if (score >= 70) {
    const xpBonus = Math.round(score / 10)
    await updateDoc(doc(db, 'users', memberId), {
      xpTotal: increment(xpBonus)
    })
  }

  return { attemptId: attemptRef.id }
}

// ── Progression d'un membre dans sa cohorte ──────────────────
export const getMemberProgress = async (cohortId, memberId) => {
  const snap = await getDoc(doc(db, 'cohorts', cohortId, 'members', memberId))
  if (!snap.exists()) return null
  return snap.data()
}

// ── Écouter le classement de la cohorte (anonymisé) ──────────
// ⚠️ Retourne uniquement memberCode, daysComplete, xpEarned
export const subscribeToCohortRanking = (cohortId, myMemberId, callback) => {
  const q = query(
    collection(db, 'cohorts', cohortId, 'members'),
    orderBy('xpEarned', 'desc')
  )
  return onSnapshot(q, (snap) => {
    const ranking = snap.docs.map((d, index) => {
      const data = d.data()
      const isMe = data.memberId === myMemberId
      return {
        rank:          index + 1,
        // ⚠️ Si ce n'est pas moi → code anonyme uniquement
        displayId:     isMe ? 'Moi' : data.memberCode,
        memberCode:    data.memberCode,
        isMe,
        daysComplete:  data.daysComplete || 0,
        xpEarned:      data.xpEarned || 0,
        chapsDone:     data.chapsDone || 0,
        status:        data.status,
      }
    })
    callback(ranking)
  })
}

// ── Cohortes disponibles (ouvertes) ──────────────────────────
export const getOpenCohorts = async () => {
  const snap = await getDocs(query(
    collection(db, 'cohorts'),
    where('status', '==', 'open'),
    orderBy('startDate', 'asc')
  ))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── Délivrer une certification ────────────────────────────────
export const issueCertification = async (cohortId, memberId, memberCode) => {
  // Vérifier les conditions
  const progress = await getMemberProgress(cohortId, memberId)
  if (!progress) throw new Error('Membre non inscrit dans cette cohorte.')

  const cohortSnap = await getDoc(doc(db, 'cohorts', cohortId))
  const cohort     = cohortSnap.data()

  if (progress.daysComplete < cohort.totalDays) {
    throw new Error(`Lectures incomplètes : ${progress.daysComplete}/${cohort.totalDays} jours.`)
  }

  // Vérifier score moyen QCM >= 70%
  const attemptsSnap = await getDocs(query(
    collection(db, 'quiz_attempts'),
    where('cohortId',   '==', cohortId),
    where('memberId',   '==', memberId)
  ))
  const attempts    = attemptsSnap.docs.map(d => d.data())
  const avgScore    = attempts.reduce((s, a) => s + a.score, 0) / (attempts.length || 1)

  if (avgScore < 70) {
    throw new Error(`Score QCM insuffisant : ${Math.round(avgScore)}% (minimum 70%).`)
  }

  const certRef = await addDoc(collection(db, 'certifications'), {
    cohortId,
    memberId,
    memberCode,
    issuedAt:  serverTimestamp(),
    level:     'Lecteur Certifié',
    avgScore:  Math.round(avgScore),
  })

  await logAudit('CERTIFICATION', 'certification', certRef.id, { memberCode, avgScore })
  return { certificationId: certRef.id, avgScore }
}
