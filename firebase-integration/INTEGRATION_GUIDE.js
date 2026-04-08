// ─────────────────────────────────────────────────────────────
// GUIDE D'INTÉGRATION FIREBASE
// Comment brancher ces fichiers dans votre projet existant
// ─────────────────────────────────────────────────────────────

/*
ÉTAPE 1 — Copier les fichiers dans votre projet VS Code
════════════════════════════════════════════════════════

Structure à obtenir dans votre projet :

eglise-ecole-adzope/
├── src/
│   ├── firebase.js                   ← NOUVEAU
│   ├── contexts/
│   │   └── AuthContext.jsx           ← NOUVEAU
│   ├── services/
│   │   ├── authService.js            ← NOUVEAU
│   │   ├── campaignService.js        ← NOUVEAU
│   │   ├── gapService.js             ← NOUVEAU
│   │   ├── bibleService.js           ← NOUVEAU
│   │   └── auditService.js           ← NOUVEAU
│   ├── hooks/
│   │   └── useFirestore.js           ← NOUVEAU
│   ├── App.jsx                       ← MODIFIER (voir ci-dessous)
│   ├── main.jsx                      ← MODIFIER (voir ci-dessous)
│   └── ...
└── scripts/
    └── seedFirestore.js              ← NOUVEAU


ÉTAPE 2 — Installer Firebase
════════════════════════════════════════════════════════

Dans le terminal VS Code (Ctrl+`) :

  npm install firebase


ÉTAPE 3 — Créer votre projet Firebase
════════════════════════════════════════════════════════

1. Aller sur https://console.firebase.google.com
2. Cliquer "Ajouter un projet" → nommer : eglise-ecole-adzope
3. Désactiver Google Analytics (optionnel)
4. Cliquer "Créer le projet"

5. Activer Firestore :
   → Build → Firestore Database → Créer une base de données
   → Choisir "Mode production"
   → Choisir la région : eur3 (Europe) ou nam5 (USA)

6. Activer Authentication :
   → Build → Authentication → Commencer
   → Activer "Email/Mot de passe"

7. Récupérer la config :
   → Paramètres du projet (⚙️) → Vos applications → Ajouter une app Web
   → Copier l'objet firebaseConfig


ÉTAPE 4 — Remplir src/firebase.js
════════════════════════════════════════════════════════

Remplacer les valeurs dans src/firebase.js par votre config :

  const firebaseConfig = {
    apiKey:            "AIzaSy...",
    authDomain:        "eglise-ecole-adzope.firebaseapp.com",
    projectId:         "eglise-ecole-adzope",
    storageBucket:     "eglise-ecole-adzope.appspot.com",
    messagingSenderId: "123456789",
    appId:             "1:123456789:web:abc123",
  }


ÉTAPE 5 — Modifier src/main.jsx
════════════════════════════════════════════════════════

Remplacer le contenu par :

  import React from 'react'
  import ReactDOM from 'react-dom/client'
  import App from './App.jsx'
  import { AuthProvider } from './contexts/AuthContext.jsx'
  import './index.css'

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>,
  )


ÉTAPE 6 — Exemple d'utilisation dans DashboardApp.jsx
════════════════════════════════════════════════════════

En haut du fichier, importer les hooks :

  import { useAuth } from '@/contexts/AuthContext'
  import {
    useCurrentCampaign,
    useMyAllocation,
    useMyPayments,
    useListedGaps,
  } from '@/hooks/useFirestore'

Puis dans le composant MemberDashboard, remplacer les données mock :

  // AVANT (données mock) :
  const p = pct(user.paid, user.total)
  const reste = user.total - user.paid

  // APRÈS (données réelles Firebase) :
  const { user: authUser, memberCode } = useAuth()
  const { campaign } = useCurrentCampaign()
  const { allocation } = useMyAllocation(campaign?.id)
  const { payments }   = useMyPayments(campaign?.id)

  const paid  = allocation?.paidAmount  || 0
  const total = allocation?.allocatedAmount || 50000
  const reste = total - paid
  const p     = pct(paid, total)

Dans GapsView, remplacer GAPS mock :

  // AVANT :
  const listedGaps = GAPS.filter(g => g.listed)

  // APRÈS :
  const { campaign }   = useCurrentCampaign()
  const { gaps: listedGaps } = useListedGaps(campaign?.id)


ÉTAPE 7 — Déployer les règles de sécurité
════════════════════════════════════════════════════════

Dans la console Firebase :
  → Firestore → Règles
  → Copier-coller le contenu de firestore.rules
  → Cliquer "Publier"


ÉTAPE 8 — Peupler la base avec les données initiales
════════════════════════════════════════════════════════

  node scripts/seedFirestore.js


ÉTAPE 9 — Créer les comptes de test
════════════════════════════════════════════════════════

Dans Firebase Console :
  → Authentication → Utilisateurs → Ajouter un utilisateur

  Membre :       membre@eglise-adzope.ci  / motdepasse123
  Responsable :  responsable@eglise-adzope.ci / motdepasse123
  Admin :        admin@eglise-adzope.ci   / motdepasse123

Copier les UIDs générés et les mettre dans seedFirestore.js,
puis relancer le script.


RÉSUMÉ DES COMMANDES
════════════════════════════════════════════════════════

  npm install firebase      ← installer Firebase
  npm run dev               ← tester en local
  node scripts/seedFirestore.js  ← peupler la base
  npm run build             ← construire pour production
  git add . && git commit -m "feat: intégration Firebase" && git push

*/

export {}  // Fichier de documentation uniquement
