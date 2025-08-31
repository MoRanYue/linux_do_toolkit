import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import styles from "../assets/window-ld-live-danmaku-list.module.less";
import "../assets/transparent-bg.less";
import { fetch_api, HttpMethod } from "../utils";
import { createStore, reconcile } from "solid-js/store";
import { Danmaku } from "./Danmaku";
import { createAsync, useParams, useSearchParams } from "@solidjs/router";
import { Portal } from "solid-js/web";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

/**
 * @typedef {object} DanmakuView
 * @property {string} id
 * @property {string} text
 * @property {string} user_id
 * @property {string} user_name
 * @property {string} color
 * @property {Date} time
 */

/**
 * @typedef {object} RoomView
 * @property {string} title
 * @property {boolean} is_active
 * @property {string} user_id
 * @property {string} user_name
 */

const BASE_URL = "https://live.smnet.studio";

export function WindowLdLiveDanmakuList(props) {
    const win = getCurrentWebviewWindow();

    const [state, set_state] = createStore({
        settings: {
            bg_image: "",
            style: "",
            web_hook_host: null,
            show_room_id: true,
            title: null
        },
        room: {
            id: "",
            title: "",
            is_active: false
        },
        danmakus: [],
        update_time: new Date(),
        error: null
    });

    const timer = setInterval(() => {
        if (!state.room.id) {
            return;
        }

        fetch_api({
            method: HttpMethod.Get,
            path: "/api/danmaku-list",
            base_url: BASE_URL,
            query: {
                roomId: state.room.id
            }
        })
            .then(data => set_state({
                danmakus: [
                    ...state.danmakus,
                    ...data.messages.danmakus.map(d => {
                        return {
                            id: d.id,
                            text: d.text,
                            user_id: d.userId,
                            user_name: d.username,
                            color: d.color,
                            time: new Date(d.timestamp)
                        };
                    })
                ],
                update_time: new Date(data.data.update_timestamp)
            }))
            .catch(err => console.error(err));
        
        fetch_api({
            method: HttpMethod.Get,
            path: "/api/room-get",
            base_url: BASE_URL,
            query: {
                id: state.room.id
            }
        })
            .then(data => set_state("room", reconcile({
                title: data.room.title,
                is_active: data.room.status === "active"
            })))
            .catch(err => console.error(err));
    }, 1000);

    let unlisten_state;
    win.listen("state", ev => {
        if (import.meta.env.DEV) {
            console.log(ev.payload);
        }

        set_state(reconcile(ev.payload));
    }).then(f => {
        unlisten_state = f;

        win.emit("ready", null);
    });

    onCleanup(() => {
        clearInterval(timer);

        unlisten_state();
    });

    return (
        <main class={styles["window-ld-live-danmaku-list"]}>
            <Portal mount={document.head}>
                <style>{state.settings.style}</style>
            </Portal>

            <div class={styles.bg} style={{
                "background-image": state.settings.bg_image
            }} />

            <div class={styles.content}>
                <Show when={state.room.is_active} fallback={(
                    <header class={styles.header} data-tauri-drag-region>
                        <h1>未开始</h1>
                    </header>
                )}>
                    <header class={styles.header} data-tauri-drag-region>
                        <h2>{state.settings.title || state.room.title}</h2>

                        <Show when={state.settings.show_room_id}>
                            <p>{params.id}</p>
                        </Show>
                    </header>

                    <ul class={styles.list}>
                        <For each={state.danmakus}>
                            {item => (
                                <Danmaku item={item} />
                            )}
                        </For>
                    </ul>
                </Show>
            </div>
        </main>
    );
}