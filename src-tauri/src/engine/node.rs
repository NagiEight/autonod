use crate::engine::utils::string_or_number_u64;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub enum Node {
    Start {
        #[serde(default)]
        data: Option<NodeData>,
    },
    End {
        #[serde(default)]
        data: Option<NodeData>,
    },
    WebLaunch {
        #[serde(default)]
        data: NodeData,
    },
    LaunchApp {
        #[serde(default)]
        data: NodeData,
    },
    CheckTask {
        #[serde(default)]
        data: NodeData,
    },
    Screenshot {
        #[serde(default)]
        data: NodeData,
    },
    Delay {
        #[serde(default)]
        data: NodeData,
    },
    #[serde(other)]
    Unknown,
}

#[derive(Debug, Deserialize, Default)]
pub struct NodeData {
    // Common fields
    #[serde(default)]
    pub process: Option<String>,
    #[serde(default)]
    pub state: Option<String>,
    #[serde(default)]
    pub path: Option<String>,
    #[serde(default)]
    pub args: Option<String>,

    // WebLaunch fields
    #[serde(default, rename = "url")]
    pub url: Option<String>,
    #[serde(default, rename = "newTab")]
    pub new_tab: Option<String>, // JSON has "" not true/false
    #[serde(default)]
    pub browser: Option<String>,
    #[serde(default)]
    pub wait: Option<String>, // JSON has "" not number
    #[serde(default)]
    pub incognito: Option<String>, // JSON has "" not true/false
    #[serde(default)]
    pub scroll: Option<String>, // JSON has "" not number

    // Screenshot fields
    #[serde(default, rename = "fileName")]
    pub file_name: Option<String>, // output file name
    #[serde(default)]
    pub region: Option<String>, // e.g. "x,y,w,h"

    // Delay node
    #[serde(default, deserialize_with = "string_or_number_u64")]
    pub duration: Option<u64>, // milliseconds
}
