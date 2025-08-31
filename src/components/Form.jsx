import styles from "../assets/form.module.less";

export function Form(props) {
    return (
        <form
            class={`${styles.form} ${props.class || ""}`}
            id={props.id}
            style={props.style}
            name={props.name}
            autocomplete={props.autocomplete ?? false}
            onSubmit={props.onSubmit}
            onFormData={props.onFormData}
        >
            {props.children}
        </form>
    );
}