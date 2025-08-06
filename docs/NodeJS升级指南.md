# Node.js 升级指南

## 版本要求

- **最低版本：** Node.js >= 22.12.0
- **推荐版本：** Node.js >= 22.12.0
- **npm 版本：** >= 10.0.0

## 升级方法（推荐按顺序尝试）

### 1️⃣ 使用 nvm（推荐）

nvm 是 Node.js 版本管理工具，可以轻松切换不同版本的 Node.js。

#### 安装 nvm
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载终端配置
source ~/.zshrc
```

#### 安装和使用 Node.js 22
```bash
# 安装 Node.js 22
nvm install 22

# 使用 Node.js 22
nvm use 22

# 设置为默认版本
nvm alias default 22
```

### 2️⃣ 使用 Homebrew

如果你使用 Homebrew 管理软件包：

```bash
# 更新 Homebrew
brew update

# 升级 Node.js
brew upgrade node
```

### 3️⃣ 使用 n

n 是另一个 Node.js 版本管理工具：

```bash
# 安装 n
npm install -g n

# 安装最新的稳定版本
n stable
```

### 4️⃣ 手动下载

访问 [Node.js 官网](https://nodejs.org/) 下载最新版本。

### 5️⃣ 使用官方安装器

访问 [Node.js 下载页面](https://nodejs.org/en/download/) 下载 macOS 安装器。

## 升级后验证

升级完成后，验证安装：

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version
```

## 故障排除

### 常见问题

1. **权限问题**
   ```bash
   # 如果遇到权限问题，使用 sudo
   sudo npm install -g n
   ```

2. **nvm 命令未找到**
   ```bash
   # 重新加载 shell 配置
   source ~/.zshrc
   # 或
   source ~/.bashrc
   ```

3. **版本切换不生效**
   ```bash
   # 重新打开终端或重新加载配置
   exec $SHELL
   ```

### 升级后注意事项

- 升级后可能需要重新安装全局包
- 建议使用 nvm 管理多个 Node.js 版本
- 升级前建议备份重要项目
- 检查项目依赖是否兼容新版本

## 项目集成

本项目已集成 Node.js 版本检查，所有主要脚本都会在运行前自动检查版本：

```bash
# 手动检查版本
npm run check-node

# 开发服务器（会自动检查版本）
npm run dev

# 构建项目（会自动检查版本）
npm run build
```

如果版本不符合要求，脚本会提示升级并退出执行。 