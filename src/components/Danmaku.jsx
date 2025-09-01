import { Show } from "solid-js";
import styles from "../assets/danmaku.module.less";

/**
 * @param {string} s 
 * @returns {string}
 */
function color_from_3_chars(s) {
    let byte_r, byte_g, byte_b;
    switch (s.length) {
        case 0:
            return "rgba(255, 255, 255, 1.0)";

        case 1:
            byte_r = s.charCodeAt(0);
            
            return `rgba(${byte_r}, ${byte_r}, ${byte_r}, 1.0)`;
        
        case 2:
            byte_r = s.charCodeAt(0);
            byte_b = s.charCodeAt(1);
            byte_g = (byte_r + byte_b) * 0.5;
            
            return `rgba(${byte_r}, ${byte_g}, ${byte_b}, 1.0)`;
        
        default:
            byte_r = s.charCodeAt(0);
            byte_g = s.charCodeAt(1);
            byte_b = s.charCodeAt(2);
            
            return `rgba(${byte_r}, ${byte_g}, ${byte_b}, 1.0)`;
    }
}

export function Danmaku(props) {
    return (
        <li class={styles.danmaku}>
            <div class={styles["user-info"]}>
                <div class={styles.name}>
                    <span>{props.user_name}</span>
                </div>

                <div class={styles.avatar} style={{
                    "background-color": color_from_3_chars(props.user_name)
                }}>
                    {/* use user name as an alternative */}
                    <Show when={props.user_name !== "游客"}>
                        <span class={styles.image}>{props.user_name.charAt(0)}</span>
                    </Show>
                </div>
            </div>

            <div class={styles.metadata}>
                <span class={styles.time}>{props.time.toLocaleString()}</span>
            </div>

            <div class={styles.content}>
                {props.children}
            </div>
        </li>
    );
}