#!/bin/bash

# 快速推送到 GitHub 并触发自动构建

echo "🚀 开始推送到 GitHub..."
echo ""

# 检查是否已经初始化 Git
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
fi

# 检查是否有远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ 错误：未配置远程仓库"
    echo ""
    echo "请先添加远程仓库："
    echo "git remote add origin https://github.com/你的用户名/你的仓库名.git"
    echo ""
    echo "然后重新运行此脚本"
    exit 1
fi

# 添加所有文件
echo "📝 添加文件..."
git add .

# 提交
echo "💾 提交更改..."
git commit -m "feat: 添加睡眠监测App - 自动构建APK"

# 推送到 GitHub
echo "📤 推送到 GitHub..."
git push -u origin main

echo ""
echo "✅ 推送成功！"
echo ""
echo "🔗 查看构建进度："
echo "https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
echo ""
echo "⏱️  预计 10-15 分钟后 APK 生成完成"
