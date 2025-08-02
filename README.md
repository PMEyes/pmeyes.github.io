# PM Eyes - 项目新探博客

> 聚焦项目管理的目光，探索未来的视野  
> Eyes on PM, vision for exploration

## 项目简介

PM Eyes 是一个基于 React + TypeScript + Vite 构建的现代化博客网站，专注于分享项目管理的深度见解和实践经验。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Sass (SCSS)
- **路由**: React Router DOM
- **UI组件**: 自定义组件 + Lucide React 图标
- **Markdown渲染**: React Markdown + React Syntax Highlighter
- **日期处理**: date-fns
- **多语言**: 自定义语言服务

## 项目特性

### 🎨 设计风格
- 扁平化设计风格
- 响应式布局，完美适配移动端
- 现代化的用户界面
- 流畅的动画效果

### 🔍 功能特性
- **多语言支持**: 中文/英文双语切换
- **文章搜索**: 支持标题、内容、标签搜索
- **标签系统**: 文章分类和标签筛选
- **Markdown渲染**: 支持代码高亮、表格等
- **响应式设计**: 完美适配桌面端和移动端

### 📱 移动端适配
- 响应式导航栏
- 移动端菜单
- 触摸友好的交互
- 优化的移动端布局

## 项目结构

```
pmeyes.github.io/
├── src/
│   ├── components/          # React组件
│   │   └── Navbar.tsx      # 导航栏组件
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx        # 首页
│   │   ├── Articles.tsx    # 文章列表页
│   │   ├── ArticleDetail.tsx # 文章详情页
│   │   └── About.tsx       # 关于页面
│   ├── services/           # 服务层
│   ├── types/              # TypeScript类型定义
│   ├── constants/          # 常量定义
│   ├── locales/            # 多语言文件
│   └── styles/             # 样式文件
│       ├── global.scss     # 全局样式变量和混合器
│       ├── components/     # 组件样式
│       │   └── navbar.scss # 导航栏样式
│       ├── pages/          # 页面样式
│       │   ├── home.scss   # 首页样式
│       │   ├── articles.scss # 文章列表页样式
│       │   ├── article-detail.scss # 文章详情页样式
│       │   └── about.scss  # 关于页面样式
│       └── main.scss       # 主样式文件
├── articles/               # 文章内容（Markdown文件）
└── public/                 # 静态资源
    ├── logo.jpg            # 网站Logo
    └── favicon.ico         # 网站图标
```

## 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 样式规范

### Sass 结构
- 使用 SCSS 语法
- 变量和混合器统一管理在 `src/styles/global.scss`
- 响应式设计使用混合器
- 组件样式与页面样式分离
- 样式文件按功能模块组织：
  - `src/styles/components/` - 组件样式
  - `src/styles/pages/` - 页面样式

### 命名规范
- 常量使用大写英文字母驼峰命名
- 组件使用 PascalCase
- 样式类使用 kebab-case
- 文件使用 PascalCase

## 多语言支持

项目支持中英文双语切换，语言文件存储在 `src/locales/` 目录下：

- `zh-CN.json`: 中文语言包
- `en-US.json`: 英文语言包

所有文案都使用大写英文字母驼峰命名作为 key。

## 文章管理

文章使用 Markdown 格式，存储在 `articles/` 目录下。每篇文章需要包含前置信息（Front Matter）：

```yaml
---
title: 文章标题
excerpt: 文章摘要
publishedAt: 2024-01-15
tags: [标签1, 标签2, 标签3]
slug: 文章的唯一标识符
readingTime: 预计阅读时间（分钟）
---
```

## 部署

项目构建后会在根目录生成 `dist` 文件夹，包含所有静态文件，可以直接部署到任何静态网站托管服务。

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 邮箱：contact@pmeyes.com
- 微信公众号：PM Eyes
- LinkedIn：PM Eyes Blog

---

**PM Eyes** - 让项目管理的视野更加清晰
