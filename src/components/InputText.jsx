import styles from "../assets/input-text.module.less"

export function InputText(props) {
    return (
        <input
            type="text"
            class={`${styles["input-text"]} ${props.class || ""}`}
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
    );
}