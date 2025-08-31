import { A, useNavigate } from "@solidjs/router";
import styles from "../assets/home.module.less";
import { Button } from "./Button";
import { ButtonList } from "./ButtonList";
import { Card } from "./Card";
import { Expander } from "./Expander";
import { Form } from "./Form";
import { FormInputText } from "./FormInputText";
import { invoke } from "@tauri-apps/api/core";
import { TitleBar } from "./TitleBar";
import { ButtonNavigation } from "./ButtonNavigation";

export function Home() {
    return (
        <>
            <TitleBar />

            <main class={styles.home}>
                <div class={styles.cards}>
                    <Card title="LD Live弹幕展示器">
                        <Expander instruction="显示描述" expand_when_hover>
                            <p style={{ color: "var(--text-muted)" }}>
                                主要面向LD Live主播的工具，创建1个用于显示弹幕的置顶窗口。
                            </p>
                        </Expander>

                        <ButtonNavigation class={styles["button-navigation"]} href="/options/ld_live_danmaku_list">选项</ButtonNavigation>
                    </Card>

                    <Card title="论坛活跃">
                        <Expander instruction="显示描述" expand_when_hover>
                            <p style={{ color: "var(--text-muted)" }}>
                                包含多种用于论坛活跃与提升等级的工具。
                            </p>
                        </Expander>

                        <ButtonNavigation class={styles["button-navigation"]} href="/options/forum_activity">选项</ButtonNavigation>
                    </Card>
                </div>
            </main>
        </>
    )
}