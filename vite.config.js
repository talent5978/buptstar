import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
// 对于GitHub Pages部署，base应设置为仓库名
// 对于普通用户站点，保持base: './'；对于仓库站点，设置为'/仓库名/'
export default defineConfig({
    plugins: [react()],
    base: '/buptstar/'
});
