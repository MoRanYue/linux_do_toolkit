import { createSignal } from "solid-js";
import styles from "../assets/input-password.module.less"
import { IconButton } from "./IconButton";

export function InputPassword(props) {
    const [is_displayed, set_is_displayed] = createSignal(false);

    return (
        <div class={`${styles["input-password"]} ${props.class || ""}`}>
            <input
                type={is_displayed() ? "text" : "password"}
                id={props.id}
                size="1"
                style={props.style}
                name={props.name}
                disabled={props.disabled}
                readonly={props.readonly}
                required={props.required}
                placeholder={props.placeholder}
                value={props.value ?? ""}
                pattern={props.pattern}
                ref={props.ref}
                onInput={props.onInput}
                onChange={props.onChange}
            />

            <IconButton
                title={is_displayed() ? "隐藏" : "显示"}
                name={is_displayed() ? "PreviewOpen" : "PreviewCloseOne"}
                size="1.125rem"
                onClick={() => set_is_displayed(v => !v)}
            />
        </div>
    );
}