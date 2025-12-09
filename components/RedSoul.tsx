import React, { useState, useMemo } from 'react';
import { CASE_DB } from '../data/redSoulData';
import { CaseStudy } from '../types';
import { Bookmark, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RedSoul: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cases' | 'models'>('cases');

  const { allCases, allModels } = useMemo(() => {
    const allItems = Object.values(CASE_DB);
    return {
      allCases: allItems.filter(item => item.category === 'red_engineering'),
      allModels: allItems.filter(item => item.category === 'model_engineer'),
    };
  }, []);

  const activeData: CaseStudy[] = activeTab === 'cases' ? allCases : allModels;

  return (
    <section id="red-soul" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="mb-6 md:mb-0">
             <h2 className="text-3xl font-bold text-bupt-blue mb-2">红邮铸魂 · 榜样示范</h2>
             <p className="text-gray-500">传承红色基因，汲取榜样力量</p>
          </div>
          
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab('cases')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'cases' ? 'bg-white text-star-red shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              红色工程案例
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'models' ? 'bg-white text-star-red shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              卓越工程师标杆
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeData.map((item) => (
            <Link key={item.id} to={`/red-soul/${item.id}`} className="group flex flex-col h-full bg-gray-50 border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
               <div className="h-48 overflow-hidden relative">
                 <img 
                   src={`https://picsum.photos/seed/${item.id}red/600/400`} 
                   alt={item.title} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute top-4 left-4">
                    <span className="bg-star-red/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {activeTab === 'cases' ? '工程' : '人物'}
                    </span>
                 </div>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                 <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-star-red transition-colors">{item.title}</h3>
                 <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
                   {item.summary}
                 </p>
                 <div className="flex flex-wrap gap-2 mt-auto mb-4">
                   {item.tags.map((tag, idx) => (
                     <span key={idx} className="flex items-center text-xs bg-blue-50 text-bupt-blue px-2 py-1 rounded border border-blue-100">
                        {activeTab === 'cases' ? <Bookmark size={12} className="mr-1"/> : <Award size={12} className="mr-1"/>}
                        {tag}
                     </span>
                   ))}
                 </div>
                 <div className="flex items-center text-sm font-medium text-star-red mt-2">
                    阅读详情 <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                 </div>
               </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RedSoul;