<div align="center">
  <h1>邮联星课 - 数智赋能定制化工程思政云平台</h1>
  <p>基于 AI 技术的现代化教育平台</p>
</div>

## 🌐 在线访问

- **生产环境**: https://buptstar.dpdns.org
- **后端 API**: https://buptstar.dpdns.org/api/*

## 📋 项目简介

邮联星课是一个基于 React 和 Node.js 的现代化教育平台，集成了多种 AI 服务，提供智能化的教学和学习体验。

### ✨ 核心功能

- 🎨 **AI 图像生成**: 集成 Kwai-Kolors 等生图模型
- 💬 **智能对话**: 支持多种 AI 对话服务
- 📊 **数据可视化**: 使用 Recharts 展示数据分析
- 🎯 **个性化推荐**: 基于用户行为的内容推荐
- 📱 **响应式设计**: 完美适配各种设备

## 🛠️ 技术栈

### 前端
- **框架**: React 19.2.0
- **构建工具**: Vite 6.2.0
- **语言**: TypeScript 5.8.2
- **样式**: TailwindCSS 4.1.18
- **路由**: React Router 6.22.3
- **图表**: Recharts 3.5.1
- **图标**: Lucide React 0.555.0

### 后端
- **框架**: Express 5.2.1
- **语言**: Node.js
- **跨域**: CORS 2.8.5
- **HTTP 客户端**: node-fetch 2.7.0

### 部署
- **反向代理**: Nginx
- **进程管理**: PM2
- **内网穿透**: Cloudflare Tunnel
- **域名**: buptstar.dpdns.org

## 📁 项目结构

```
buptstar-web/
├── backend/              # 后端服务
│   ├── index.js         # 后端入口文件
│   └── package.json     # 后端依赖
├── src/                 # 前端源码
│   ├── App.tsx         # 主应用组件
│   ├── components/     # 可复用组件
│   ├── pages/          # 页面组件
│   ├── services/       # API 服务
│   └── data/          # 数据文件
├── dist/               # 前端构建产物
├── public/             # 静态资源
├── components/         # 全局组件
├── pages/             # 页面文件
├── App.tsx            # 应用入口
├── index.tsx          # React 入口
├── vite.config.ts     # Vite 配置
├── tsconfig.json      # TypeScript 配置
├── package.json       # 前端依赖
└── ecosystem.config.cjs # PM2 配置
```

## 🚀 快速开始

### 前置要求

- Node.js (推荐 v18+)
- npm 或 yarn

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/talent5978/buptstar.git
   cd buptstar-web
   ```

2. **安装前端依赖**
   ```bash
   npm install
   ```

3. **安装后端依赖**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **启动前端开发服务器**
   ```bash
   npm run dev
   ```
   访问: http://localhost:5173

5. **启动后端服务**
   ```bash
   cd backend
   node index.js
   ```
   后端运行在: http://localhost:3001

### 生产构建

```bash
# 构建前端
npm run build

# 启动生产环境（使用 PM2）
pm2 start ecosystem.config.cjs
```

## 📦 部署指南

### 服务器部署

1. **拉取代码**
   ```bash
   cd /var/www/buptstar-web
   git pull origin main
   ```

2. **更新依赖**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **构建前端**
   ```bash
   npm run build
   ```

4. **重启服务**
   ```bash
   pm2 restart buptstar-backend
   pm2 restart buptstar-frontend
   ```

5. **查看服务状态**
   ```bash
   pm2 status
   ```

### Cloudflare Tunnel 配置

配置文件位于: `/var/www/buptstar-web/cloudflared-config.yml`

```yaml
tunnel: d0f0a13c-25a6-45b3-9e9b-243c11ce7b38
credentials-file: /home/zkt/.cloudflared/d0f0a13c-25a6-45b3-9e9b-243c11ce7b38.json
protocol: http2

ingress:
  - hostname: buptstar.dpdns.org
    service: http://localhost:80
  - service: http_status:404
```

### Nginx 配置

Nginx 已配置反向代理，将 `/api` 请求转发到后端服务。

## 🔧 开发指南

### 添加新页面

1. 在 `src/pages/` 或 `pages/` 目录创建新组件
2. 在 `App.tsx` 中添加路由配置
3. 在导航组件中添加链接

### 添加新 API

1. 在 `backend/index.js` 中添加新的路由
2. 在 `src/services/` 中创建对应的 API 服务函数
3. 在组件中调用 API 服务

### 环境变量

后端使用 `.env` 文件配置环境变量（位于 `backend/` 目录）。

## 📊 监控和日志

### PM2 监控

```bash
# 查看实时日志
pm2 logs

# 查看服务状态
pm2 status

# 查看资源使用
pm2 monit
```

### Nginx 日志

```bash
# 访问日志
sudo tail -f /var/log/nginx/access.log

# 错误日志
sudo tail -f /var/log/nginx/error.log
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### 最新更新
- ✅ 集成 Cloudflare Tunnel 实现内网穿透
- ✅ 配置 Nginx 反向代理
- ✅ 使用 PM2 管理进程
- ✅ 完成前后端分离部署
- ✅ 集成 Kwai-Kolors 生图模型
- ✅ 优化导航和 AI 回复格式

## 📄 许可证

本项目采用 ISC 许可证。

## 📧 联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues: https://github.com/talent5978/buptstar/issues

---

<div align="center">
  <p>用 ❤️ 和 AI 构建</p>
</div>
