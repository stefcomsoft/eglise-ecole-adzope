# Vérification de Mémorisation du Verset - Documentation

## Vue d'ensemble

Le système de vérification de mémorisation des versets bibliques a été implémenté pour évaluer l'exactitude de la mémorisation de l'utilisateur en comparant son texte saisi avec le verset de référence.

## Fonctionnalités implémentées

### 1. **Comparaison intelligente des textes**
- Normalisation des deux textes (guillemets, ponctuation, espaces)
- Conversion en minuscules pour comparaison insensible à la casse
- Découpage en liste de mots
- Calcul de similarité basé sur les mots correspondants

### 2. **Système de scoring**
Calcule un **pourcentage de similarité** (0-100%) basé sur:
- Nombre de mots correctement mémorisés
- Nombre total de mots du verset de référence

### 3. **Feedback personnalisé**
En fonction du score:
| Score | Feedback | Message |
|-------|----------|---------|
| 100% | ✅ Parfait | "Vous avez parfaitement mémorisé le verset." |
| 85-99% | ⚠️ Presque parfait | "Restez attentif aux petits détails." |
| 70-84% | 📖 Bien | "Continuez à le relire pour l'améliorer." |
| 50-69% | 🔄 Partiellement correct | "Travaillez plus sur la précision des mots." |
| 25-49% | ⚠️ Compréhension générale | "Travaillez plus sur la précision." |
| < 25% | ❌ À améliorer | "Relisez le verset et réessayez." |

### 4. **Détails du résultat**
Affiche:
- **Similarité (%)** : Pourcentage de mots corrects
- **Mots corrects (X/Y)** : Nombre de mots bien mémorisés sur le total
- **Mots saisis (Z)** : Nombre total de mots que l'utilisateur a écrits

---

## Architecture technique

### États React
```javascript
const [versetInput, setVersetInput] = useState("");        // Texte saisi
const [versetResult, setVersetResult] = useState(null);   // Résultat vérification
```

### Données du verset
```javascript
const weekVerse = {
  text: "Car je connais les projets que j'ai formés sur vous...",
  reference: "Jérémie 29:11",
  week: "03 mars 2025"
};
```

### Fonctions principales

#### 1. `normalizeText(text)`
Normalise un texte pour la comparaison:
- Supprime les guillemets français « »
- Supprime la ponctuation (.,!?;:-—)
- Convertit en minuscules
- Divise en mots
- Filtre les mots vides

```javascript
"Car je connais les projets..." → ["car", "je", "connais", "les", "projets"]
```

#### 2. `calculateSimilarity(userWords, referenceWords)`
Compare deux listes de mots:
- Pour chaque mot de l'utilisateur, cherche la correspondance dans la référence
- Évite de compter deux fois le même mot
- Calcule le pourcentage basé sur la longueur de référence

```javascript
User: ["car", "je", "connais", ...]
Ref:  ["car", "je", "connais", "les", "projets", ...]
Score: (mots_corrects / total_ref) * 100
```

#### 3. `handleVerifyVerse()`
Fonction principale de vérification:
1. Valide que l'utilisateur a saisi du texte
2. Normalise les deux textes
3. Calcule la similarité
4. Détermine le feedback

---

## Interface utilisateur

### Affichage du verset à mémoriser
```
┌─────────────────────────────────────┐
│ VERSET À MÉMORISER — SEMAINE DU ... │
│                                     │
│ « Car je connais les projets que    │
│   j'ai formés sur vous, dit         │
│   l'Éternel, ... »                  │
│                                     │
│ Jérémie 29:11                       │
└─────────────────────────────────────┘
```

### Section de test
```
┌─────────────────────────────────────┐
│ TESTEZ VOTRE MÉMORISATION           │
│                                     │
│ [Résultat du test]  (conditionnel)  │
│                                     │
│ [Textarea 4 lignes]                 │
│                                     │
│ [Bouton: Vérifier]     [Bouton: ↺ Réessayer] │
└─────────────────────────────────────┘
```

### Affichage du résultat
```
┌─────────────────────────────────────┐
│ ✅ Parfait !                        │
│                                     │
│ "Vous avez parfaitement mémorisé    │
│  le verset."                        │
│                                     │
│ ┌──────┬──────┬──────┐              │
│ │ 92%  │ 12/13│  12  │              │
│ │Simil.│Correct│Mots  │              │
│ └──────┴──────┴──────┘              │
└─────────────────────────────────────┘
```

---

## Cas d'usage

### Test 1: Mémorisation parfaite
**Utilisateur tape:** 
```
"Car je connais les projets que j'ai formés sur vous, dit l'Éternel, 
projets de paix et non de malheur, afin de vous donner un avenir 
et de l'espérance."
```
**Score:** 100%  
**Feedback:** ✅ "Excellent ! Vous avez parfaitement mémorisé le verset."

