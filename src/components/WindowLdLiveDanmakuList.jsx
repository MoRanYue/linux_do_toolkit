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

    let list_elem;

    const [state, set_state] = createStore({
        settings: {
            bg_image: "",
            web_hook: {
                url: null,
                auth_token: ""
            },
            show_room_id: true,
            title: null,
            session_token: null
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

    let scrolling_timer = null;

    const timer = setInterval(() => {
        if (!state.room.id) {
            return;
        }

        fetch_api({
            method: HttpMethod.Get,
            path: "/api/danmaku-list",
            base_url: BASE_URL,
            query: {
                roomId: state.room.id,
                since: state.update_time
            }
        })
            .then(data => {
                if (import.meta.env.DEV) {
                    console.log(data);
                }

                const danmakus = data.messages
                    .filter(d => {
                        for (let i = state.danmakus.length - 1; i > state.danmakus.length - 21 && i >= 0; i--) {
                            const original_d = state.danmakus[i];
                            
                            if (d.id == original_d.id) {
                                return false;
                            }
                        }

                        return true;
                    })
                    .map(d => {
                        return {
                            id: d.id,
                            text: d.text,
                            user_id: d.userId,
                            user_name: d.username,
                            color: d.color,
                            time: new Date(d.timestamp)
                        };
                    });
                
                set_state({
                    danmakus: state.danmakus.concat(danmakus),
                    update_time: new Date(data.lastUpdate)
                });
                
                if (danmakus.length) {
                    if (scrolling_timer) {
                        clearTimeout(scrolling_timer);
                    }
                    
                    scrolling_timer = setTimeout(() => {
                        list_elem.scrollTo({
                            behavior: "smooth",
                            top: list_elem.scrollHeight
                        });

                        scrolling_timer = null;
                    }, 1000);

                    if (state.settings.web_hook.url) {
                        fetch_api({
                            path: state.settings.web_hook.url,
                            method: HttpMethod.Post,
                            body: {
                                hook: "danmaku_sent",
                                danmakus: danmakus.map(d => { return { ...d, time: d.time.getTime() } })
                            }
                        });
                    }
                }
            })
            .catch(err => console.error(err));
        
        fetch_api({
            method: HttpMethod.Get,
            path: "/api/room-get",
            base_url: BASE_URL,
            query: {
                id: state.room.id
            }
        })
            .then(data => {
                if (import.meta.env.DEV) {
                    console.log(data);
                }

                set_state("room", {
                    title: data.room.title,
                    is_active: data.room.status === "active"
                });
            })
            .catch(err => console.error(err));
    }, 1000);

    let unlisten_state;
    win.listen("state", ev => {
        if (import.meta.env.DEV) {
            console.log(ev.payload);
        }

        set_state(ev.payload);
    }).then(f => {
        unlisten_state = f;

        win.emit("ready", null);
    });

    // if (import.meta.env.DEV) {
    //     setInterval(() => {
    //         set_state("danmakus", danmakus => danmakus.concat([{
    //             id: "test",
    //             text: "Test",
    //             user_id: "test",
    //             user_name: "Test User",
    //             color: "#000000",
    //             time: new Date()
    //         }]));
    //     }, 1000);
    // }

    onCleanup(() => {
        clearInterval(timer);

        unlisten_state();
    });

    return (
        <main class={styles["window-ld-live-danmaku-list"]}>
            {/* <Portal mount={document.head}>
                <style>{state.settings.style}</style>
            </Portal> */}

            <div class={styles.bg} style={{
                "background-image": state.settings.bg_image && `url(${state.settings.bg_image})`
            }} />

            <div class={styles.content}>
                <header class={styles.header} data-tauri-drag-region>
                    <Show when={state.room.is_active} fallback={<h1>未开始</h1>}>
                        <h2>{state.settings.title || state.room.title}</h2>

                        <Show when={state.settings.show_room_id}>
                            <p>{state.room.id}</p>
                        </Show>
                    </Show>
                </header>

                <ul class={styles.list} ref={list_elem}>
                    <For each={state.danmakus}>
                        {({ text, user_name }) => (
                            <Danmaku user_name={user_name}>{text}</Danmaku>
                        )}
                    </For>
                </ul>
            </div>
        </main>
    );
}