import { createSignal } from "solid-js";
import styles from "../assets/expander.module.less";
import { Icon } from "./Icon";

export function Expander(props) {
    const [is_expanded, set_is_expanded] = createSignal(false);

    return (
        <div
            class={styles.expander}
            onMouseOver={props.expand_when_hover && (() => set_is_expanded(true))}
            onMouseLeave={props.expand_when_hover && (() => set_is_expanded(false))}
        >
            <div
                class={styles.instruction}
                onClick={!props.expand_when_hover && (() => set_is_expanded(e => !e))}
            >
                <span class={styles.text}>{props.instruction}</span>

                <Icon
                    class={styles.icon}
                    style={{ transform: is_expanded() ? "rotate(180deg)" : "rotate(0)" }}
                    name="Up"
                    size="1.125rem"
                />
            </div>

            <div class={styles.content} is_expanded={is_expanded()}>
                {props.children}
            </div>
        </div>
    );
}