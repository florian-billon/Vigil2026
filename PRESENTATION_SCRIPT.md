# Script de Présentation Orale - Projet VIGIL

## Introduction (2 minutes)

Bonjour à tous, je suis Florian Billon et je vous présente aujourd'hui **VIGIL**, une plateforme de gestion d'incidents et de releases collaborative.

**VIGIL** est conçue pour les équipes techniques qui doivent gérer des incidents en production, coordonner des releases, et maintenir une communication fluide entre les différents membres de l'équipe.

## Le Problème (2 minutes)

Dans le monde du développement logiciel moderne, les équipes font face à plusieurs défis majeurs:

1. **Communication fragmentée** - Les informations sur les incidents sont dispersées entre Slack, emails, tickets Jira
2. **Manque de visibilité** - Difficile de suivre l'état des incidents en temps réel
3. **Coordination complexe** - Les releases nécessitent une synchronisation entre plusieurs équipes
4. **Perte d'historique** - Pas de traçabilité claire des décisions et actions prises

Ces problèmes entraînent des délais de résolution plus longs, des erreurs de communication, et une perte de confiance entre les équipes.

## La Solution (3 minutes)

VIGIL propose une solution tout-en-un qui centralise la gestion d'incidents et de releases avec:

- **Interface unifiée** - Une seule plateforme pour tous les aspects de la gestion d'incidents
- **Collaboration en temps réel** - Mises à jour instantanées pour tous les membres de l'équipe
- **Système de rôles** - Observer, Responder, Manager pour des droits adaptés
- **Timeline collaborative** - Historique complet et traçabilité des actions
- **Intégration releases** - Lien direct entre incidents et releases

## Fonctionnalités Actuelles (4 minutes)

### Authentification
- Connexion par email/mot de passe
- Gestion des sessions utilisateurs

### Gestion des Équipes
- Création d'équipes avec code d'invitation
- Système de rôles (Observer/Responder/Manager)
- Transfert de rôle Manager
- Filtrage par équipe pour incidents et releases

### Gestion des Incidents
- **Cycle de vie complet**: Open → Acknowledged → Escalated → Resolved
- **4 niveaux de sévérité**: Low, Medium, High, Critical
- **Actions collaboratives**: Acknowledge, Escalate, Resolve
- **Assignation à des équipes et utilisateurs**
- **Notifications automatiques** pour les managers lors des escalades
- **Confirmation dialogues** pour les actions destructives

### Gestion des Releases
- **Cycle de vie**: Created → In Progress → Completed/Cancelled/Blocked
- **Suivi par étapes** avec validation
- **Lien avec les incidents** (blocking)
- **Annulation avec confirmation**

### Interface
- **Design moderne et responsive**
- **Raccourcis clavier** (Ctrl+N, Ctrl+A, Ctrl+E, etc.)
- **Indicateurs visuels** (couleurs, icônes)
- **Double client**: Web et Desktop (Tauri)

## Architecture Technique (3 minutes)

### Stack Technique
- **Frontend Web**: Next.js 14 + React + TypeScript
- **Frontend Desktop**: Tauri + React
- **Styling**: Tailwind CSS
- **Persistance**: localStorage (mock API)
- **Architecture**: Client-side avec API mock pour démonstration

### Architecture Future
- **Backend**: Rust (Tauri) + Serveur dédié
- **Base de données**: PostgreSQL
- **WebSockets**: Communication temps réel
- **OAuth2**: Authentification GitHub

### Points Forts
- **TypeScript** pour la sécurité des types
- **Architecture modulaire** pour l'évolutivité
- **Double plateforme** pour flexibilité
- **Code propre et maintenable**

## Démonstration (5 minutes)

[Préparer une démo live montrant:]

1. **Connexion** - Login avec email/mot de passe
2. **Dashboard** - Vue d'ensemble des incidents et releases actifs
3. **Création d'équipe** - Créer une équipe et rejoindre avec code d'invitation
4. **Création d'incident** - Nouvel incident avec sévérité et assignation
5. **Gestion d'incident** - Acknowledge, Escalate (avec confirmation), Resolve
6. **Création de release** - Nouvelle release avec étapes
7. **Validation d'étapes** - Suivi de progression
8. **Navigation** - Utilisation des raccourcis clavier

## Roadmap Phase 1 (2 minutes)

Pour valider la Phase 1, nous devons implémenter:

✅ **Déjà fait:**
- Authentification email/password
- Cycle de vie incidents complet
- Niveaux de sévérité
- Persistance des données
- Code d'invitation équipes

🔄 **En cours:**
- Système de 3 rôles (Observer/Responder/Manager)
- Transfert de rôle Manager
- Timeline collaborative en temps réel
- WebSockets (incident_state_changed, incident_update)
- GET/me endpoint
- Invalidation token au sign out
- Reconnexion automatique client

## Roadmap Étendue (1 minute)

Pour la phase finale (jury):

- OAuth2 sign-in (GitHub)
- Releases avec blocage automatique par incidents liés
- Modération des membres (kick, ban temporaire/permanent)
- Édition des entrées timeline
- Messages privés
- Réactions sur timeline
- WebSockets étendus (member_kicked, private_message, etc.)

## Conclusion (1 minute)

VIGIL est une solution moderne et collaborative pour la gestion d'incidents et de releases. Elle répond à un besoin réel des équipes techniques en centralisant la communication et en offrant une visibilité complète sur les opérations.

La plateforme est conçue pour être évolutive, avec une architecture solide et une roadmap claire vers des fonctionnalités avancées.

**Merci de votre attention. Avez-vous des questions?**

---

## Notes pour le présentateur

- **Timing total**: ~20-25 minutes
- **Ton**: Professionnel, confiant, passionné
- **Pacing**: Parler clairement, faire des pauses entre les sections
- **Démonstration**: Pratiquer la démo plusieurs fois avant la présentation
- **Questions**: Anticiper les questions sur l'architecture, la scalabilité, la sécurité
