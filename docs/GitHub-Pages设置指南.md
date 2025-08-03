# 🌐 GitHub Pages 设置指南

## 问题描述

访问 https://pmeyes.github.io/ 时显示的是根目录的 `index.html`，而不是构建后的 `dist/index.html`。

## 解决方案

### 1. 检查 GitHub Pages 设置

1. 进入 GitHub 仓库页面
2. 点击 "Settings" 标签
3. 在左侧菜单找到 "Pages"
4. 确保设置如下：
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`

### 2. 验证部署内容

确保 `gh-pages` 分支包含正确的构建文件：

```
gh-pages/
├── index.html          # 构建后的主页面
├── 404.html           # 404 页面
├── assets/            # 静态资源
│   ├── css/          # 样式文件
│   └── js/           # JavaScript 文件
├── favicon.ico        # 网站图标
├── logo.jpg           # Logo 图片
└── CNAME             # 自定义域名配置
```

### 3. 手动触发部署

如果自动部署不工作，可以手动触发：

```bash
# 切换到 gh-pages 分支
git checkout gh-pages

# 合并最新代码
git merge main

# 推送触发部署
git push origin gh-pages
```

### 4. 检查 GitHub Actions 日志

1. 进入 GitHub 仓库
2. 点击 "Actions" 标签
3. 查看 "Deploy to GitHub Pages" 工作流
4. 检查构建和部署步骤是否成功

### 5. 常见问题排查

#### 问题 1：GitHub Pages 设置错误
**症状**：显示根目录的 index.html
**解决**：确保 Source 设置为 "Deploy from a branch"，Branch 设置为 `gh-pages`

#### 问题 2：gh-pages 分支不存在
**症状**：部署失败
**解决**：手动创建 gh-pages 分支并推送

#### 问题 3：构建失败
**症状**：GitHub Actions 构建步骤失败
**解决**：检查构建日志，修复构建错误

#### 问题 4：权限问题
**症状**：部署步骤失败
**解决**：确保仓库有正确的权限设置

### 6. 正确的部署流程

1. **开发阶段**：
   ```bash
   git add .
   git commit -m "更新代码"
   git push origin main  # 触发构建验证
   ```

2. **部署阶段**：
   ```bash
   git checkout gh-pages
   git merge main
   git push origin gh-pages  # 触发实际部署
   ```

### 7. 验证部署

部署完成后，访问以下地址验证：

- **主页面**: https://pmeyes.github.io/
- **文章页面**: https://pmeyes.github.io/articles
- **关于页面**: https://pmeyes.github.io/about

### 8. 故障排除步骤

1. **检查 GitHub Pages 设置**
2. **验证 gh-pages 分支内容**
3. **查看 GitHub Actions 日志**
4. **手动触发重新部署**
5. **清除浏览器缓存**

---

💡 **提示**：如果问题持续存在，可以尝试删除并重新创建 gh-pages 分支。 