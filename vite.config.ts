import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages部署配置
  // 需要将base设置为仓库名称的路径
  // 例如：如果仓库名为 engineering-ideology-platform
  // 则设置为 '/engineering-ideology-platform/'
  // 请根据你的实际仓库名称修改
  base: '/engineering-ideology-platform/',
})