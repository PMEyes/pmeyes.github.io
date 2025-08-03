#!/bin/bash

# 测试部署脚本
# 用于验证 GitHub Pages 部署配置

echo "🧪 开始测试部署配置..."

# 检查必要文件是否存在
echo "📋 检查必要文件..."

files_to_check=(
    "package.json"
    "vite.config.ts"
    "index.html"
    "public/404.html"
    "scripts/deploy.sh"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 不存在"
        exit 1
    fi
done

# 检查 package.json 中的脚本
echo "📦 检查 package.json 脚本..."
if grep -q '"deploy"' package.json; then
    echo "✅ deploy 脚本存在"
else
    echo "❌ deploy 脚本不存在"
    exit 1
fi

# 检查 deploy.sh 脚本内容
echo "📝 检查 deploy.sh 脚本内容..."
if grep -q "npm run build" scripts/deploy.sh; then
    echo "✅ deploy.sh 包含构建步骤"
else
    echo "❌ deploy.sh 缺少构建步骤"
    exit 1
fi

if grep -q "gh-pages -d dist" scripts/deploy.sh; then
    echo "✅ deploy.sh 包含部署步骤"
else
    echo "❌ deploy.sh 缺少部署步骤"
    exit 1
fi

# 检查 gh-pages 依赖
echo "📦 检查 gh-pages 依赖..."
if npm list gh-pages > /dev/null 2>&1; then
    echo "✅ gh-pages 依赖已安装"
else
    echo "❌ gh-pages 依赖未安装"
    exit 1
fi

# 测试构建
echo "🔨 测试构建..."
if npm run build; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败"
    exit 1
fi

# 检查构建输出
echo "📁 检查构建输出..."
if [ -d "dist" ]; then
    echo "✅ dist 目录存在"
    
    # 检查关键文件
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html 存在"
    else
        echo "❌ index.html 不存在"
        exit 1
    fi
    
    if [ -d "dist/assets" ]; then
        echo "✅ assets 目录存在"
    else
        echo "❌ assets 目录不存在"
        exit 1
    fi
else
    echo "❌ dist 目录不存在"
    exit 1
fi

# 检查 vite.config.ts 中的 base 配置
echo "⚙️ 检查 Vite 配置..."
if grep -q "base.*pmeyes.github.io" vite.config.ts; then
    echo "✅ base 路径配置正确"
else
    echo "❌ base 路径配置不正确"
    exit 1
fi

echo "🎉 所有测试通过！部署配置正确。"
echo ""
echo "📝 下一步："
echo "1. 推送代码到 GitHub: git push origin main"
echo "2. 在 GitHub 仓库设置中启用 Pages"
echo "3. 选择 gh-pages 分支作为源"
echo "4. 等待自动部署完成"
echo ""
echo "🌍 部署完成后访问: https://pmeyes.github.io" 