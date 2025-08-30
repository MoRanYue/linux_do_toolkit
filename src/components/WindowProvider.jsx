import { createContext } from "solid-js";
import { Window } from "@tauri-apps/api/window";

export const WindowContext = createContext();

export function WindowProvider(props) {
    return (
        <WindowContext.Provider value={{ main: new Window("main") }}>
            {props.children}
        </WindowContext.Provider>
    );
}