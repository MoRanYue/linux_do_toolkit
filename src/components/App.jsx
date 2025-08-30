import { TitleBar } from "./TitleBar";

export function App(props) {
    return (
        <>
            <TitleBar />

            {props.children}
        </>
    );
}
