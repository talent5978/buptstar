import React from 'react';
import { Signal, Code, ShieldCheck, Cpu, Zap, Globe } from 'lucide-react';
import { SIX_FIELDS } from '../constants';
import { Link } from 'react-router-dom';

const iconMap: Record<string, React.ReactNode> = {
  Signal: <Signal size={32} />,
  Code: <Code size={32} />,
  ShieldCheck: <ShieldCheck size={32} />,
  Cpu: <Cpu size={32} />,
  Zap: <Zap size={32} />,
  Globe: <Globe size={32} />,
};

const StarFields: React.FC = () => {
  return (
    <section id="fields" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-bupt-blue mb-4 flex items-center justify-center gap-3">
            <span className="w-8 h-1 bg-star-red"></span>
            星途领航 · 领域思政
            <span className="w-8 h-1 bg-star-red"></span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            聚焦ICT五大关键领域与航天卫星互联网，融合技术前沿与思政育人，引领卓越工程师成长之路。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SIX_FIELDS.map((field) => (
            <Link key={field.id} to={`/fields/${field.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden block">
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-50 text-bupt-blue rounded-2xl flex items-center justify-center mb-6 group-hover:bg-bupt-blue group-hover:text-white transition-colors duration-300">
                  {iconMap[field.icon]}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-star-red transition-colors">
                  {field.name}
                </h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  {field.description}
                </p>
                <div className="flex items-center text-sm font-medium text-bupt-blue cursor-pointer group-hover:underline">
                  探索课程资源 &rarr;
                </div>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-bupt-blue to-star-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StarFields;