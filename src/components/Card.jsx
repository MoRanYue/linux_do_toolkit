import { Show } from "solid-js";
import styles from "../assets/card.module.less";

export function Card(props) {
    return (
        <div class={`${styles.card} ${props.class}`} style={props.style}>
            <Show when={props.title}>
                <h3 class={styles.title}>{props.title}</h3>
            </Show>
            
            <div class={styles.content}>
                {props.children}
            </div>

            <Show when={props.footer}>
                <div class={styles.footer}>{props.footer}</div>
            </Show>
        </div>
    );
}
