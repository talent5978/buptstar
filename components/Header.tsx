import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, Menu, UserCircle2 } from 'lucide-react';
import { AuthUser } from '../types';

interface HeaderProps {
  mobileMenuOpen: boolean;
  onMenuClick: () => void;
  authUser: AuthUser | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, onMenuClick, authUser, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首页', exact: true },
    { path: '/fields/ict', label: '星途领航' },
    { path: '/red-soul', label: '红邮铸魂' },
    { path: '/industry', label: '星联企迹' },
    { path: '/spirit', label: '精神传承' },
    { path: '/links', label: '政通星联' },
    { path: '/comprehensive-score', label: '综测加分' }
  ];

  if (authUser?.role === 'admin') {
    navItems.push({ path: '/admin', label: '管理后台' });
  }

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const getLinkClass = (path: string, exact?: boolean) =>
    `hover:text-star-red transition-colors ${isActive(path, exact) ? 'text-star-red font-bold' : 'text-gray-700'}`;

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
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={getLinkClass(item.path, item.exact)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-gray-100 rounded-full" aria-label="打开菜单">
            <Menu size={24} className="text-gray-700" />
          </button>

          <div className="hidden md:flex items-center space-x-2">
            {authUser ? (
              <>
                <span className="inline-flex items-center text-sm text-gray-700 px-3 py-1.5 bg-gray-100 rounded-full">
                  <UserCircle2 size={16} className="mr-1" />
                  {authUser.displayName}（{authUser.role === 'admin' ? '管理员' : '学生'}）
                </span>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-white bg-slate-700 rounded-full hover:bg-slate-900"
                >
                  <LogOut size={14} className="mr-1" />退出
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-bupt-blue rounded-full hover:bg-blue-900"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2 shadow">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-lg ${isActive(item.path, item.exact) ? 'bg-blue-50 text-bupt-blue font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {item.label}
            </Link>
          ))}

          {authUser ? (
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-900"
            >
              退出登录（{authUser.displayName}）
            </button>
          ) : (
            <Link to="/login" className="block px-3 py-2 rounded-lg bg-bupt-blue text-white hover:bg-blue-900">
              登录
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
