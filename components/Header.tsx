import React from 'react';
import { Menu, GraduationCap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `hover:text-star-red transition-colors ${isActive ? 'text-star-red font-bold' : 'text-gray-700'}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 cursor-pointer">
          <div className="bg-star-red p-2 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-bupt-blue tracking-wide">邮联星课</h1>
            <p className="text-xs text-gray-500 hidden sm:block">数智赋能定制化工程思政云平台</p>
          </div>
        </Link>

        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link to="/" className={getLinkClass('/')} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>首页</Link>
          <Link to="/fields/ict" className={getLinkClass('/fields/ict')}>星途领航</Link>
          <Link to="/red-soul" className={getLinkClass('/red-soul')}>红邮铸魂</Link>
          <Link to="/industry" className={getLinkClass('/industry')}>星联企迹</Link>
          <Link to="/spirit" className={getLinkClass('/spirit')}>精神传承</Link>
          <Link to="/links" className={getLinkClass('/links')}>政通星联</Link>
          <Link to="/image-generation" className={getLinkClass('/image-generation')}>星图生成</Link>
        </nav>

        <div className="flex items-center space-x-4">
           {/* Mobile Menu Button */}
           <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
            <Menu size={24} className="text-gray-700" />
          </button>
          <Link 
            to="/ai-tutor"
            className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-bupt-blue to-blue-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-medium text-sm"
          >
            <span>AI 定制化学习</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;