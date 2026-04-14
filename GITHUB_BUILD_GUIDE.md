# 🚀 使用 GitHub Actions 自动构建 APK

我已经为你配置好了 GitHub Actions 自动构建系统！

---

## 📋 使用步骤

### 第一步：推送到 GitHub

```bash
# 在你的本地电脑上执行
cd /workspace/projects

# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: 添加睡眠监测App"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

---

### 第二步：触发自动构建

推送代码后，GitHub Actions 会**自动开始构建**！

你可以在以下位置查看构建进度：
```
https://github.com/你的用户名/你的仓库名/actions
```

---

### 第三步：下载 APK

构建完成后（约 10-15 分钟），下载 APK：

1. 进入 Actions 页面
2. 点击最新的构建任务
3. 滚动到页面底部的 **Artifacts** 区域
4. 点击下载 `app-debug-apk.zip`
5. 解压后安装 `app-debug.apk` 到 Android 设备

---

## 🎛️ 手动触发构建（可选）

你也可以手动触发构建，选择 debug 或 release 版本：

1. 进入 **Actions** 页面
2. 选择 **Build Android APK** 工作流
3. 点击 **Run workflow** 按钮
4. 选择构建类型：`debug` 或 `release`
5. 点击 **Run workflow** 开始构建

---

## 📱 构建类型说明

| 类型 | 用途 | 说明 |
|------|------|------|
| **Debug** | 测试版本 | 快速构建，可直接安装，适合内部测试 |
| **Release** | 发布版本 | 性能优化，需要签名，适合应用商店 |

---

## 🔄 每次推送自动构建

一旦配置完成，以后每次你推送代码到 `main` 分支，都会自动构建新的 APK！

```bash
# 修改代码后
git add .
git commit -m "fix: 修复录音问题"
git push
# 等待 10-15 分钟，APK 自动生成！
```

---

## 📊 查看构建历史

所有构建历史都会保存 30 天，你可以随时下载之前的版本：

1. 进入 **Actions** 页面
2. 点击任意历史构建
3. 下载对应的 Artifact

---

## ⚙️ 自定义配置

如果需要修改构建配置，编辑这个文件：
```
.github/workflows/build-apk.yml
```

常见修改：
- 修改 Node.js 版本
- 修改 Java 版本
- 调整构建参数
- 添加自定义签名

---

## 🐛 构建失败怎么办？

1. 查看 Actions 页面的构建日志
2. 检查错误信息
3. 修复代码后重新推送
4. 或手动触发构建

---

## 💡 小技巧

### 1. 快速测试修改
```bash
# 修改代码后快速推送
git add .
git commit -m "test: 测试录音功能"
git push
# 等待自动构建完成
```

### 2. 查看构建进度
GitHub Actions 页面会实时显示构建进度：
- ✅ 绿色勾 = 成功
- ❌ 红色叉 = 失败
- 🔄 蓝色圆圈 = 进行中

### 3. 下载历史版本
所有构建记录都会保存 30 天，方便回滚测试

---

## 🎉 完成！

现在你的代码已经准备好推送了！

只需要三步：
1. **推送代码到 GitHub** → 触发自动构建
2. **等待 10-15 分钟** → APK 自动生成
3. **下载并安装** → 在手机上测试

就这么简单！🚀

---

## 📞 需要帮助？

如果遇到问题，请告诉我，我会帮你解决！
