import styles from "../assets/home.module.less";
import { Card } from "./Card";
import { Expander } from "./Expander";

export function Home() {
    return (
        <main class={styles.home}>
            <div class={styles.cards}>
                <Card title="LD Live弹幕展示器">
                    <Expander instruction="显示描述">
                        <p style={{ color: "var(--text-muted)" }}>
                            （此为主要面向LD Live主播的工具，能够创建1个，用于显示弹幕的置顶窗口呀）
                        </p>
                    </Expander>
                </Card>
            </div>
        </main>
    )
}