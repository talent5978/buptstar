# 工程思政云平台

## 项目简介
这是一个基于React + TypeScript + Vite构建的工程思政云平台。

## 部署指南 (GitHub Pages)

### 准备工作
1. 确保项目已经构建成功
   ```bash
   npm run build
   ```
   构建完成后会生成`dist`目录

### GitHub Pages部署步骤（已优化）

### 方法一：手动部署（推荐，避免网络连接问题）

1. **创建GitHub仓库**：
   - 在GitHub上创建名为`engineering-ideology-platform`的公开仓库
   - 配置GitHub Pages：Settings -> Pages -> Source选择「Deploy from a branch」-> Branch选择`main`或`master`

2. **构建项目**：
   ```bash
   npm run build
   ```

3. **修改配置**：
   - 修改`vite.config.ts`中的base配置：
   ```typescript
   base: '/engineering-ideology-platform/',
   ```

4. **手动上传部署**：
   - 构建完成后，打开`dist`目录
   - 直接在GitHub仓库页面上传这些文件（最简单的方法）
   - 或使用GitHub Desktop客户端拖拽上传

### 方法二：使用gh-pages工具部署

1. **安装依赖**：
   ```bash
   npm install --save-dev gh-pages
   ```

2. **配置部署脚本**：
   ```json
   "scripts": {
     "dev": "vite",
     "build": "tsc && vite build",
     "preview": "vite preview",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **尝试部署**：
   ```bash
   npm run build
   npm run deploy
   ```

   如果遇到网络问题，尝试以下方法：
   ```bash
   # 增加缓存大小
   git config http.postBuffer 524288000
   ```

### 方法三：使用GitHub Desktop（最简单）
1. 下载安装[GitHub Desktop](https://desktop.github.com/)
2. 克隆你的仓库
3. 构建项目：`npm run build`
4. 将`dist`目录中的文件复制到克隆的仓库文件夹中
5. 提交并推送更改

### 验证部署
- 部署成功后，可以通过以下地址访问：
  `https://你的GitHub用户名.github.io/engineering-ideology-platform/`

### 注意事项
1. **React Router配置**：
   - 如果使用BrowserRouter，确保设置了正确的basename
   ```jsx
   <BrowserRouter basename="/engineering-ideology-platform">
   ```
   - 或者考虑使用HashRouter来避免路径问题

2. **静态资源引用**：所有静态资源引用应使用相对路径，避免使用绝对路径

3. **重新部署**：每次代码更新后，只需运行：
   ```bash
   npm run build
   npm run deploy
   ```

## 本地开发
```bash
npm install  # 安装依赖
npm run dev  # 启动开发服务器
```

## 构建生产版本
```bash
npm run build
```

## 预览构建结果
```bash
npm run preview
```