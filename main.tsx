import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.tsx';

// 创建React根节点
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 渲染App组件
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);