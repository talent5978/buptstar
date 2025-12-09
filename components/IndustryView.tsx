import React from 'react';
import { PARTNER_COMPANIES, HISTORY_TIMELINE } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const dummyData = [
  { name: '2020', value: 4000, value2: 2400 },
  { name: '2021', value: 3000, value2: 1398 },
  { name: '2022', value: 2000, value2: 9800 },
  { name: '2023', value: 2780, value2: 3908 },
  { name: '2024', value: 1890, value2: 4800 },
];

const TimelineCard: React.FC<{ event: typeof HISTORY_TIMELINE[0] }> = ({ event }) => {
  const content = (
    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg hover:bg-slate-700 transition-colors">
      <div className="flex items-center justify-between space-x-2 mb-1">
        <div className="font-bold text-white">{event.title}</div>
        <time className="font-mono text-xs text-blue-400">{event.year}</time>
      </div>
      <div className="text-slate-400 text-sm">{event.description}</div>
    </div>
  );

  if (event.url) {
    return (
      <a href={event.url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }
  return content;
};


const IndustryView: React.FC = () => {
  return (
    <section id="industry" className="py-20 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span className="text-blue-400">星联企迹</span> · 行业纵览
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Timeline */}
          <div>
            <h3 className="text-xl font-semibold mb-8 text-white border-l-4 border-star-red pl-4">发展里程碑</h3>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {HISTORY_TIMELINE.map((event, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xs font-bold">
                    {event.year.slice(-2)}
                  </div>
                  <TimelineCard event={event} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Data & Partners */}
          <div className="flex flex-col space-y-12">
            <div>
              <h3 className="text-xl font-semibold mb-8 text-white border-l-4 border-blue-500 pl-4">行业态势数据</h3>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dummyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} 
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" name="行业产值" />
                    <Bar dataKey="value2" fill="#ef4444" name="人才需求" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-white border-l-4 border-gold-accent pl-4">联培企业矩阵</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {PARTNER_COMPANIES.map((company, idx) => (
                  <a 
                    key={idx} 
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white text-bupt-blue font-bold flex items-center justify-center shrink-0 group-hover:bg-star-red group-hover:text-white transition-colors">
                      {company.logoInitial}
                    </div>
                    <span className="text-xs text-slate-300 group-hover:text-white truncate">{company.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryView;