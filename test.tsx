import React from 'react';
import ReactDOM from 'react-dom/client';

// 尝试不同的导入方式
let App;
try {
  // 尝试默认导入
  const defaultImport = await import('./app.tsx');
  App = defaultImport.default || defaultImport;
  console.log('Default import successful:', App);
} catch (e) {
  console.error('Import error:', e);
  // 如果导入失败，使用备用组件
  App = () => (
    <div className="min-h-screen bg-light p-8">
      <h1 className="text-4xl font-bold text-primary">导入失败</h1>
      <p className="mt-4 text-lg">无法导入app.tsx组件，请检查文件导出方式。</p>
    </div>
  );
}

// 创建React根节点
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 渲染组件
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);