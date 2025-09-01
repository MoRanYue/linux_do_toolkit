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
        headers = {}
    } = options;

    let body = options.body || null;

    const final_headers = { ...headers };

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
            credentials: "include",
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

export class FormDataParser {
    /**
     * @type {FormData}
     */
    form_data;
    /**
     * @type {object}
     */
    res;

    /**
     * @param {FormData} form_data
     */
    constructor(form_data) {
        this.form_data = form_data;
    }

    unflatten() {
        this.res = {};

        this.form_data.forEach((v, k) => this.set(k, v));

        return this.res;
    }

    /**
     * @private
     * @param {string} path
     * @param {any} [value]
     */
    set(path, value) {
        path.split("-").reduce((res, f) => {
            const [field, type] = FormDataParser.field_type(f);

            // console.log(field, type, value);

            switch (type) {
                case "Object":
                    if (typeof res[field] !== "object") {
                        res[field] = {};
                    }
                    return res[field];

                case "Vec":
                    if (!Array.isArray(res[field])) {
                        res[field] = [];
                    }
                    return res[field];

                case "String":
                    res[field] = !!value ? value : null;
                    break;

                case "NonNull(String)":
                    res[field] = value;
                    break;

                case "u8":
                    value = parseInt(value);
                    if (value < 0 || value > 255) {
                        throw new RangeError("`u8` must be ranged from 0 to 255");
                    }
                    res[field] = isNaN(value) ? null : value;
                    break;

                case "u16":
                    value = parseInt(value);
                    if (value < 0 || value > 65535) {
                        throw new RangeError("`u16` must be ranged from 0 to 65535");
                    }
                    res[field] = isNaN(value) ? null : value;
                    break;

                case "u32":
                    value = parseInt(value);
                    if (value < 0 || value > 4294967295) {
                        throw new RangeError("`u32` must be ranged from 0 to 4294967295");
                    }
                    res[field] = isNaN(value) ? null : value;
                    break;

                case "i32":
                    value = parseInt(value);
                    if (value < -2147483648 || value > 2147483647) {
                        throw new RangeError("`i32` must be ranged from -2147483648 to 2147483647");
                    }
                    res[field] = isNaN(value) ? null : value;
                    break;

                case "bool":
                    if (!["true", "false"].includes(value)) {
                        throw new TypeError("`bool` must be literally `true` or `false`");
                    }
                    res[field] = value === "true";
                    break;
                
                case "Lines":
                    res[field] = value.split(/\r?\n/);
                    break;
            
                default:
                    res[field] = null;
                    break;
            }
        }, this.res);
    }

    /**
     * @param {string} field_type
     * @returns {[string, object]}
     */
    static field_type(field_type) {
        const index = field_type.indexOf("(");

        const field = field_type.slice(0, index == -1 ? undefined : index);
        const type = index == -1 ? null : field_type.slice(index + 1, -1);
        
        if (type) {
            return [
                field,
                type
            ];
        }

        return [
            field,
            "Object"
        ];
    }
}