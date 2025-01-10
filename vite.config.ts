import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: "/ai-marketing-newsletter/", // Base URL for GitHub Pages
});