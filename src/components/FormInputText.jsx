import { InputText } from "./InputText";
import styles from "../assets/form-item.module.less"

export function FormInputText(props) {
    return (
        <div class={styles["form-item"]} style={props.style}>
            <label for={props.id}>
                { props.label }
            </label>
            
            <InputText
                class={`${styles.item} ${props.class}`}
                name={props.name}
                id={props.id}
                disabled={props.disabled}
                readonly={props.readonly}
                required={props.required}
                placeholder={props.placeholder ?? (props.required && "请输入内容")}
                value={props.value ?? ""}
                pattern={props.pattern}
                ref={props.ref}
                onInput={props.onInput}
                onChange={props.onChange}
            />
        </div>
    );
}