import { splitProps } from "solid-js";
import styles from "../assets/icon-button.module.less";
import { Icon } from "./Icon";

export function IconButton(props) {
    const [button_props, icon_props] = splitProps(props, ["class", "type", "onClick", "title"]);

    return (
        <button
            class={`${styles["icon-button"]} ${button_props.class || ""}`}
            type={button_props.type ?? "button"}
            title={button_props.title}
            onClick={button_props.onClick}
        >
            <Icon {...icon_props} />
        </button>
    );
}