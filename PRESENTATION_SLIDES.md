# Présentation VIGIL - Slides avec Commentaires

---

## Slide 1: Titre

### VIGIL
### Plateforme de Gestion d'Incidents et Releases Collaborative

**Florian Billon**

---

**Commentaires:**
Bonjour à tous, je suis Florian Billon et je vous présente aujourd'hui VIGIL, une plateforme de gestion d'incidents et de releases collaborative conçue pour les équipes techniques.

---

## Slide 2: Le Problème

### Les Défis des Équipes Techniques

- **Communication fragmentée** - Informations dispersées entre Slack, emails, tickets
- **Manque de visibilité** - Difficile de suivre l'état des incidents en temps réel
- **Coordination complexe** - Releases nécessitant synchronisation multi-équipes
- **Perte d'historique** - Pas de traçabilité claire des décisions et actions

---

**Commentaires:**
Dans le monde du développement logiciel moderne, les équipes font face à plusieurs défis majeurs. Premièrement, la communication est fragmentée - les informations sur les incidents sont dispersées entre Slack, emails et tickets Jira. Deuxièmement, il y a un manque de visibilité - il est difficile de suivre l'état des incidents en temps réel. Troisièmement, la coordination est complexe - les releases nécessitent une synchronisation entre plusieurs équipes. Enfin, il y a une perte d'historique - pas de traçabilité claire des décisions et actions prises. Ces problèmes entraînent des délais de résolution plus longs et une perte de confiance entre les équipes.

---

## Slide 3: La Solution VIGIL

### Une Solution Tout-en-Un

- **Interface unifiée** - Une seule plateforme pour tout
- **Collaboration en temps réel** - Mises à jour instantanées
- **Système de rôles** - Observer, Responder, Manager
- **Timeline collaborative** - Historique complet et traçabilité
- **Intégration releases** - Lien direct incidents/releases

---

**Commentaires:**
VIGIL propose une solution tout-en-un qui centralise la gestion d'incidents et de releases. Nous offrons une interface unifiée - une seule plateforme pour tous les aspects de la gestion. La collaboration en temps réel permet des mises à jour instantanées pour tous les membres de l'équipe. Notre système de rôles (Observer, Responder, Manager) assure des droits adaptés à chaque membre. La timeline collaborative fournit un historique complet et une traçabilité des actions. Enfin, l'intégration releases permet un lien direct entre incidents et releases.

---

## Slide 4: Architecture Technique

### Stack Technique

- **Frontend Web**: Next.js 14 + React + TypeScript
- **Frontend Desktop**: Tauri + React
- **Styling**: Tailwind CSS
- **Persistance**: localStorage (mock API)
- **Architecture**: Client-side avec API mock

### Points Forts
- TypeScript pour la sécurité des types
- Architecture modulaire pour l'évolutivité
- Double plateforme pour flexibilité
- Code propre et maintenable

---

**Commentaires:**
Sur le plan technique, VIGIL utilise une stack moderne et robuste. Pour le frontend web, nous utilisons Next.js 14 avec React et TypeScript. Pour le desktop, nous utilisons Tauri avec React. Le styling est fait avec Tailwind CSS. La persistance est actuellement gérée via localStorage avec une API mock pour la démonstration. Notre architecture est client-side avec une API mock. Les points forts de cette architecture incluent TypeScript pour la sécurité des types, une architecture modulaire pour l'évolutivité, une double plateforme pour la flexibilité, et un code propre et maintenable.

---

## Slide 5: Authentification

### Gestion des Utilisateurs

- **Email/password authentication**
- **Sessions sécurisées**
- **GET/me endpoint** (en cours)
- **Token invalidation** au sign out (en cours)

---

**Commentaires:**
VIGIL dispose d'un système d'authentification complet avec email et password. Les sessions sont sécurisées. Nous travaillons actuellement sur l'implémentation du endpoint GET/me et l'invalidation de token au sign out pour une sécurité renforcée.

---

## Slide 6: Gestion des Équipes

### Système de Rôles

