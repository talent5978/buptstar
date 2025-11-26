import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 设置base路径，适用于GitHub Pages和Gitee Pages部署
  // 对于GitHub Pages：
  // - 如果部署到 https://username.github.io/，保持base: './'（相对路径）
  // - 如果部署到 https://username.github.io/repo-name/，则设置base: '/repo-name/'
  // 当前仓库是 https://github.com/talent5978/buptstar
  // 因此base设置为 '/buptstar/'
  base: '/buptstar/', // 设置为仓库名，确保GitHub Pages部署时资源路径正确
})