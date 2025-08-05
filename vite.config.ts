import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'

// 复制文章文件夹的插件
function copyArticlesPlugin() {
  return {
    name: 'copy-articles',
    writeBundle() {
      // 复制文章文件夹
      const sourceDir = path.resolve(__dirname, 'articles')
      const targetDir = path.resolve(__dirname, 'dist/articles')
      
      // 确保目标目录存在
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }
      
      // 复制文件夹
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
      
      if (fs.existsSync(sourceDir)) {
        copyDir(sourceDir, targetDir)
        console.log('✅ 文章文件夹已复制到 dist/articles')
      }
      
      // 复制文章元数据文件
      const articlesJsonSource = path.resolve(__dirname, 'src/data/articles.json')
      const articlesJsonTarget = path.resolve(__dirname, 'dist/data/articles.json')
      
      if (fs.existsSync(articlesJsonSource)) {
        // 确保目标目录存在
        const targetDir = path.dirname(articlesJsonTarget)
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true })
        }
        
        fs.copyFileSync(articlesJsonSource, articlesJsonTarget)
        console.log('✅ 文章元数据文件已复制到 dist/data/articles.json')
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
      
      // 处理文章元数据请求
      server.middlewares.use('/data/articles.json', (req, res) => {
        try {
          const articlesPath = path.resolve(__dirname, 'src/data/articles.json')
          if (fs.existsSync(articlesPath)) {
            const content = fs.readFileSync(articlesPath, 'utf-8')
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(content)
          } else {
            res.statusCode = 404
            res.end('Articles data not found')
          }
        } catch (error) {
          res.statusCode = 500
          res.end('Error loading articles data')
        }
      })
      
      // 处理文章文件请求
      server.middlewares.use('/articles/:path(*)', (req, res) => {
        try {
          const articlePath = req.params.path
          const fullPath = path.resolve(__dirname, `articles/${articlePath}`)
          
          // 安全检查：确保路径在 articles 目录内
          const articlesDir = path.resolve(__dirname, 'articles')
          if (!fullPath.startsWith(articlesDir)) {
            res.statusCode = 403
            res.end('Access denied')
            return
          }
          
          if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf-8')
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
            res.end(content)
          } else {
            res.statusCode = 404
            res.end('Article file not found')
          }
        } catch (error) {
          res.statusCode = 500
          res.end('Error loading article file')
        }
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