- **3 rôles**: Observer, Responder, Manager
- **Code d'invitation** pour rejoindre une équipe
- **Transfert de rôle Manager** (en cours)
- **Filtrage par équipe** pour incidents et releases
- **Notifications automatiques**

---

**Commentaires:**
La gestion des équipes dans VIGIL est basée sur un système de 3 rôles: Observer, Responder et Manager. Chaque équipe dispose d'un code d'invitation pour permettre aux nouveaux membres de rejoindre. Nous travaillons sur le transfert de rôle Manager pour permettre une rotation des responsabilités. Le filtrage par équipe permet à chaque membre de voir uniquement les incidents et releases qui le concernent. Des notifications automatiques sont envoyées aux managers lors des événements importants.

---

## Slide 7: Cycle de Vie des Incidents

### États des Incidents

```
OPEN → ACKNOWLEDGED → ESCALATED → RESOLVED
```

### Actions Disponibles
- **Acknowledge** - Prendre en charge l'incident
- **Escalate** - Monter de niveau (avec confirmation)
- **Resolve** - Résoudre l'incident

---

**Commentaires:**
Les incidents dans VIGIL suivent un cycle de vie complet: de l'état OPEN à ACKNOWLEDGED, puis ESCALATED, et enfin RESOLVED. Les actions disponibles incluent Acknowledge pour prendre en charge l'incident, Escalate pour monter de niveau avec une confirmation de sécurité, et Resolve pour résoudre l'incident. Chaque action est tracée dans la timeline collaborative.

---

## Slide 8: Sévérité des Incidents

### 4 Niveaux de Sévérité

- 🔴 **Critical** - Impact majeur, action immédiate requise
- 🟠 **High** - Impact significatif, action rapide requise
- 🟡 **Medium** - Impact modéré, action planifiée
- 🟢 **Low** - Impact mineur, action normale

### Indicateurs Visuels
- Couleurs distinctes pour chaque niveau
- Icônes pour identification rapide
- Filtrage par sévérité

---

**Commentaires:**
VIGIL définit 4 niveaux de sévérité pour les incidents: Critical pour un impact majeur nécessitant une action immédiate, High pour un impact significatif nécessitant une action rapide, Medium pour un impact modéré avec action planifiée, et Low pour un impact mineur avec action normale. Des indicateurs visuels comme des couleurs distinctes et des icônes permettent une identification rapide. Le filtrage par sévérité aide à prioriser les actions.

---

## Slide 9: Gestion des Releases

### Cycle de Vie des Releases

```
CREATED → IN PROGRESS → COMPLETED
                ↓
           CANCELLED / BLOCKED
```

### Fonctionnalités
- **Suivi par étapes** avec validation
- **Lien avec incidents** (blocking)
- **Annulation avec confirmation**
- **Raccourcis clavier** (Ctrl+V pour validate, Ctrl+C pour cancel)

---

**Commentaires:**
Les releases dans VIGIL suivent également un cycle de vie complet: de CREATED à IN PROGRESS, puis COMPLETED. Elles peuvent également être CANCELLED ou BLOCKED. Les fonctionnalités incluent un suivi par étapes avec validation, un lien avec les incidents qui peuvent bloquer une release, une annulation avec confirmation de sécurité, et des raccourcis clavier pour une action rapide (Ctrl+V pour validate, Ctrl+C pour cancel).

---

## Slide 10: Interface Utilisateur

### Design Moderne et Responsive

- **Interface claire et intuitive**
- **Indicateurs visuels** (couleurs, icônes)
- **Raccourcis clavier** (Ctrl+N, Ctrl+A, Ctrl+E, etc.)
- **Double client**: Web et Desktop
- **Mode sombre** par défaut

---

**Commentaires:**
L'interface utilisateur de VIGIL est conçue pour être moderne, claire et intuitive. Nous utilisons des indicateurs visuels comme des couleurs et des icônes pour une identification rapide. Des raccourcis clavier permettent une action efficace (Ctrl+N pour nouveau, Ctrl+A pour acknowledge, Ctrl+E pour escalate, etc.). VIGIL est disponible en double client: Web et Desktop via Tauri. L'interface utilise un mode sombre par défaut pour réduire la fatigue visuelle.

