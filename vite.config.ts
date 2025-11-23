import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 设置base路径，适用于Gitee Pages部署
  // 注意：部署时需要将base设置为你的仓库名
  // 例如：如果仓库地址是 https://gitee.com/username/my-project
  // 则base应该设置为 '/my-project/'
  base: './', // 使用相对路径以便在不同环境下都能正常工作
})