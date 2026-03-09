import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { login } from '../services/authService';
import { AuthPayload, UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (payload: AuthPayload) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState<UserRole>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('请输入账号和密码');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = await login({ role, username: username.trim(), password: password.trim() });
      onLoginSuccess(payload);

      const state = location.state as { from?: { pathname?: string } } | undefined;
      const fromPath = state?.from?.pathname;
      if (fromPath) {
        navigate(fromPath, { replace: true });
        return;
      }

      navigate(role === 'admin' ? '/admin' : '/comprehensive-score', { replace: true });
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-bupt-blue text-white flex items-center justify-center">
              <LogIn size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">登录系统</h1>
              <p className="text-sm text-gray-500">综测加分上报需先登录</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">身份</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bupt-blue"
              >
                <option value="student">学生</option>
                <option value="admin">管理员</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">账号</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === 'student' ? '学号（如 2025010101）' : '管理员账号'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bupt-blue"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bupt-blue"
              />
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-bupt-blue text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors disabled:opacity-60"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