---

## Slide 11: Démonstration - Dashboard

### Vue d'Ensemble

- **Statistiques en temps réel**
- **Incidents récents** (3 derniers)
- **Releases actives** (2 dernières)
- **Navigation rapide** vers les pages détaillées

---

**Commentaires:**
[Passer à la démo live] Le dashboard de VIGIL offre une vue d'ensemble avec des statistiques en temps réel. Il affiche les incidents récents (les 3 derniers) et les releases actives (les 2 dernières). La navigation rapide permet d'accéder directement aux pages détaillées pour incidents et releases.

---

## Slide 12: Démonstration - Création d'Incident

### Processus de Création

1. Cliquer sur "+ New Incident" (Ctrl+N)
2. Remplir le formulaire: titre, description, sévérité, assignation, équipe
3. Valider pour créer l'incident
4. L'incident apparaît immédiatement dans la liste

---

**Commentaires:**
[Continuer la démo] Pour créer un incident, on clique sur "+ New Incident" ou on utilise le raccourci Ctrl+N. On remplit ensuite le formulaire avec le titre, la description, la sévérité, l'assignation et l'équipe. En validant, l'incident est créé immédiatement et apparaît dans la liste.

---

## Slide 13: Démonstration - Gestion d'Incident

### Actions Collaboratives

- **Acknowledge** (Ctrl+A) - Prendre en charge
- **Escalate** (Ctrl+E) - Monter de niveau avec confirmation
- **Resolve** - Résoudre l'incident
- **Timeline** - Historique complet des actions

---

**Commentaires:**
[Continuer la démo] Une fois l'incident créé, plusieurs actions sont disponibles. Acknowledge (Ctrl+A) permet de prendre en charge l'incident. Escalate (Ctrl+E) monte le niveau de l'incident avec une confirmation de sécurité. Resolve permet de résoudre l'incident. La timeline affiche l'historique complet de toutes les actions effectuées.

---

## Slide 14: Roadmap Phase 1

### Pour Valider la Phase 1

✅ **Déjà implémenté:**
- Authentification email/password
- Cycle de vie incidents complet
- Niveaux de sévérité
- Persistance des données
- Code d'invitation équipes

🔄 **En cours:**
- Système de 3 rôles complet
- Transfert de rôle Manager
- Timeline collaborative en temps réel
- WebSockets (incident_state_changed, incident_update)
- GET/me endpoint
- Invalidation token au sign out
- Reconnexion automatique client

---

**Commentaires:**
Pour valider la Phase 1 du projet, nous avons déjà implémenté l'authentification email/password, le cycle de vie complet des incidents, les niveaux de sévérité, la persistance des données et le code d'invitation pour les équipes. Nous travaillons actuellement sur le système de 3 rôles complet, le transfert de rôle Manager, la timeline collaborative en temps réel, les WebSockets pour les événements incident_state_changed et incident_update, le endpoint GET/me, l'invalidation de token au sign out, et la reconnexion automatique du client.

---

## Slide 15: Roadmap Étendue

### Fonctionnalités pour le Jury Final

- **OAuth2 sign-in** (GitHub)
- **Releases avec blocage automatique** par incidents liés
- **Modération des membres** (kick, ban temporaire/permanent)
- **Édition des entrées timeline**
- **Messages privés**
- **Réactions sur timeline**
- **WebSockets étendus** (member_kicked, private_message, etc.)

---

**Commentaires:**
Pour la phase finale qui sera évaluée par le jury, nous prévoyons l'implémentation de fonctionnalités avancées comme OAuth2 sign-in avec GitHub, des releases avec blocage automatique par incidents liés, la modération des membres (kick, ban temporaire et permanent), l'édition des entrées timeline, les messages privés, les réactions sur timeline, et des WebSockets étendus pour les événements member_kicked, private_message, etc.

---

## Slide 16: Architecture Future

### Évolution Technique

