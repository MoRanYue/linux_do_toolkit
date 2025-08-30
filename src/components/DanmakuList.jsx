import { For, Show, onCleanup, onMount } from "solid-js";
import styles from "../assets/danmaku-list.module.less";
import "../assets/transparent-bg.less";
import { API_BASE_URL, fetch_api, HttpMethod } from "../utils";
import { createStore, reconcile } from "solid-js/store";
import { Danmaku } from "./Danmaku";
import { createAsync, useParams, useSearchParams } from "@solidjs/router";

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

export function DanmakuList(props) {
    const params = useParams();

    const [search_params, set_search_params] = useSearchParams();

    const [info, set_info] = createStore({
        room: {
            title: "未定义",
            is_active: true
        },
        danmakus: [],
        update_time: new Date(),
        error: null
    });

    const danmakus = createAsync(async () => {
        let data;
        try {
            data = fetch_api({
                method: HttpMethod.Get,
                path: "/api/danmaku-list",
                query: {
                    roomId: params.room_id
                }
            });
        }
        catch (err) {
            console.error(err);
        }

        set_info({
            danmakus: info.danmakus.concat(data.messages.danmakus.map(d => {
                return {
                    id: d.id,
                    text: d.text,
                    user_id: d.userId,
                    user_name: d.username,
                    color: d.color,
                    time: new Date(d.timestamp)
                };
            })),
            update_time: new Date(data.data.update_timestamp)
        });
    });

    return (
        <main class={styles["danmaku-list"]} style={{
            "background-color": search_params.bg_color,
            "border-radius": search_params.border_radius,
            "--text": search_params.text_color,
            "--text-muted": search_params.muted_text_color,
            width: search_params.damaku_list_width,
            height: search_params.damaku_list_height
        }}>
            <div class={styles.bg} style={{
                "background-color": search_params.bg_color,
                "background-image": search_params.bg_image && `url("${search_params.bg_image}")`,
                filter: search_params.bg_filter && search_params.bg_filter
            }} />

            <div class={styles.content}>
                <Show when={info.room.is_active} fallback={<h1>未开始</h1>}>
                    <header class={styles.header}>
                        <h2>{search_params.title ?? info.room.title}</h2>

                        <Show when={search_params.show_room_id}>
                            <p>{params.id}</p>
                        </Show>
                    </header>

                    <ul class={styles.list}>
                        <For each={info.danmakus}>
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