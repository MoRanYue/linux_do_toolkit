import { A } from "@solidjs/router";
import styles from "../assets/button-navigation.module.less";

export function ButtonNavigation(props) {
    return (
        <A
            class={`${styles["button-navigation"]} ${props.class || ""}`}
            style={props.style}
            href={props.href}
        >
            {props.children}
        </A>
    );
}