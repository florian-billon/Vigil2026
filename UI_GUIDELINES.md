# UI Guidelines - VIGIL

**Auteur:** Florian Billon  
**Version:** 0.1.0  
**Projet T-DEV-600 / T-JSF-600

Ce document définit les règles de conception et d'expérience utilisateur pour VIGIL. Il sert de contrat pour l'évaluation des exigences UX par le jury lors de la démo.

## Table des matières

- [Palette de couleurs](#palette-de-couleurs)
- [Typographie](#typographie)
- [Grille d'espacement](#grille-despacement)
- [Mapping des états](#mapping-des-états)
- [Composants réutilisables](#composants-réutilisables)
- [Accessibilité](#accessibilité)
- [Dark Patterns](#dark-patterns)
- [Captures d'écran annotées](#captures-décran-annotées)

## Palette de couleurs

VIGIL utilise une palette sombre professionnelle avec 5 couleurs primaires :

| Couleur | Hex | Usage | Règle |
|---------|-----|-------|-------|
| **Primary** | `#e94560` | Actions principales, boutons CTA | Utiliser pour l'action principale de chaque écran |
| **Secondary** | `#16213e` | Arrière-plans, cartes, zones de contenu | Couleur de fond principale des composants |
| **Accent** | `#0f3460` | Bordures, éléments secondaires | Bordures et séparateurs |
| **Dark** | `#1a1a2e` | Fond de page principal | Arrière-plan global de l'application |
| **Light** | `#eaeaea` | Texte principal, labels | Texte et labels sur fond sombre |

### Couleurs sémantiques

| Couleur | Hex | Usage |
|---------|-----|-------|
| **Success** | `#22c55e` | Actions réussies, validation |
| **Warning** | `#f59e0b` | Avertissements, état intermédiaire |
| **Danger** | `#ef4444` | Actions destructives, erreurs critiques |

### Règles d'utilisation

1. **Primary** - Une seule action primaire par écran
2. **Secondary** - Pour les zones de contenu et cartes
3. **Accent** - Pour les bordures et éléments décoratifs
4. **Dark** - Fond global de l'application
5. **Light** - Texte principal et labels

## Typographie

VIGIL utilise une hiérarchie typographique à 3 niveaux :

### Niveaux de texte

| Niveau | Taille | Poids | Usage |
|--------|--------|-------|-------|
| **Title** | 32px (2rem) | Bold (700) | Titres de pages et sections principales |
| **Subtitle** | 20px (1.25rem) | Semibold (600) | Sous-titres, titres de cartes |
| **Body** | 16px (1rem) | Regular (400) | Texte de corps, descriptions |

### Police

- **Famille:** System UI (San Francisco, Segoe UI, Roboto)
- **Ligne de base:** 1.5
- **Lettre:** Normal (0)

### Règles d'utilisation

1. **Title** - Un seul titre H1 par page
2. **Subtitle** - Pour les sections et cartes
3. **Body** - Pour tout le texte de contenu

## Grille d'espacement

VIGIL utilise une grille d'espacement basée sur des multiples de 8px :

| Unité | Valeur | Usage |
|-------|--------|-------|
| **xs** | 4px | Espacement interne des petits composants |
| **sm** | 8px | Espacement entre éléments proches |
| **md** | 16px | Espacement standard entre composants |
| **lg** | 24px | Espacement entre sections |
| **xl** | 32px | Espacement entre grandes sections |
| **2xl** | 48px | Espacement entre zones principales |

### Règles d'utilisation

1. Utiliser **sm** (8px) pour l'espacement entre éléments d'un même composant
2. Utiliser **md** (16px) pour l'espacement entre composants
3. Utiliser **lg** (24px) pour l'espacement entre sections
4. Utiliser **xl** (32px) pour l'espacement entre zones principales

## Mapping des états

### États des Incidents

| État | Couleur | Icône | Représentation visuelle |
|------|---------|-------|------------------------|
| **Open** | Bleu (`#3b82f6`) | 🔔 | Badge bleu clair avec icône cloche |
| **Acknowledged** | Jaune (`#f59e0b`) | 👁️ | Badge jaune avec icône œil |
| **Escalated** | Orange (`#f97316`) | ⬆️ | Badge orange avec icône flèche haut |
| **Resolved** | Vert (`#22c55e`) | ✅ | Badge vert avec icône check |

### Niveaux de sévérité

| Sévérité | Couleur | Icône | Représentation visuelle |
|----------|---------|-------|------------------------|
| **Low** | Vert (`#22c55e`) | 🟢 | Badge vert clair, bordure fine |
| **Medium** | Jaune (`#f59e0b`) | 🟡 | Badge jaune, bordure moyenne |
| **High** | Orange (`#f97316`) | 🟠 | Badge orange, bordure épaisse |
| **Critical** | Rouge (`#ef4444`) | 🔴 | Badge rouge, bordure très épaisse + animation |

### États des Releases

| État | Couleur | Icône | Représentation visuelle |
|------|---------|-------|------------------------|
| **Created** | Gris (`#6b7280`) | 📝 | Badge gris avec icône document |
| **In Progress** | Bleu (`#3b82f6`) | ▶️ | Badge bleu avec icône play |
| **Completed** | Vert (`#22c55e`) | ✅ | Badge vert avec icône check |
| **Cancelled** | Rouge (`#ef4444`) | ❌ | Badge rouge avec icône croix |
| **Blocked** | Violet (`#8b5cf6`) | 🚫 | Badge violet avec icône interdiction |

### Rôles des membres

| Rôle | Couleur | Icône | Représentation visuelle |
|------|---------|-------|------------------------|
| **Observer** | Gris (`#6b7280`) | 👁️ | Badge gris, texte en italique |
| **Responder** | Bleu (`#3b82f6`) | 🛠️ | Badge bleu, texte normal |
| **Manager** | Primary (`#e94560`) | 👑 | Badge primary, texte en gras |

## Composants réutilisables

### Button

**Variantes:**
- **Primary** - Fond primary, texte blanc, pour actions principales
- **Secondary** - Fond secondary, texte light, pour actions secondaires
- **Danger** - Fond danger, texte blanc, pour actions destructives
- **Ghost** - Fond transparent, bordure secondary, pour actions discrètes

**États:**
- Normal
- Hover (légèrement plus clair)
- Disabled (grisé, non cliquable)
- Loading (spinner à la place du texte)

### Card

**Variantes:**
- **Default** - Fond secondary, bordure accent
- **Selected** - Fond secondary, bordure primary
- **Hover** - Fond secondary, bordure primary au hover

**Contenu:**
- Header (optionnel)
- Body
- Footer (optionnel)

### Badge

**Variantes:**
- **State** - Pour les états (Incident, Release)
- **Severity** - Pour les niveaux de sévérité
- **Role** - Pour les rôles des membres

### Input

**Types:**
- Text
- Email
- Password
- Textarea
- Select

**États:**
- Normal
- Focus (bordure primary)
- Error (bordure danger, message d'erreur)
- Disabled (grisé)

### Modal

**Utilisation:**
- Confirmation d'actions destructives
- Formulaires complexes
- Informations détaillées

**Structure:**
- Header avec titre
- Body avec contenu
- Footer avec actions (annuler, confirmer)

### Timeline

**Composant pour les entrées de timeline d'Incident:**
- Avatar de l'auteur
- Horodatage
- Contenu
- Icône d'édition (pour l'auteur)
- Réactions (emojis)

## Accessibilité

VIGIL cible le niveau AA des WCAG 2.1.

### Navigation au clavier

Toutes les actions principales doivent être accessibles au clavier :
- **Tab** - Navigation entre éléments interactifs
- **Enter/Space** - Activer boutons et liens
- **Escape** - Fermer modals et menus

### Labels explicites

Tous les champs de formulaire doivent avoir :
- Un label explicite (pas de placeholder-only)
- Un attribut `for` sur le label lié à l'input
- Un texte d'erreur clair en cas de validation

### Signaux multiples

Aucun état ne doit être communiqué uniquement par couleur :
- **Incident state:** Couleur + icône + texte
- **Severity level:** Couleur + icône + texte + épaisseur bordure
- **Release state:** Couleur + icône + texte

### Contraste

- Texte sur fond: Minimum 4.5:1 (AA)
- Texte large: Minimum 3:1 (AA)
- Composants interactifs: Minimum 3:1 (AA)

### Focus visible

Tous les éléments interactifs doivent avoir un indicateur de focus visible :
- Bordure primary de 2px
- Outline de 2px sur les boutons

## Dark Patterns

VIGIL n'utilise aucun dark pattern. Voici les patterns identifiés et comment ils sont évités :

### Confirmation d'actions destructives

**Pattern à éviter:** Confirmation implicite ou inversion de confirmation

**Solution VIGIL:**
- Toutes les actions destructives (delete, kick, ban, cancel Release, transfer Manager) nécessitent une confirmation explicite
- Dialog de confirmation nommant explicitement la ressource affectée
- Bouton "Annuler" à gauche, bouton "Confirmer" à droite (pas d'inversion)

### Options critiques cachées

**Pattern à éviter:** Options critiques cachées derrière des affordances non évidentes

**Solution VIGIL:**
- Toutes les actions critiques sont visibles dans l'interface principale
- Pas de menus cachés ou d'actions nécessitant plusieurs clics
- Icônes avec tooltips explicites

### Urgence artificielle

**Pattern à éviter:** Créer un sentiment d'urgence artificiel

**Solution VIGIL:**
- Pas de compteurs à rebours artificiels
- Pas de messages d'urgence non justifiés
- Notifications basées sur des événements réels

### Obstruction

**Pattern à éviter:** Rendre difficile la sortie d'un flux

**Solution VIGIL:**
- Possibilité d'annuler toute action à tout moment
- Bouton "Retour" ou "Annuler" toujours visible
- Pas de pop-ups intrusifs

## Captures d'écran annotées

### Capture 1: Dashboard Incident

```
┌─────────────────────────────────────────────────────────┐
│  VIGIL                    Dashboard  Incidents  Releases │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔔 API Down - Critical                    🔴 CRIT │   │
│  │                                                 │   │
│  │ L'API de production ne répond plus depuis      │   │
│  │ 10 minutes.                                      │   │
│  │                                                 │   │
│  │ 👤 Florian Billon • 10 min ago                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔔 Database Slow - Medium                 🟡 MED │   │
│  │                                                 │   │
│  │ Latence élevée sur la base de données.          │   │
│  │                                                 │   │
│  │ 👤 Florian Billon • 25 min ago                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Annotations:**
- Badge Critical avec couleur rouge + icône + texte
- Badge Medium avec couleur jaune + icône + texte
- Avatar + nom + horodatage pour chaque incident
- Cartes avec fond secondary et bordure accent

### Capture 2: Release en cours

```
┌─────────────────────────────────────────────────────────┐
│  VIGIL                    Dashboard  Incidents  Releases │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Release: v2.0.0                         ▶️ In Progress   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ✅ Build                                    │   │
│  │ Validé par Florian Billon • 10:30             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ⏳ Staging                                   │   │
│  │ En cours de validation...                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ⏸️ Go No Go                                  │   │
│  │ Non disponible (étape précédente non validée)  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ⏸️ Production                                │   │
│  │ Non disponible (étape précédente non validée)  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Annotations:**
- Badge In Progress avec couleur bleue + icône + texte
- Étapes validées avec icône check + vert
- Étape en cours avec icône loading + bleu
- Étapes non disponibles avec icône pause + gris
- Progression séquentielle clairement visible

---

**Développé par Florian Billon**  
**Projet académique T-DEV-600 / T-JSF-600**