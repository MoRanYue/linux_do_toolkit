import styles from "../assets/form-item.module.less";
import { InputCheckbox } from "./InputCheckbox";

export function FormInputCheckbox(props) {
    return (
        <div class={styles["form-item"]} style={props.style}>
            <label for={props.id}>
                {props.label}
            </label>
            
            <InputCheckbox
                id={props.id}
                name={props.name}
                disabled={props.disabled}
                readonly={props.readonly}
                required={props.required}
                checked={props.checked || props.value}
                onChange={props.onChange}
            />
        </div>
    );
}