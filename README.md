# VIGIL - Operational Control Room

**Auteur:** Florian Billon  
**Version:** 0.5.0  
**Projet T-DEV-600 / T-JSF-600**

VIGIL est une salle de contrôle opérationnelle collaborative qui gère à la fois les déploiements planifiés (Releases) et les incidents imprévus en temps réel. Les équipes coordonnent leurs Releases et leurs Incidents, les deux étant connectés : une Release peut déclencher automatiquement un Incident, et un Incident actif peut bloquer une Release en cours.

## Table des matières

- [Architecture](#architecture)
- [Stack Technique](#stack-technique)
- [Installation](#installation)
- [API REST](#api-rest)
- [Base de données](#base-de-données)
- [Navigation du code](#navigation-du-code)
- [Docker](#docker)
- [CI/CD](#cicd)

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                              │
│              (GitHub, GitLab, webhooks...)                       │
└─────────────────────────────┬───────────────────────────────────┘
                              │ POST /webhooks/{service}
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Server                           │
│  ┌─────────────────┐    ┌──────────────────┐                    │
│  │ Webhook Receiver│───▶│   Hook Engine    │                    │
│  │ HMAC validation │    │ (rule evaluation)│                    │
│  └─────────────────┘    └──────────────────┘                    │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │ WS Broadcaster  │                          │
│                    │ - Release/Incident│                         │
│                    │   state updates  │                         │
│                    │ - Collaborative   │                         │
│                    │   timeline        │                         │
│                    │ - Presence        │                         │
│                    │ - Live feed       │                         │
│                    └─────────────────┘                          │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐              │
│         ▼                    ▼                    ▼              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   REST API  │    │Business Logic│    │ Persistence │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
└─────────────────────────────┬───────────────────────────────────┘
                              │ WebSocket + REST
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Web Client    │  │  Desktop Client │  │   Database      │
│   (Next.js)     │  │   (Tauri)       │  │   (PostgreSQL)  │
│                 │  │                 │  │                 │
│ - All features  │  │ - All features  │  │                 │
│ - Tray icon     │  │ - OS Notifications│                │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Stack Technique

### Application Server
- **Rust avec Axum** - Framework web asynchrone haute performance
  - **Justification:** Performance native, sécurité mémoire, excellent support async/await, écosystème mature pour les applications backend
  - **Alternative considérée:** Node.js avec Express - rejeté pour les performances inférieures et la gestion de concurrence

### Web Client
- **Next.js 14** - Framework React avec SSR/SSG
  - **Justification:** Excellent SEO, performances optimisées, routing intégré, support TypeScript natif
  - **Alternative considérée:** Create React App - rejeté pour l'absence de SSR et de routing intégré

### Desktop Client
- **Tauri** - Framework d'applications desktop avec Rust backend
  - **Justification:** Légèreté (binaires < 5MB), sécurité, performance native, intégration parfaite avec le serveur Rust
  - **Alternative considérée:** Electron - rejeté pour la taille excessive (100MB+) et la consommation mémoire élevée

### Base de données
- **PostgreSQL** - SGBD relationnel
  - **Justification:** Support des transactions, types de données riches, extensibilité, excellent support JSON
  - **Alternative considérée:** SQLite - rejeté pour les limitations en environnement multi-utilisateur

### CI/CD
- **GitHub Actions** - Pipeline d'intégration et déploiement
  - **Justification:** Intégration native avec GitHub, workflows YAML flexibles, marketplace riche

## Installation

### Prérequis

- Rust 1.75+
- Node.js 20+
- PostgreSQL 15+
- Docker et Docker Compose (optionnel)

### Installation locale

1. **Cloner le repository**
```bash
git clone https://github.com/florianbillon/vigil.git
cd vigil
```

2. **Configurer la base de données**
```bash
# Créer la base de données
createdb vigil

# Exécuter les migrations (à créer)
cd server
sqlx database create
sqlx migrate run
```

3. **Démarrer le serveur**
```bash
cd server
cargo run
```

Le serveur sera accessible sur `http://localhost:8080`

4. **Démarrer le client web**
```bash
cd client-web
npm install
npm run dev
```

Le client web sera accessible sur `http://localhost:3000`

5. **Démarrer le client desktop**
```bash
cd client-desktop
npm install
npm run tauri dev
```

### Installation avec Docker

```bash
docker-compose up -d
```

Services accessibles:
- Serveur: `http://localhost:8080`
- Client web: `http://localhost:8081`
- Base de données: `localhost:5432`

## API REST

### Endpoints

#### Health Check
```
GET /health
GET /
```

**Response:**
```json
{
  "status": "ok",
  "service": "vigil-server",
  "version": "0.1.0"
}
```

#### Authentication (Phase 1)
```
POST /auth/register
POST /auth/login
POST /auth/logout
GET /me
```

#### Teams (Phase 1)
```
POST /teams
GET /teams/:id
POST /teams/:id/members
POST /teams/:id/transfer-manager
```

#### Incidents (Phase 1)
```
POST /incidents
GET /incidents/:id
PUT /incidents/:id/state
PUT /incidents/:id/assign
POST /incidents/:id/timeline
```

#### Releases (Phase 1 Extended)
```
POST /releases
GET /releases/:id
PUT /releases/:id/state
POST /releases/:id/steps
PUT /releases/:id/steps/:step_id/validate
```

#### Webhooks (Phase 2)
```
POST /webhooks/:service
```

#### About (Phase 2)
```
GET /about.json
```

## Base de données

### Schéma

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    invitation_code VARCHAR(32) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('observer', 'responder', 'manager')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Incidents
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    state VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (state IN ('open', 'acknowledged', 'escalated', 'resolved')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    assigned_to UUID REFERENCES users(id),
    linked_release_id UUID REFERENCES releases(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline Entries
CREATE TABLE timeline_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    edited_at TIMESTAMP WITH TIME ZONE
);

-- Releases
CREATE TABLE releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    state VARCHAR(20) NOT NULL DEFAULT 'created' CHECK (state IN ('created', 'in_progress', 'completed', 'cancelled', 'blocked')),
    linked_incident_id UUID REFERENCES incidents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Release Steps
CREATE TABLE release_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID REFERENCES releases(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,
    validated BOOLEAN DEFAULT FALSE,
    validated_by UUID REFERENCES users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(release_id, "order")
);

-- Bans
CREATE TABLE bans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ban_type VARCHAR(20) NOT NULL CHECK (ban_type IN ('temporary', 'permanent')),
    until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Private Messages
CREATE TABLE private_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (sender_id != recipient_id)
);

-- Connected Services (Phase 2)
CREATE TABLE connected_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_name VARCHAR(50) NOT NULL,
    encrypted_token TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_name)
);

-- Rules (Phase 2)
CREATE TABLE rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    action_service VARCHAR(50) NOT NULL,
    action_event VARCHAR(100) NOT NULL,
    reaction_service VARCHAR(50) NOT NULL,
    reaction_action VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Navigation du code

### Structure du projet

```
vigil/
├── server/                 # Application Server (Rust + Axum)
│   ├── src/
│   │   ├── main.rs        # Point d'entrée, configuration serveur
│   │   ├── handlers.rs    # Handlers HTTP (routes REST)
│   │   ├── models.rs      # Modèles de données (User, Team, Incident, etc.)
│   │   ├── websocket.rs   # Gestionnaire WebSocket et événements
│   │   └── db.rs          # Configuration pool de base de données
│   ├── Cargo.toml         # Dépendances Rust
│   └── Dockerfile         # Conteneur Docker
│
├── client-web/            # Web Client (Next.js)
│   ├── src/
│   │   ├── app/           # Pages Next.js (App Router)
│   │   │   ├── layout.tsx # Layout principal
│   │   │   ├── page.tsx   # Page d'accueil
│   │   │   └── globals.css # Styles globaux
│   │   └── components/    # Composants React réutilisables
│   │       ├── Header.tsx
│   │       └── IncidentCard.tsx
│   ├── package.json       # Dépendances Node.js
│   └── Dockerfile         # Conteneur Docker
│
├── client-desktop/        # Desktop Client (Tauri)
│   ├── src/               # Code React/Vite
│   │   ├── App.tsx        # Composant principal
│   │   ├── main.tsx       # Point d'entrée React
│   │   └── index.css      # Styles
│   ├── src-tauri/         # Code Rust backend Tauri
│   │   ├── src/
│   │   │   └── main.rs   # Point d'entrée Tauri
│   │   ├── Cargo.toml     # Dépendances Rust Tauri
│   │   └── tauri.conf.json # Configuration Tauri
│   ├── package.json       # Dépendances Node.js
│   └── Dockerfile         # Conteneur Docker
│
├── public/                # Assets statiques
│   └── logo.svg           # Logo VIGIL
│
├── .github/
│   └── workflows/
│       └── ci.yml         # Pipeline CI/CD GitHub Actions
│
├── docker-compose.yml     # Orchestration Docker
├── README.md              # Ce fichier
├── UI_GUIDELINES.md       # Guidelines UX/UI
├── WEBSOCKET_SPEC.md      # Spécification WebSocket
└── HOWTOCONTRIBUTE.md     # Guide contribution
```

### Où trouver la logique métier

**Business Logic:** `server/src/handlers.rs` et `server/src/models.rs`
- Les handlers contiennent la logique de traitement des requêtes HTTP
- Les modèles définissent les structures de données et enums (IncidentState, Severity, Role, etc.)

**Routes HTTP:** `server/src/main.rs`
- Le Router Axum est configuré ici avec toutes les routes REST
- Middleware CORS et autres configurations globales

**Persistence:** `server/src/db.rs` et `server/src/models.rs`
- `db.rs` contient la configuration du pool de connexion PostgreSQL
- Les modèles peuvent être étendus avec des méthodes de persistance

**WebSocket Broadcaster:** `server/src/websocket.rs`
- Définition des événements WebSocket (WsEvent enum)
- Structure WsBroadcaster pour la diffusion des événements en temps réel

## Docker

### Services

- **db:** PostgreSQL 15 Alpine
- **server:** Application Server Rust (port 8080)
- **client_web:** Next.js Web Client (port 8081)
- **client_desktop:** Build service pour le client desktop

### Commandes

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire les images
docker-compose build
```

## CI/CD

### Pipeline GitHub Actions

Le pipeline CI/CD s'exécute sur:
- **Push sur toutes les branches:** Linting (clippy, ESLint, prettier) + Tests unitaires
- **Merge sur main:** Build complet + Tests d'intégration + Rapport de couverture
- **Création de tag (v*.*.*):** Build des artefacts de release (binaire desktop + image Docker)

### Qualité du code

- **Rust:** `cargo clippy` sans erreurs, `cargo fmt --check`
- **TypeScript:** ESLint avec configuration documentée, `prettier --check`
- **Couverture:** Minimum 70% de couverture de lignes, rapport publié comme artefact CI

### Seuils de qualité

- **Tests unitaires:** Couverture minimale 70%
- **Linting:** Doit passer sur chaque push
- **Formatting:** Code formaté selon les standards (rustfmt, prettier)

---

**Développé par Florian Billon**  
