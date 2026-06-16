# WebSocket Specification - VIGIL

**Auteur:** Florian Billon  
**Version:** 0.1.0  
**Projet T-DEV-600 / T-JSF-600

Ce document spécifie le protocole WebSocket utilisé par VIGIL pour la communication en temps réel entre le serveur et les clients (web et desktop).

## Table des matières

- [Connexion](#connexion)
- [Événements Phase 1](#événements-phase-1)
- [Événements Phase 1 Extended](#événements-phase-1-extended)
- [Événements Phase 2](#événements-phase-2)
- [Format des messages](#format-des-messages)
- [Reconnexion automatique](#reconnexion-automatique)

## Connexion

### Endpoint

```
ws://localhost:8080/ws
```

### Authentification

La connexion WebSocket nécessite un token d'authentification passé en paramètre query :

```
ws://localhost:8080/ws?token=<auth_token>
```

### Reconnexion automatique

Les clients doivent implémenter une reconnexion automatique avec backoff exponentiel :
- Tentative immédiate après déconnexion
- Intervalle exponentiel : 1s, 2s, 4s, 8s, 16s (maximum)
- Réinitialisation après connexion réussie

## Événements Phase 1

### incident_state_changed

**Déclencheur:** Changement d'état d'un Incident (open → acknowledged → escalated → resolved)

**Payload:**
```json
{
  "event": "incident_state_changed",
  "data": {
    "incident_id": "uuid",
    "state": "acknowledged",
    "user_id": "uuid",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Tous les membres de l'équipe de l'incident

---

### incident_escalated

**Déclencheur:** Escalade d'un Incident à un Responder ou Manager

**Payload:**
```json
{
  "event": "incident_escalated",
  "data": {
    "incident_id": "uuid",
    "escalated_to": "uuid",
    "escalated_by": "uuid",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Tous les membres de l'équipe de l'incident

---

### incident_assigned

**Déclencheur:** Assignation d'un Incident à un Responder

**Payload:**
```json
{
  "event": "incident_assigned",
  "data": {
    "incident_id": "uuid",
    "assigned_to": "uuid",
    "assigned_by": "uuid",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** 
- Le Responder assigné (notification prioritaire)
- Tous les membres de l'équipe de l'incident

---

### timeline_entry_added

**Déclencheur:** Ajout d'une entrée dans la timeline d'un Incident

**Payload:**
```json
{
  "event": "timeline_entry_added",
  "data": {
    "incident_id": "uuid",
    "entry_id": "uuid",
    "user_id": "uuid",
    "content": "Investigation en cours...",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Tous les membres de l'équipe de l'incident

---

### presence_update

**Déclencheur:** Changement de présence d'un utilisateur (connexion/déconnexion)

**Payload:**
```json
{
  "event": "presence_update",
  "data": {
    "user_id": "uuid",
    "team_id": "uuid",
    "online": true,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Tous les membres de l'équipe

---

## Événements Phase 1 Extended

### member_kicked

**Déclencheur:** Expulsion d'un membre d'une équipe

**Payload:**
```json
{
  "event": "member_kicked",
  "data": {
    "team_id": "uuid",
    "user_id": "uuid",
    "kicked_by": "uuid",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Tous les membres de l'équipe

---

### member_banned

**Déclencheur:** Bannissement (temporaire ou permanent) d'un membre

**Payload:**
```json
{
  "event": "member_banned",
  "data": {
    "team_id": "uuid",
    "user_id": "uuid",
    "ban_type": "temporary",
    "until": "2024-01-20T00:00:00Z",
    "banned_by": "uuid",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Note:** `until` est `null` pour les bannissements permanents

**Cibles:** Tous les membres de l'équipe

---

### timeline_entry_edited

**Déclencheur:** Édition d'une entrée de timeline par son auteur

**Payload:**
```json
{
  "event": "timeline_entry_edited",
  "data": {
    "incident_id": "uuid",
    "entry_id": "uuid",
    "user_id": "uuid",
    "content": "Investigation en cours... (modifié)",
    "edited_at": "2024-01-15T10:35:00Z",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Tous les membres de l'équipe de l'incident

---

### private_message_received

**Déclencheur:** Réception d'un message privé

**Payload:**
```json
{
  "event": "private_message_received",
  "data": {
    "message_id": "uuid",
    "sender_id": "uuid",
    "recipient_id": "uuid",
    "content": "Peux-tu m'aider ?",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Uniquement l'expéditeur et le destinataire (pas de broadcast à l'équipe)

---

### reaction_added

**Déclencheur:** Ajout d'une réaction emoji à une entrée de timeline

**Payload:**
```json
{
  "event": "reaction_added",
  "data": {
    "incident_id": "uuid",
    "entry_id": "uuid",
    "user_id": "uuid",
    "emoji": "👍",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Tous les membres de l'équipe de l'incident

**Note:** Les réactions ne s'appliquent qu'aux entrées de timeline d'Incidents, pas aux validations de Release steps ni aux messages privés

---

### reaction_removed

**Déclencheur:** Retrait d'une réaction emoji d'une entrée de timeline

**Payload:**
```json
{
  "event": "reaction_removed",
  "data": {
    "incident_id": "uuid",
    "entry_id": "uuid",
    "user_id": "uuid",
    "emoji": "👍",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Tous les membres de l'équipe de l'incident

---

### release_step_validated

**Déclencheur:** Validation d'une étape de Release

**Payload:**
```json
{
  "event": "release_step_validated",
  "data": {
    "release_id": "uuid",
    "step_id": "uuid",
    "validated_by": "uuid",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Tous les membres de l'équipe de la Release

---

### release_state_changed

**Déclencheur:** Changement d'état d'une Release

**Payload:**
```json
{
  "event": "release_state_changed",
  "data": {
    "release_id": "uuid",
    "state": "blocked",
    "linked_incident_id": "uuid",
    "user_id": "uuid",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Tous les membres de l'équipe de la Release

---

## Événements Phase 2

### rule_triggered

**Déclencheur:** Déclenchement d'une règle d'automation

**Payload:**
```json
{
  "event": "rule_triggered",
  "data": {
    "rule_id": "uuid",
    "team_id": "uuid",
    "action_service": "github",
    "action_event": "push",
    "reaction_service": "discord",
    "reaction_action": "send_message",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Tous les membres de l'équipe

---

### rule_failed

**Déclencheur:** Échec d'exécution d'une règle d'automation

**Payload:**
```json
{
  "event": "rule_failed",
  "data": {
    "rule_id": "uuid",
    "team_id": "uuid",
    "error": "Failed to send Discord message",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Cibles:** Tous les Managers de l'équipe

---

## Format des messages

### Structure générale

Tous les messages WebSocket suivent cette structure :

```json
{
  "event": "event_type",
  "data": {
    // Données spécifiques à l'événement
  }
}
```

### Types de données

- **UUID:** Chaîne au format UUID v4 (ex: `"550e8400-e29b-41d4-a716-446655440000"`)
- **Timestamp:** Chaîne au format ISO 8601 (ex: `"2024-01-15T10:30:00Z"`)
- **Boolean:** `true` ou `false`
- **String:** Chaîne de caractères
- **Integer:** Nombre entier

### Erreurs

En cas d'erreur, le serveur envoie :

```json
{
  "event": "error",
  "data": {
    "code": "AUTH_FAILED",
    "message": "Invalid authentication token"
  }
}
```

### Codes d'erreur

| Code | Description |
|------|-------------|
| `AUTH_FAILED` | Token d'authentification invalide |
| `FORBIDDEN` | Accès refusé |
| `NOT_FOUND` | Ressource non trouvée |
| `RATE_LIMITED` | Trop de requêtes |
| `SERVER_ERROR` | Erreur interne du serveur |

## Reconnexion automatique

### Stratégie de reconnexion

Les clients doivent implémenter une reconnexion automatique avec backoff exponentiel :

```typescript
// Exemple d'implémentation
let retryCount = 0;
const maxRetries = 5;
const baseDelay = 1000; // 1 seconde

function connect() {
  const ws = new WebSocket('ws://localhost:8080/ws?token=xxx');
  
  ws.onclose = () => {
    if (retryCount < maxRetries) {
      const delay = Math.min(baseDelay * Math.pow(2, retryCount), 16000);
      setTimeout(connect, delay);
      retryCount++;
    }
  };
  
  ws.onopen = () => {
    retryCount = 0; // Reset on successful connection
  };
}
```

### Intervales de reconnexion

| Tentative | Délai |
|----------|-------|
| 1 | 1s |
| 2 | 2s |
| 3 | 4s |
| 4 | 8s |
| 5 | 16s (maximum) |

### Gestion de la perte de connexion

- Détecter la déconnexion via `onclose` ou `onerror`
- Afficher un indicateur de connexion dans l'UI
- Mettre en file d'attente les messages non envoyés
- Reconnecter automatiquement avec backoff exponentiel

---

## Liste des emojis disponibles

Les réactions sont limitées à cet ensemble d'emojis (exposé via `GET /reactions/available`) :

| Emoji | Nom | Usage |
|-------|-----|-------|
| 👍 | +1 | Accord, approbation |
| 👎 | -1 | Désaccord |
| 👁️ | eyes | Vu, en observation |
| ⚠️ | warning | Attention |
| ✅ | check | Validé, confirmé |
| 🔥 | fire | Urgent, critique |
| 🎉 | tada | Célébration, succès |

---

## Sécurité

### Validation des tokens

- Le token doit être validé à la connexion
- Le token expire après inactivité (configurable, défaut: 24h)
- Le token est invalidé lors de la déconnexion explicite

### Rate limiting

- Maximum 100 messages par seconde par connexion
- Déconnexion automatique en cas de dépassement

### Sanitization

- Tous les payloads sont validés et sanitizés
- Les entrées utilisateur sont échappées pour prévenir XSS

---

**Développé par Florian Billon**  
**Projet académique T-DEV-600 / T-JSF-600**