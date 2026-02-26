import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'

// 复制文章文件夹的插件
function copyArticlesPlugin() {
  // 复制文件夹的辅助函数
  function copyDir(src: string, dest: string) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }
    
    const items = fs.readdirSync(src)
    for (const item of items) {
      const srcPath = path.join(src, item)
      const destPath = path.join(dest, item)
      const stat = fs.statSync(srcPath)
      
      if (stat.isDirectory()) {
        copyDir(srcPath, destPath)
      } else {
        fs.copyFileSync(srcPath, destPath)
      }
    }
  }

  return {
    name: 'copy-articles',
    writeBundle() {
      // 复制整个 data 目录
      const dataSource = path.resolve(__dirname, 'data')
      const dataTarget = path.resolve(__dirname, 'dist/data')
      
      if (fs.existsSync(dataSource)) {
        // 确保目标目录存在
        if (!fs.existsSync(dataTarget)) {
          fs.mkdirSync(dataTarget, { recursive: true })
        }
        
        // 复制整个 data 目录
        copyDir(dataSource, dataTarget)
        console.log('✅ data 目录已复制到 dist/data')
      } else {
        console.log('⚠️  data 目录不存在，跳过复制')
      }
    }
  }
}

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
          name: "项界新探",
          short_name: "项界新探",
          description: "聚焦项目管理的目光，探索未来的视野",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#007bff"
        }))
      })

      // 处理数据文件请求（含 JSON 与 data/assets 下的图片等静态资源）
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/data/')) {
          const pathname = req.url.split('?')[0]
          const filePath = decodeURIComponent(pathname.replace(/^\/data\//, ''))
          const fullPath = path.resolve(__dirname, 'data', filePath)
          if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
            const ext = path.extname(fullPath).toLowerCase()
            const mime: Record<string, string> = {
              '.json': 'application/json',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.gif': 'image/gif',
              '.svg': 'image/svg+xml',
              '.webp': 'image/webp',
              '.ico': 'image/x-icon',
            }
            const contentType = mime[ext] ?? 'application/octet-stream'
            res.setHeader('Content-Type', contentType)
            res.setHeader('Cache-Control', 'no-cache')
            const buf = fs.readFileSync(fullPath)
            res.end(buf)
            return
          }
        }
        next()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pwaPlugin(), copyArticlesPlugin()],
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
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
        // 资源文件命名
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
      },
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: ['..']
    }
  },
  preview: {
    port: 4173,
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false,
  },
}) 