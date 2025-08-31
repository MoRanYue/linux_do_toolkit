import styles from "../assets/fieldset.module.less";

export function FieldSet(props) {
    return (
        <fieldset
            class={styles.fieldset}
            style={props.style}
            disabled={props.disabled}
        >
            {props.children}
        </fieldset>
    );
}