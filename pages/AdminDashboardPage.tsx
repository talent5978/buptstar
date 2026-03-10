import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { ScoreRankingItem, ScoreReport, ScoreReviewStudent, UserListItem, UserRole } from '../types';
import {
  batchReviewReports,
  createAdminUser,
  fetchAdminScoreConfig,
  fetchAdminEntryStatus,
  fetchAdminScoreRankings,
  fetchAdminUsers,
  fetchReviewStudentReports,
  fetchReviewStudents,
  importUsersBulk,
  resetUserPassword,
  saveAdminScoreConfig,
  setAdminEntryStatus,
  updateUserProfile
} from '../services/scoreReportService';

interface AdminDashboardPageProps {
  token: string;
}

type AdminTab = 'users' | 'review' | 'ranking' | 'config';
type ConfigModuleKey = 'moral_education' | 'intellectual_education' | 'physical_aesthetic_labor';

interface EditableConfigItem {
  label: string;
  base_score: number | null;
}

interface EditableConfigCategory {
  name: string;
  max_limit?: number | null;
  max_limit_note?: string;
  items: EditableConfigItem[];
}

interface EditableConfigModule {
  module_name: string;
  max_limit?: number | null;
  categories: EditableConfigCategory[];
}

type EditableScoreConfig = Record<ConfigModuleKey, EditableConfigModule>;

const statusClass: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
};

const statusTextMap: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回'
};

const moduleTextMap: Record<string, string> = {
  moral_education: '德育加分',
  intellectual_education: '智育加分',
  physical_aesthetic_labor: '体美劳育'
};

const moduleKeyOrder: ConfigModuleKey[] = ['moral_education', 'intellectual_education', 'physical_aesthetic_labor'];

