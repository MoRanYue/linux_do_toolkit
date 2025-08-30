import { Suspense, useContext } from "solid-js";
import styles from "../assets/title-bar.module.less";
import { ButtonList } from "./ButtonList";
import { IconButton } from "./IconButton";
import { WindowContext } from "./WindowProvider";
import { createAsync } from "@solidjs/router";

export function TitleBar(props) {
    const { main } = useContext(WindowContext);

    const title = createAsync(() => main.title());

    return (
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
                    onClick={() => main.minimize()}
                />
                <IconButton
                    title="切换最大化"
                    name="Square"
                    onClick={() => main.toggleMaximize()}
                />
                <IconButton
                    title="关闭"
                    name="Close"
                    onClick={() => main.close()}
                />
            </ButtonList>
        </aside>
    );
}