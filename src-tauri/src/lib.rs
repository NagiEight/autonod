use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Node {
    id: u32,
    node_type: String,
    data: serde_json::Value,
    connections: Connections,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Connections {
    r#in: Vec<u32>,
    out: Vec<u32>,
}

#[tauri::command]
fn create_macro(path: &str) -> Result<String, String> {
    let file_path = Path::new(path);
    if file_path.exists() {
        return Err("Macro already exists".into());
    }

    let empty: Vec<Node> = Vec::new();
    let json = serde_json::to_string_pretty(&empty).map_err(|e| e.to_string())?;
    if let Some(parent) = file_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let mut file = File::create(file_path).map_err(|e| e.to_string())?;
    file.write_all(json.as_bytes()).map_err(|e| e.to_string())?;

    Ok(format!(
        "New macro file '{}' created in '{}'",
        file_path.file_name().unwrap().to_string_lossy(),
        file_path.parent().unwrap_or(Path::new("")).display()
    ))
}

#[tauri::command]
fn save_macro(path: &str, content: String) -> Result<String, String> {
    let file_path = Path::new(path);
    if let Some(parent) = file_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    let mut file = File::create(file_path).map_err(|e| e.to_string())?;
    file.write_all(content.as_bytes())
        .map_err(|e| e.to_string())?;

    let filename = file_path
        .file_name()
        .and_then(|f| f.to_str())
        .unwrap_or("unknown");
    let directory = file_path
        .parent()
        .and_then(|p| p.to_str())
        .unwrap_or("unknown");

    Ok(format!(
        "Filename '{}' has been saved to directory '{}'",
        filename, directory
    ))
}

#[tauri::command]
fn load_macro(path: &str) -> Result<Vec<Node>, String> {
    let mut file = File::open(path).map_err(|e| e.to_string())?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|e| e.to_string())?;
    let nodes: Vec<Node> = serde_json::from_str(&contents).map_err(|e| e.to_string())?;
    Ok(nodes)
}

#[tauri::command]
fn list_macros(dir_path: &str) -> Result<Vec<String>, String> {
    let entries = fs::read_dir(dir_path).map_err(|e| e.to_string())?;
    let mut names = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        if let Some(name) = entry.path().file_stem().and_then(|n| n.to_str()) {
            names.push(name.to_string());
        }
    }
    Ok(names)
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            create_macro,
            save_macro,
            load_macro,
            list_macros
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
