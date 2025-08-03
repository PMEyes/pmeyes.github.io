#!/bin/bash

# GitHub Pages 部署脚本
# 使用方法: ./scripts/deploy.sh

echo "🚀 开始部署到 GitHub Pages..."

# 检查是否在正确的分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  警告: 当前分支是 $CURRENT_BRANCH，建议在 main 分支上部署"
    read -p "是否继续? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 部署已取消"
        exit 1
    fi
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  检测到未提交的更改"
    git status --short
    read -p "是否提交更改? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "请输入提交信息: " commit_message
        git add .
        git commit -m "$commit_message"
    else
        echo "❌ 部署已取消，请先提交更改"
        exit 1
    fi
fi

# 安装依赖
echo "📦 安装依赖..."
npm ci

# 生成文章
echo "📝 生成文章..."
npm run generate-articles

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建是否成功
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist 目录不存在"
    exit 1
fi

# 部署到 GitHub Pages
echo "🌐 部署到 GitHub Pages..."
npm run deploy

# 检查部署是否成功
if [ $? -eq 0 ]; then
    echo "✅ 部署成功!"
    echo "🌍 网站地址: https://pmeyes.github.io"
    echo "⏰ 部署可能需要几分钟才能生效"
else
    echo "❌ 部署失败"
    exit 1
fi

# 推送代码到远程仓库
echo "📤 推送代码到远程仓库..."
git push origin main

echo "🎉 部署完成!" 