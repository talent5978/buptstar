# 工程思政云平台

## 项目简介
这是一个基于React + TypeScript + Vite构建的工程思政云平台。

## 部署指南 (Gitee Pages)

### 准备工作
1. 确保项目已经构建成功
   ```bash
   npm run build
   ```
   构建完成后会生成`dist`目录

### Gitee Pages部署步骤

#### 第一步：创建Gitee仓库
1. 注册/登录[码云(Gitee)](https://gitee.com/)
2. 点击右上角「+」号，选择「新建仓库」
3. 填写仓库信息：
   - 仓库名称：如`engineering-ideology-platform`
   - 选择公开仓库
   - 其他选项保持默认，点击「创建」

#### 第二步：上传项目文件
1. 在本地项目根目录初始化Git仓库（如果尚未初始化）：
   ```bash
   git init
   git add .
   git commit -m "初始化项目"
   ```

2. 关联Gitee仓库并推送代码：
   ```bash
   git remote add origin https://gitee.com/你的用户名/engineering-ideology-platform.git
   git push -u origin master
   ```

#### 第三步：配置Gitee Pages
1. 进入Gitee仓库页面
2. 点击「服务」-> 「Gitee Pages」
3. 在配置页面：
   - 分支：选择`master`
   - 目录：选择`dist`（重要！）
   - 勾选「强制使用HTTPS」
   - 点击「启动」按钮

#### 第四步：验证部署
1. 稍等片刻，Gitee会自动部署你的项目
2. 部署成功后，页面上会显示访问地址，格式通常为：
   `https://你的用户名.gitee.io/engineering-ideology-platform`
3. 访问该地址，确认网站可以正常运行

### 注意事项
1. **React Router配置**：如果项目使用了React Router的BrowserRouter，需要确保在`vite.config.ts`中设置了正确的`base`路径
2. **静态资源引用**：所有静态资源引用应使用相对路径，避免使用绝对路径
3. **重新部署**：每次代码更新后，需要：
   - 重新构建项目：`npm run build`
   - 提交并推送更新：`git add . && git commit -m "更新内容" && git push`
   - 在Gitee Pages页面点击「更新」按钮

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