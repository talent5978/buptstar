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

### GitHub Pages部署步骤

#### 第一步：创建GitHub仓库
1. 注册/登录[GitHub](https://github.com/)
2. 点击右上角「+」号，选择「New repository」
3. 填写仓库信息：
   - Repository name：如`engineering-ideology-platform`
   - 选择Public仓库
   - 其他选项保持默认，点击「Create repository」

#### 第二步：配置GitHub Pages部署设置
1. 在GitHub仓库页面，点击「Settings」-> 「Pages」
2. 在「Build and deployment」部分：
   - Source：选择「Deploy from a branch」
   - Branch：选择`gh-pages`分支和`/root`目录
   - 点击「Save」

#### 第三步：使用gh-pages工具自动部署
1. 安装gh-pages依赖：
   ```bash
   npm install --save-dev gh-pages
   ```

2. 在`package.json`中添加部署脚本：
   ```json
   "scripts": {
     "dev": "vite",
     "build": "tsc && vite build",
     "preview": "vite preview",
     "deploy": "gh-pages -d dist"
   }
   ```

3. 修改`vite.config.ts`中的base配置：
   - 将`base: './'`改为：
   ```typescript
   base: '/你的仓库名/', // 例如：'/engineering-ideology-platform/'
   ```

4. 运行构建和部署命令：
   ```bash
   npm run build
   npm run deploy
   ```

#### 第四步：验证部署
1. 稍等片刻，GitHub会自动部署你的项目
2. 部署成功后，可以通过以下地址访问：
   `https://你的GitHub用户名.github.io/engineering-ideology-platform/`
3. 访问该地址，确认网站可以正常运行

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