import React from 'react';
import { Spirit } from '../types';
import { X, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SpiritDetailModalProps {
  spirit: Spirit | null;
  onClose: () => void;
}

const SpiritDetailModal: React.FC<SpiritDetailModalProps> = ({ spirit, onClose }) => {
  if (!spirit) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-bupt-blue text-white border-b-4 border-star-red">
            <div className="flex items-center space-x-3">
                <BookOpen size={24} />
                <h2 className="text-2xl font-bold">{spirit.name}</h2>
            </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="关闭详情窗口"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{spirit.details}</ReactMarkdown>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
             <button
                onClick={onClose}
                className="px-6 py-2 bg-star-red text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
             >
                关闭
             </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SpiritDetailModal;