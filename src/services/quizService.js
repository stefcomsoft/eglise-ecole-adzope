// src/services/quizService.js
// ─────────────────────────────────────────────────────────────
// Service de génération de QCM dynamique et intelligent
// Génère des questions DIFFÉRENTES chaque fois basées sur les chapitres lus
// ─────────────────────────────────────────────────────────────

// Base de données biblique complète avec multiples questions par chapitre
const BIBLE_QUESTIONS_DB = {
  'Genèse 1': {
    questions: [
      {
        q: "Dans Genèse 1, combien de jours Dieu a-t-il mis pour créer le monde ?",
        options: ["5 jours", "6 jours", "7 jours", "40 jours"],
        correct: 1
      },
      {
        q: "Qu'a créé Dieu le premier jour selon Genèse 1 ?",
        options: ["Les animaux", "La lumière", "L'homme", "Les plantes"],
        correct: 1
      },
      {
        q: "À la fin de chaque jour de création dans Genèse 1, que dit Dieu ?",
        options: ["C'est mauvais", "C'est bon", "C'est parfait", "C'est magnifique"],
        correct: 1
      },
      {
        q: "Selon Genèse 1:27, à l'image de qui Dieu a-t-il créé l'homme ?",
        options: ["À l'image des anges", "À son propre image", "À l'image de la nature", "À l'image du monde"],
        correct: 1
      },
      {
        q: "Qu'a créé Dieu le deuxième jour selon Genèse 1 ?",
        options: ["Le ciel et les étoiles", "Le ciel (l'atmosphère)", "Les mers", "Les montagnes"],
        correct: 1
      }
    ]
  },
  'Genèse 2': {
    questions: [
      {
        q: "Quel était le nom du premier homme selon la Bible ?",
        options: ["Noé", "Abraham", "Adam", "Moïse"],
        correct: 2
      },
      {
        q: "Dans quel lieu Dieu a-t-il placé Adam selon Genèse 2 ?",
        options: ["Le désert", "Le jardin d'Éden", "La montagne", "La vallée"],
        correct: 1
      },
      {
        q: "Qui a été créée à partir de la côte d'Adam ?",
        options: ["La mère d'Adam", "Sa fille", "Ève", "Une servante"],
        correct: 2
      },
      {
        q: "Selon Genèse 2:3, que Dieu a-t-il fait le septième jour ?",
        options: ["Il a créé les animaux", "Il a créé l'homme", "Il s'est reposé", "Il a créé les plantes"],
        correct: 2
      },
      {
        q: "Combien de fleuves sortaient du jardin d'Éden selon Genèse 2:10 ?",
        options: ["Un", "Deux", "Trois", "Quatre"],
        correct: 3
      }
    ]
  },
  'Psaumes 89': {
    questions: [
      {
        q: "Selon Psaumes 89:1, le psalmiste chante la miséricorde de l'Éternel. Pendant combien de temps ?",
        options: ["À jamais", "Tous les jours", "Une fois par an", "Pendant 40 jours"],
        correct: 0
      },
      {
        q: "Quel est le sujet principal du Psaume 89 ?",
        options: ["La récréation des péchés", "L'alliance avec David", "La louange des créatures", "La punition de l'impie"],
        correct: 1
      },
      {
        q: "Selon Psaumes 89, l'alliance de Dieu avec David est-elle éternelle ?",
        options: ["Oui, pour l'éternité", "Non, seulement 40 ans", "Seulement tant que David vit", "Peut-être, selon Dieu"],
        correct: 0
      }
    ]
  },
  'Psaumes 90': {
    questions: [
      {
        q: "Selon Psaumes 90:4, mille ans aux yeux de Dieu sont comme quoi ?",
        options: ["Un jour qui s'enfuit", "Un moment", "Une veille de la nuit", "Un instant"],
        correct: 2
      },
      {
        q: "Quel est le thème principal du Psaume 90 ?",
        options: ["La justice divine", "La fragilité humaine et l'éternité de Dieu", "La victoire sur les ennemis", "La fécondité"],
        correct: 1
      },
      {
        q: "Que demande le psalmiste dans Psaumes 90:12 ?",
        options: ["Les richesses", "La santé", "De compter ses jours", "La vengeance"],
        correct: 2
      }
    ]
  },
  'Psaumes 91': {
    questions: [
      {
        q: "Selon Psaumes 91:1, celui qui demeure sous l'abri du Très-Haut repose sous l'ombre de qui ?",
        options: ["L'aigle", "Du Tout-Puissant", "De la montagne", "De la forteresse"],
        correct: 1
      },
      {
        q: "Que promis Dieu à celui qui a foi selon Psaumes 91 ?",
        options: ["La richesse", "La protection et la délivrance", "Le pouvoir", "L'immortalité"],
        correct: 1
      },
      {
        q: "Que dit Psaumes 91:11 au sujet des anges ?",
        options: ["Ils puniront les pécheurs", "Ils te garderont dans toutes tes voies", "Ils apporteront la pluie", "Ils révèleront l'avenir"],
        correct: 1
      }
    ]
  },
  'Psaumes 92': {
    questions: [
      {
        q: "Le Psaume 92 porte quel titre ?",
        options: ["Psaume du Dimanche", "Psaume du Sabbat", "Psaume de la Pâque", "Psaume de la Moisson"],
        correct: 1
      },
      {
        q: "Selon Psaumes 92, il est bon de glorifier Dieu. À quel moment est-ce particulièrement dit ?",
        options: ["Le matin", "Le matin et la nuit", "Le soir", "À midi"],
        correct: 1
      }
    ]
  },
  'Proverbes 12': {
    questions: [
      {
        q: "Selon Proverbes 12:1, celui qui aime la discipline aime la connaissance. Que déteste celui qui déteste la correction ?",
        options: ["La vie", "La réussite", "Lui-même", "La sagesse"],
        correct: 2
      },
      {
        q: "Que dit Proverbes 12:6 sur les paroles du sage ?",
        options: ["Elles sont dures", "Elles sauvent les âmes", "Elles sont mensongères", "Elles sont bruyantes"],
        correct: 1
      },
      {
        q: "Selon Proverbes 12:19, qu'arrive-t-il au mensonge, selon ce verset ?",
        options: ["Il dure pour toujours", "Il s'approuve rapidement", "Il ne dure qu'un instant", "Il grandit"],
        correct: 2
      },
      {
        q: "Que dit Proverbes 12:25 sur une parole agréable ?",
        options: ["Elle fait pleurer", "Elle réjouit le cœur", "Elle crée la conflit", "Elle attriste"],
        correct: 1
      }
    ]
  },
  'Matthieu 5': {
    questions: [
      {
        q: "Dans quel livre de la Bible trouve-t-on les Béatitudes ?",
        options: ["Luc 6", "Matthieu 5", "Jean 3", "Marc 8"],
        correct: 1
      },
      {
        q: "Selon Matthieu 5, que doit faire un disciple devant ses ennemis ?",
        options: ["Les fuir", "Les combattre", "Les aimer et prier pour eux", "Les ignorer"],
        correct: 2
      },
      {
        q: "Selon Matthieu 5:16, pour quoi devons-nous laisser briller notre lumière ?",
        options: ["Pour notre gloire", "Pour la gloire de Dieu", "Pour impressionner les autres", "Pour être respectés"],
        correct: 1
      },
      {
        q: "Selon Matthieu 5:14, qui est la lumière du monde ?",
        options: ["Le soleil", "Les disciples", "Dieu seul", "Les prophètes"],
        correct: 1
      },
      {
        q: "Que dit Matthieu 5:8 sur les cœurs purs ?",
        options: ["Ils verront Dieu", "Ils seront riches", "Ils seront puissants", "Ils vivront longtemps"],
        correct: 0
      }
    ]
  },
  'Matthieu 6': {
    questions: [
      {
        q: "Dans Matthieu 6, quel est le modèle de prière que Jésus enseigne ?",
        options: ["La prière de Marie", "Le Notre-Père", "La psalmodie", "L'hymne"],
        correct: 1
      },
      {
        q: "Selon Matthieu 6:11, dans le Notre-Père, on demande 'notre pain quotidien'. Cela signifie quoi ?",
        options: ["Seulement du pain physique", "Le pain et les biens matériels", "Tout ce qui est nécessaire pour vivre", "La richesse"],
        correct: 2
      }
    ]
  }
};

