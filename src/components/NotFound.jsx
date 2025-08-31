import { TitleBar } from "./TitleBar";

export function NotFound() {
    return (
        <>
            <TitleBar />

            <main>
                <h1 style={{
                    "text-align": "center",
                    "font-size": "500%"
                }}>页面未找到</h1>
            </main>
        </>
    );
}