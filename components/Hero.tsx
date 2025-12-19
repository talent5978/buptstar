import React from 'react';

const Hero: React.FC = () => {
  return (
    <section 
      id="hero" 
      className="relative min-h-[90vh] flex flex-col items-center justify-end overflow-hidden text-white pt-16"
      style={{
        // 将图片作为背景图，确保从导航栏下方开始显示
        backgroundImage: `url(/images/微信图片_20251125084549_241_4.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        // 确保背景图片从内容区域开始显示，而不是从容器顶部开始
        backgroundOrigin: 'content-box',
        // 设置背景颜色作为回退
        backgroundColor: '#0a0a0a'
      }}
    >
      {/* 添加半透明渐变层，调整图片亮度 */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-bupt-blue/10 opacity-40"></div>

      {/* 按钮区域：位于图片下方，不挡住图片内容 */}
      <div className="container mx-auto px-6 z-10 text-center pb-16">
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
          {/* 开启定制化学习按钮：移除阴影效果 */}
          <button 
            onClick={() => document.getElementById('ai-tutor')?.scrollIntoView({behavior: 'smooth'})}
            className="px-8 py-4 bg-star-red hover:bg-red-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center"
          >
             开启定制化学习
          </button>
          {/* 探索六大领域按钮 */}
          <button 
            onClick={() => document.getElementById('fields')?.scrollIntoView({behavior: 'smooth'})}
            className="px-8 py-4 bg-transparent border border-white hover:bg-white hover:text-bupt-blue text-white rounded-lg font-bold transition-all flex items-center justify-center"
          >
            探索六大领域
          </button>
        </div>
      </div>
      
      {/* Abstract decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
    </section>
  );
};

export default Hero;