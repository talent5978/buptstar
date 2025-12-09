import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import FieldDetail from './pages/FieldDetail';
import CaseDetail from './pages/CaseDetail';
import AiTutor from './components/AiTutor';
import StarFields from './components/StarFields';
import RedSoul from './components/RedSoul';
import IndustryView from './components/IndustryView';
import SpiritSource from './components/SpiritSource';

// Layout component to wrap pages with Header and Footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
      {children}
      {/* Footer */}
      <footer className="bg-space-black text-white py-12 border-t border-slate-800 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center">
                 <span className="text-star-red mr-2">✦</span>邮联星课
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                聚焦ICT全产业链与航天卫星互联网领域，打造校企协同、数智赋能的工程思政云平台新标杆。
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">主办单位</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>北京邮电大学国家卓越工程师学院</li>
                <li>中国卫星网络集团教育培养中心</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">联系我们</h4>
              <p className="text-gray-400 text-sm">
                地址：北京市海淀区西土城路10号<br/>
                Email: contact@bupt-starnet-class.cn
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-gray-500 text-xs">
            <p>&copy; 2024 邮联星课工程思政云平台. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fields/:fieldId" element={<FieldDetail />} />
          <Route path="/red-soul/:id" element={<CaseDetail />} />
          
          {/* Independent pages for each module */}
          <Route path="/fields" element={<div className="pt-16"><StarFields /></div>} />
          <Route path="/red-soul" element={<div className="pt-16"><RedSoul /></div>} />
          <Route path="/industry" element={<div className="pt-16"><IndustryView /></div>} />
          <Route path="/spirit" element={<div className="pt-16"><SpiritSource /></div>} />
          <Route path="/ai-tutor" element={<div className="pt-16"><AiTutor /></div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;