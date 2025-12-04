import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const PORT = Number(process.env.VITE_PORT);
const HOST = process.env.VITE_HOST;

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
	host: HOST,
	port: PORT,
	},
})
