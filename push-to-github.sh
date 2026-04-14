#!/bin/bash

# 🚀 一键推送到 GitHub 脚本

echo "=========================================="
echo "  🎤 呼噜娃 - 睡眠监测 App"
echo "  推送到 GitHub 并自动构建 APK"
echo "=========================================="
echo ""

# 检查是否已经配置远程仓库
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ 已配置远程仓库"
    echo ""
    echo "📤 开始推送..."
    git add .
    git commit -m "feat: 添加睡眠监测App - 自动构建APK"
    git push -u origin main
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "🔗 查看构建进度："
    git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/https:\/\/github.com\/\1\/actions/'
    echo ""
    echo "⏱️  预计 10-15 分钟后 APK 生成完成"
else
    echo "❌ 未配置远程仓库"
    echo ""
    echo "请先执行以下步骤："
    echo ""
    echo "1. 创建一个 GitHub 仓库（如果没有）"
    echo "   访问：https://github.com/new"
    echo ""
    echo "2. 添加远程仓库："
    echo "   git remote add origin https://github.com/你的用户名/你的仓库名.git"
    echo ""
    echo "3. 再次运行此脚本"
    echo ""
    echo "或者手动推送："
    echo "   git remote add origin https://github.com/你的用户名/你的仓库名.git"
    echo "   git add ."
    echo "   git commit -m 'feat: 添加睡眠监测App'"
    echo "   git push -u origin main"
fi
