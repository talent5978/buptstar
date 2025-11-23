import React from 'react';
import ReactDOM from 'react-dom/client';

// 静态导入App组件
import App from './app';

console.log('App component type:', typeof App);
console.log('App component:', App);

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