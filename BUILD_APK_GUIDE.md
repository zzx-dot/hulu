# 构建Android APK指南

本文档将指导你如何在本地构建Android APK。

## 方法一：使用 EAS Build（推荐）

### 1. 安装 EAS CLI
```bash
npm install -g eas-cli
```

### 2. 登录 EAS 账号
```bash
eas login
```
- 需要注册 Expo 账号：https://expo.dev
- 免费账号每月可以构建一定数量的 APK

### 3. 配置项目
```bash
cd /workspace/projects/client
eas build:configure
```

### 4. 构建调试版 APK
```bash
# 构建调试版（可直接安装，适合测试）
eas build --platform android --profile preview

# 或者构建开发版（需要 Expo Go）
eas build --platform android --profile development
```

### 5. 构建发布版 APK
```bash
# 构建正式发布版（用于应用商店）
eas build --platform android --profile production
```

### 6. 下载 APK
- 构建完成后，EAS 会提供下载链接
- 或者访问：https://expo.dev/account/projects/[项目ID]/builds

---

## 方法二：本地构建（需要 Android Studio）

### 1. 安装依赖
```bash
# 安装 Java JDK（版本 17 或 21）
# 安装 Android Studio
# 配置 ANDROID_HOME 环境变量

# 安装 Gradle 依赖
cd /workspace/projects/client && npm install
```

### 2. 预构建原生代码
```bash
cd /workspace/projects/client
npx expo prebuild --clean
```

### 3. 构建 APK
```bash
# 调试版 APK
cd android
./gradlew assembleDebug

# 发布版 APK（需要签名）
./gradlew assembleRelease
```

### 4. APK 位置
- 调试版：`android/app/build/outputs/apk/debug/app-debug.apk`
- 发布版：`android/app/build/outputs/apk/release/app-release.apk`

---

## 方法三：使用 GitHub Actions（推荐用于 CI/CD）

创建 `.github/workflows/build-apk.yml` 文件：

```yaml
name: Build Android APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '17'

    - name: Setup Android SDK
      uses: android-actions/setup-android@v2

    - name: Install dependencies
      run: |
        cd client
        npm install

    - name: Prebuild
      run: |
        cd client
        npx expo prebuild --clean

    - name: Build APK
      run: |
        cd client/android
        ./gradlew assembleDebug

    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug
        path: client/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 当前项目配置

项目已配置好 `eas.json`，包含以下构建配置：

### 预览版（preview）
- 适合测试和内部分发
- 快速构建
- APK 格式

### 生产版（production）
- 适合应用商店发布
- 优化的性能
- 需要签名

### 开发版（development）
- 需要 Expo Go
- 快速开发迭代
- 支持热更新

---

## 常见问题

### Q: EAS 构建失败怎么办？
A: 检查以下几点：
1. `eas.json` 配置是否正确
2. `app.config.ts` 中的权限配置是否完整
3. 网络连接是否正常
4. 查看构建日志获取详细错误信息

### Q: APK 安装后无法录音？
A: 确保在 `app.config.ts` 中配置了麦克风权限：
```json
[
  "expo-av",
  {
    "microphonePermission": "需要访问麦克风以录制睡眠声音。"
  }
]
```

### Q: 如何自定义应用图标？
A: 替换以下文件：
- `assets/images/icon.png`（应用图标）
- `assets/images/adaptive-icon.png`（Android 自适应图标）
- `assets/images/favicon.png`（网站图标）

### Q: 如何修改应用名称？
A: 编辑 `app.config.ts` 中的 `name` 字段。

---

## 快速开始（推荐流程）

1. **首次构建**（预览版）：
```bash
eas login
eas build --platform android --profile preview
```

2. **测试 APK**：
   - 下载构建的 APK
   - 在 Android 设备上安装测试
   - 验证录音功能是否正常

3. **正式发布**（生产版）：
```bash
eas build --platform android --profile production
```

---

## 构建时间估算

- **预览版**：约 5-10 分钟
- **生产版**：约 10-20 分钟
- **首次构建**可能需要更长时间（缓存依赖）

---

## 成本说明

### EAS Build
- **免费账号**：每月 5-10 次构建
- **付费账号**：无限构建，$29/月起
- 详细定价：https://expo.dev/pricing

### 本地构建
- **免费**
- 需要安装 Android Studio（约 5GB 空间）
- 需要配置开发环境

---

## 推荐方案

**对于个人开发者**：
- 使用 EAS Build（免费账号）
- 选择 preview profile 构建测试版
- 确认功能正常后再构建生产版

**对于团队开发**：
- 配置 GitHub Actions 自动构建
- 使用本地构建进行快速迭代
- 使用 EAS Build 进行正式发布

---

## 技术支持

如有问题，请访问：
- Expo 文档：https://docs.expo.dev
- EAS Build 文档：https://docs.expo.dev/build/introduction/
- Expo 社区：https://forums.expo.dev
