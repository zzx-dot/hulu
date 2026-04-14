# 🎤 呼噜娃 - 睡眠监测 App

监测你的睡眠声音，分析打鼾情况，改善睡眠质量！

---

## ✨ 功能特点

- 🎙️ **一键录音** - 点击开始，轻松监测
- 📊 **实时分贝** - 可视化波形显示
- 🔍 **智能分析** - 自动识别疑似打鼾时段
- 📱 **历史记录** - 查看所有录音记录
- 🎵 **回放听音** - 聆听录音确认效果
- 🎨 **极光风格** - 深色主题，夜间友好

---

## 🚀 快速开始

### 方法一：自动构建 APK（推荐）

```bash
# 1. 克隆或下载项目
git clone <你的仓库地址>
cd 呼噜娃

# 2. 配置 GitHub 远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 3. 推送代码触发自动构建
./push-and-build.sh

# 或者手动执行
git add .
git commit -m "feat: 添加睡眠监测App"
git push -u origin main
```

推送代码后，GitHub Actions 会自动构建 APK！查看构建进度：
```
https://github.com/你的用户名/你的仓库名/actions
```

---

### 方法二：在浏览器中运行

```bash
# 启动开发服务器
cd client
npm start

# 访问
# http://localhost:8081
```

---

## 📱 下载 APK

1. 进入 GitHub 仓库的 Actions 页面
2. 点击最新的构建任务
3. 下载 **Artifacts** 区域的 APK 文件
4. 安装到 Android 设备

---

## 🎯 使用说明

### 首页 - 开始录音
1. 点击 **开始录音** 按钮
2. 将手机放在床头
3. 睡眠时自动录音监测
4. 点击 **停止录音** 结束

### 历史记录 - 查看数据
- 查看所有录音记录
- 显示打鼾次数、时长、分贝
- 点击查看详情

### 详情页 - 分析音频
- 查看音频波形
- 调节分贝阈值
- 回放录音确认
- 导出音频文件

---

## 🛠️ 技术栈

**前端：**
- Expo 54 + React Native
- expo-av（音频录制与播放）
- expo-linear-gradient（渐变效果）
- expo-blur（毛玻璃效果）

**后端：**
- Express.js
- Supabase（数据库）
- 对象存储（音频文件）

**构建：**
- GitHub Actions（自动构建）
- EAS Build（云端构建）

---

## 📖 详细文档

- [APK 构建指南](./BUILD_APK_GUIDE.md)
- [GitHub 构建指南](./GITHUB_BUILD_GUIDE.md)

---

## 🎨 UI 设计

采用**极光柔和风格**（深色主题）：
- 深空蓝黑背景
- 极光渐变辉光
- 毛玻璃卡片
- 流畅动画

---

## 📝 开发者

- 项目类型：睡眠监测 App
- 目标平台：Android
- 开发框架：Expo 54 + React Native

---

## 📄 许可证

MIT License

---

## 🙏 致谢

灵感来源于 [timqian](https://t9t.io) 的《呼噜娃》应用

---

**祝你睡个好觉！😴**
