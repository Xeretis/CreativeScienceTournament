import { defineConfig } from 'vite'
import mkcert from "vite-plugin-mkcert";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: true,
    strictPort : true,
    proxy: {
      '/Api' : {
        target: 'https://localhost:7225',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/Api')
      }
    }
  }
})
