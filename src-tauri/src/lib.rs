pub mod commands;

use tauri::{AppHandle, Manager, TitleBarStyle, WebviewUrl, WebviewWindowBuilder, WindowEvent};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build()
                )?;
            }

            let window_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
                .title("LINUX DO Toolkit")
                .inner_size(600.0, 400.0);

            #[cfg(target_os = "macos")]
            let window_builder = window_builder.title_bar_style(TitleBarStyle::Transparent);

            #[cfg(not(target_os = "macos"))]
            let window_builder = window_builder.decorations(false);

            let window = window_builder.build().unwrap();

            #[cfg(target_os = "macos")]
            {
                use cocoa::appkit::{NSColor, NSWindow};
                use cocoa::base::{id, nil};

                let ns_window = window.ns_window().unwrap() as id;
                unsafe {
                    let bg_color = NSColor::colorWithRed_green_blue_alpha_(
                        nil,
                        50.0 / 255.0,
                        158.0 / 255.0,
                        163.5 / 255.0,
                        1.0,
                    );

                    ns_window.setBackgroundColor_(bg_color);
                }
            }

            Ok(())
        })
        // .invoke_handler(tauri::generate_handler![
        //     commands::build_danmaku_list_window
        // ])
        .on_window_event(|window, ev| {
            match ev {
                WindowEvent::CloseRequested { api, .. } => {
                    if window.label() == "main" {
                        window.app_handle().exit(0);
                    }
                },
                _ => ()
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
