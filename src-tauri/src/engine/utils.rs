use open;
use std::ffi::OsStr;
use std::process::Command;
use std::time::Duration;
use sysinfo::System;
use tauri_plugin_opener::open_url;
use webbrowser;

use crate::engine::types::WebLaunchParams;
use screenshots::Screen;
use std::path::Path;
use tokio::time::sleep as async_sleep;
pub fn check_process_running(process: &str) -> bool {
    //println!("Checking if process '{}' is running...", process);
    return get_process_running(process);
}

fn get_process_running(process_name: &str) -> bool {
    let system = System::new_all();
    let converted_process_name: &OsStr = &OsStr::new(process_name);

    let is_running = system
        .processes_by_name(converted_process_name)
        .next()
        .is_some();

    if is_running {
        return true;
    } else {
        return false;
    }
}

pub fn execute_from_string(command: &str) {
    let result = Command::new(command).spawn();

    match result {
        Ok(_) => println!("executed command: {}", command),
        Err(e) => eprintln!("Failed to launch Waterfox: {}", e),
    }
}

pub fn execute_screenshot(
    file_name: &str,
    region: Option<(i32, i32, u32, u32)>, // x, y, width, height
) -> Result<(), String> {
    let screen = Screen::from_point(0, 0).map_err(|e| format!("Failed to get screen: {}", e))?;

    let image = if let Some((x, y, w, h)) = region {
        screen
            .capture_area(x, y, w, h)
            .map_err(|e| format!("Failed to capture area: {}", e))?
    } else {
        screen
            .capture()
            .map_err(|e| format!("Failed to capture screen: {}", e))?
    };

    let path = Path::new(file_name);
    image
        .save(path)
        .map_err(|e| format!("Failed to save screenshot: {}", e))?;

    println!("Screenshot saved to {}", file_name);
    Ok(())
}

pub async fn execute_delay(ms: u64) {
    async_sleep(Duration::from_millis(ms)).await;
}

pub fn execute_weblaunch_with_params(
    url: &str,
    new_tab: bool,
    browser: &str,     // "default", "chrome", "firefox", "edge"
    wait: Option<u64>, // milliseconds
    incognito: bool,
    scroll: Option<u32>,
) -> Result<(), String> {
    webbrowser::open(url);

    // Optional scroll (placeholder — needs WebDriver for real automation)
    if let Some(px) = scroll {
        println!("Scroll to {}px (requires WebDriver integration)", px);
    }

    Ok(())
}
pub fn string_or_number_u64<'de, D>(deserializer: D) -> Result<Option<u64>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    use serde::Deserialize;
    let val: Option<serde_json::Value> = Option::deserialize(deserializer)?;
    Ok(match val {
        Some(serde_json::Value::Number(n)) => n.as_u64(),
        Some(serde_json::Value::String(s)) => s.parse::<u64>().ok(),
        _ => None,
    })
}
