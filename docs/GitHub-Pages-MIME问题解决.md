# 🔧 GitHub Pages MIME 类型问题解决方案

## 问题描述

在 GitHub Pages 部署后，可能会遇到以下错误：

```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream". Strict MIME type checking is enforced for module scripts per HTML spec.
```

## 问题原因

这个错误通常由以下原因引起：

1. **GitHub Pages 的 MIME 类型配置**：GitHub Pages 可能没有正确设置 JavaScript 文件的 MIME 类型
2. **模块脚本路径问题**：构建后的脚本路径可能不正确
3. **环境变量设置**：生产环境变量可能没有正确设置

## 解决方案

### 1. 确保正确的构建配置

在 `vite.config.ts` 中已经配置了：

```typescript
export default defineConfig({
  // GitHub Pages配置 - 根据环境设置不同的base路径
  base: process.env.NODE_ENV === 'production' ? '/pmeyes.github.io/' : '/',
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        format: 'es',
        // 其他配置...
      }
    }
  }
})
```

### 2. 正确的环境变量设置

在 `package.json` 中：

```json
{
  "scripts": {
    "build": "npm run generate-articles && tsc && NODE_ENV=production vite build"
  }
}
```

### 3. GitHub Actions 配置

在 `.github/workflows/deploy.yml` 中：

```yaml
- name: Build
  env:
    NODE_ENV: production
  run: npm run build
```

## 验证步骤

### 1. 本地构建测试

```bash
npm run build
```

检查 `dist/index.html` 中的脚本路径是否正确：

```html
<script type="module" crossorigin src="/pmeyes.github.io/assets/js/index-xxx.js"></script>
```

### 2. 本地预览测试

```bash
npm run preview
```

访问 `http://localhost:4173` 检查是否正常工作。

### 3. 部署后验证

1. 推送代码到 GitHub
2. 等待 GitHub Actions 完成部署
3. 访问 `https://pmeyes.github.io`
4. 打开浏览器开发者工具检查控制台错误

## 常见问题排查

### 问题 1：脚本路径不正确

**症状**：浏览器控制台显示 404 错误

**解决**：
- 检查 `vite.config.ts` 中的 `base` 配置
- 确保构建时设置了正确的 `NODE_ENV`

### 问题 2：MIME 类型错误

**症状**：显示 MIME 类型错误

**解决**：
- 确保构建配置中设置了 `format: 'es'`
- 检查 `target: 'esnext'` 设置

### 问题 3：模块加载失败

**症状**：模块无法加载

**解决**：
- 检查网络请求是否返回正确的 JavaScript 文件
- 验证文件路径是否正确

## 预防措施

### 1. 构建前检查

```bash
# 清理之前的构建
rm -rf dist

# 重新构建
npm run build

# 检查构建输出
ls -la dist/
```

### 2. 本地预览

```bash
npm run preview
```

### 3. 部署前测试

```bash
# 使用 serve 包进行本地测试
npx serve dist
```

## 监控和调试

### 1. 浏览器开发者工具

- 打开 Network 标签页
- 检查 JavaScript 文件的请求状态
- 查看 Response Headers 中的 Content-Type

### 2. GitHub Actions 日志

- 检查构建步骤是否成功
- 查看是否有警告或错误信息

### 3. 部署状态

- 在 GitHub 仓库的 Actions 标签页查看部署状态
- 检查 Pages 设置是否正确

## 最佳实践

1. **始终在本地测试构建**：在推送代码前先在本地构建和预览
2. **使用正确的环境变量**：确保生产环境变量正确设置
3. **监控部署状态**：定期检查部署是否成功
4. **保持依赖更新**：定期更新 Vite 和相关依赖

---

💡 **提示**：如果问题仍然存在，可以尝试清除浏览器缓存或使用无痕模式访问网站。 