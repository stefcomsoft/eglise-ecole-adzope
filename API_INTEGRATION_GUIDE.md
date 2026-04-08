# Guide d'intégration API d'IA - QCM Intelligent

Cet espace contient la base du code pour intégrer une API d'IA externe et générer des questions encore plus sophistiquées.

## 🔑 Options d'API recommandées

### 1. **Claude (Anthropic)** ⭐ Recommandé
- **Qualité** : Excellente
- **Coût** : $3-15 per 1M tokens (moins cher)
- **Modèle** : `claude-3-5-sonnet-20241022`

### 2. **ChatGPT (OpenAI)**
- **Qualité** : Très bonne
- **Coût** : $10-30 per 1M tokens (plus cher)
- **Modèle** : `gpt-4-turbo`

### 3. **Gemini (Google)**
- **Qualité** : Très bonne
- **Coût** : Gratuit jusqu'à 15 RPM (appels par minute)
- **Modèle** : `gemini-1.5-pro`

---

## Step 1: Configuration Firebase Cloud Functions

### A. Installer les dépendances

```bash
cd functions
npm install @anthropic-ai/sdk
```

### B. Créer la fonction Cloud

**`functions/index.js`** :

```javascript
const functions = require("firebase-functions");
const Anthropic = require("@anthropic-ai/sdk");

// Initialiser le client Anthropic
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Fonction générer QCM avec Anthropic
exports.generateQuiz = functions.https.onCall(async (data, context) => {
  try {
    const { chapters, numberOfQuestions = 3 } = data;

    // Valider l'authentification (optionnel mais recommandé)
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "L'utilisateur doit être authentifié"
      );
    }

    // Créer le prompt
    const prompt = `Tu es un expert biblique. Génère exactement ${numberOfQuestions} questions de QCM en français qui testent la compréhension des passages bibliques suivants:

${chapters
  .map((c) => `- ${c}`)
  .join("\n")}

IMPORTANT:
- Chaque question doit tester une compréhension SPÉCIFIQUE du passage
- Les options doivent être plausibles mais clairement différentes
- Format STRICT en JSON (pas de markdown):

{
  "questions": [
    {
      "q": "Question 1?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    },
    {
      "q": "Question 2?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 1
    }
  ]
}

Ne retourne QUE le JSON, rien d'autre.`;

    // Appeler l'API Anthropic
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Parser la réponse
    const responseText = message.content[0].text;
    console.log("Response from Claude:", responseText);

    // Essayer de parser le JSON
    let questionsData;
    try {
      questionsData = JSON.parse(responseText);
    } catch (parseError) {
      // Si le JSON n'est pas valide, essayer de l'extraire avec regex
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        questionsData = JSON.parse(jsonMatch[0]);
      } else {
        throw new functions.https.HttpsError(
          "internal",
          "Impossible de parser la réponse API"
        );
      }
    }

    return {
      questions: questionsData.questions || [],
      timestamp: new Date().toISOString(),
      chapters: chapters,
    };
  } catch (error) {
    console.error("Erreur dans generateQuiz:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "Erreur lors de la génération du QCM"
    );
  }
});

// Alternative: Fonction pour OpenAI / ChatGPT
exports.generateQuizGPT = functions.https.onCall(async (data, context) => {
  const { Configuration, OpenAIApi } = await import("openai");

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const { chapters, numberOfQuestions = 3 } = data;

  const response = await openai.createChatCompletion({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          "Tu es un expert biblique qui génère des QCM de compréhension.",
      },
      {
        role: "user",
        content: `Génère ${numberOfQuestions} questions QCM pour: ${chapters.join(", ")}. Retourne UNIQUEMENT du JSON valide.`,
      },
    ],
    temperature: 0.7,
  });

  return JSON.parse(response.data.choices[0].message.content);
});
```

### C. Configurer les variables d'environnement

**`functions/.env`** ou **`firebase.json`** :

```json
{
  "functions": {
    "env": ["ANTHROPIC_API_KEY"]
  }
}
```

**`.env.local`** (local testing) :

```
ANTHROPIC_API_KEY=sk-ant-...
```

### D. Déployer

```bash
firebase deploy --only functions
```

---

## Step 2: Mettre à jour quizService.js

Remplacer la fonction `generateQuizQuestions` pour utiliser l'API :

**`src/services/quizService.js`** :

```javascript
import { getFunctions, httpsCallable } from "firebase/functions";
import { getDefaultQuestionsForChapters } from "./quizServiceLocal";

