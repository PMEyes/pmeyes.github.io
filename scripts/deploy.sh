#!/bin/bash

# 部署脚本
echo "🚀 开始部署流程..."

# 构建项目
echo "📦 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 部署到 GitHub Pages
echo "🌐 部署到 GitHub Pages..."
gh-pages -d dist

if [ $? -ne 0 ]; then
    echo "❌ 部署失败"
    exit 1
fi

echo "✅ 部署完成！" 