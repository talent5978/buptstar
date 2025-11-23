# GitHub Pages 部署指南

本文档提供使用 gh-pages 包将 React + Vite 项目部署到 GitHub Pages 的完整步骤。

## 准备工作

1. **确保已完成以下配置**:
   - 已安装 gh-pages 依赖 (`npm install gh-pages --save-dev`)
   - package.json 中已添加 deploy 和 predeploy 脚本
   - vite.config.ts 中已设置正确的 base 路径

2. **检查 git 环境**:
   ```bash
   git status
   ```
   确认当前目录已经是一个 git 仓库。

## 部署步骤

### 1. 初始化 git 仓库（如果尚未初始化）

```bash
# 如果尚未初始化 git 仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"
```

### 2. 连接到 GitHub 仓库

```bash
# 添加远程仓库（替换为你的 GitHub 仓库 URL）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# 推送代码到 master/main 分支
git push -u origin master
# 或
git push -u origin main
```

### 3. 执行部署命令

```bash
# 执行部署
npm run deploy
```

此命令将自动执行以下操作：
1. 运行 `npm run build` 生成构建文件
2. 将 dist 目录内容部署到 gh-pages 分支

## 配置 GitHub Pages

1. 部署成功后，登录 GitHub 并进入你的仓库
2. 点击 Settings → Pages
3. 在 Source 下拉菜单中选择 `gh-pages` 分支
4. 点击 Save 保存设置

## 访问部署的网站

部署完成后，通常需要等待几分钟 GitHub Pages 才会生效。

你的网站将可以通过以下 URL 访问：
```
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/
```

## 注意事项

1. **base 路径配置**:
   - 如果你在 vite.config.ts 中设置了 `base: './'`，则网站将使用相对路径，适用于大多数情况
   - 如果需要使用绝对路径，请将 base 设置为你的仓库名称，如 `base: '/YOUR_REPOSITORY/'`

2. **SPA 路由配置**:
   - 如果使用 React Router，请确保配置了正确的 basename
   - 对于 HashRouter，不需要额外配置
   - 对于 BrowserRouter，需要设置 basename 属性

3. **更新部署**:
   - 每次代码变更后，只需再次运行 `npm run deploy` 即可更新部署

## 常见问题

1. **部署失败**:
   - 检查是否有未提交的更改
   - 确认 GitHub 远程仓库已正确配置
   - 检查网络连接和 GitHub 访问权限

2. **页面加载后显示空白**:
   - 检查浏览器控制台是否有错误
   - 确认 base 路径配置正确
   - 检查静态资源路径是否正确

3. **路由跳转失败**:
   - 对于 BrowserRouter，确保 GitHub Pages 的 "404 重定向" 配置正确
   - 考虑使用 HashRouter 代替 BrowserRouter 避免路由问题

## 高级配置

### 自定义部署分支

如果需要部署到非默认分支，可以修改 package.json 中的 deploy 脚本：

```json
"deploy": "gh-pages -d dist -b your-custom-branch"
```

### 自定义 CNAME

如果你有自定义域名，可以在 public 目录下创建 CNAME 文件：

```
your-domain.com
```

然后在 GitHub Pages 设置中配置自定义域名。

---

部署成功后，你的 React 应用将可以通过 GitHub Pages 进行访问。如需进一步的配置或遇到问题，请参考 GitHub Pages 官方文档或 gh-pages 包的文档。