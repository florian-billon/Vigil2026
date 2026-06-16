# Présentation Orale - Projet VIGIL

**Auteur:** Florian Billon  
**Projet:** T-DEV-600 / T-JSF-600  
**Version:** 0.1.0

---

## Table des matières

1. [Introduction](#introduction)
2. [Architecture du projet](#architecture-du-projet)
3. [Stack technique](#stack-technique)
4. [Fonctionnalités Phase 1](#fonctionnalités-phase-1)
5. [Fonctionnalités Phase 2](#fonctionnalités-phase-2)
6. [Documentation](#documentation)
7. [Points forts du projet](#points-forts-du-projet)
8. [Défis rencontrés](#défis-rencontrés)
9. [Perspectives](#perspectives)

---

## Introduction

### Qu'est-ce que VIGIL ?

VIGIL est une **Salle de Contrôle Opérationnelle** (Operational Control Room) pour la gestion d'incidents et de releases. C'est une application web et desktop qui permet aux équipes de collaborer en temps réel pour résoudre des incidents et gérer les déploiements.

### Contexte académique

- **Projet:** T-DEV-600 (Backend Rust) + T-JSF-600 (Frontend JavaScript)
- **Objectif:** Créer une application full-stack avec Rust (Axum) et Next.js
- **Architecture:** Microservices avec WebSocket pour le temps réel

### Problème résolu

VIGIL résout le problème de coordination des équipes lors d'incidents critiques et de releases de production en offrant:
- Une centralisation des informations
- Une communication en temps réel
- Un suivi structuré des actions
- Une gestion des rôles et responsabilités

---

## Architecture du projet

### Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                        VIGIL                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │ Client Web   │         │ Client       │                 │
│  │   (Next.js)  │         │ Desktop      │                 │
│  │   Port 3000  │         │   (Tauri)    │                 │
│  └──────┬───────┘         └──────┬───────┘                 │
│         │                        │                          │
│         └──────────┬─────────────┘                          │
│                    │ WebSocket + REST                       │
│         ┌──────────▼─────────────┐                          │
│         │   Serveur Rust         │                          │
│         │   (Axum) Port 8080     │                          │
│         └──────────┬─────────────┘                          │
│                    │                                        │
│         ┌──────────▼─────────────┐                          │
│         │   PostgreSQL           │                          │
│         │   Port 5432           │                          │
│         └───────────────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Composants

1. **Serveur Rust (Axum)**
   - API REST pour CRUD
   - WebSocket pour temps réel
   - Gestion des utilisateurs et équipes
   - Moteur de règles (Phase 2)

2. **Client Web (Next.js)**
   - Interface utilisateur responsive
   - Pages: Dashboard, Incidents, Releases
   - Intégration WebSocket
   - Authentification

3. **Client Desktop (Tauri)**
   - Application native
   - Notifications système
   - Mode hors-ligne partiel
   - Interface similaire au web

4. **Base de données (PostgreSQL)**
   - Schéma relationnel
   - Tables: users, teams, incidents, releases, timeline_entries
   - Indexes pour performance

---

## Stack technique

### Backend (Rust)

- **Framework:** Axum 0.7.9
- **Runtime:** Tokio 1.52.3
- **Database:** SQLx 0.7.4 (PostgreSQL)
- **Serialization:** Serde 1.0.228
- **UUID:** uuid 1.23.3
- **Time:** Chrono 0.4.45
- **Logging:** Tracing 0.1.44
- **Error Handling:** anyhow 1.0.102

**Pourquoi Rust ?**
- Performance et sécurité mémoire
- Type system strict
- Concurrency sans data races
- Écosystème web moderne (Axum)

### Frontend Web (Next.js)

- **Framework:** Next.js 14.2.35
- **React:** 18.3.1
- **Language:** TypeScript 5.7.3
- **Styling:** Tailwind CSS 3.4.17
- **HTTP Client:** Axios 1.7.9
- **WebSocket:** Socket.IO Client 4.8.1

**Pourquoi Next.js ?**
- SSR et SSG pour performance
- App Router moderne
- Excellent DX
- Optimisation automatique

### Frontend Desktop (Tauri)

- **Framework:** Tauri 2.x
- **Frontend:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS

**Pourquoi Tauri ?**
- Applications natives légères
- Sécurité renforcée
- Performance native
- Partage de code avec le web

### Infrastructure

- **Containerisation:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Version Control:** Git

---

## Fonctionnalités Phase 1

### 1. Gestion des utilisateurs

- Inscription avec email et mot de passe
- Connexion avec JWT
- Profil utilisateur

### 2. Gestion des équipes

- Création d'équipes avec code d'invitation
- Rôles: Observer, Responder, Manager
- Ajout de membres via code d'invitation
- Expulsion et bannissement de membres

### 3. Gestion des incidents

- Création d'incidents avec titre, description, sévérité
- États: open, acknowledged, escalated, resolved
- Sévérité: low, medium, high, critical
- Assignation à des responders
- Escalade à des managers
- Timeline avec entrées textuelles
- Réactions emoji sur les entrées de timeline
- Édition des entrées de timeline par l'auteur

### 4. Gestion des releases

- Création de releases avec étapes
- États: created, in_progress, completed, cancelled, blocked
- Étapes ordonnées avec validation
- Blocage automatique si incident critique lié
- Validation des étapes par les membres

### 5. Communication temps réel (WebSocket)

- Événements Phase 1:
  - `incident_state_changed`
  - `incident_escalated`
  - `incident_assigned`
  - `timeline_entry_added`
  - `presence_update`

- Événements Phase 1 Extended:
  - `member_kicked`
  - `member_banned`
  - `timeline_entry_edited`
  - `private_message_received`
  - `reaction_added`
  - `reaction_removed`
  - `release_step_validated`
  - `release_state_changed`

### 6. Messages privés

- Communication directe entre membres d'équipe
- Historique des messages
- Notifications en temps réel

---

## Fonctionnalités Phase 2

### 1. Services externes

- Connexion à GitHub, GitLab, Discord
- Stockage sécurisé des tokens
- Authentification OAuth2 ou token-based

### 2. Moteur d'automation

- Création de règles: IF action THEN reaction
- Actions: push, pull_request, issue (GitHub)
- Réactions: create_issue, send_message (Discord)
- Déclenchement automatique via webhooks

### 3. Événements WebSocket Phase 2

- `rule_triggered`
- `rule_failed`

---

## Documentation

### Fichiers de documentation créés

1. **README.md** (462 lignes)
   - Architecture avec diagramme ASCII
   - Stack technique avec justifications
   - Instructions d'installation locale et Docker
   - Documentation API REST complète
   - Schéma de base de données commenté
   - Navigation du code
   - Configuration Docker et CI/CD

2. **UI_GUIDELINES.md** (355 lignes)
   - Palette de couleurs (5 couleurs primaires + sémantiques)
   - Typographie (3 niveaux de hiérarchie)
   - Grille d'espacement (multiples de 8px)
   - Mapping des états (Incident, Severity, Release, Roles)
   - Composants réutilisables
   - Accessibilité (WCAG 2.1 AA)
   - Dark patterns identifiés et évités
   - 2 captures d'écran annotées

3. **WEBSOCKET_SPEC.md** (512 lignes)
   - Connexion et authentification
   - Événements Phase 1 (5 événements)
   - Événements Phase 1 Extended (6 événements)
   - Événements Phase 2 (2 événements)
   - Format des messages et types de données
   - Reconnexion automatique avec backoff exponentiel
   - Liste des emojis disponibles (7 emojis)
   - Sécurité (validation tokens, rate limiting, sanitization)

4. **HOWTOCONTRIBUTE.md** (525 lignes)
   - Configuration de l'environnement
   - Comment ajouter un nouveau service externe
   - Comment ajouter une nouvelle Action
   - Comment ajouter une nouvelle REAction
   - Comment ajouter un nouvel événement WebSocket
   - Conventions de code (Rust, TypeScript, nommage)
   - Processus de pull request

---

## Points forts du projet

### 1. Architecture moderne et scalable

- Séparation claire des responsabilités
- WebSocket pour temps réel
- API REST pour CRUD
- Base de données relationnelle robuste

### 2. Sécurité

- Authentification JWT
- Tokens chiffrés pour services externes
- Validation des inputs
- Rate limiting sur WebSocket

### 3. Performance

- Rust pour backend (performance native)
- Next.js avec SSR/SSG
- Indexes PostgreSQL
- Optimisation des requêtes

### 4. Expérience utilisateur

- Interface moderne avec Tailwind CSS
- Communication en temps réel
- Notifications instantanées
- Accessibilité WCAG 2.1 AA

### 5. Documentation exhaustive

- 4 fichiers de documentation complets
- 1854 lignes de documentation
- Guide de contribution détaillé
- Spécification WebSocket précise

### 6. CI/CD

- Pipeline GitHub Actions
- Tests automatisés
- Linting (clippy, eslint)
- Build automatisé

---

## Défis rencontrés

### 1. Configuration de l'environnement

**Problème:** Configuration PostgreSQL locale complexe
**Solution:** Documentation détaillée et option Docker Compose

### 2. Version de Rust

**Problème:** Dépendances nécessitant Rust 1.86+ pour edition2024
**Solution:** Mise à jour vers Rust 1.88 dans Dockerfile

### 3. Next.js Standalone Output

**Problème:** Dockerfile nécessitant `.next/standalone`
**Solution:** Configuration `output: 'standalone'` dans next.config.js

### 4. Imports TypeScript inutilisés

**Problème:** Erreurs de compilation TypeScript
**Solution:** Nettoyage des imports inutilisés dans App.tsx

### 5. Dossier public manquant

**Problème:** Dockerfile échouant sans dossier public
**Solution:** Création du dossier public dans client-web

---

## Perspectives

### Améliorations futures

1. **Tests**
   - Tests unitaires Rust
   - Tests E2E avec Playwright
   - Tests d'intégration WebSocket

2. **Performance**
   - Mise en cache Redis
   - Pagination des résultats
   - Optimisation des requêtes SQL

3. **Fonctionnalités**
   - Notifications email
   - Intégration Slack
   - Dashboard avec métriques
   - Export de rapports

4. **Sécurité**
   - 2FA
   - Audit logs
   - Rate limiting avancé

5. **Déploiement**
   - Kubernetes
   - Monitoring (Prometheus, Grafana)
   - Logs centralisés (ELK)

---

## Conclusion

VIGIL est une application complète de gestion d'incidents et de releases qui démontre:

- **Maîtrise de Rust** pour le backend
- **Expertise Next.js** pour le frontend
- **Architecture microservices** moderne
- **Communication temps réel** avec WebSocket
- **Documentation professionnelle**
- **Pratiques DevOps** (Docker, CI/CD)

Le projet est prêt pour être présenté et peut servir de base pour des développements futurs.

---

**Développé par Florian Billon**  
**Projet académique T-DEV-600 / T-JSF-600**
