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
                    }
                    else {
                        new FormData(ev.target);
                    }
                }}
                onFormData={ev => {
                    ev.preventDefault();

                    const form_data = ev.formData;

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

                    win.once("ready", () => {
                        const state = {
                            settings: {
                                bg_image: form_data.get("bg_image"),
                                web_hook_host: form_data.get("web_hook_host"),
                                title: form_data.get("title"),
                                show_room_id: form_data.get("show_room_id") === "true"
                            },
                            room: {
                                id: form_data.get("room_id")
                            }
                        };

                        localStorage.setItem("ld_list_danmaku_list_options", JSON.stringify(state));

                        win.emit("state", state);
                    });

                    win.onCloseRequested(() => set_win(null));
                }}
            >
                <FieldSet disabled={(() => !!win())()}>
                    <FormInputText
                        label="房间ID"
                        name="room_id"
                        id="room_id"
                        value={stored_state && stored_state.room.id}
                        required
                    />
                    <FormInputText
                        label="自定义标题"
                        name="title"
                        id="title"
                        value={stored_state && stored_state.settings.title}
                    />
                    <FormInputCheckbox
                        label="显示房间ID"
                        name="show_room_id"
                        id="show_room_id"
                        value={stored_state && stored_state.settings.show_room_id}
                    />
                    <FormInputText
                        label="背景图像"
                        name="bg_image"
                        id="bg_image"
                        value={stored_state && stored_state.settings.bg_image}
                    />
                    <FormInputText
                        label="WebHook主机"
                        name="web_hook_host"
                        id="web_hook_host"
                        value={stored_state && stored_state.settings.web_hook_host}
                    />
                </FieldSet>

                <Button type="submit">{ win() ? "关闭" : "打开" }</Button>
            </Form>
        </section>
    );
}