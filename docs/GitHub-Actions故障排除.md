# 🔧 GitHub Actions 故障排除指南

## 常见错误及解决方案

### 错误 1：Rollup 模块错误

**错误信息**：
```
Error: Cannot find module @rollup/rollup-linux-x64-gnu. 
npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). 
Please try `npm i` again after removing both package-lock.json and node_modules.
```

**原因**：
- npm 的可选依赖问题
- 平台特定的二进制文件缺失
- 缓存问题

**解决方案**：
1. 清理缓存和依赖
2. 重新安装依赖
3. 使用 `--no-optional` 标志

**GitHub Actions 配置**：
```yaml
- name: Clear npm cache
  run: npm cache clean --force
  
- name: Install dependencies
  run: |
    rm -rf node_modules package-lock.json
    npm install --no-optional
    npm rebuild
```

### 错误 2：构建失败

**错误信息**：
```
Build failed with exit code 1
```

**原因**：
- TypeScript 编译错误
- 依赖版本冲突
- 环境变量问题

**解决方案**：
1. 检查 TypeScript 错误
2. 更新依赖版本
3. 确保环境变量正确设置

### 错误 3：部署失败

**错误信息**：
```
Deploy to GitHub Pages failed
```

**原因**：
- GitHub Pages 设置不正确
- 权限问题
- 构建输出目录不存在

**解决方案**：
1. 检查 GitHub Pages 设置
2. 验证构建输出
3. 检查权限配置

## 完整的 GitHub Actions 工作流

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Clear npm cache
      run: npm cache clean --force
      
    - name: Install dependencies
      run: |
        rm -rf node_modules package-lock.json
        npm install --no-optional
        npm rebuild
        
    - name: Generate articles
      run: npm run generate-articles
      
    - name: Build
      env:
        NODE_ENV: production
      run: npm run build
      
    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        cname: pmeyes.github.io
```

## 本地测试

### 1. 模拟 GitHub Actions 环境

```bash
# 清理环境
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install --no-optional

# 测试构建
npm run build
```

### 2. 检查依赖问题

```bash
# 检查依赖树
npm ls

# 检查过时的依赖
npm outdated

# 更新依赖
npm update
```

### 3. 验证构建输出

```bash
# 构建项目
npm run build

# 检查构建输出
ls -la dist/

# 本地预览
npm run preview
```

## 调试步骤

### 1. 查看 GitHub Actions 日志

1. 进入 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择失败的工作流
4. 查看详细的错误日志

### 2. 本地复现问题

```bash
# 使用相同的 Node.js 版本
nvm use 18

# 清理并重新安装
rm -rf node_modules package-lock.json
npm install --no-optional

# 测试构建
npm run build
```

### 3. 检查环境差异

- Node.js 版本
- npm 版本
- 操作系统差异
- 依赖版本

## 预防措施

### 1. 依赖管理

- 定期更新依赖
- 使用 `package-lock.json` 锁定版本
- 避免使用过时的依赖

### 2. 构建优化

- 使用 TypeScript 严格模式
- 配置 ESLint 规则
- 优化构建配置

### 3. 测试策略

- 本地测试构建
- 使用 GitHub Actions 进行 CI/CD
- 定期检查部署状态

## 最佳实践

### 1. 依赖安装

```bash
# 生产环境
npm ci --no-optional

# 开发环境
npm install --no-optional
```

### 2. 构建配置

```json
{
  "scripts": {
    "build": "npm run generate-articles && tsc && NODE_ENV=production vite build",
    "prebuild": "npm run generate-articles",
    "postbuild": "echo 'Build completed'"
  }
}
```

### 3. 错误处理

- 设置超时时间
- 添加重试机制
- 配置错误通知

## 监控和维护

### 1. 定期检查

- 每周检查 GitHub Actions 状态
- 监控构建时间
- 关注依赖更新

### 2. 性能优化

- 使用缓存加速构建
- 并行化构建步骤
- 优化依赖安装

### 3. 安全更新

- 定期更新依赖
- 检查安全漏洞
- 更新 GitHub Actions 版本

---

💡 **提示**：如果问题持续存在，可以尝试使用不同的 Node.js 版本或切换到 yarn 包管理器。 