import { defineConfig} from 'vite'
import tailwindcss from '@tailwindcss/vite';
import 'dotenv/config';


const PORT = Number(process.env.VITE_PORT);
const HOST = process.env.VITE_HOST;

console.log(PORT);

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
	host: HOST,
	port: PORT,
	},
})