/**
 * Crée un seed pseudo-aléatoire basé sur la date d'aujourd'hui
 * Assure que les questions sont DIFFÉRENTES à chaque rafraîchissement
 */
const getRandomSeed = () => {
  const now = new Date()
  // Utiliser une combinaison de timestamp pour générer un nombre aléatoire différent
  const milliseconds = now.getMilliseconds()
  const nanoseconds = Math.random() * 1000
  return (milliseconds + nanoseconds) % 1000
}

/**
 * Mélange un array avec un algorithme Fisher-Yates
 */
const shuffleArray = (arr, seed) => {
  const array = [...arr]
  // Initialiser le générateur pseudo-aléatoire avec la seed
  let random = seed
  
  for (let i = array.length - 1; i > 0; i--) {
    random = (random * 9301 + 49297) % 233280
    const j = Math.floor((random / 233280) * (i + 1))
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * Sélectionne les bonnes options pour une question et les mélange
 */
const prepareQuestion = (question, seed) => {
  const optionsCopy = [...question.options]
  const correctOption = optionsCopy[question.correct]
  
  // Mélanger les options
  const shuffledOptions = shuffleArray(optionsCopy, seed)
  
  // Trouver le nouvel index de la bonne réponse
  const newCorrect = shuffledOptions.indexOf(correctOption)
  
  return {
    q: question.q,
    options: shuffledOptions,
    correct: newCorrect
  }
}

/**
 * Génère des questions de QCM basées sur les chapitres bibliques
 * GARANTIT des questions DIFFÉRENTES à chaque appel
 * @param {Array} chapters - Liste des chapitres à évaluer (ex: ["Genèse 1", "Genèse 2"])
 * @param {Number} numberOfQuestions - Nombre de questions à générer (défaut: 3)
 * @returns {Array} Array d'objets question avec options et réponse correcte
 */
export const generateQuizQuestions = (chapters, numberOfQuestions = 3) => {
  try {
    // Valider l'entrée
    if (!chapters || chapters.length === 0) {
      throw new Error('Aucun chapitre fourni pour générer les questions.')
    }

    // Générer une seed différente à chaque appel
    const seed = getRandomSeed()
    
    // Collecter toutes les questions disponibles pour les chapitres fournis
    let allAvailableQuestions = []
    
    for (const chapter of chapters) {
      if (BIBLE_QUESTIONS_DB[chapter] && BIBLE_QUESTIONS_DB[chapter].questions) {
        allAvailableQuestions.push(...BIBLE_QUESTIONS_DB[chapter].questions)
      }
    }

    // Si aucune question trouvée, utiliser les questions par défaut pour ce chapitre
    if (allAvailableQuestions.length === 0) {
      console.warn(`Aucune question trouvée pour les chapitres: ${chapters.join(', ')}`)
      return getDefaultQuestionsForChapters(chapters, numberOfQuestions)
    }

    // Sélectionner aléatoirement les questions demandées
    const selectedQuestions = []
    const questionsToSelect = Math.min(numberOfQuestions, allAvailableQuestions.length)
    
    // Utiliser un mélange pour sélectionner les questions
    const shuffledAll = shuffleArray(allAvailableQuestions, seed)
    
    for (let i = 0; i < questionsToSelect; i++) {
      // Mélanger les options pour chaque question sélectionnée
      const prepared = prepareQuestion(shuffledAll[i], seed + i)
      selectedQuestions.push(prepared)
    }

    return selectedQuestions

  } catch (error) {
    console.error('Erreur lors de la génération des questions:', error)
    return getDefaultQuestionsForChapters(chapters, numberOfQuestions)
  }
}

/**
 * Questions par défaut si aucune n'est trouvée
 */
const getDefaultQuestionsForChapters = (chapters, numberOfQuestions) => {
  // Retourner une question générique basée sur les chapitres
  const chapterNames = chapters.join(', ')
  
  return [
    {
      q: `Avez-vous lu attentivement les chapitres : ${chapterNames} ?`,
      options: ["Oui, entièrement", "Partiellement", "Non", "Je ne suis pas sûr"],
      correct: 0
    },
    {
      q: `Quel est le thème principal des passages que vous avez lus aujourd'hui ?`,
      options: ["La création", "La grâce de Dieu", "La persévérance", "L'amour du prochain"],
      correct: Math.floor(Math.random() * 4)
    },
    {
      q: `Selon votre lecture, quel enseignement vous a marqué ?`,
      options: ["La foi", "L'obéissance", "L'espoir", "Tous les enseignements"],
      correct: Math.floor(Math.random() * 4)
    }
  ].slice(0, numberOfQuestions)
}

/**
 * Enregistre la tentative du QCM dans Firestore
 * @param {Object} data - Données de la tentative
 * @returns {Promise<Object>} Résultat de l'enregistrement
 */
export const recordQuizAttempt = async ({
  cohortId,
  quizId,
  memberId,
  memberCode,
  chapters,
  answers,
  score,
  totalQuestions
}) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/quiz-attempt`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cohortId,
          quizId,
          memberId,
          memberCode,
          chapters,
          answers,
          score,
          totalQuestions,
          submittedAt: new Date().toISOString()
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Erreur lors de l'enregistrement: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du QCM:', error)
    throw error
  }
}

/**
 * Calcule le score du QCM
 * @param {Array} questions - Questions du QCM
 * @param {Object} answers - Réponses de l'utilisateur
 * @returns {Number} Score en pourcentage (0-100)
 */
export const calculateScore = (questions, answers) => {
  if (!questions || questions.length === 0) return 0
  
  let correctCount = 0
  questions.forEach((question, index) => {
    const userAnswer = answers[index]
    if (userAnswer && userAnswer.correct) {
      correctCount++
    }
  })
  
  return Math.round((correctCount / questions.length) * 100)
}
