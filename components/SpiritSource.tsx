import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { SPIRIT_DATA } from '../data/spiritData';
import { SpiritCategory, Spirit } from '../types';
import SpiritDetailModal from './SpiritDetailModal';

const SpiritSource: React.FC = () => {
  const [selectedSpirit, setSelectedSpirit] = useState<Spirit | null>(null);

  return (
    <>
      <section id="spirit" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4 text-star-red">
              <Star size={24} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">精神传承 · 思政溯源</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              系统学习第一批纳入中国共产党人精神谱系的伟大精神，深度挖掘精神内核，筑牢学生思想根基。
            </p>
          </div>

          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 bg-bupt-blue text-white">
              <h3 className="text-xl font-bold">中国共产党人精神谱系（第一批）</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {SPIRIT_DATA.map((category: SpiritCategory, catIndex: number) => (
                <div key={catIndex} className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 bg-red-50/50 p-4 font-bold text-star-red flex items-center justify-center md:justify-start text-center md:text-left border-b md:border-b-0 md:border-r border-gray-200">
                    {category.period}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                      {category.spirits.flat().map((spirit, spiritIndex) => (
                        spirit.name ? (
                          <button 
                            key={spiritIndex} 
                            onClick={() => setSelectedSpirit(spirit)}
                            className="text-left text-gray-700 hover:text-bupt-blue transition-colors cursor-pointer"
                          >
                            <span className="font-medium hover:underline">{spirit.name}</span>
                            {spirit.note && <span className="text-xs text-gray-500 ml-1">({spirit.note})</span>}
                          </button>
                        ) : null
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
             <div className="p-4 bg-gray-50 text-right text-xs text-gray-400">
              参考资料：中宣部“中国共产党人精神谱系第一批伟大精神”
            </div>
          </div>
        </div>
      </section>
      <SpiritDetailModal 
        spirit={selectedSpirit} 
        onClose={() => setSelectedSpirit(null)} 
      />
    </>
  );
};

export default SpiritSource;