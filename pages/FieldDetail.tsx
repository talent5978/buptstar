import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchKnowledgeById } from '../services/dataService';
import { SIX_FIELDS } from '../constants';
import { FieldDetailData } from '../types';
import ReactMarkdown from 'react-markdown';
import { Signal, Code, ShieldCheck, Cpu, Zap, Globe, ArrowLeft, BookOpen, BookText, ScrollText, Rocket, Loader2 } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Signal: <Signal size={20} />,
  Code: <Code size={20} />,
  ShieldCheck: <ShieldCheck size={20} />,
  Cpu: <Cpu size={20} />,
  Zap: <Zap size={20} />,
  Globe: <Globe size={20} />,
};

const sectionIcons: Record<string, React.ReactNode> = {
    overview: <BookText size={24} className="text-blue-500" />,
    history: <ScrollText size={24} className="text-green-500" />,
    future: <Rocket size={24} className="text-purple-500" />
};

const FieldDetail: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const currentId = fieldId || 'ict';
  
  const [data, setData] = useState<FieldDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchKnowledgeById(currentId);
        setData(result);
      } catch (err: any) {
        setError(err.message || '加载失败');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentId]);

  if (loading) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-bupt-blue" />
        <span className="ml-2 text-gray-600">加载中...</span>
      </div>
    );
  }

  if (error || !data) {
    return <div className="pt-24 text-center text-red-500">{error || '领域不存在'}</div>;
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 hidden md:block overflow-y-auto">
        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">核心领域库</h3>
          <div className="space-y-2">
            {SIX_FIELDS.map((field) => (
              <Link
                key={field.id}
                to={`/fields/${field.id}`}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentId === field.id
                    ? 'bg-bupt-blue text-white shadow-md'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-bupt-blue'
                }`}
              >
                {iconMap[field.icon]}
                <span className="font-medium text-sm">{field.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-bupt-blue mb-4 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> 返回首页
            </Link>
            <div className="flex items-center space-x-4 mb-4">
               <div className="p-3 bg-blue-100 text-bupt-blue rounded-xl">
                 {iconMap[data.icon]}
               </div>
               <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            </div>
            
            <div className="bg-gradient-to-r from-star-red to-red-600 text-white p-6 rounded-xl shadow-lg mt-6 flex items-start space-x-4">
              <BookOpen size={24} className="flex-shrink-0 mt-1 text-gold-accent" />
              <div>
                <h3 className="font-bold text-lg mb-1 text-gold-accent">工程思政育人点</h3>
                <p className="opacity-95 leading-relaxed font-medium">{data.ideologicalPoint}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Overview Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-4 mb-4">
                {sectionIcons.overview}
                <h2 className="text-2xl font-bold text-gray-800">领域概况</h2>
              </div>
              <section className="prose prose-blue max-w-none">
                  <ReactMarkdown>{data.overview}</ReactMarkdown>
              </section>
            </div>
            
            {/* History Card */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
               <div className="flex items-center gap-4 mb-4">
                {sectionIcons.history}
                <h2 className="text-2xl font-bold text-gray-800">历史沿革</h2>
              </div>
               <section className="prose prose-blue max-w-none">
                 <ReactMarkdown>{data.history}</ReactMarkdown>
               </section>
            </div>

            {/* Future Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
               <div className="flex items-center gap-4 mb-4">
                 {sectionIcons.future}
                 <h2 className="text-2xl font-bold text-gray-800">技术前沿与挑战</h2>
               </div>
               <section className="prose prose-blue max-w-none">
                 <ReactMarkdown>{data.future}</ReactMarkdown>
               </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FieldDetail;