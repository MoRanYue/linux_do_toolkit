import { TitleBar } from "./TitleBar";
import { OptionsNavigation } from "./OptionsNavigation";
import { OptionsNavigationItem } from "./OptionsNavigationItem";
import styles from "../assets/options.module.less";

export function Options(props) {
    return (
        <>
            <TitleBar />

            <main class={styles.options}>
                <OptionsNavigation>
                    <OptionsNavigationItem href="/options/ld_live_danmaku_list">
                        LD Live弹幕展示器
                    </OptionsNavigationItem>
                    <OptionsNavigationItem href="/options/forum_activity">
                        论坛活跃
                    </OptionsNavigationItem>
                </OptionsNavigation>
                
                <div class={styles.content}>
                    {props.children}
                </div>
            </main>
        </>
    );
}
