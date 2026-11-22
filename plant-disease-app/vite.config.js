import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// https://vite.dev/config/
export default defineConfig({
plugins: [react()],
server: {
// any request starting with /api is forwarded to the Express server
proxy: {
'/api': 'http://localhost:5000',
},
},
})