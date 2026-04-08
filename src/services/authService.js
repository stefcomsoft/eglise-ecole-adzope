// src/services/authService.js
// ─────────────────────────────────────────────────────────────
// Gestion de l'authentification Firebase
// ─────────────────────────────────────────────────────────────

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  sendPasswordResetEmail,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from 'firebase/auth'

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'

import { auth, db } from '../firebase'
import { logAudit } from './auditService'

// ── Connexion Email/Mot de passe ──────────────────────────────
export const loginWithEmail = async (email, password) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const profile = await getUserProfile(cred.user.uid)
    await logAudit('LOGIN', 'user', cred.user.uid)
    return { user: cred.user, profile }
  } catch (error) {
    throw translateAuthError(error.code)
  }
}

// ── Inscription d'un nouveau membre ───────────────────────────
// Appelé par l'admin ou le responsable local
export const registerMember = async ({
  email,
  password,
  name,           // stocké chiffré côté admin uniquement
  phone,
  churchId,
  category,       // 'homme' | 'femme' | 'couple' | 'eleve' | 'travailleur'
  role = 'MEMBRE'
}) => {
  try {
    // 1. Créer le compte Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    const uid = cred.user.uid

    // 2. Générer un code anonyme unique (MBR-XXXX)
    const memberCode = await generateMemberCode()

    // 3. Profil public (visible par le membre lui-même)
    await setDoc(doc(db, 'users', uid), {
      uid,
      role,
      churchId,
      category,
      memberCode,       // identifiant anonyme public
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      status: 'actif',
    })

    // 4. Données privées (visible ADMIN/RESPONSABLE uniquement)
    await setDoc(doc(db, 'members', uid), {
      uid,
      memberCode,
      name,             // ⚠️ CONFIDENTIEL — jamais affiché aux membres
      phone,            // ⚠️ CONFIDENTIEL
      email,
      churchId,
      category,
      isActive: true,
      createdAt: serverTimestamp(),
    })

    await logAudit('REGISTER', 'member', uid, { memberCode, churchId })
    return { uid, memberCode }

  } catch (error) {
    throw translateAuthError(error.code)
  }
}

// ── Récupérer le profil utilisateur ───────────────────────────
export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) throw new Error('Profil introuvable')
  return snap.data()
}

// ── Déconnexion ───────────────────────────────────────────────
export const logout = async () => {
  await logAudit('LOGOUT', 'user', auth.currentUser?.uid)
  await signOut(auth)
}

// ── Observer les changements d'état de connexion ──────────────
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await getUserProfile(user.uid)
      // Mettre à jour lastLogin
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp()
      })
      callback({ user, profile })
    } else {
      callback(null)
    }
  })
}

// ── Réinitialisation du mot de passe ─────────────────────────
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email)
}

// ── Générer un code membre unique ─────────────────────────────
const generateMemberCode = async () => {
  // Format : MBR-XXXX (4 chiffres aléatoires, vérifie l'unicité)
  const { getDocs, collection, query, where } = await import('firebase/firestore')
  let code, exists = true
  while (exists) {
    const num = String(Math.floor(1000 + Math.random() * 9000))
    code = `MBR-${num}`
    const q = query(collection(db, 'users'), where('memberCode', '==', code))
    const snap = await getDocs(q)
    exists = !snap.empty
  }
  return code
}

// ── Traduction des erreurs Firebase ───────────────────────────
const translateAuthError = (code) => {
  const messages = {
    'auth/wrong-password':       'Mot de passe incorrect.',
    'auth/user-not-found':       'Aucun compte trouvé avec cet email.',
    'auth/email-already-in-use': 'Cet email est déjà utilisé.',
    'auth/weak-password':        'Le mot de passe doit faire au moins 6 caractères.',
    'auth/too-many-requests':    'Trop de tentatives. Réessayez dans quelques minutes.',
    'auth/network-request-failed': 'Problème de connexion réseau.',
  }
  return new Error(messages[code] || `Erreur d'authentification (${code})`)
}
