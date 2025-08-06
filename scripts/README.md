# 📜 脚本说明文档

这个文件夹包含项目的各种自动化脚本，用于文章生成、数据转换、部署等任务。

## 📁 脚本文件列表

```
scripts/
├── README.md                    # 本文档
├── generateArticles.js          # 文章元数据生成脚本
├── convertArticlesToJson.js     # Markdown转JSON脚本
├── deploy.sh                    # 部署脚本
└── test-deploy.sh              # 测试部署脚本
```

## 🔧 脚本功能说明

### 📝 generateArticles.js - 文章元数据生成

**功能**：扫描 `articles/` 目录下的 Markdown 文件，生成文章元数据和文件夹树结构。

**输入**：
- `articles/` 目录下的 Markdown 文件

**输出**：
- `src/data/articles.json` - 文章元数据文件
- `src/data/.articles-cache.json` - 缓存文件

**特性**：
- ✅ 智能缓存：只处理有变化的文件
- ✅ 自动计算：阅读时间、摘要等
- ✅ 文件夹树：自动生成目录结构
- ✅ 多语言支持：支持中英文文件名

**使用方法**：
```bash
# 手动运行
npm run generate-articles

# 或直接运行脚本
node scripts/generateArticles.js
```

**输出示例**：
```json
{
  "articles": [
    {
      "id": "project-boundary-exploration",
      "title": "项界新探介绍",
      "excerpt": "详细介绍项界新探的概念...",
      "publishedAt": "2025-08-04",
      "tags": ["项界新探", "项目管理"],
      "slug": "project-boundary-exploration",
      "readingTime": 4,
      "folder": "项界新探"
    }
  ],
  "folderTree": [...]
}
```

### 🔄 convertArticlesToJson.js - Markdown转JSON

**功能**：将 Markdown 文件转换为完整的 JSON 文件，包含文章内容和元数据。

**输入**：
- `articles/` 目录下的 Markdown 文件

**输出**：
- `src/data/articles-json/` 目录下的 JSON 文件

**特性**：
- ✅ 完整转换：包含 Front Matter 和内容
- ✅ 结构化数据：统一的 JSON 格式
- ✅ 便于访问：可通过 HTTP 请求获取
- ✅ 缓存友好：适合 CDN 缓存
- ✅ 智能缓存：与 generateArticles.js 共享缓存机制
- ✅ 增量更新：只在文件变化时重新转换

**使用方法**：
```bash
# 手动运行
npm run convert-articles

# 或直接运行脚本
node scripts/convertArticlesToJson.js
```

**缓存机制**：
- 与 `generateArticles.js` 共享缓存文件
- 检查文件变化和 JSON 文件完整性
- 自动更新缓存信息
- 避免重复转换未修改的文件

**输出示例**：
```json
{
  "id": "project-boundary-exploration",
  "title": "项界新探介绍",
  "content": "# 项界新探：项目管理的新视角\n\n## 什么是项界新探？\n...",
  "rawContent": "---\ntitle: 项界新探介绍\n...\n---\n\n# 项界新探：项目管理的新视角\n...",
  "tags": ["项界新探", "项目管理"],
  "slug": "project-boundary-exploration",
  "readingTime": 4,
  "folder": "项界新探"
}
```

### 🔗 generate-all - 合并脚本

**功能**：一次性执行文章元数据生成和 JSON 转换两个步骤。

**特性**：
- ✅ 一键执行：同时生成元数据和 JSON 文件
- ✅ 顺序执行：先生成元数据，再转换 JSON
- ✅ 错误处理：任一步骤失败都会停止执行
- ✅ 简化流程：减少手动执行多个命令

**使用方法**：
```bash
# 使用合并脚本
npm run generate-all

# 等同于
npm run generate-articles && npm run convert-articles
```

**执行流程**：
1. 运行 `generateArticles.js` 生成文章元数据
2. 运行 `convertArticlesToJson.js` 转换 JSON 文件
3. 如果第一步失败，不会执行第二步

### 🚀 deploy.sh - 部署脚本

**功能**：自动化部署到 GitHub Pages。

**特性**：
- ✅ 自动构建：运行 `npm run build`
- ✅ 自动部署：使用 gh-pages 部署
- ✅ 错误处理：部署失败时提供错误信息
- ✅ 状态反馈：显示部署进度

**使用方法**：
```bash
# 手动运行
npm run deploy

# 或直接运行脚本
./scripts/deploy.sh
```

### 🧪 test-deploy.sh - 测试部署脚本

**功能**：测试部署流程，不实际推送到生产环境。

**特性**：
- ✅ 模拟部署：测试部署流程
- ✅ 本地验证：检查构建结果
- ✅ 安全测试：不修改生产环境
- ✅ 详细日志：提供测试结果

**使用方法**：
```bash
# 直接运行脚本
./scripts/test-deploy.sh
```

## 🔄 构建流程

### 完整构建流程

```bash
npm run build
```