const cloneConfig = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const toNullableNumber = (raw: string): number | null => {
  const text = String(raw || '').trim();
  if (!text) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
};

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ token }) => {
  const [tab, setTab] = useState<AdminTab>('users');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [entryEnabled, setEntryEnabled] = useState(true);

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [userSearch, setUserSearch] = useState('');

  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewStudents, setReviewStudents] = useState<ScoreReviewStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<UserListItem | null>(null);
  const [studentReports, setStudentReports] = useState<ScoreReport[]>([]);
  const [selectedReportIds, setSelectedReportIds] = useState<number[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [rankings, setRankings] = useState<ScoreRankingItem[]>([]);

  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newPassword, setNewPassword] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [editableConfig, setEditableConfig] = useState<EditableScoreConfig | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  const loadBasic = async () => {
    setLoading(true);
    setError(null);
    try {
      const [entryStatus, userList] = await Promise.all([fetchAdminEntryStatus(token), fetchAdminUsers(token)]);
      setEntryEnabled(entryStatus.enabled);
      setUsers(userList);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const loadReviewStudents = async (search = reviewSearch) => {
    try {
      const list = await fetchReviewStudents(token, search);
      setReviewStudents(list);
    } catch (err: any) {
      setError(err.message || '加载审核学生列表失败');
    }
  };

  const loadRankings = async () => {
    try {
      const list = await fetchAdminScoreRankings(token);
      setRankings(list);
    } catch (err: any) {
      setError(err.message || '加载积分排名失败');
    }
  };

  const loadStudentReports = async (userId: number) => {
    try {
      const detail = await fetchReviewStudentReports(token, userId);
      setSelectedStudent(detail.user);
      setStudentReports(detail.reports);
      setSelectedReportIds([]);
    } catch (err: any) {
      setError(err.message || '加载学生上报失败');
    }
  };

  useEffect(() => {
    loadBasic();
  }, [token]);

  useEffect(() => {
    if (tab === 'review') {
      loadReviewStudents();
    }
    if (tab === 'ranking') {
      loadRankings();
    }
    if (tab === 'config' && !configLoaded) {
      loadConfig();
    }
  }, [tab]);

  const loadConfig = async () => {
    try {
      const config = await fetchAdminScoreConfig(token);
      setEditableConfig(cloneConfig(config as EditableScoreConfig));
      setConfigLoaded(true);
    } catch (err: any) {
      setError(err.message || '读取综测配置失败');
    }
  };

  const filteredUsers = useMemo(() => {
    const keyword = userSearch.trim().toLowerCase();
    if (!keyword) return users;
    return users.filter((user) => {
      const username = (user.username || '').toLowerCase();
      const displayName = (user.display_name || '').toLowerCase();
      return username.includes(keyword) || displayName.includes(keyword);
    });
  }, [users, userSearch]);

  const pendingReports = useMemo(() => studentReports.filter((item) => item.status === 'pending'), [studentReports]);

  const toggleSelected = (reportId: number) => {
    setSelectedReportIds((prev) =>
      prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]
    );
  };

  const selectAllPending = () => {
    setSelectedReportIds(pendingReports.map((item) => item.id));
  };

  const clearSelected = () => setSelectedReportIds([]);

  const handleBatchReview = async (status: 'approved' | 'rejected') => {
    if (!selectedReportIds.length) {
      setError('请先勾选待审核项');
      return;
    }
    if (status === 'rejected' && !rejectReason.trim()) {
      setError('驳回时请填写原因');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await batchReviewReports(token, {
        reportIds: selectedReportIds,
        status,
        reviewComment: status === 'rejected' ? rejectReason.trim() : ''
      });
      setSuccess(`批量审核完成，处理 ${result.changes} 条`);
      setRejectReason('');
      if (selectedStudent) {
        await loadStudentReports(selectedStudent.id);
      }
      await loadReviewStudents();
    } catch (err: any) {
      setError(err.message || '批量审核失败');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEntry = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await setAdminEntryStatus(token, !entryEnabled);
      setEntryEnabled(result.enabled);
      setSuccess(result.enabled ? '已开启综测上报入口' : '已关闭综测上报入口');
    } catch (err: any) {
      setError(err.message || '切换入口状态失败');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (updater: (draft: EditableScoreConfig) => void) => {
    setEditableConfig((prev) => {
      if (!prev) return prev;
      const next = cloneConfig(prev);
      updater(next);
      return next;
    });
  };

  const setModuleName = (moduleKey: ConfigModuleKey, value: string) => {
    updateConfig((draft) => {
      draft[moduleKey].module_name = value;
    });
  };

  const setModuleMaxLimit = (moduleKey: ConfigModuleKey, value: string) => {
    updateConfig((draft) => {
      draft[moduleKey].max_limit = toNullableNumber(value);
    });
  };

  const addCategory = (moduleKey: ConfigModuleKey) => {
    updateConfig((draft) => {
      draft[moduleKey].categories.push({
        name: '',
        max_limit: null,
        max_limit_note: '',
        items: [{ label: '', base_score: null }]
      });
    });
  };

  const removeCategory = (moduleKey: ConfigModuleKey, categoryIndex: number) => {
    updateConfig((draft) => {
      draft[moduleKey].categories.splice(categoryIndex, 1);
    });
  };

  const setCategoryField = (
    moduleKey: ConfigModuleKey,
    categoryIndex: number,
    field: 'name' | 'max_limit_note',
    value: string
  ) => {
    updateConfig((draft) => {
      draft[moduleKey].categories[categoryIndex][field] = value;
    });
  };

  const setCategoryMaxLimit = (moduleKey: ConfigModuleKey, categoryIndex: number, value: string) => {
    updateConfig((draft) => {
      draft[moduleKey].categories[categoryIndex].max_limit = toNullableNumber(value);
    });
  };

  const addItem = (moduleKey: ConfigModuleKey, categoryIndex: number) => {
    updateConfig((draft) => {
      draft[moduleKey].categories[categoryIndex].items.push({ label: '', base_score: null });
    });
  };

  const removeItem = (moduleKey: ConfigModuleKey, categoryIndex: number, itemIndex: number) => {
    updateConfig((draft) => {
      draft[moduleKey].categories[categoryIndex].items.splice(itemIndex, 1);
    });
  };

  const setItemLabel = (moduleKey: ConfigModuleKey, categoryIndex: number, itemIndex: number, value: string) => {
    updateConfig((draft) => {
      draft[moduleKey].categories[categoryIndex].items[itemIndex].label = value;
    });
  };

  const setItemBaseScore = (moduleKey: ConfigModuleKey, categoryIndex: number, itemIndex: number, value: string) => {
    updateConfig((draft) => {
      draft[moduleKey].categories[categoryIndex].items[itemIndex].base_score = toNullableNumber(value);
    });
  };

  const handleSaveConfig = async () => {
    if (!editableConfig) {
      setError('配置尚未加载，请先点击重新加载');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const saved = await saveAdminScoreConfig(token, editableConfig as Record<string, any>);
      setEditableConfig(cloneConfig(saved as EditableScoreConfig));
      setSuccess('综测配置已保存并生效');
    } catch (err: any) {
      setError(err.message || '保存综测配置失败');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      setError('请填写用户名和密码');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await createAdminUser(token, {
        username: newUsername.trim(),
        displayName: newDisplayName.trim() || undefined,
        role: newRole,
        password: newPassword
      });
      setNewUsername('');
      setNewDisplayName('');
      setNewPassword('');
      await loadBasic();
      setSuccess('用户创建成功');
    } catch (err: any) {
      setError(err.message || '创建失败');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) {
      setError('请先输入批量导入内容');
      return;
    }

    const rows = bulkText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [username, displayName, role, password] = line.split(',').map((part) => part?.trim());
        return {
          username,
          displayName,
          role: role === 'admin' ? 'admin' : 'student',
          password: password || username
        } as { username: string; displayName?: string; role?: 'student' | 'admin'; password?: string };
      });

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await importUsersBulk(token, rows);
      setBulkText('');
      await loadBasic();
      setSuccess(`批量导入完成：新增 ${result.created}，更新 ${result.updated}，失败 ${result.failed.length}`);
    } catch (err: any) {
      setError(err.message || '批量导入失败');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleUser = async (user: UserListItem) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateUserProfile(token, user.id, {
        displayName: user.display_name,
        isActive: !user.is_active
      });
      await loadBasic();
      setSuccess(`用户 ${user.username} 已${user.is_active ? '停用' : '启用'}`);
    } catch (err: any) {
      setError(err.message || '更新用户状态失败');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (user: UserListItem) => {
    const nextPass = window.prompt(`为用户 ${user.username} 设置新密码：`);
    if (!nextPass) return;

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await resetUserPassword(token, user.id, nextPass);
      setSuccess(`用户 ${user.username} 密码已重置`);
    } catch (err: any) {
      setError(err.message || '重置密码失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-bupt-blue" />
        <span className="ml-2 text-gray-600">加载管理后台...</span>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">管理员后台</h1>
            <p className="text-gray-500 mt-2">用户管理、学生维度综测审核、综测配置</p>
          </div>
          <button
            onClick={async () => {
              await loadBasic();
              if (tab === 'review') await loadReviewStudents();
              if (tab === 'ranking') await loadRankings();
              if (tab === 'config') await loadConfig();
            }}
            className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white"
          >
            <RefreshCw size={16} className="mr-2" /> 刷新
          </button>
        </div>

        <section className="bg-white rounded-2xl border-2 border-amber-300 shadow-sm p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-gray-900">综测上报入口开关</h2>
              <p className="text-sm text-gray-500">关闭后学生无法进入综测加分页面并提交。</p>
            </div>
            <button
              onClick={handleToggleEntry}
              disabled={saving}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${entryEnabled ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
            >
              {entryEnabled ? '已开启（点击关闭）' : '已关闭（点击开启）'}
            </button>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTab('users')}
            className={`px-4 py-2 rounded-lg ${tab === 'users' ? 'bg-bupt-blue text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
          >
            用户管理
          </button>
          <button
            onClick={() => setTab('review')}
            className={`px-4 py-2 rounded-lg ${tab === 'review' ? 'bg-bupt-blue text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
          >
            综测审核
          </button>
          <button
            onClick={() => setTab('ranking')}
            className={`px-4 py-2 rounded-lg ${tab === 'ranking' ? 'bg-bupt-blue text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
          >
            积分排名
          </button>
          <button
            onClick={() => setTab('config')}
            className={`px-4 py-2 rounded-lg ${tab === 'config' ? 'bg-bupt-blue text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
          >
            加分配置
          </button>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
        {success && <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">{success}</div>}

        {tab === 'users' && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">用户管理</h2>
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="按姓名或学号搜索"
                className="px-3 py-2 border border-gray-300 rounded-lg min-w-[260px]"
              />
            </div>

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="用户名/学号"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="姓名（可选）"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select value={newRole} onChange={(e) => setNewRole(e.target.value as UserRole)} className="px-3 py-2 border border-gray-300 rounded-lg">
                <option value="student">学生</option>
                <option value="admin">管理员</option>
              </select>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="初始密码"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button disabled={saving} className="px-3 py-2 bg-bupt-blue text-white rounded-lg hover:bg-blue-900 disabled:opacity-60">
                新增用户
              </button>
            </form>

            <div className="space-y-2">
              <label className="block text-sm text-gray-600">批量导入（每行：username,displayName,role,password）</label>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
                placeholder="2025010102,李四,student,2025010102"
              />
              <button
                onClick={handleBulkImport}
                disabled={saving}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-60"
              >
                批量导入
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 pr-4">用户名</th>
                    <th className="py-2 pr-4">姓名</th>
                    <th className="py-2 pr-4">角色</th>
                    <th className="py-2 pr-4">状态</th>
                    <th className="py-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">{user.username}</td>
                      <td className="py-2 pr-4">{user.display_name || '-'}</td>
                      <td className="py-2 pr-4">{user.role === 'admin' ? '管理员' : '学生'}</td>
                      <td className="py-2 pr-4">{user.is_active ? '启用' : '停用'}</td>
                      <td className="py-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleToggleUser(user)}
                            className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
                          >
                            {user.is_active ? '停用' : '启用'}
                          </button>
                          <button
                            onClick={() => handleResetPassword(user)}
                            className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
                          >
                            重置密码
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'review' && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">综测审核（按学生）</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
              <div className="border border-gray-200 rounded-xl p-3 space-y-3">
                <input
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  placeholder="搜索学生姓名/学号"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => loadReviewStudents()}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
                >
                  查询
                </button>

                <div className="max-h-[520px] overflow-y-auto space-y-2">
                  {reviewStudents.map((student) => {
                    const selected = selectedStudent?.id === student.user_id;
                    return (
                      <button
                        key={student.user_id}
                        onClick={() => loadStudentReports(student.user_id)}
                        className={`w-full text-left px-3 py-2 rounded-lg border ${selected ? 'border-bupt-blue bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        <div className="font-semibold text-gray-800">{student.display_name || student.username}</div>
                        <div className="text-xs text-gray-500">{student.username}</div>
                        <div className="text-xs mt-1 text-amber-700">待审 {student.pending_count} 条 / 总计 {student.total_count} 条</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-3">
                {!selectedStudent ? (
                  <div className="text-gray-500 text-sm">请选择左侧学生查看待审核项。</div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {selectedStudent.display_name || selectedStudent.username}
                        </div>
                        <div className="text-xs text-gray-500">{selectedStudent.username}</div>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={selectAllPending} className="px-3 py-1.5 rounded border border-gray-300 text-sm">
                          全选待审
                        </button>
                        <button onClick={clearSelected} className="px-3 py-1.5 rounded border border-gray-300 text-sm">
                          清空选择
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center flex-wrap">
                      <input
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="驳回原因（驳回时必填）"
                        className="px-3 py-2 border border-gray-300 rounded-lg min-w-[280px]"
                      />
                      <button
                        disabled={saving || !selectedReportIds.length}
                        onClick={() => handleBatchReview('approved')}
                        className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50"
                      >
                        通过
                      </button>
                      <button
                        disabled={saving || !selectedReportIds.length}
                        onClick={() => handleBatchReview('rejected')}
                        className="px-3 py-2 rounded bg-red-600 text-white disabled:opacity-50"
                      >
                        驳回
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 border-b">
                            <th className="py-2 pr-2">选择</th>
                            <th className="py-2 pr-4">模块</th>
                            <th className="py-2 pr-4">加分项</th>
                            <th className="py-2 pr-4">分值</th>
                            <th className="py-2 pr-4">状态</th>
                            <th className="py-2">原因</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentReports.map((report) => (
                            <tr key={report.id} className="border-b last:border-0 align-top">
                              <td className="py-2 pr-2">
                                {report.status === 'pending' ? (
                                  <input
                                    type="checkbox"
                                    checked={selectedReportIds.includes(report.id)}
                                    onChange={() => toggleSelected(report.id)}
                                  />
                                ) : null}
                              </td>
                              <td className="py-2 pr-4">{moduleTextMap[report.module_key] || report.module_key}</td>
                              <td className="py-2 pr-4">
                                {report.is_other ? report.custom_item_label || '其它' : report.item_label}
                                {report.custom_description && (
                                  <div className="text-xs text-gray-500 mt-1">说明：{report.custom_description}</div>
                                )}
                              </td>
                              <td className="py-2 pr-4 font-semibold">{Number(report.self_score).toFixed(2)}</td>
                              <td className="py-2 pr-4">
                                <span className={`px-2 py-1 rounded-full text-xs ${statusClass[report.status] || statusClass.pending}`}>
                                  {statusTextMap[report.status] || report.status}
                                </span>
                              </td>
                              <td className="py-2">{report.review_comment || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {tab === 'ranking' && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-gray-900">动态积分排名</h2>
                <p className="text-sm text-gray-500 mt-1">按当前未驳回积分实时汇总，包含待审和已通过项目。</p>
              </div>
              <button
                onClick={loadRankings}
                disabled={saving}
                className="px-3 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50"
              >
                刷新排名
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 pr-4">排名</th>
                    <th className="py-2 pr-4">学生</th>
                    <th className="py-2 pr-4">学号</th>
                    <th className="py-2 pr-4">总分</th>
                    <th className="py-2 pr-4">德育</th>
                    <th className="py-2 pr-4">智育</th>
                    <th className="py-2 pr-4">体美劳</th>
                    <th className="py-2 pr-4">已通过</th>
                    <th className="py-2 pr-4">待审</th>
                    <th className="py-2">总条数</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((item, index) => (
                    <tr key={item.user_id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-semibold">{index + 1}</td>
                      <td className="py-2 pr-4">{item.display_name || '-'}</td>
                      <td className="py-2 pr-4">{item.username}</td>
                      <td className="py-2 pr-4 font-bold text-bupt-blue">{Number(item.total_score).toFixed(2)}</td>
                      <td className="py-2 pr-4">{Number(item.moral_score).toFixed(2)}</td>
                      <td className="py-2 pr-4">{Number(item.intellectual_score).toFixed(2)}</td>
                      <td className="py-2 pr-4">{Number(item.physical_score).toFixed(2)}</td>
                      <td className="py-2 pr-4">{item.approved_count}</td>
                      <td className="py-2 pr-4">{item.pending_count}</td>
                      <td className="py-2">{item.total_count}</td>
                    </tr>
                  ))}
                  {!rankings.length && (
                    <tr>
                      <td colSpan={10} className="py-6 text-center text-gray-500">
                        暂无可展示的积分排名数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'config' && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">加分配置编辑器</h2>
              <p className="text-sm text-gray-500 mt-1">按模块、类别、加分项分层编辑。保存后会直接影响学生端可选项与上报校验规则。</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={loadConfig}
                disabled={saving}
                className="px-3 py-2 rounded border border-gray-300 text-sm hover:bg-gray-50"
              >
                重新加载
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="px-3 py-2 rounded bg-bupt-blue text-white text-sm disabled:opacity-50"
              >
                保存配置
              </button>
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              系统会自动追加“其它（自定义）”选项，这里不需要手动新增。
            </div>

            {!editableConfig ? (
              <div className="text-sm text-gray-500">配置尚未加载，点击“重新加载”获取配置。</div>
            ) : (
              <div className="space-y-5">
                {moduleKeyOrder.map((moduleKey) => {
                  const moduleConfig = editableConfig[moduleKey];
                  return (
                    <div key={moduleKey} className="border border-gray-200 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <div className="text-lg font-semibold text-gray-900">{moduleTextMap[moduleKey] || moduleKey}</div>
                          <div className="text-xs text-gray-500">{moduleKey}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => addCategory(moduleKey)}
                          className="px-3 py-1.5 rounded border border-gray-300 text-sm hover:bg-gray-50"
                        >
                          + 新增类别
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">模块名称</label>
                          <input
                            value={moduleConfig.module_name || ''}
                            onChange={(e) => setModuleName(moduleKey, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="模块名称"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">模块总分上限（留空=不限）</label>
                          <input
                            value={moduleConfig.max_limit ?? ''}
                            onChange={(e) => setModuleMaxLimit(moduleKey, e.target.value)}
                            type="number"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="如 30"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {(moduleConfig.categories || []).map((category, categoryIndex) => (
                          <div key={`${moduleKey}-${categoryIndex}`} className="border border-gray-100 bg-gray-50 rounded-lg p-3 space-y-3">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="font-medium text-gray-800">类别 #{categoryIndex + 1}</div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => addItem(moduleKey, categoryIndex)}
                                  className="px-2 py-1 rounded border border-gray-300 text-xs hover:bg-white"
                                >
                                  + 新增加分项
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeCategory(moduleKey, categoryIndex)}
                                  className="px-2 py-1 rounded border border-red-300 text-red-600 text-xs hover:bg-red-50"
                                >
                                  删除类别
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <input
                                value={category.name || ''}
                                onChange={(e) => setCategoryField(moduleKey, categoryIndex, 'name', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="类别名称"
                              />
                              <input
                                value={category.max_limit ?? ''}
                                onChange={(e) => setCategoryMaxLimit(moduleKey, categoryIndex, e.target.value)}
                                type="number"
                                step="0.1"
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="类别上限（可选）"
                              />
                              <input
                                value={category.max_limit_note || ''}
                                onChange={(e) => setCategoryField(moduleKey, categoryIndex, 'max_limit_note', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="上限说明（可选）"
                              />
                            </div>

                            <div className="space-y-2">
                              {(category.items || []).map((item, itemIndex) => (
                                <div key={`${moduleKey}-${categoryIndex}-${itemIndex}`} className="grid grid-cols-1 md:grid-cols-[1fr_180px_90px] gap-2">
                                  <input
                                    value={item.label || ''}
                                    onChange={(e) => setItemLabel(moduleKey, categoryIndex, itemIndex, e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                    placeholder="加分项名称"
                                  />
                                  <input
                                    value={item.base_score ?? ''}
                                    onChange={(e) => setItemBaseScore(moduleKey, categoryIndex, itemIndex, e.target.value)}
                                    type="number"
                                    step="0.1"
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                    placeholder="参考分值"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeItem(moduleKey, categoryIndex, itemIndex)}
                                    className="px-2 py-2 rounded border border-red-300 text-red-600 text-sm hover:bg-red-50"
                                  >
                                    删除
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
