import { Suspense, useContext } from "solid-js";
import styles from "../assets/title-bar.module.less";
import { ButtonList } from "./ButtonList";
import { IconButton } from "./IconButton";
import { WindowContext } from "./WindowProvider";
import { createAsync } from "@solidjs/router";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export function TitleBar(props) {
    const cur_window = getCurrentWebviewWindow();

    const title = createAsync(() => cur_window.title());

    return (
        <>
            <div class={styles.placeholder} />

            <aside data-tauri-drag-region class={styles["title-bar"]}>
                <Suspense>
                    <div class={styles.content}>
                        <h1>{title()}</h1>
                    </div>
                </Suspense>

                <ButtonList>
                    <IconButton
                        title="最小化"
                        name="CollapseTextInput"
                        onClick={() => cur_window.minimize()}
                    />
                    <IconButton
                        title="切换最大化"
                        name="Square"
                        onClick={() => cur_window.toggleMaximize()}
                    />
                    <IconButton
                        title="关闭"
                        name="Close"
                        onClick={() => cur_window.close()}
                    />
                </ButtonList>
            </aside>
        </>
    );
}