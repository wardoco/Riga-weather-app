import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    devServer: {
        https: true,
    },
    build: {
        minify: false,
        chunkSizeWarningLimit: 5000,
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].css',
                chunkFileNames: 'assets/chunk-[name].js',
            }
        }
    }
})
