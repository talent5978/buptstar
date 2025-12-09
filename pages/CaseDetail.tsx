import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CASE_DB } from '../data/redSoulData';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Quote, Tag, ExternalLink } from 'lucide-react';

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const data = CASE_DB[id || ''];

  if (!data) {
    return <div className="pt-24 text-center">内容不存在</div>;
  }

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 w-full bg-space-black overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${data.id}red/1200/600`} 
          alt={data.title} 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <div className="container mx-auto">
            <Link to="/red-soul" className="inline-flex items-center text-gray-300 hover:text-white mb-4 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> 返回列表
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{data.title}</h1>
            <div className="flex flex-wrap gap-2">
                {data.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-star-red text-white text-xs font-bold rounded-full uppercase tracking-wider">
                        {tag}
                    </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
        {/* Main Article */}
        <div className="lg:w-2/3">
           <div className="prose prose-lg prose-slate max-w-none">
             {/* Quote Block */}
             <div className="bg-red-50 border-l-4 border-star-red p-6 rounded-r-lg mb-8 not-prose">
                <Quote className="text-star-red opacity-20 mb-2" size={32} />
                <p className="text-xl font-serif text-gray-800 italic leading-relaxed">
                    “{data.quote}”
                </p>
             </div>

             {/* Content */}
             <ReactMarkdown>{data.fullContent}</ReactMarkdown>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:w-1/3 space-y-8 sticky top-24 self-start">
            {data.sourceUrl && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-bold text-bupt-blue mb-4">权威资料</h3>
                  <a 
                      href={data.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-3 bg-white text-bupt-blue text-center rounded-lg font-bold hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
                  >
                      <span>查看官方介绍</span>
                      <ExternalLink size={16} className="ml-2" />
                  </a>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-bupt-blue mb-4">关联技术点</h3>
                <div className="flex flex-wrap gap-2">
                    {data.relatedTech.map((tech, i) => (
                        <div key={i} className="flex items-center px-3 py-2 bg-white rounded border border-blue-100 text-sm text-gray-600 shadow-sm">
                            <Tag size={14} className="mr-2 text-blue-400" />
                            {tech}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-900 text-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold mb-2">深度思考</h3>
                <p className="text-blue-200 text-sm mb-4">
                    作为新时代的工程师，该案例对你的职业发展有何启示？
                </p>
                <Link to="/ai-tutor" className="block w-full py-2 bg-white text-bupt-blue text-center rounded font-bold hover:bg-gray-100 transition-colors">
                    与 AI 导师讨论
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;