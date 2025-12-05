import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const PORT = Number(process.env.VITE_PORT) || 8080;
const HOST = process.env.VITE_HOST || '0.0.0.0';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
	host: HOST,
	port: PORT,
	},
})