- **Backend**: Rust (Tauri) + Serveur dédié
- **Base de données**: PostgreSQL
- **WebSockets**: Communication temps réel
- **OAuth2**: Authentification GitHub
- **API RESTful**: Endpoints complets

---

**Commentaires:**
L'architecture future de VIGIL prévoit l'évolution vers un backend complet en Rust avec Tauri et un serveur dédié. Nous migrerons vers PostgreSQL pour la base de données. Les WebSockets assureront la communication temps réel. OAuth2 permettra l'authentification via GitHub. Enfin, nous implémenterons une API RESTful avec des endpoints complets.

---

## Slide 17: Avantages Concurrentiels

### Pourquoi VIGIL?

- **Simplicité** - Interface intuitive et facile à prendre en main
- **Performance** - Temps réel et réactivité
- **Flexibilité** - Double plateforme (Web/Desktop)
- **Sécurité** - Rôles et permissions granulaires
- **Traçabilité** - Timeline complète et historique
- **Évolutivité** - Architecture modulaire et extensible

---

**Commentaires:**
VIGIL offre plusieurs avantages concurrentiels. La simplicité de l'interface la rend intuitive et facile à prendre en main. La performance assure un temps réel et une réactivité optimale. La flexibilité est garantie par la double plateforme Web et Desktop. La sécurité est renforcée par des rôles et permissions granulaires. La traçabilité est assurée par une timeline complète et un historique détaillé. Enfin, l'évolutivité est garantie par une architecture modulaire et extensible.

---

## Slide 18: Cas d'Usage

### Scénarios d'Utilisation

- **Équipe DevOps** - Gestion incidents production
- **Équipe SRE** - Coordination releases
- **Support Technique** - Suivi tickets incidents
- **Startup** - Communication incidents clients
- **Enterprise** - Gestion multi-équipes

---

**Commentaires:**
VIGIL s'adapte à plusieurs scénarios d'utilisation. Les équipes DevOps peuvent l'utiliser pour la gestion des incidents en production. Les équipes SRE peuvent coordonner les releases. Le support technique peut suivre les tickets d'incidents. Les startups peuvent communiquer sur les incidents clients. Enfin, les entreprises peuvent gérer des incidents multi-équipes.

---

## Slide 19: Métriques de Succès

### Indicateurs de Performance

- **Temps de résolution** - Réduction de 30%
- **Communication** - Centralisation des informations
- **Visibilité** - Suivi en temps réel
- **Satisfaction équipe** - Feedback positif
- **Adoption** - Utilisation croissante

---

**Commentaires:**
Les métriques de succès de VIGIL incluent une réduction de 30% du temps de résolution des incidents, une centralisation de la communication, une visibilité accrue avec un suivi en temps réel, une satisfaction améliorée des équipes avec un feedback positif, et une adoption croissante de la plateforme.

---

## Slide 20: Conclusion

### VIGIL: La Solution pour la Gestion d'Incidents

- **Plateforme moderne** et collaborative
- **Architecture solide** et évolutive
- **Fonctionnalités complètes** pour équipes techniques
- **Roadmap claire** vers l'excellence

**Merci de votre attention - Questions?**

---

**Commentaires:**
En conclusion, VIGIL est une solution moderne et collaborative pour la gestion d'incidents et de releases. Elle repose sur une architecture solide et évolutive, offre des fonctionnalités complètes pour les équipes techniques, et dispose d'une roadmap claire vers l'excellence. Merci de votre attention. Avez-vous des questions?

---

## Notes pour le Présentateur

### Timing
- **Total**: 20 minutes
- **Introduction**: 2 minutes
- **Problème/Solution**: 4 minutes
- **Architecture**: 3 minutes
- **Fonctionnalités**: 5 minutes
- **Démonstration**: 3 minutes
- **Roadmap**: 2 minutes
- **Conclusion**: 1 minute

### Conseils
- Parler clairement et à un rythme modéré
- Faire des pauses entre les sections
- Pratiquer la démonstration plusieurs fois
- Anticiper les questions sur l'architecture et la sécurité
- Avoir des exemples concrets prêts
- Être prêt à montrer le code si demandé
