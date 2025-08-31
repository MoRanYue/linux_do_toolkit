import styles from "../assets/button.module.less";

export function Button(props) {
    return (
        <button
            class={`${styles.button} ${props.class || ""}`}
            style={props.style}
            onClick={props.onClick}
            title={props.title}
            type={props.type ?? "button"}
            form={props.form}
        >
            {props.children}
        </button>
    );
}