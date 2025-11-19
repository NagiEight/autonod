use serde::Deserialize;

use crate::engine::node::Node;

#[derive(Debug, Deserialize)]
pub struct Workflow {
    pub id: u32,
    #[serde(flatten)]
    pub node: Node,
    pub position: Position,
    pub connections: Connections,
}

#[derive(Debug, Deserialize)]
pub struct Position {
    pub x: f64,
    pub y: f64,
}

#[derive(Debug, Deserialize)]
pub struct Connections {
    #[serde(default)]
    pub inputs: Vec<Connection>,
    #[serde(default)]
    pub outputs: Vec<Connection>,
}

#[derive(Debug, Deserialize)]
pub struct Connection {
    #[serde(rename = "nodeId")]
    pub node_id: u32,
    #[serde(rename = "type")]
    pub conn_type: String,
}

pub struct WebLaunchParams {
    pub url: String,
    pub new_tab: bool,
    pub browser: String,   // "default", "chrome", "firefox", "edge"
    pub wait: Option<u64>, // milliseconds
    pub incognito: bool,
    pub scroll: Option<u32>,
}
