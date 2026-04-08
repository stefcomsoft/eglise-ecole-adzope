// scripts/seedFirestore.js
// ─────────────────────────────────────────────────────────────
// Script de peuplement initial de Firestore
// Exécuter UNE SEULE FOIS après avoir créé le projet Firebase
//
// Usage dans le terminal VS Code :
//   node scripts/seedFirestore.js
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore'

// ⚠️ Remplacez par votre config Firebase
const firebaseConfig = {
  apiKey:            "VOTRE_API_KEY",
  authDomain:        "eglise-ecole-adzope.firebaseapp.com",
  projectId:         "eglise-ecole-adzope",
  storageBucket:     "eglise-ecole-adzope.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId:             "VOTRE_APP_ID",
}

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)

async function seed() {
  console.log('🌱 Début du peuplement Firestore...\n')

  // ── 1. CAMPAGNE 2025 ────────────────────────────────────────
  await setDoc(doc(db, 'campaigns', 'campaign-2025'), {
    year:          2025,
    targetAmount:  200_000_000,
    collected:      87_450_000,
    memberShare:    50_000,
    minPayment:     500,
    startDate:     Timestamp.fromDate(new Date('2025-01-01')),
    endDate:       Timestamp.fromDate(new Date('2025-12-31')),
    status:        'active',
    createdAt:     Timestamp.now(),
  })
  console.log('✅ Campagne 2025 créée')

  // ── 2. ÉGLISES ──────────────────────────────────────────────
  const churches = [
    { id: 'church-adzope-centre',    name: 'Adzopé Centre',       region: 'Adzopé', memberCount: 412 },
    { id: 'church-abengourou-est',   name: 'Abengourou Est',      region: 'Adzopé', memberCount: 389 },
    { id: 'church-daoukro',          name: 'Daoukro',             region: 'Adzopé', memberCount: 334 },
    { id: 'church-mbatto',           name: "M'Batto",             region: 'Adzopé', memberCount: 287 },
    { id: 'church-yakasse',          name: 'Yakassé-Attobrou',    region: 'Adzopé', memberCount: 201 },
    { id: 'church-agnibilekrou',     name: 'Agnibilékrou',        region: 'Adzopé', memberCount: 126 },
  ]
  for (const church of churches) {
    await setDoc(doc(db, 'churches', church.id), {
      name:        church.name,
      region:      church.region,
      memberCount: church.memberCount,
      createdAt:   Timestamp.now(),
    })
  }
  console.log(`✅ ${churches.length} églises créées`)

  // ── 3. COHORTE BIBLIQUE ─────────────────────────────────────
  await setDoc(doc(db, 'cohorts', 'cohort-jan-2025'), {
    name:        'Cohorte Janvier 2025',
    planName:    'Bible complète — 6 mois',
    totalDays:   180,
    chapPerDay:  7,
    totalChaps:  1189,
    startDate:   Timestamp.fromDate(new Date('2025-01-07')),
    endDate:     Timestamp.fromDate(new Date('2025-07-07')),
    status:      'open',
    memberCount: 147,
    churchId:    'church-adzope-centre',
    createdAt:   Timestamp.now(),
  })
  console.log('✅ Cohorte Janvier 2025 créée')

  // ── 4. VERSET DE LA SEMAINE ─────────────────────────────────
  await setDoc(doc(db, 'verses', 'verse-current'), {
    reference: 'Jérémie 29:11',
    text:      "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance.",
    weekStart: Timestamp.fromDate(new Date('2025-03-03')),
    language:  'fr',
  })
  console.log('✅ Verset de la semaine créé')

  // ── 5. PLANS DE LECTURE ─────────────────────────────────────
  await setDoc(doc(db, 'reading_plans', 'plan-bible-6mois'), {
    name:         'Bible complète — 6 mois',
    durationDays: 180,
    chapPerDay:   7,
    description:  'Lecture intégrale de la Bible en 180 jours, environ 7 chapitres par jour.',
    createdAt:    Timestamp.now(),
  })
  console.log('✅ Plan de lecture créé')

  // ── 6. DONNÉES DE DÉMO MEMBRES (3 comptes test) ─────────────
  // ⚠️ Ces comptes Firebase Auth doivent être créés manuellement
  //    dans la console Firebase → Authentication → Add user
  //    Puis remplacer les UIDs ci-dessous par les vrais UIDs

  const demoMembers = [
    {
      uid:        'UID_MEMBRE_A_REMPLACER',
      memberCode: 'MBR-0001',
      role:       'MEMBRE',
      churchId:   'church-adzope-centre',
      category:   'travailleur',
      xpTotal:    870,
      level:      'Disciple',
    },
    {
      uid:        'UID_RESPONSABLE_A_REMPLACER',
      memberCode: 'MBR-0002',
      role:       'RESPONSABLE_LOCAL',
      churchId:   'church-adzope-centre',
      category:   'femme',
      xpTotal:    1200,
      level:      'Disciple',
    },
    {
      uid:        'UID_ADMIN_A_REMPLACER',
      memberCode: 'MBR-0003',
      role:       'ADMIN',
      churchId:   'church-adzope-centre',
      category:   'homme',
      xpTotal:    3500,
      level:      'Responsable',
    },
  ]

  console.log('\n⚠️  Membres de démo : remplacez les UIDs dans le script')
  console.log('   Firebase Console → Authentication → copier les UIDs')
  console.log('   Puis relancez : node scripts/seedFirestore.js\n')

  // Allocations de démo (campagne 2025)
  await setDoc(doc(db, 'allocations', 'alloc-demo-membre'), {
    memberId:        'UID_MEMBRE_A_REMPLACER',
    memberCode:      'MBR-0001',
    campaignId:      'campaign-2025',
    allocatedAmount:  50_000,
    paidAmount:       32_000,
    status:          'en_cours',
    createdAt:       Timestamp.now(),
  })
  console.log('✅ Allocation de démo créée (32 000 / 50 000 FCFA)')

  console.log('\n🎉 Peuplement terminé !')
  console.log('   → Ouvrez la console Firebase pour vérifier les données')
  console.log('   → https://console.firebase.google.com\n')

  process.exit(0)
}

seed().catch(e => {
  console.error('❌ Erreur :', e.message)
  process.exit(1)
})
