import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import FieldDetail from './pages/FieldDetail';
import CaseDetail from './pages/CaseDetail';
import LinksPage from './pages/LinksPage';
import ImageGenerationPage from './pages/ImageGenerationPage';
import AiTutor from './components/AiTutor';
import StarFields from './components/StarFields';
import RedSoul from './components/RedSoul';
import IndustryView from './components/IndustryView';
import SpiritSource from './components/SpiritSource';
import LoginPage from './pages/LoginPage';
import ComprehensiveScorePage from './pages/ComprehensiveScorePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { AuthPayload, UserRole } from './types';
import {
  clearStoredAuth,
  fetchCurrentUser,
  getStoredAuth,
  logout,
  storeAuth
} from './services/authService';

interface RequireAuthProps {
  auth: AuthPayload | null;
  requiredRole?: UserRole;
  children: React.ReactElement;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ auth, requiredRole, children }) => {
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && auth.user.role !== requiredRole) {
    const fallback = auth.user.role === 'admin' ? '/admin' : '/comprehensive-score';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

interface LayoutProps {
  auth: AuthPayload | null;
  onAuthChange: (payload: AuthPayload | null) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ auth, onAuthChange, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);

    setMobileMenuOpen(false);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (auth?.token) {
      await logout(auth.token);
    }
    clearStoredAuth();
    onAuthChange(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        onMenuClick={() => setMobileMenuOpen((v) => !v)}
        authUser={auth?.user || null}
        onLogout={handleLogout}
      />
      {children}
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
                地址：北京市海淀区西土城路10号
                <br />
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

const AppRoutes: React.FC = () => {
  const [auth, setAuth] = useState<AuthPayload | null>(() => getStoredAuth());
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const stored = getStoredAuth();
      if (!stored?.token) {
        setAuth(null);
        setCheckingAuth(false);
        return;
      }

      try {
        const user = await fetchCurrentUser(stored.token);
        const payload = { token: stored.token, user };
        storeAuth(payload);
        setAuth(payload);
      } catch {
        clearStoredAuth();
        setAuth(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    verify();
  }, []);

  const handleLoginSuccess = (payload: AuthPayload) => {
    storeAuth(payload);
    setAuth(payload);
  };

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">登录状态检查中...</div>;
  }

  return (
    <Layout auth={auth} onAuthChange={setAuth}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fields/:fieldId" element={<FieldDetail />} />
        <Route path="/red-soul/:id" element={<CaseDetail />} />

        <Route path="/fields" element={<div className="pt-16"><StarFields /></div>} />
        <Route path="/red-soul" element={<div className="pt-16"><RedSoul /></div>} />
        <Route path="/industry" element={<div className="pt-16"><IndustryView /></div>} />
        <Route path="/spirit" element={<div className="pt-16"><SpiritSource /></div>} />
        <Route path="/ai-tutor" element={<div className="pt-16"><AiTutor /></div>} />
        <Route path="/links" element={<div className="pt-16"><LinksPage /></div>} />
        <Route path="/image-generation" element={<div className="pt-16"><ImageGenerationPage /></div>} />

        <Route
          path="/login"
          element={
            auth ? <Navigate to={auth.user.role === 'admin' ? '/admin' : '/comprehensive-score'} replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
          }
        />

        <Route
          path="/comprehensive-score"
          element={
            <RequireAuth auth={auth} requiredRole="student">
              <ComprehensiveScorePage token={auth?.token || ''} />
            </RequireAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAuth auth={auth} requiredRole="admin">
              <AdminDashboardPage token={auth?.token || ''} />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
