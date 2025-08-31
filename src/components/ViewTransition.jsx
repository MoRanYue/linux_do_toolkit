import { useBeforeLeave } from "@solidjs/router";
import { createSignal, useContext } from "solid-js";
import { char_count_in } from "../utils";
import "../assets/view-transition.less"

/**
 * @enum {string}
 */
const TransitionDirection = Object.freeze({
    Deeper: "Deeper",
    Same: "Same",
    Shallower: "Shallower"
});

export function ViewTransition(props) {
    const [is_transitioning, set_is_transitioning] = createSignal(false);

    useBeforeLeave(ev => {
        if (!document.startViewTransition || is_transitioning()) {
            return;
        }

        ev.preventDefault();

        set_is_transitioning(true);

        document.documentElement.dataset.transitionDirection =
            typeof ev.to === "string" ?
                (() => {
                    const from_depth = char_count_in(ev.from.pathname, "/");
                    const to_depth = char_count_in(ev.to, "/");

                    // console.log(ev.from.pathname, from_depth, ev.to, to_depth);

                    return from_depth < to_depth ?
                        TransitionDirection.Deeper :
                        from_depth == to_depth ?
                        TransitionDirection.Same :
                        TransitionDirection.Shallower
                })() :
                TransitionDirection.Same;

        const transition = document.startViewTransition(() => ev.retry());
        
        transition.finished.finally(() => {
            set_is_transitioning(false);
            delete document.documentElement.dataset.transitionDirection;
        })
    });

    return <>{props.children}</>;
}