export const generateQuizQuestions = async (chapters, numberOfQuestions = 3) => {
  try {
    // Essayer la version API d'abord
    const functions = getFunctions();
    const generateQuizFunction = httpsCallable(functions, "generateQuiz");

    const result = await generateQuizFunction({
      chapters: chapters,
      numberOfQuestions: numberOfQuestions,
    });

    return result.data.questions;
  } catch (error) {
    console.warn("API indisponible, utilisant base de données locale", error);
    // Fallback vers la génération locale
    return getDefaultQuestionsForChapters(chapters, numberOfQuestions);
  }
};
```

---

## Step 3: Configuration Anthropic

### Obtenir une clé API

1. Aller à https://console.anthropic.com/
2. Sign up ou log in
3. Créer une clé API dans "Account Settings"
4. Copier la clé `sk-ant-...`

### Ajouter le crédit

- Les nouveaux comptes reçoivent $5 de crédit gratuit pour 3 mois
- Coût moyen: ~$0.02-0.05 par QCM généré
- 1000 QCM par mois = ~$20-50

---

## Step 4: Tester localement

```bash
# Installer Firebase Emulator
npm install -g firebase-tools

# Démarrer l'émulateur
firebase emulators:start

# Tester avec cURL
curl -X POST http://localhost:5001/eglise-ecole-adzope/us-central1/generateQuiz \
  -H "Content-Type: application/json" \
  -d '{"data": {"chapters": ["Genèse 1", "Genèse 2"], "numberOfQuestions": 2}}'
```

---

## Alternative: Backend Express.js

Si vous préférez un serveur Node.js classique :

**`backend/server.js`** :

```javascript
const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
require("dotenv").config();

const app = express();
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { chapters, numberOfQuestions = 3 } = req.body;

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Génère ${numberOfQuestions} questions QCM pour: ${chapters.join(", ")}. JSON seulement.`,
        },
      ],
    });

    const data = JSON.parse(message.content[0].text);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server on port 5000"));
```

---

## Pratiques recommandées

### 1. Rate limiting
```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests par minute
});

app.post("/api/generate-quiz", limiter, async (req, res) => {
  // ...
});
```

### 2. Caching
```javascript
const Cache = require("node-cache");
const cache = new Cache({ stdTTL: 600 }); // 10 minutes

const cacheKey = chapters.sort().join("|");
if (cache.has(cacheKey)) {
  return res.json(cache.get(cacheKey));
}

// Generate and cache
const result = await generateQuiz(chapters);
cache.set(cacheKey, result);
res.json(result);
```

### 3. Logging
```javascript
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "quiz-api.log" }),
  ],
});

logger.info("Generating quiz for:", { chapters, numberOfQuestions });
```

---

## Monitoring et Analytics

### Firestore Rules
```javascript
match /quiz_attempts/{document=**} {
  allow create: if request.auth != null;
  allow read, write: if request.auth.uid == resource.data.userId;
}
```

### Tableau de bord usage
```javascript
// Firestore query
const quizAttempts = await firebase
  .firestore()
  .collection("quiz_attempts")
  .where("createdAt", ">=", new Date(Date.now() - 30 * 86400000))
  .get();

const costEstimate = quizAttempts.size * 0.03; // $0.03 par quiz
console.log(`Usage: ${quizAttempts.size} QCM generés, coût: $${costEstimate}`);
```

---

## Troubleshooting

| Problème | Solution |
|----------|----------|
| "API Key invalid" | Vérifier que la clé commence par `sk-ant-` |
| "Rate limit exceeded" | Implémenter le rate limiting ou attendre |
| "Invalid JSON response" | Ajouter une regex pour extraire le JSON valide |
| "Timeout" | Augmenter `max_tokens` ou réduire `numberOfQuestions` |
| "Cost too high" | Utiliser Gemini gratuit ou cache plus agressif |

---

## Coûts mensuels estimés

| Volume | Claude | ChatGPT | Gemini |
|--------|--------|---------|--------|
| 100 QCM | $3 | $10 | Gratuit * |
| 500 QCM | $15 | $50 | Gratuit * |
| 1000 QCM | $30 | $100 | ~$5 ** |

*Limité à 15 appels par minute  
**Après dépassement du quota gratuit

---

**Recommandation finale** : Commencer avec la génération locale, puis passer à Claude une fois que vous avez plus de 500 utilisateurs actifs.
