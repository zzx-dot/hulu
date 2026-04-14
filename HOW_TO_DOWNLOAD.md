# 📥 如何下载项目到本地

## 方法一：推送到 GitHub（推荐，可自动构建APK）

### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库（可以叫 `huluwa` 或 `sleep-monitor`）
3. 不要初始化 README（因为我们已经有代码了）
4. 点击 "Create repository"

### 步骤 2：添加远程仓库

在沙箱环境执行：

```bash
cd /workspace/projects

# 添加你的 GitHub 仓库地址
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 运行推送脚本
./push-to-github.sh
```

或者手动执行：

```bash
cd /workspace/projects

# 添加远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 添加所有文件
git add .

# 提交
git commit -m "feat: 添加睡眠监测App - 自动构建APK"

# 推送（首次需要认证）
git push -u origin main
```

### 步骤 3：在本地克隆

在你的本地电脑上执行：

```bash
# 克隆仓库
git clone https://github.com/你的用户名/你的仓库名.git

# 进入项目目录
cd 你的仓库名

# 安装依赖
npm install
cd client && npm install

# 启动开发服务器
npm start
```

---

## 方法二：直接下载压缩包

项目已经打包为 `projects.tar.gz`（约 4MB）

### 下载方式

你需要通过以下方式下载：

**选项 A：如果支持文件下载功能**
- 下载 `/workspace/projects.tar.gz`
- 解压后使用

**选项 B：手动打包命令**

在你的本地终端执行：

```bash
# SSH 连接到沙箱
# 或者通过其他方式访问文件系统

# 复制文件到可访问的位置
cp /workspace/projects.tar.gz /tmp/

# 下载文件
```

### 解压后使用

```bash
# 解压
tar -xzf projects.tar.gz

# 进入项目
cd projects

# 安装依赖
npm install
cd client && npm install

# 启动开发服务器
npm start
```

---

## 方法三：手动复制文件

如果你想手动复制文件，需要复制以下目录和文件：

```
/workspace/projects/
├── client/              # 前端代码（必须）
│   ├── app/            # 路由配置
│   ├── screens/        # 页面代码
│   ├── components/     # 组件
│   └── package.json
├── server/             # 后端代码（必须）
│   ├── src/
│   └── package.json
├── .github/            # GitHub Actions配置（推荐）
│   └── workflows/
├── package.json        # 根依赖（必须）
├── pnpm-lock.yaml      # 锁文件
├── README.md           # 项目说明
└── BUILD_APK_GUIDE.md  # 构建指南
```

不需要复制的：
- `node_modules/` （本地安装依赖时生成）
- `.git/` （本地初始化 Git 时生成）

---

## 🎯 推荐流程

### 如果你要自动构建 APK：

1. **推送到 GitHub** → 使用方法一
2. **等待自动构建** → 10-15 分钟
3. **下载 APK** → 在 GitHub Actions 页面

### 如果只是本地运行：

1. **克隆或下载项目** → 使用方法一或二
2. **安装依赖** → `npm install`
3. **启动服务器** → `npm start`

---

## 📱 运行项目

克隆或下载后：

```bash
# 安装根依赖
npm install

# 安装客户端依赖
cd client
npm install

# 启动开发服务器
npm start

# 或者同时启动后端（在另一个终端）
cd ../server
pnpm install
pnpm run dev
```

访问：http://localhost:8081

---

## ❓ 常见问题

### Q: 我没有 GitHub 怎么办？
A: 使用方法二下载压缩包，然后运行项目。

### Q: 推送到 GitHub 时需要密码？
A: 使用 GitHub Personal Access Token（推荐）或 SSH 密钥。

### Q: 下载后如何安装依赖？
A: 运行 `npm install` 和 `cd client && npm install`

### Q: 如何构建 APK？
A: 推送到 GitHub 后，自动构建，在 Actions 页面下载。

---

## 🚀 快速开始（最简单）

```bash
# 在本地克隆项目（如果你已经推送到 GitHub）
git clone https://github.com/你的用户名/你的仓库名.git
cd 你的仓库名

# 安装依赖
npm install
cd client && npm install

# 启动
npm start
```

就这么简单！🎉
