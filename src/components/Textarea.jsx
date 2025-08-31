import styles from "../assets/textarea.module.less";

export function Textarea(props) {
    return (
        <textarea
            class={`${styles.textarea} ${props.class || ""}`}
            name={props.name}
            id={props.id}
            rows="1"
            cols="1"
            style={props.style}
            disabled={props.disabled}
            readonly={props.readonly}
            required={props.required}
            placeholder={props.placeholder}
            value={props.value ?? ""}
            onInput={props.onInput}
            onChange={props.onChange}
        />
    );
}