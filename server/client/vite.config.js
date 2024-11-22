import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    envDir: '../', // Points to the root directory of the server where .env is located
    define: {
        'process.env': {}, // Ensure environment variables are accessible
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:9000/api/',
                changeOrigin: true, // Ensures proxying across origins works
            },
        },
    },
});
