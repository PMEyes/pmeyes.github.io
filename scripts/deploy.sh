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

# 检查是否有新文件需要提交
echo "📝 检查是否有新文件需要提交..."
if [ -n "$(git status --porcelain)" ]; then
    echo "发现新文件，正在提交..."
    
    # 添加所有文件
    git add .
    
    # 提交更改
    git commit -m "chore: 自动提交部署生成的文件 [skip ci]"
    
    echo "✅ 文件已提交"
else
    echo "ℹ️  没有新文件需要提交"
fi

echo "✅ 部署完成！" 