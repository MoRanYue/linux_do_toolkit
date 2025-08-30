import styles from "../assets/button-list.module.less";

export function ButtonList(props) {
    return (
        <ul
            class={`${styles["button-list"]} ${props.class || ""}`}
            style={props.style}
        >
            {props.children}
        </ul>
    );
}