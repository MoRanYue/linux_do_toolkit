import { defineConfig } from 'vite';
import solid_plugin from 'vite-plugin-solid';
import postcss_pxtorem from "postcss-pxtorem";
import pkg from "./package.json";

export default defineConfig({
    clearScreen: false,
    plugins: [solid_plugin()],
    server: {
        port: 3000,
        strictPort: true,
        watch: {
            ignored: [
                "**/src-tauri/**"
            ]
        }
    },
    envPrefix: [
        "VITE_",
        "TAURI_ENV_*"
    ],
    build: {
        target: "esnext",
        minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
        sourcemap: !!process.env.TAURI_ENV_DEBUG
    },
    define: {
        VERSION: JSON.stringify(pkg.version)
    },
    css: {
        preprocessorOptions: {
            less: {
                math: "always"
            }
        },
        postcss: {
            plugins: [
                postcss_pxtorem({
                    rootValue: 16,
                    propList: ["*", "!border-radius"]
                })
            ]
        }
    }
});
