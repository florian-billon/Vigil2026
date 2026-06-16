use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "event")]
pub enum WsEvent {
    #[serde(rename = "incident_state_changed")]
    IncidentStateChanged {
        incident_id: Uuid,
        state: String,
        user_id: Uuid,
    },
    #[serde(rename = "incident_escalated")]
    IncidentEscalated {
        incident_id: Uuid,
        escalated_to: Uuid,
        escalated_by: Uuid,
    },
    #[serde(rename = "incident_assigned")]
    IncidentAssigned {
        incident_id: Uuid,
        assigned_to: Uuid,
        assigned_by: Uuid,
    },
    #[serde(rename = "timeline_entry_added")]
    TimelineEntryAdded {
        incident_id: Uuid,
        entry_id: Uuid,
        user_id: Uuid,
    },
    #[serde(rename = "presence_update")]
    PresenceUpdate {
        user_id: Uuid,
        team_id: Uuid,
        online: bool,
    },
}

pub struct WsBroadcaster;