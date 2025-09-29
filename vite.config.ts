import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: 3000,
		strictPort: false,
		allowedHosts: ['neatly-genuine-reindeer.ngrok-free.app', '6458ecdfc989.ngrok-free.app']
	},
	preview: {
		port: 3000,
		strictPort: false
	}
});
