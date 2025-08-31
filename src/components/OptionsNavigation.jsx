import { useNavigate } from "@solidjs/router";
import styles from "../assets/options-navigation.module.less";
import { IconButton } from "./IconButton";

export function OptionsNavigation(props) {
    const navigate = useNavigate();

    return (
        <nav class={styles["options-navigation"]}>
            <IconButton
                name="Home"
                size="1.5rem"
                title="返回首页"
                onClick={() => navigate("/")}
            />

            {props.children}
        </nav>
    );
}
