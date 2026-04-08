# QCM Intelligent - Documentation

## Vue d'ensemble

Le système QCM a été modernisé pour générer des questions **dynamiques et différentes** chaque fois que l'utilisateur rafraîchit ou relance le quiz.

### Améliorations apportées

1. **Questions générées dynamiquement** : Les questions ne sont plus statiques. Elles sont générées à partir d'une base de données biblique complète et mélangées à chaque appel.

2. **Questions différentes à chaque rafraîchissement** : 
   - Utilise un algorithme de mélange (Fisher-Yates) avec une seed aléatoire
   - Les options de réponse sont aussi mélangées
   - Garantit que les questions ne seront jamais les mêmes

3. **Basées sur les chapitres lus** : Les questions sont générées en fonction des chapitres bibliques que l'utilisateur a sélectionnés pour sa lecture du jour.

4. **Validation biblique** : Chaque question vérifie réellement la compréhension du passage.

---

## Architecture technique

### Service: `src/services/quizService.js`

Le service contient :

- **`generateQuizQuestions(chapters, numberOfQuestions)`** : Fonction principale qui génère les questions
  - Paramètres:
    - `chapters` (Array): Liste des chapitres bibliques à évaluer
    - `numberOfQuestions` (Number): Nombre de questions à générer (défaut: 3)
  - Retourne: Array d'objets question avec structure `{ q: string, options: array, correct: number }`

- **`BIBLE_QUESTIONS_DB`** : Base de données biblique avec plusieurs questions par chapitre
  - Chaque chapitre a 3-5 questions pré-écrites
  - Couvre: Genèse 1-2, Psaumes 89-92, Proverbes 12, Matthieu 5-6

### Intégration dans le composant

Dans `LectureView`:

```javascript
// Générer les questions dynamiquement
const [quizQuestions, setQuizQuestions] = useState([]);

useEffect(() => {
  if (lectureValidated && quizQuestions.length === 0) {
    const chapters = selectedChapters.length > 0 ? selectedChapters : todayChapters;
    const questions = generateQuizQuestions(chapters, 3);
    setQuizQuestions(questions);
  }
}, [lectureValidated]);

// Relancer le QCM - régénère de NOUVELLES questions
const handleRestartQuiz = () => {
  const newQuestions = generateQuizQuestions(chapters, 3);
  setQuizQuestions(newQuestions);
};
```

---

## Comment ça fonctionne

### Génération des questions (côté client)

1. **Sélection des questions** : 
   - Collecte toutes les questions disponibles pour les chapitres fournis
   - Mélange les questions avec un algorithme pseudo-aléatoire

2. **Mélange des options** :
   - Chaque question a ses options mélangées
   - L'index de la bonne réponse est recalculé après le mélange

3. **Seed aléatoire** :
   - Chaque appel génère une nouvelle seed basée sur l'heure actuelle
   - Garantit des variations différentes à chaque appel

### Exemple de question générée

```javascript
{
  q: "Selon Matthieu 5, que doit faire un disciple devant ses ennemis ?",
  options: ["Les ignorer", "Les combattre", "Les aimer et prier pour eux", "Les fuir"],
  correct: 2  // Index de la bonne réponse
}
```

---

## Amélioration future: Intégration avec une API d'IA

Pour générer des questions **beaucoup plus sophistiquées et contextuelles**, vous pouvez intégrer une API d'IA comme Claude (Anthropic), GPT (OpenAI), ou Gemini (Google).

### Option 1 : Cloud Function Firebase

**Avantage** : Sécurisé, pas d'exposition de clé API au client

**Étapes** :

