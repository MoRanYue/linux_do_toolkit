import styles from "../assets/form-item.module.less"
import { Textarea } from "./Textarea";

export function FormTextarea(props) {
    return (
        <div class={styles["form-item"]} style={props.style}>
            <label for={props.id}>
                { props.label }
            </label>
            
            <Textarea
                name={props.name}
                id={props.id}
                disabled={props.disabled}
                readonly={props.readonly}
                required={props.required}
                placeholder={props.placeholder ?? (props.required && "请输入内容")}
                value={props.value ?? ""}
                onInput={props.onInput}
                onChange={props.onChange}
            />
        </div>
    );
}