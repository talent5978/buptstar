import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 设置base路径，适用于GitHub Pages和Gitee Pages部署
  // 对于GitHub Pages：
  // - 如果部署到 https://username.github.io/，保持base: './'（相对路径）
  // - 如果部署到 https://username.github.io/repo-name/，则设置base: '/repo-name/'
  // 例如：仓库地址是 https://github.com/username/my-project
  // 则base应该设置为 '/my-project/'
  base: './', // 使用相对路径以便在不同环境下都能正常工作
})