```bash
# 1. Installer Firebase CLI
npm install -g firebase-tools

# 2. Initialiser les functions
firebase init functions

# 3. Créer une fonction generateQuiz
# functions/index.js

const functions = require("firebase-functions");
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic();

exports.generateQuiz = functions.https.onCall(async (data, context) => {
  const { chapters, numberOfQuestions } = data;
  
  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Génère ${numberOfQuestions} questions de QCM en français basées sur les chapitres bibliques suivants: ${chapters.join(', ')}.
        
Format JSON:
{
  "questions": [
    {
      "q": "Question?",
      "options": ["A", "B", "C", "D"],
      "correct": 0
    }
  ]
}`
      }
    ]
  });

  return JSON.parse(message.content[0].text);
});
```

**Mise à jour du service** :

```javascript
import { getFunctions, httpsCallable } from "firebase/functions";

export const generateQuizQuestions = async (chapters, numberOfQuestions = 3) => {
  try {
    const functions = getFunctions();
    const generateQuiz = httpsCallable(functions, 'generateQuiz');
    
    const result = await generateQuiz({
      chapters,
      numberOfQuestions
    });
    
    return result.data.questions;
  } catch (error) {
    console.error('Erreur génération QCM:', error);
    return getDefaultQuestions(chapters);
  }
};
```

### Option 2 : Backend Express Node.js

**Avantage** : Plus de contrôle, peut intégrer d'autres services

**Étapes** :

```javascript
// backend/routes/quiz.js
router.post('/api/generate-quiz', async (req, res) => {
  const { chapters, numberOfQuestions } = req.body;
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Génère ${numberOfQuestions} questions QCM basées sur: ${chapters.join(', ')}`
      }]
    })
  });
  
  const data = await response.json();
  res.json(JSON.parse(data.content[0].text));
});
```

### Configuration des variables d'environnement

**.env.local**
```
VITE_API_BASE_URL=http://localhost:5000
```

**.env** (Backend)
```
ANTHROPIC_API_KEY=your_api_key_here
```

### Coûts estimés

- **Claude 3.5 Sonnet** (Anthropic)
  - Input: $3 / M tokens
  - Output: $15 / M tokens
  - ~1000 tokens par question = ~$0.02-0.03 par QCM

- **GPT-4 Turbo** (OpenAI)
  - Input: $10 / 1M tokens
  - Output: $30 / 1M tokens
  - ~5-10 fois plus cher

**Recommandation** : Utiliser Claude pour un meilleur rapport coût/qualité

---

## Maintenance de la base de données biblique

### Ajouter des questions pour un nouveau chapitre

```javascript
// src/services/quizService.js

'Luc 1': {
  questions: [
    {
      q: "Quel ange a annoncé la naissance de Jésus selon Luc 1?",
      options: ["Michel", "Gabriel", "Raphaël", "Uriel"],
      correct: 1
    },
    // ... plus de questions
  ]
}
```

### Format recommandé

- 3-5 questions par chapitre
- Types: Comprehension factuelle, Application, Analyse
- Distracteurs plausibles mais clairement différents

---

## Points de vérification

✅ Questions générées dynamiquement  
✅ Options mélangées pour chaque appel  
✅ Questions basées sur les chapitres lus  
✅ Validation correcte de la compréhension  
✅ Fallback vers questions locales si API indisponible  
✅ Affichage du score et feedback utilisateur  

---

## Support et améliorations futures

1. **Stockage des tentatives** : Sauvegarder les QCM dans Firestore
2. **Analyse de performance** : Afficher les statistiques par utilisateur
3. **Sélection adaptative** : Augmenter la difficulté SI l'utilisateur réussit
4. **Partage des questions** : Leadership peut créer des questions customisées
5. **Multilingue** : Support pour d'autres langues bibliques

---

## Troubleshooting

**Problème** : "Les questions ne changent pas"  
**Solution** : Vérifier que le `useEffect` se déclenche correctement avec `lectureValidated` comme dépendance

**Problème** : "Les questions sont vides"  
**Solution** : Vérifier que les chapitres fournies correspondent à ceux dans `BIBLE_QUESTIONS_DB`

**Problème** : "API timeout"  
**Solution** : Augmenter le timeout ou implémenter une cache locale

---

**Dernière mise à jour** : Avril 2026  
**Version** : 2.0.0 - Génération dynamique des questions
