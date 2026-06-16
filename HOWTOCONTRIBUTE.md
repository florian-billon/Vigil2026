# How to Contribute - VIGIL

**Auteur:** Florian Billon  
**Version:** 0.1.0  
**Projet T-DEV-600 / T-JSF-600

Ce document guide les contributeurs pour ajouter de nouvelles fonctionnalités à VIGIL, notamment l'ajout de services externes, d'actions, de réactions et d'événements WebSocket.

## Table des matières

- [Configuration de l'environnement](#configuration-de-lenvironnement)
- [Ajouter un nouveau service](#ajouter-un-nouveau-service)
- [Ajouter une nouvelle Action](#ajouter-une-nouvelle-action)
- [Ajouter une nouvelle REAction](#ajouter-une-nouvelle-reaction)
- [Ajouter un nouvel événement WebSocket](#ajouter-un-nouvel-événement-websocket)
- [Conventions de code](#conventions-de-code)
- [Processus de pull request](#processus-de-pull-request)

## Configuration de l'environnement

### Prérequis

- Rust 1.75+
- Node.js 20+
- PostgreSQL 15+
- Docker et Docker Compose

### Installation locale

1. **Cloner le repository**
```bash
git clone https://github.com/florianbillon/vigil.git
cd vigil
```

2. **Configurer la base de données**
```bash
createdb vigil
cd server
sqlx database create
sqlx migrate run
```

3. **Démarrer les services**
```bash
# Terminal 1 - Serveur
cd server
cargo run

# Terminal 2 - Client web
cd client-web
npm install
npm run dev

# Terminal 3 - Client desktop (optionnel)
cd client-desktop
npm install
npm run tauri dev
```

### Installation avec Docker

```bash
docker-compose up -d
```

## Ajouter un nouveau service

Les services externes (GitHub, GitLab, Discord, etc.) permettent aux utilisateurs de connecter leurs comptes tiers à VIGIL.

### Étapes

1. **Ajouter le service dans `server/src/models.rs`**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ExternalService {
    GitHub,
    GitLab,
    Discord,
    // Ajouter votre nouveau service ici
    YourService,
}
```

2. **Créer le module de service dans `server/src/services/`**

```rust
// server/src/services/your_service.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct YourServiceConfig {
    pub token: String,
    pub webhook_url: Option<String>,
}

pub struct YourServiceClient {
    config: YourServiceConfig,
}

impl YourServiceClient {
    pub fn new(config: YourServiceConfig) -> Self {
        Self { config }
    }
    
    pub async fn verify_token(&self) -> Result<bool, anyhow::Error> {
        // Implémenter la vérification du token
        Ok(true)
    }
}
```

3. **Ajouter les routes dans `server/src/handlers.rs`**

```rust
use axum::{Json, routing::{get, post}, Router};
use crate::services::your_service::YourServiceClient;

pub async fn connect_your_service(
    Json(payload): Json<ConnectServiceRequest>,
) -> Result<Json<ConnectServiceResponse>, AppError> {
    // Implémenter la connexion du service
    Ok(Json(ConnectServiceResponse {
        success: true,
        message: "Service connected".to_string(),
    }))
}

// Ajouter la route dans le Router
pub fn create_router() -> Router {
    Router::new()
        .route("/services/github/connect", post(connect_github))
        .route("/services/your-service/connect", post(connect_your_service))
        // ... autres routes
}
```

4. **Mettre à jour `/about.json`**

```rust
// server/src/handlers.rs
pub async fn about() -> impl IntoResponse {
    Json(json!({
        "services": [
            {
                "name": "github",
                "display_name": "GitHub",
                "auth_type": "oauth2",
                "available_actions": ["push", "pull_request", "issue"],
                "available_reactions": ["create_issue", "comment"]
            },
            {
                "name": "your-service",
                "display_name": "Your Service",
                "auth_type": "token",
                "available_actions": ["event1", "event2"],
                "available_reactions": ["action1", "action2"]
            }
        ],
        "version": "0.1.0",
        "kickoff_token": "SHA256_HASH"
    }))
}
```

5. **Ajouter les tests**

```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_your_service_verification() {
        let config = YourServiceConfig {
            token: "test_token".to_string(),
            webhook_url: None,
        };
        let client = YourServiceClient::new(config);
        assert!(client.verify_token().await.unwrap());
    }
}
```

## Ajouter une nouvelle Action

Les Actions sont des événements déclencheurs provenant de services externes.

### Étapes

1. **Définir l'événement dans le module de service**

```rust
// server/src/services/your_service.rs
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum YourServiceEvent {
    Push {
        repository: String,
        branch: String,
        commit: String,
        author: String,
    },
    // Ajouter votre nouvel événement ici
    YourCustomEvent {
        field1: String,
        field2: i32,
    },
}
```

2. **Créer le handler webhook**

```rust
pub async fn handle_your_custom_event(
    Json(payload): Json<YourCustomEvent>,
    State(state): State<AppState>,
) -> Result<Json<StatusCode>, AppError> {
    // Traiter l'événement
    // Déclencher les règles correspondantes
    
    Ok(Json(json!({"status": "processed"})))
}
```

3. **Ajouter la route webhook**

```rust
pub fn create_router() -> Router {
    Router::new()
        .route("/webhooks/github", post(handle_github_webhook))
        .route("/webhooks/your-service", post(handle_your_custom_event))
}
```

4. **Documenter l'événement dans `WEBSOCKET_SPEC.md`**

```markdown
### your_custom_event

**Déclencheur:** Événement personnalisé de YourService

**Payload:**
```json
{
  "event": "your_custom_event",
  "data": {
    "field1": "value",
    "field2": 123
  }
}
```
```

## Ajouter une nouvelle REAction

Les REActions sont des actions exécutées en réponse à des événements déclencheurs.

### Étapes

1. **Définir la réaction dans le module de service**

```rust
// server/src/services/your_service.rs
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum YourServiceReaction {
    SendMessage {
        channel: String,
        message: String,
    },
    // Ajouter votre nouvelle réaction ici
    YourCustomReaction {
        target: String,
        data: String,
    },
}
```

2. **Implémenter la logique de réaction**

```rust
impl YourServiceClient {
    pub async fn execute_custom_reaction(
        &self,
        reaction: YourServiceReaction,
    ) -> Result<(), anyhow::Error> {
        match reaction {
            YourServiceReaction::YourCustomReaction { target, data } => {
                // Implémenter la logique
                self.send_custom_action(target, data).await?;
            }
            _ => {}
        }
        Ok(())
    }
    
    async fn send_custom_action(&self, target: String, data: String) -> Result<(), anyhow::Error> {
        // Implémenter l'appel API
        Ok(())
    }
}
```

3. **Intégrer dans le moteur de règles**

```rust
// server/src/rules.rs
pub async fn execute_rule(
    rule: &Rule,
    trigger_event: &TriggerEvent,
) -> Result<(), anyhow::Error> {
    match rule.reaction_service.as_str() {
        "your-service" => {
            let client = get_your_service_client(rule.team_id).await?;
            let reaction = parse_your_service_reaction(&rule.reaction_action)?;
            client.execute_custom_reaction(reaction).await?;
        }
        _ => {}
    }
    Ok(())
}
```

## Ajouter un nouvel événement WebSocket

Les événements WebSocket permettent la communication en temps réel entre le serveur et les clients.

### Étapes

1. **Définir l'événement dans `server/src/websocket.rs`**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "event")]
pub enum WsEvent {
    // Événements existants...
    #[serde(rename = "your_custom_event")]
    YourCustomEvent {
        resource_id: Uuid,
        user_id: Uuid,
        data: String,
    },
}
```

2. **Créer le handler de diffusion**

```rust
// server/src/websocket.rs
impl WsBroadcaster {
    pub async fn broadcast_custom_event(
        &self,
        resource_id: Uuid,
        user_id: Uuid,
        data: String,
    ) {
        let event = WsEvent::YourCustomEvent {
            resource_id,
            user_id,
            data,
        };
        self.broadcast(event).await;
    }
}
```

3. **Appeler la diffusion depuis les handlers**

```rust
// server/src/handlers.rs
pub async fn handle_some_action(
    State(state): State<AppState>,
) -> Result<Json<SuccessResponse>, AppError> {
    // ... logique de l'action
    
    // Diffuser l'événement WebSocket
    state.ws_broadcaster
        .broadcast_custom_event(resource_id, user_id, data)
        .await;
    
    Ok(Json(SuccessResponse { success: true }))
}
```

4. **Documenter l'événement dans `WEBSOCKET_SPEC.md`**

```markdown
### your_custom_event

**Déclencheur:** Votre événement personnalisé

**Payload:**
```json
{
  "event": "your_custom_event",
  "data": {
    "resource_id": "uuid",
    "user_id": "uuid",
    "data": "custom data"
  }
}
```

**Cibles:** [Définir les cibles]
```

5. **Implémenter la réception côté client**

```typescript
// client-web/src/hooks/useWebSocket.ts
export function useWebSocket(token: string) {
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws?token=${token}`);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.event) {
        case 'your_custom_event':
          handleCustomEvent(message.data);
          break;
        // ... autres événements
      }
    };
    
    return () => ws.close();
  }, [token]);
}
```

## Conventions de code

### Rust

- **Style:** Utiliser `cargo fmt` avant chaque commit
- **Linting:** `cargo clippy` doit passer sans erreurs
- **Tests:** Écrire des tests unitaires pour toute nouvelle logique
- **Documentation:** Commenter les fonctions publiques avec `///`

