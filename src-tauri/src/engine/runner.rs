use crate::engine::node::Node as NodeType;
use crate::engine::types::Workflow;
use crate::engine::utils::{
    check_process_running, execute_delay, execute_from_string, execute_screenshot,
    execute_weblaunch_with_params,
};
use serde_json::Value;
use std::fs::File;
use std::io::BufReader;

pub async fn run_workflow_from_file(path: &str) {
    let file = File::open(path).expect("Failed to open workflow file");
    let reader = BufReader::new(file);

    // Step 1: Read raw JSON for inspection
    let raw_json: Value = serde_json::from_reader(reader).expect("Invalid JSON format");
    println!("Raw JSON loaded:\n{:#}", raw_json);

    //Deserialize into Workflow structs
    let workflow: Vec<Workflow> = serde_json::from_value(raw_json).expect("Deserialization failed");

    //Run the workflow
    run_workflow(workflow).await;
}

pub async fn run_workflow(workflow: Vec<Workflow>) {
    use std::collections::HashMap;

    let node_map: HashMap<u32, &Workflow> = workflow.iter().map(|n| (n.id, n)).collect();
    let mut current_id = 1;

    loop {
        let node = match node_map.get(&current_id) {
            Some(n) => n,
            None => {
                println!("Node {} not found", current_id);
                break;
            }
        };

        match &node.node {
            NodeType::Start { .. } => {
                println!("→ Node {}: Start", node.id);
                current_id = node
                    .connections
                    .outputs
                    .get(0)
                    .map(|c| c.node_id)
                    .unwrap_or(0);
            }
            NodeType::CheckTask { data } => {
                println!(
                    "→ Node {}: CheckTask (process: '{}')",
                    node.id,
                    data.process.as_deref().unwrap_or("<none>")
                );

                let proc_name = data.process.as_deref().unwrap_or("");
                //println!("Checking if process '{}' is running...", proc_name);
                let is_running = check_process_running(proc_name);

                current_id = if is_running {
                    node.connections
                        .outputs
                        .get(1)
                        .map(|c| c.node_id)
                        .unwrap_or(0)
                } else {
                    node.connections
                        .outputs
                        .get(0)
                        .map(|c| c.node_id)
                        .unwrap_or(0)
                };
            }

            NodeType::LaunchApp { data } => {
                println!(
                    "→ Node {}: LaunchApp (path: '{}', args: '{}')",
                    node.id,
                    data.path.as_deref().unwrap_or("<none>"),
                    data.args.as_deref().unwrap_or("")
                );

                // let path = data.path.as_deref().unwrap_or("<missing>");
                // let args = data.args.as_deref().unwrap_or("");
                let merged = data.path.as_deref().unwrap_or_default().to_string()
                    + data.args.as_deref().unwrap_or_default();

                execute_from_string(&merged);
                //println!("Launching '{}' with args: '{}'", path, args);
                current_id = node
                    .connections
                    .outputs
                    .get(0)
                    .map(|c| c.node_id)
                    .unwrap_or(0);
            }
            NodeType::WebLaunch { data } => {
                let url = data.url.as_deref().unwrap_or("<none>");
                println!("→ Node {}: WebLaunch (url: '{}')", node.id, url);

                // Parse string fields to their correct types
                let new_tab = data
                    .new_tab
                    .as_deref()
                    .unwrap_or("false")
                    .parse::<bool>()
                    .unwrap_or(false);
                let incognito = data
                    .incognito
                    .as_deref()
                    .unwrap_or("false")
                    .parse::<bool>()
                    .unwrap_or(false);
                let wait = data.wait.as_deref().and_then(|s| {
                    if s.is_empty() {
                        None
                    } else {
                        s.parse::<u64>().ok()
                    }
                });
                let scroll = data.scroll.as_deref().and_then(|s| {
                    if s.is_empty() {
                        None
                    } else {
                        s.parse::<u32>().ok()
                    }
                });
                let browser = data.browser.as_deref().unwrap_or("default");
                print!("browser: {}", browser);
                if let Err(e) =
                    execute_weblaunch_with_params(url, new_tab, browser, wait, incognito, scroll)
                {
                    eprintln!("WebLaunch failed: {}", e);
                }

                current_id = node
                    .connections
                    .outputs
                    .get(0)
                    .map(|c| c.node_id)
                    .unwrap_or(0);
            }

            NodeType::Screenshot { data } => {
                println!("→ Node {}: Screenshot", node.id);

                let file_name = data.file_name.as_deref().unwrap_or("screenshot.png");
                println!("file_name: {}", file_name);
                // Parse region string "x,y,w,h" into (i32, i32, u32, u32)
                let region = data.region.as_deref().and_then(|s| {
                    let parts: Vec<&str> = s.split(',').collect();
                    if parts.len() == 4 {
                        Some((
                            parts[0].parse::<i32>().ok()?,
                            parts[1].parse::<i32>().ok()?,
                            parts[2].parse::<u32>().ok()?,
                            parts[3].parse::<u32>().ok()?,
                        ))
                    } else {
                        None
                    }
                });

                if let Err(e) = execute_screenshot(file_name, region) {
                    eprintln!("Screenshot failed: {}", e);
                }

                current_id = node
                    .connections
                    .outputs
                    .get(0)
                    .map(|c| c.node_id)
                    .unwrap_or(0);
            }
            NodeType::Delay { data } => {
                println!("→ Node {}: Delay", node.id);

                if let Some(ms) = data.duration {
                    execute_delay(ms).await;
                } else {
                    println!("No duration specified, skipping delay.");
                }

                current_id = node
                    .connections
                    .outputs
                    .get(0)
                    .map(|c| c.node_id)
                    .unwrap_or(0);
            }

            NodeType::End { .. } => {
                //println!("Workflow ended at node {}", node.id);
                println!("→ Node {}: End", node.id);
                break;
            }
            NodeType::Unknown => {
                //println!("Unknown node type at node {}", node.id);
                println!("→ Node {}: Unknown", node.id);
                break;
            }
        }

        if current_id == 0 {
            println!("Terminating due to missing connection");
            break;
        }
    }
}
