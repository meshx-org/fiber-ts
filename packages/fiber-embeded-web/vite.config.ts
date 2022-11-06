import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: { target: 'es2020' },
    optimizeDeps: {
        esbuildOptions: {
            target: 'es2020',
            supported: { bigint: true }
        }
    }
})
