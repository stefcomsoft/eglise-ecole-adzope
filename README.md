# Église-École Adzopé — Plateforme Numérique

Écosystème numérique intégré pour le projet régional Adzopé (Côte d'Ivoire).

## 🏗️ Description

Plateforme à double vocation :
- **Financement participatif** d'un complexe scolaire (objectif : 200M FCFA sur 5 ans)
- **Renforcement de la maturité spirituelle** via des cohortes bibliques et un QCM IA

## 📦 Prérequis

- **Node.js** v18 ou supérieur — [télécharger ici](https://nodejs.org/)
- **npm** v9 ou supérieur (inclus avec Node.js)

Vérifier votre installation :
```bash
node --version
npm --version
```

## 🚀 Installation

```bash
# 1. Décompresser le ZIP dans un dossier
# 2. Ouvrir un terminal dans ce dossier

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application s'ouvre automatiquement sur **http://localhost:5173**

## 🖥️ Applications disponibles

### Dashboard Admin (Web)
Interface de gestion pour responsables et comptabilité :
- Tableau de bord régional temps réel
- Gestion des membres (anonymisée pour les membres)
- Suivi campagnes et gaps/compensations
- Cohortes bibliques et gamification
- Gouvernance, RBAC et conformité RGPD
- Communications ciblées

**Profils de démonstration :**
| Rôle | Accès |
|------|-------|
| Konan Emmanuel | Membre — Vue personnelle uniquement |
| Adjoua Marie-Claire | Responsable Local |
| Président Kouassi | Admin Régional — Accès complet |

### Application Mobile (Simulateur)
Interface membre simulée dans un cadre iPhone :
- Cotisations (MTN, Wave, Orange Money)
- Lecture biblique + QCM IA (nécessite clé API Anthropic)
- Cohorte : classement anonymisé, chat
- Suivi chantier en direct
- Simulateur ROI
- Communications (Prière, SOS, Info, Annonce)

## 🔑 Configuration IA (optionnel)

Le module QCM utilise l'API Anthropic Claude. Pour l'activer :

1. Créer un compte sur [anthropic.com](https://www.anthropic.com)
2. Obtenir une clé API
3. Dans l'app mobile, aller sur **Bible → QCM** et saisir votre clé

> Sans clé API, le QCM affiche un message d'information.

## 🔒 Confidentialité & RBAC

Conformément au PRD, les noms des membres sont **anonymisés** dans toutes les vues publiques :
- Les gaps affichent des codes `COMP-2025-XXX`
- Le classement cohorte affiche des identifiants `MBR-XXXX`
- Seule la vue **Comptabilité/Pilotage** (ADMIN) affiche les noms réels

## 📁 Structure du projet

```
eglise-ecole-adzope/
├── src/
│   ├── App.jsx              # Sélecteur d'application (launcher)
│   ├── main.jsx             # Point d'entrée React
│   ├── index.css            # Styles globaux
│   ├── dashboard/
│   │   └── DashboardApp.jsx # Application dashboard admin/membre
│   └── mobile/
│       └── MobileApp.jsx    # Application mobile simulée
├── public/
│   └── favicon.svg
├── index.html
├── package.json
└── vite.config.js
```

## 🛠️ Commandes disponibles

```bash
npm run dev      # Démarrer en mode développement (http://localhost:5173)
npm run build    # Construire pour la production (dossier dist/)
npm run preview  # Prévisualiser le build de production
```

## 📊 Stack technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 18.3 | Framework UI |
| Vite | 5.3 | Bundler & Dev server |
| Recharts | 2.12 | Graphiques & visualisations |
| Anthropic API | claude-sonnet | QCM bibliques IA |

## 🗺️ Roadmap

- **Phase 1 (actuelle)** : Prototype frontend avec données mockées
- **Phase 2** : Backend Firebase/Firestore + Auth
- **Phase 3** : Intégration paiement réel (CinetPay / FedaPay)
- **Phase 4** : App React Native pour iOS/Android
- **Phase 5** : Module coopératives régionales

---

*PROJET THOM • Initiative EduCI • v1.0.0*
