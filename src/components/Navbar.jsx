import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  GraduationCap,
  Star,
  Building2,
  Shield,
  Network,
  Brain,
  Menu,
  Search,
} from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // In a real app, this would probably navigate to a search results page
      // For now we'll just log or do nothing as per the original code's limited logic
      // The original code navigates to `/search?q=...`
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative hidden md:block">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索领域、案例、人物..."
        className="bg-blue-700 bg-opacity-50 border border-blue-600 rounded-lg py-1 px-3 w-64 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
};

const Navbar = ({ currentPage }) => {
  const links = [
    { path: "/", label: "首页", icon: Home },
    { path: "/fields", label: "星途领航", icon: GraduationCap },
    { path: "/red-spirit", label: "红邮铸魂", icon: Star },
    { path: "/enterprises", label: "星联企迹", icon: Building2 },
    { path: "/spirits", label: "精神传承", icon: Shield },
    { path: "/platforms", label: "政通星联", icon: Network },
    { path: "/personalized", label: "数智定制", icon: Brain },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-yellow-400 text-blue-900 font-bold text-xl rounded-full w-10 h-10 flex items-center justify-center">
                邮
              </div>
              <span className="font-bold text-xl hidden md:block">
                邮联星课
              </span>
              <span className="text-sm hidden md:block">
                数智赋能定制化工程思政云平台
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap min-w-[80px] text-center ${
                    currentPage === link.label
                      ? "bg-blue-700 text-white"
                      : "hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center">
            <SearchBar />
            <button className="md:hidden ml-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
