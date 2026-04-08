// src/firebase.js
// ─────────────────────────────────────────────────────────────
// ÉTAPE 1 : Remplacer les valeurs ci-dessous par celles de
//           votre projet Firebase (console.firebase.google.com)
//           Projet → Paramètres → Vos applications → SDK Config
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

const firebaseConfig = {
  apiKey:            "REMPLACER_PAR_VOTRE_API_KEY",
  authDomain:        "eglise-ecole-adzope.firebaseapp.com",
  projectId:         "eglise-ecole-adzope",
  storageBucket:     "eglise-ecole-adzope.appspot.com",
  messagingSenderId: "REMPLACER_PAR_VOTRE_SENDER_ID",
  appId:             "REMPLACER_PAR_VOTRE_APP_ID",
}

// Initialisation Firebase
const app = initializeApp(firebaseConfig)

// Services exportés
export const db   = getFirestore(app)
export const auth = getAuth(app)

// ─── Mode développement local (émulateur) ───────────────────
// Décommentez ces lignes si vous utilisez Firebase Emulator Suite
// if (import.meta.env.DEV) {
//   connectFirestoreEmulator(db, 'localhost', 8080)
//   connectAuthEmulator(auth, 'http://localhost:9099')
// }

export default app
