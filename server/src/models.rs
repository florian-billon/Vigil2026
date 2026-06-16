use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Team {
    pub id: Uuid,
    pub name: String,
    pub invitation_code: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Role {
    Observer,
    Responder,
    Manager,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TeamMember {
    pub id: Uuid,
    pub team_id: Uuid,
    pub user_id: Uuid,
    pub role: Role,
    pub joined_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum IncidentState {
    Open,
    Acknowledged,
    Escalated,
    Resolved,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Severity {
    Low,
    Medium,
    High,
    Critical,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Incident {
    pub id: Uuid,
    pub team_id: Uuid,
    pub title: String,
    pub description: String,
    pub state: IncidentState,
    pub severity: Severity,
    pub assigned_to: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimelineEntry {
    pub id: Uuid,
    pub incident_id: Uuid,
    pub user_id: Uuid,
    pub content: String,
    pub created_at: DateTime<Utc>,
    pub edited_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ReleaseState {
    Created,
    InProgress,
    Completed,
    Cancelled,
    Blocked,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Release {
    pub id: Uuid,
    pub team_id: Uuid,
    pub title: String,
    pub state: ReleaseState,
    pub linked_incident_id: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReleaseStep {
    pub id: Uuid,
    pub release_id: Uuid,
    pub name: String,
    pub order: i32,
    pub validated: bool,
    pub validated_by: Option<Uuid>,
    pub validated_at: Option<DateTime<Utc>>,
}