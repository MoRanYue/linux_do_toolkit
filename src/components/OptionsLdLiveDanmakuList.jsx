import { getAllWebviewWindows, WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Show } from "solid-js";
import { Button } from "./Button";
import { createSignal } from "solid-js";
import { Form } from "./Form";
import { FormInputText } from "./FormInputText";
import { FormTextarea } from "./FormTextarea";
import { FormInputCheckbox } from "./FormInputCheckbox";
import { Window } from "@tauri-apps/api/window";
import { FieldSet } from "./FieldSet";
import { FormInputPassword } from "./FormInputPassword";

export function OptionsLdListDanmakuList() {
    let [win, set_win] = createSignal(null);

    WebviewWindow.getByLabel("ld_live_danmaku_list").then(w => set_win(w));

    let stored_state = localStorage.getItem("ld_list_danmaku_list_options");
    if (stored_state) {
        stored_state = JSON.parse(stored_state);
    }

    return (
        <section>
            <Form
                onSubmit={ev => {
                    ev.preventDefault();

                    if (win()) {
                        win().close();

                        set_win(null);
                    }
                    else {
                        new FormData(ev.target);
                    }
                }}
                onFormData={ev => {
                    ev.preventDefault();

                    const form_data = ev.formData;

                    if (import.meta.env.DEV) {
                        console.log(form_data.get("settings-show_room_id"));
                    }

                    const win = new WebviewWindow("ld_live_danmaku_list", {
                        url: "#/window/ld_live_danmaku_list",
                        title: "LINUX DO Toolkit < LD Live Danmaku List",
                        alwaysOnTop: true,
                        transparent: true,
                        decorations: false,
                        shadow: false,
                        width: 275,
                        height: 825
                    });

                    set_win(win);

                    const unlisten_ready = win.listen("ready", () => {
                        const state = {
                            settings: {
                                bg_image: form_data.get("settings-bg_image"),
                                web_hook: {
                                    url: form_data.get("settings-web_hook-url"),
                                    auth_token: form_data.get("settings-web_hook-auth_token")
                                },
                                title: form_data.get("settings-title"),
                                show_room_id: form_data.get("settings-show_room_id") == "true"
                            },
                            room: {
                                id: form_data.get("room-id")
                            }
                        };

                        localStorage.setItem("ld_list_danmaku_list_options", JSON.stringify(state));

                        win.emit("state", state);
                    });

                    win.onCloseRequested(() => {
                        unlisten_ready();

                        set_win(null);
                    });
                }}
            >
                <FieldSet disabled={(() => !!win())()}>
                    <FormInputText
                        label="房间ID"
                        name="room-id"
                        id="room-id"
                        value={stored_state && stored_state.room.id}
                        required
                    />
                    <FormInputText
                        label="自定义标题"
                        name="settings-title"
                        id="settings-title"
                        value={stored_state && stored_state.settings.title}
                    />
                    <FormInputCheckbox
                        label="显示房间ID"
                        name="settings-show_room_id"
                        id="settings-show_room_id"
                        checked={stored_state && stored_state.settings.show_room_id}
                    />
                    <FormInputText
                        label="背景图像"
                        name="settings-bg_image"
                        id="settings-bg_image"
                        value={stored_state && stored_state.settings.bg_image}
                    />
                    <FormInputText
                        label="WebHook URL"
                        name="settings-web_hook-url"
                        id="settings-web_hook-url"
                        value={stored_state && stored_state.settings.web_hook.url}
                    />
                    <FormInputPassword
                        label="WebHook验证"
                        name="settings-web_hook-auth_token"
                        id="settings-web_hook-auth_token"
                        value={stored_state && stored_state.settings.web_hook.auth_token}
                    />
                    
                </FieldSet>

                <Button type="submit">{ win() ? "关闭" : "打开" }</Button>
            </Form>
        </section>
    );
}