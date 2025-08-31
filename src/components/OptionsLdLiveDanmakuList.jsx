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

    getAllWebviewWindows().then(windows => {
        const win = windows.find(w => w.label === "ld_live_danmaku_list");

        if (win) {
            set_win(win);
        }
    });

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

                    set_win(new WebviewWindow("ld_live_danmaku_list", {
                        url: "#/window/ld_live_danmaku_list",
                        title: "LINUX DO Toolkit < LD Live Danmaku List",
                        alwaysOnTop: true,
                        transparent: true,
                        decorations: false,
                        width: 275,
                        height: 825
                    }));

                    win().once("ready", () => {
                        win().emit("state", {
                            settings: {
                                bg_image: form_data.get("bg_image"),
                                style: form_data.get("style"),
                                web_hook_host: form_data.get("web_hook_host"),
                                title: form_data.get("title"),
                                show_room_id: form_data.get("show_room_id")
                            },
                            room: {
                                id: form_data.get("room_id")
                            }
                        });
                    });

                    win().once("tauri://destroyed", () => set_win(null));
                }}
            >
                <FieldSet disabled={(() => !!win())()}>
                    <FormInputText
                        label="房间ID"
                        name="room_id"
                        id="room_id"
                        required
                    />
                    <FormInputText
                        label="自定义标题"
                        name="title"
                        id="title"
                    />
                    <FormInputCheckbox
                        label="显示房间ID"
                        name="show_room_id"
                        id="show_room_id"
                    />

                    <FormInputText
                        label="背景图像"
                        name="web_hook_host"
                        id="web_hook_host"
                    />
                    <FormTextarea
                        label="CSS"
                        name="style"
                        id="style"
                    />
                </FieldSet>

                <Button type="submit">{ win() ? "关闭" : "打开" }</Button>
            </Form>
        </section>
    );
}