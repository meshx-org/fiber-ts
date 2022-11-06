import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [],
    build: { target: 'es2020', outDir: 'dist' },
    root: './',

    publicDir: 'public',
    optimizeDeps: {
        esbuildOptions: {
            target: 'es2020',
            supported: { bigint: true }
        }
    }
})
