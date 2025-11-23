# GitHub Pages 部署指南（修订版）

本指南详细说明了如何成功将工程思政云平台React应用部署到GitHub Pages，并解决了常见的部署问题。

## 已完成的配置修复

### 1. 修复Router配置

在`app.tsx`中，我们为`Router`组件添加了`basename`属性：

```tsx
<Router basename="">
```

这确保了React Router能够在GitHub Pages的URL结构下正确工作。

### 2. 修复资源引用路径

在`index.html`中，我们将资源引用从绝对路径改为相对路径：

```html
<!-- 修改前 -->
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
<script type="module" src="/main.tsx"></script>

<!-- 修改后 -->
<link rel="icon" type="image/svg+xml" href="./vite.svg" />
<script type="module" src="./main.tsx"></script>
```

### 3. 优化Vite配置说明

在`vite.config.ts`中，我们保留了`base: './'`相对路径配置，并添加了详细注释：

```typescript
base: './', // 使用相对路径以便在不同环境下都能正常工作
```

## 部署步骤

### 1. 生成构建产物

首先，运行构建命令生成生产环境的代码：

```bash
npm run build
```

这将在项目根目录下创建一个`dist`目录，包含所有构建后的静态文件。

### 2. 初始化Git仓库（如果尚未初始化）

如果你的项目还没有初始化Git仓库，请执行以下命令：

```bash
git init
git add .
git commit -m "Initial commit"
```

### 3. 连接到GitHub仓库

将本地仓库连接到GitHub远程仓库：

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin master  # 或者使用main分支
git branch -M main  # 如果默认分支是main
```

### 4. 部署到GitHub Pages

使用我们已经配置好的脚本进行部署：

```bash
npm run deploy
```

这个命令会自动执行以下操作：
1. 运行`predeploy`脚本构建应用（`npm run build`）
2. 使用`gh-pages`工具将`dist`目录的内容推送到GitHub仓库的`gh-pages`分支

### 5. 配置GitHub Pages

部署完成后，需要在GitHub仓库中启用GitHub Pages：

1. 登录GitHub，进入你的仓库页面
2. 点击顶部导航栏中的"Settings"选项
3. 在左侧菜单中找到并点击"Pages"
4. 在"Source"部分，从下拉菜单中选择`gh-pages`分支
5. 选择根目录(/)或docs文件夹（本项目使用根目录）
6. 点击"Save"按钮保存设置

## 访问部署的网站

GitHub Pages配置完成后，你的网站将可以通过以下URL访问：

- 如果部署到用户/组织站点：`https://YOUR_USERNAME.github.io/`
- 如果部署到项目站点：`https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

## 重要注意事项

### 1. 配置basename（根据仓库类型调整）

**如果部署到项目站点**（即URL包含仓库名），需要修改以下配置：

1. 在`app.tsx`中更新`Router`的`basename`：

```tsx
<Router basename="/YOUR_REPOSITORY_NAME">
```

2. 在`vite.config.ts`中更新`base`配置：

```typescript
base: '/YOUR_REPOSITORY_NAME/',
```

### 2. SPA路由配置

如果遇到页面刷新404问题（典型的SPA路由问题），确保：

1. 你已经正确配置了`Router`的`basename`属性
2. 对于复杂的路由需求，考虑使用`HashRouter`替代`BrowserRouter`：

```tsx
// 替换导入语句
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// 然后正常使用Router组件，不需要basename
<Router>
  {/* 你的路由配置 */}
</Router>
```

### 3. 更新部署流程

当你对项目进行更改后，重复以下步骤重新部署：

```bash
git add .
git commit -m "描述你的更改"
git push origin main  # 先推送到主分支
npm run deploy  # 然后部署到GitHub Pages
```

## 常见问题排查

1. **页面空白，但控制台无错误**
   - 检查`base`配置是否正确
   - 确认`Router`的`basename`是否与GitHub仓库路径匹配

2. **页面空白，控制台显示资源加载错误**
   - 确保所有资源路径都是相对路径（以`.`开头）
   - 检查`vite.config.ts`中的`base`配置

3. **页面可以加载，但路由导航失败**
   - 确认`Router`的`basename`配置正确
   - 考虑切换到`HashRouter`

4. **部署成功但GitHub Pages未更新**
   - GitHub Pages可能需要几分钟时间来更新
   - 清除浏览器缓存后重试

5. **gh-pages部署命令失败**
   - 确保你已安装git并配置了正确的用户信息
   - 检查GitHub仓库权限设置
   - 确认本地git环境可以正常推送到GitHub

## 验证部署

部署完成后，建议执行以下检查：

1. 访问你的GitHub Pages URL
2. 检查控制台是否有错误
3. 测试所有导航链接和交互功能
4. 尝试刷新页面，验证SPA路由是否正常工作

## 其他部署选项

如果你发现GitHub Pages仍有问题，可以考虑以下替代方案：

1. **Vercel** - 对React应用有很好的支持，提供自动部署
2. **Netlify** - 简单易用，支持自动部署和表单处理
3. **Firebase Hosting** - Google提供的托管服务，支持CDN和自定义域名

## 联系与支持

如果在部署过程中遇到任何问题，请参考：

- [React Router官方文档](https://reactrouter.com/docs/en/v6)
- [GitHub Pages文档](https://docs.github.com/en/pages)
- [Vite部署文档](https://vitejs.dev/guide/static-deploy.html)

祝您部署顺利！