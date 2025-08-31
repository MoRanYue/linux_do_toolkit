/* @refresh reload */

import { render } from "solid-js/web";
import { lazy } from "solid-js";
import { Router, Route, HashRouter } from "@solidjs/router";

import "normalize.css";
import "./assets/index.less"

import { WindowLdLiveDanmakuList } from "./components/WindowLdLiveDanmakuList";
import { NotFound } from "./components/NotFound";
import { Home } from "./components/Home";
import { WindowProvider } from "./components/WindowProvider";
import { ViewTransition } from "./components/ViewTransition";
import { Options } from "./components/Options";
import { OptionsForumActivity } from "./components/OptionsForumActivity";
import { OptionsLdListDanmakuList } from "./components/OptionsLdLiveDanmakuList";

render(() => (
    <WindowProvider>
        <HashRouter root={ViewTransition}>
            <Route path="/" component={Home} />
            <Route path="/options" component={Options}>
                <Route path="/ld_live_danmaku_list" component={OptionsLdListDanmakuList} />
                <Route path="/forum_activity" component={OptionsForumActivity} />
            </Route>
            <Route path="/window">
                <Route path="/ld_live_danmaku_list" component={WindowLdLiveDanmakuList} matchFilters={{ id: /.+/ }} />
            </Route>
            <Route path="*" component={NotFound} />
        </HashRouter>
    </WindowProvider>
), document.getElementById("root"));
