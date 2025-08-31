import { fetch } from "@tauri-apps/plugin-http";

/**
 * @param {string} s
 * @param {string} char
 */
export function char_count_in(s, char) {
    return Array.from(s)
        .reduce((prev_value, cur_value) => cur_value === char ? ++prev_value : prev_value, 0);
}

export class FetchError extends Error {
    constructor(status_code, content) {
        super("");

        this.name = "FetchError";
        this.status_code = status_code;
        this.content = JSON.stringify(content);

        this.message = `The server responded ${this.status_code} with content: ${this.content}`;
    }
}

export class TimeoutError extends Error {
    constructor() {
        super("Timeout exceeded");

        this.name = "TimeoutError";
    }
}

/**
 * @enum {string}
 */
export const HttpMethod = Object.freeze({
    Get: "GET",
    Post: "POST",
    Put: "PUT",
    Delete: "DELETE"
});

/**
 * @typedef {Object} FetchApiOptions
 * @property {string} path
 * @property {string} base_url
 * @property {HttpMethod} method
 * @property {number} [timeout_ms]
 * @property {Record<string, string | string[]>} [query]
 * @property {Record<string, string | string[]>} [headers]
 * @property {any} [body]
 * @property {Function} [token]
 */

/**
 * @param {FetchApiOptions} options
 */
export async function fetch_api(options) {
    const {
        path,
        base_url,
        method,
        timeout_ms = 10000,
        query = {},
        headers = {},
        token,
    } = options;

    let body = options.body || null;

    const final_headers = { ...headers };
    if (typeof token === 'function') {
        const token_ = token();

        if (token_) {
            final_headers.Authorization = token_;
        }
    }

    if (body != null && !(body instanceof FormData)) {
        if (!final_headers["Content-Type"]) {
            final_headers["Content-Type"] = "application/json;charset=utf-8";
        }

        if (final_headers["Content-Type"].includes("application/json")) {
            body = JSON.stringify(body);
        }
    }

    if (!final_headers["User-Agent"]) {
        final_headers["User-Agent"] = navigator.userAgent + " LINUX_DO_Toolkit/" + import.meta.env.VERSION;
    }

    const url = new URL(path, base_url);
    url.search = query ?
        "?" + Object.keys(query)
            .map(k => {
                const v = query[k];

                if (v) {
                    return encodeURIComponent(k) + "=" + encodeURIComponent(
                        Array.isArray(v) ? v.join(",") : v
                    );
                }

                return "";
            })
            .join("&") :
        "";

    const controller = new AbortController();

    const timer = setTimeout(() => controller.abort(new TimeoutError()), timeout_ms);
    const res = await fetch(
        url,
        {
            method,
            headers: final_headers,
            body,
            signal: controller.signal
        }
    );
    clearTimeout(timer);

    const content_type = res.headers.get("Content-Type") || "";

    if (res.ok) {
        return await (content_type.includes("application/json") ? res.json() : res.text());
    }
    
    const content = await (content_type.includes("application/json") ? res.json() : res.text());
    
    throw new FetchError(res.status, content);
}