### TypeScript

- **Style:** Utiliser `prettier` avant chaque commit
- **Linting:** `eslint` doit passer sans erreurs
- **Typing:** Toujours utiliser des types explicites
- **Components:** Utiliser des composants fonctionnels avec hooks

### Nommage

- **Rust:** snake_case pour les fonctions et variables, PascalCase pour les types
- **TypeScript:** camelCase pour les fonctions et variables, PascalCase pour les composants
- **Base de données:** snake_case pour les tables et colonnes

## Processus de pull request

1. **Créer une branche**
```bash
git checkout -b feature/your-feature-name
```

2. **Faire les changements**
- Suivre les conventions de code
- Ajouter des tests
- Mettre à jour la documentation

3. **Tester localement**
```bash
# Rust
cd server
cargo test
cargo clippy
cargo fmt --check

# TypeScript
cd client-web
npm test
npm run lint
npx prettier --check .
```

4. **Commiter**
```bash
git add .
git commit -m "feat: add your feature description"
```

5. **Push et créer PR**
```bash
git push origin feature/your-feature-name
```

### Message de commit

Utiliser le format Conventional Commits:
- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatting
- `refactor:` refactoring
- `test:` tests
- `chore:` maintenance

### Review

- Au moins une approbation requise
- Tous les tests doivent passer
- CI/CD doit être vert

## Signalement de bugs

Pour signaler un bug, créer une issue sur GitHub avec:
- Titre descriptif
- Description détaillée
- Étapes pour reproduire
- Comportement attendu
- Environnement (OS, version)
- Logs pertinents

## Questions

Pour toute question, créer une issue avec le tag `question` ou contacter Florian Billon.

---

**Développé par Florian Billon**  
**Projet académique T-DEV-600 / T-JSF-600**