这个命令会按以下顺序执行：

1. **清理**：删除 `dist` 目录
2. **生成所有**：`generate-all` 脚本（包含元数据生成和 JSON 转换）
3. **编译**：TypeScript 编译
4. **构建**：Vite 构建，复制 `src/data/` 到 `dist/data/`

### 开发流程

```bash
npm run dev
```

这个命令会：

1. **生成元数据**：`generateArticles.js`
2. **启动开发服务器**：Vite 开发服务器

### 文件结构

```
src/data/
├── articles.json              # 文章元数据
├── .articles-cache.json       # 缓存文件
└── articles-json/             # 文章 JSON 文件
    ├── project-boundary-exploration.json
    ├── project-boundary-practice-cases.json
    └── ... (其他文章 JSON 文件)

dist/data/                     # 构建后的结构
├── articles.json              # 文章元数据
├── .articles-cache.json       # 缓存文件
└── articles-json/             # 文章 JSON 文件
    ├── project-boundary-exploration.json
    ├── project-boundary-practice-cases.json
    └── ... (其他文章 JSON 文件)
```

## 📋 脚本依赖

### Node.js 模块

- `fs` - 文件系统操作
- `path` - 路径处理
- `crypto` - 哈希计算
- `gray-matter` - Front Matter 解析
- `child_process` - 子进程执行

### 外部依赖

- `gh-pages` - GitHub Pages 部署
- `husky` - Git 钩子管理

## 🛠️ 故障排除

### 常见问题

1. **文章未更新**
   ```bash
   # 清除缓存重新生成
   rm -f src/data/.articles-cache.json
   npm run generate-articles
   ```

2. **JSON 文件未生成**
   ```bash
   # 强制转换
   npm run convert-articles
   ```

3. **部署失败**
   ```bash
   # 检查构建
   npm run build
   
   # 测试部署
   ./scripts/test-deploy.sh
   ```

### 调试技巧

1. **查看缓存状态**：
   ```bash
   cat src/data/.articles-cache.json
   ```

2. **检查生成的文件**：
   ```bash
   ls -la src/data/
   ls -la dist/articles-json/
   ```

3. **查看构建日志**：
   ```bash
   npm run build --verbose
   ```

## 📝 脚本维护

### 添加新脚本

1. 在 `scripts/` 目录下创建新脚本
2. 在 `package.json` 中添加对应的命令
3. 更新本文档说明新脚本的功能

### 修改现有脚本

1. 保持向后兼容性
2. 更新文档说明
3. 测试脚本功能

### 版本控制

- 所有脚本都应该提交到 Git
- 重要更改需要添加注释
- 保持脚本的可读性和可维护性

## 🎯 最佳实践

1. **错误处理**：所有脚本都应该有适当的错误处理
2. **日志输出**：提供清晰的进度和状态信息
3. **缓存机制**：避免重复处理相同的数据
4. **模块化**：将复杂功能拆分为小函数
5. **文档化**：为每个脚本提供详细说明

---

✅ **脚本系统已完善，支持自动化文章生成、转换和部署流程！** 

# 脚本说明

## Node.js 版本检查

### checkNodeVersion.js
Node.js 版本检查脚本，用于验证当前 Node.js 版本是否符合项目要求。

**功能：**
- 检查当前 Node.js 版本是否 >= 22.12.0
- 如果版本过低，显示错误信息和快速升级提示
- 如果版本符合要求，显示通过信息
- 详细升级指南请查看 `docs/NodeJS升级指南.md`

**使用方法：**
```bash
# 直接运行
node scripts/checkNodeVersion.js

# 通过 npm 脚本运行
npm run check-node
```

## 集成到项目脚本

核心开发脚本会在运行前自动检查 Node.js 版本：

- `npm run dev` - 开发服务器（会检查版本）
- `npm run build` - 构建项目（会检查版本）

其他脚本不会检查版本，以提高执行效率：

- `npm run lint` - 代码检查
- `npm run preview` - 预览构建结果
- `npm run generate-articles` - 生成文章
- `npm run convert-articles` - 转换文章
- `npm run generate-all` - 生成所有内容
- `npm run deploy` - 部署项目

如果 Node.js 版本不符合要求，相关脚本会：
1. 显示当前版本和要求版本
2. 提供升级指南的链接
3. 退出执行，防止兼容性问题

## 版本要求

- **最低版本：** Node.js >= 22.12.0
- **推荐版本：** Node.js >= 22.12.0
- **npm 版本：** >= 10.0.0

## 升级建议

推荐使用 nvm 管理 Node.js 版本：

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载终端
source ~/.zshrc

# 安装 Node.js 22
nvm install 22
nvm use 22
nvm alias default 22
```

## 故障排除

如果遇到版本检查问题：

1. 确保使用正确的 Node.js 版本
2. 运行 `npm run upgrade-guide` 查看详细升级步骤
3. 升级后重新安装依赖：`npm install`
4. 清除缓存：`npm cache clean --force` 