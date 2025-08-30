/* @refresh reload */

import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "normalize.css";
import "./assets/index.less"

import { App } from "./components/App";
import { DanmakuList } from "./components/DanmakuList";
import { NotFound } from "./components/NotFound";
import { Home } from "./components/Home";
import { WindowProvider } from "./components/WindowProvider";

render(() => (
    <WindowProvider>
        <Router root={App}>
            <Route path="/" component={Home} />
            <Route path="/room/:id" matchFilters={{ id: /.+/ }}>
                <Route path="/danmakus" component={DanmakuList} />
            </Route>
            <Route path="*" component={NotFound} />
        </Router>
    </WindowProvider>
), document.getElementById("root"));
