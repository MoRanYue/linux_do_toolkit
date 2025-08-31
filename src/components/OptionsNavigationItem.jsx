import { A } from "@solidjs/router";
import styles from "../assets/options-navigation-item.module.less";

export function OptionsNavigationItem(props) {
    return (
        <A
            class={styles["options-navigation-item"]}
            activeClass={styles.active}
            href={props.href}
        >
            {props.children}
        </A>
    );
}
