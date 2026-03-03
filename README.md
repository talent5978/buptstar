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
- **数据库**: SQLite (better-sqlite3)
- **跨域**: CORS 2.8.5
- **HTTP 客户端**: node-fetch 2.7.0
- **LLM**: 支持 OpenAI 格式 API（DeepSeek、SiliconFlow 等）

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
│   ├── database.js      # SQLite 数据库模块
│   ├── initDb.js        # 数据迁移脚本
│   ├── buptstar.db      # SQLite 数据库文件
│   ├── services/        # 后端服务
│   │   ├── llmService.js    # LLM API 服务
│   │   └── kolorsService.js # 图像生成服务
│   ├── data/            # 后端数据文件
│   ├── .env             # 环境变量
│   └── package.json     # 后端依赖
├── components/          # React 组件
├── pages/              # 页面文件
├── services/           # 前端服务
│   ├── baiduService.ts # AI 对话服务
│   ├── kolorsService.ts # 图像生成服务
│   └── dataService.ts  # 数据 API 服务
├── data/               # 前端静态数据（已迁移到后端数据库）
├── public/             # 静态资源
│   └── assets/         # 图片资源
├── App.tsx             # 应用入口
├── index.tsx           # React 入口
├── vite.config.ts      # Vite 配置
├── tsconfig.json       # TypeScript 配置
├── package.json        # 前端依赖
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
   ```

4. **配置环境变量**
   ```bash
   # 复制环境变量示例文件
   cp .env.example .env
   
   # 编辑 .env 文件，配置鉴权与 LLM API
   # JWT_SECRET=replace-with-a-secure-random-secret
   # LLM_API_KEY=your-api-key
   # LLM_API_ENDPOINT=https://api.siliconflow.cn/v1/chat/completions
   # LLM_MODEL=deepseek-ai/DeepSeek-R1-Distill-Qwen-7B
   # 注：LLM_API_KEY 同时用于 AI 学习规划和 AI 图像生成接口
   ```

5. **初始化数据库**
   ```bash
   # 运行数据迁移脚本，将静态数据导入 SQLite 数据库
   node initDb.js
   ```
   
   输出示例：
   ```
   开始数据迁移...
   [1/3] 迁移知识库数据...
   知识库数据迁移完成，共 6 条记录
   [2/3] 迁移案例数据...
   案例数据迁移完成，共 22 条记录
   [3/3] 迁移精神谱系数据...
   精神谱系数据迁移完成，共 46 条记录
   数据迁移全部完成！
   ```

6. **启动后端服务**
   ```bash
   node index.js
   ```
   后端运行在: http://localhost:3001
   
   后端 API 接口：
   - `POST /api/study-plan` - AI 学习规划
   - `POST /api/generate-image` - AI 图像生成
   - `GET /api/knowledge` - 获取知识库数据
   - `GET /api/cases` - 获取案例数据
   - `GET /api/spirits` - 获取精神谱系数据
   - `GET /api/health` - 健康检查

7. **启动前端开发服务器**（新终端窗口）
   ```bash
   cd ..  # 返回项目根目录
   npm run dev
   ```
   访问: http://localhost:5173

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

### 用户与综测加分模块

- 登录入口：`/login`（需选择身份：`student` / `admin`）
- 综测上报页：`/comprehensive-score`（仅学生可访问）
- 管理后台：`/admin`（仅管理员可访问）
- 默认测试账号：
  - 学生：`2025010101 / 2025010101`（张三）
  - 管理员：`admin / bupt2026star`

后端新增接口：
- `POST /api/auth/login` 登录
- `GET /api/auth/me` 获取当前用户
- `GET /api/score/config` 获取综测配置
- `POST /api/score-reports` 学生提交综测上报（支持图片/PDF）
- `GET /api/score-reports/mine` 学生查看个人上报
- `GET /api/admin/users` 管理员查看用户
- `POST /api/admin/users` 管理员新增用户
- `POST /api/admin/users/bulk` 管理员批量导入用户
- `PATCH /api/admin/users/:id/password` 管理员重置密码
- `PATCH /api/admin/users/:id/profile` 管理员启停用户
- `GET /api/admin/score-reports` 管理员查看全部上报
- `PATCH /api/admin/score-reports/:id/review` 管理员审核上报

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
