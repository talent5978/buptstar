import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: mode === 'production' ? '/buptstar/' : '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify('bce-v3/ALTAK-JFzKly2vCuIV8LnfdyX1W/a0ac65d30c610560dc4b72939c8826f7a390fce6'),
        'process.env.BAIDU_API_KEY': JSON.stringify('bce-v3/ALTAK-JFzKly2vCuIV8LnfdyX1W/a0ac65d30c610560dc4b72939c8826f7a390fce6')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
