import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 自定义插件处理PWA相关请求
function pwaPlugin() {
  return {
    name: 'pwa-plugin',
    configureServer(server) {
      // 处理PWA相关请求
      server.middlewares.use('/@vite-plugin-pwa/pwa-entry-point-loaded', (req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/javascript')
        res.end('console.log("PWA entry point loaded");')
      })
      
      // 处理manifest请求
      server.middlewares.use('/manifest.webmanifest', (req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/manifest+json')
        res.end(JSON.stringify({
          name: "PM Eyes - 项目新探博客",
          short_name: "PM Eyes",
          description: "聚焦项目管理的目光，探索未来的视野",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#007bff"
        }))
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pwaPlugin()],
  // GitHub Pages配置 - 根据环境设置不同的base路径
  base: process.env.NODE_ENV === 'production' ? '/pmeyes.github.io/' : '/',
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
    // 确保构建输出适合 GitHub Pages
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
        // 确保资源路径正确
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        // 确保模块类型正确
        format: 'es',
      },
    },
    // 确保构建后的文件大小合理
    chunkSizeWarningLimit: 1000,
    // 确保正确的模块类型
    target: 'esnext',
  },
  server: {
    // 开发服务器配置
    port: 3000,
    open: true,
    // 处理PWA相关文件请求
    fs: {
      allow: ['..']
    }
  },
  preview: {
    // 预览服务器配置
    port: 4173,
  },
  // 禁用PWA相关功能，避免开发环境错误
  define: {
    __VUE_PROD_DEVTOOLS__: false,
  },
}) 