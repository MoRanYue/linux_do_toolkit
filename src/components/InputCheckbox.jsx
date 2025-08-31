import { createEffect, createSignal } from "solid-js";
import styles from "../assets/input-checkbox.module.less";

export function InputCheckbox(props) {
    return (
        <>
            {/* <input type="hidden" name={props.name} value="false" /> */}
            <input
                type="checkbox"
                class={`${styles["input-checkbox"]} ${props.class || ""}`}
                id={props.id}
                style={props.style}
                name={props.name}
                disabled={props.disabled}
                readonly={props.readonly}
                required={props.required}
                checked={props.checked || props.value}
                value="true"
                onChange={props.onChange}
            />
        </>
    );
}