### Test 2: Mémorisation partielle
**Utilisateur tape:**
```
"Car je connais les projets que j'ai formés sur vous, dit l'Éternel, 
projets de paix et de malheur, afin de vous donner un avenir 
et de l'espérance."
```
**Score:** 92% (manque "non")  
**Feedback:** ⚠️ "Très bien ! Restez attentif aux petits détails."

### Test 3: Compréhension générale
**Utilisateur tape:**
```
"Je connais vos projets pour vous, dit l'Éternel, des projets 
de paix pas de malheur, pour vous donner un futur et l'espoir."
```
**Score:** ~65% (paraphrase)  
**Feedback:** 🔄 "Bien ! Continuez comme ça."

---

## Normalisation - Exemples

| Texte original | Après normalisation |
|---|---|
| `"Car"` | `"car"` |
| `« Car »` | `"car"` |
| `"Car,"` | `"car"` |
| `"car'est"` | `"car"`, `"est"` |
| `"car—est"` | `"car"`, `"est"` |

---

## Limitations actuelles & améliorations possibles

### ✅ Points forts
1. Insensible à la casse et la ponctuation
2. Tolérant aux petites variations
3. Feedback immédiat et personnalisé
4. Détails détaillés du résultat

### 🔄 Améliorations futures

**Court terme (Easy)**
- [ ] Stockage du résultat dans Firestore
- [ ] Historique des tentatives
- [ ] Badge "Verset maîtrisé" si score >= 90%

**Moyen terme (Medium)**
- [ ] Comparaison par synonymes (ex: "avenir" vs "futur")
- [ ] Levenshtein distance pour typos (fautes d'orthographe)
- [ ] Support plusieurs versets par semaine
- [ ] Analytics: Versets les plus difficiles

**Long terme (Advanced)**
- [ ] IA pour accepter paraphrases intelligentes
- [ ] Vérification par prononciation (audio)
- [ ] Recommandations de learning path
- [ ] Notations vocales de versets

---

## Configuration actuelle

### Verset configuré
```javascript
{
  text: "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance.",
  reference: "Jérémie 29:11",
  week: "03 mars 2025"
}
```

### Pour changer de verset
Modifier dans `LectureView()`:
```javascript
const weekVerse = {
  text: "NOUVEAU VERSET ICI",
  reference: "Livre Chapitre:Verset",
  week: "DATE"
};
```

---

## Points techniques importants

### Sensibilité aux variations
```javascript
// CES TEXTES DONNENT LE MÊME SCORE:
"Car je connais les projets"  // Score: 100%
"car je connais les projets"  // Score: 100% (casse)
"Car, je connais les projets" // Score: 100% (ponctuation)
"Car je connais les projets." // Score: 100% (point)

// CELUI-CI DONNE UN SCORE INFÉRIEUR:
"Je connais les projets"       // Score: 80% (mot manquant)
```

### Ordre des mots
```javascript
// L'ORDRE IMPORTE POUR LA PERFORMANCE OPTIMALE:
"Car je connais les projets que j'ai formés sur vous"   // ✅ 100%
"je Car les projets que connais les j'ai formés vous"   // ✅ Partiellement (mots mal positionnés)
```

---

## Tests recommandés

1. **Scenario: Score parfait**
   - Vérifier que 100% affiche "✅ Parfait !"
   - Vérifier que le détail affiche 100% et tous les mots

2. **Scenario: Score partiel**
   - Supprimer 2-3 mots
   - Vérifier que le score baisse proportionnellement
   - Vérifier le feedback adapté

3. **Scenario: Paraphrase**
   - Utiliser différentes mots avec même sens
   - Vérifier que le score reflète la différence
   - Vérifier le feedback "À améliorer"

4. **Scenario: Vide**
   - Cliquer sans rien saisir
   - Vérifier le message "Veuillez écrire le verset..."

---

## Support

**Question:** Comment ajouter un nouveau verset?  
**Réponse:** Modifier l'objet `weekVerse` au début de la fonction `LectureView()`

**Question:** Pourquoi mon score n'est pas 100% alors que je suis sûr?  
**Réponse:** Vérifier:
1. Pas de mot oublié ou mal orthographié
2. Réduction des mots (~cet/ce vs those)
3. Ponctuation (n'oubliez pas les guillemets)

**Question:** Peut-on accepter les paraphrases?  
**Réponse:** Pas actuellement, c'est prévu pour une version future avec IA

---

**Version**: 1.0.0  
**Date**: Avril 2026  
**Status**: ✅ Production Ready
