import * as icons from "@icon-park/svg";
import { mergeProps, splitProps } from "solid-js";
import styles from "../assets/icon.module.less";

export function icon_config() {
    const colors = {
        fill: "oklch(0.15 0.16 180)",
        background: "oklch(0.4 0.16 180)"
    };

    return {
        theme: "outline",
        size: "1em",
        strokeWidth: 4,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        colors: {
            filled: colors,
            outline: colors
        }
    };
}

export function Icon(props) {
    const [icon_props, config_props] = splitProps(props, ["name", "class", "style"]);
    const merged_config_props = mergeProps(
        icon_config(),
        config_props
    );

    const icon = () => {
        if (Object.prototype.hasOwnProperty.call(icons, icon_props.name)) {
            return icons[icon_props.name](merged_config_props);
        }

        throw new Error(`Icon \`${name_prop.name}\` was not found`);
    };

    return (
        <span
            class={`${styles.icon} ${icon_props.class || ""}`}
            style={{
                ...icon_props.style,
                width: merged_config_props.size || "1rem",
                height: merged_config_props.size || "1rem",
            }}
            innerHTML={icon()}
        />
    );
}