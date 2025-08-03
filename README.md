# PM Eyes - 项目新探博客

聚焦项目管理的目光，探索未来的视野

## 🌟 特性

- 📝 **文章管理**: 支持 Markdown 格式的文章
- 🌐 **多语言支持**: 中文和英文双语支持
- 🔍 **搜索功能**: 全文搜索和标签筛选
- 📱 **响应式设计**: 适配各种设备
- ⚡ **快速加载**: 优化的性能和缓存策略
- 🚀 **自动部署**: GitHub Pages 自动部署

## 🚀 快速开始

### 开发环境

```bash
# 克隆项目
git clone https://github.com/pmeyes/pmeyes.github.io.git
cd pmeyes.github.io

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 部署到 GitHub Pages

#### 自动部署（推荐）

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建和部署
3. 访问 https://pmeyes.github.io

#### 手动部署

```bash
# 构建项目
npm run build

# 部署到 GitHub Pages
npm run deploy
```

#### 使用部署脚本

```bash
# 运行部署脚本
./scripts/deploy.sh
```

## 📁 项目结构

```
pmeyes.github.io/
├── src/                    # 源代码
│   ├── components/         # 组件
│   ├── pages/             # 页面
│   ├── services/          # 服务
│   ├── types/             # 类型定义
│   └── styles/            # 样式文件
├── articles/              # 文章目录
├── public/                # 静态资源
├── scripts/               # 脚本文件
├── docs/                  # 文档
└── .github/               # GitHub 配置
```

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **路由**: React Router DOM
- **样式**: SCSS
- **部署**: GitHub Pages + GitHub Actions

## 📚 文章管理

### 添加新文章

1. 在 `articles/` 目录下创建 Markdown 文件
2. 添加文章元数据（frontmatter）
3. 运行 `npm run generate-articles` 生成文章数据

### 文章格式

```markdown
---
title: 文章标题
description: 文章描述
tags: [标签1, 标签2]
date: 2024-01-01
---

文章内容...
```

## 🌐 多语言支持

项目支持中文和英文双语：

- 语言文件: `src/locales/`
- 切换语言: 点击导航栏的语言切换按钮
- 文章翻译: 支持多语言文章版本

## 🔍 搜索功能

- **全文搜索**: 搜索文章标题和内容
- **标签筛选**: 按标签筛选文章
- **实时搜索**: 输入时实时显示结果

## 🚀 部署配置

### GitHub Pages 设置

1. 进入仓库设置 → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 `gh-pages`，文件夹选择 `/ (root)`
4. 保存设置

### 自定义域名

1. 在 Pages 设置中添加自定义域名
2. 确保 DNS 记录正确配置
3. 项目会自动创建 CNAME 文件

## 📖 文档

- [部署指南](docs/部署指南.md)
- [技术架构](docs/项目架构.md)
- [路由方案](docs/路由解决方案.md)
- [技术栈](docs/技术栈说明.md)

## 🤝 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系

- 网站: https://pmeyes.github.io
- 邮箱: [your-email@example.com]
- GitHub: [@pmeyes](https://github.com/pmeyes)

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！
