import React from 'react';
import { EXTERNAL_LINKS } from '../constants';
import { ExternalLink as LinkIcon } from 'lucide-react';

const PlatformLinks: React.FC = () => {
  return (
    <section id="links" className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">政通星联 · 平台互通</h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {EXTERNAL_LINKS.map((link, idx) => (
            <a 
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 px-6 py-3 bg-gray-50 rounded-full border border-gray-200 hover:bg-bupt-blue hover:border-bupt-blue transition-all duration-300"
            >
              <span className="font-medium text-gray-700 group-hover:text-white">{link.name}</span>
              <LinkIcon size={14} className="text-gray-400 group-hover:text-white/80" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformLinks;