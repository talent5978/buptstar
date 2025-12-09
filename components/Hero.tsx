import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-space-black text-white">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/satellite/1920/1080" 
          alt="Satellite Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-space-black via-transparent to-bupt-blue/30"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 z-10 text-center">
        <div className="inline-block mb-4 px-3 py-1 border border-gold-accent text-gold-accent rounded-full text-sm tracking-widest uppercase">
          北邮 × 中国星网
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">邮联星课</span>
          <br />
          <span className="text-4xl md:text-6xl text-star-red mt-2 block">数智赋能 · 红色工程</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light">
          理论共学 · 技术共研 · 难题共克
          <br/>
          <span className="text-sm md:text-lg opacity-80 mt-2 block">
            构建“大思政课”云探索标杆平台，培育新时代红色卓越工程师
          </span>
        </p>
        
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
          <button 
            onClick={() => document.getElementById('ai-tutor')?.scrollIntoView({behavior: 'smooth'})}
            className="px-8 py-4 bg-star-red hover:bg-red-700 text-white rounded-lg font-bold shadow-lg shadow-red-900/50 transition-all transform hover:scale-105 flex items-center justify-center"
          >
             开启定制化学习
          </button>
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