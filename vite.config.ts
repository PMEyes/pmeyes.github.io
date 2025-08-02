import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 使用现代Sass配置
        additionalData: `@use "sass:color";`,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
}) 