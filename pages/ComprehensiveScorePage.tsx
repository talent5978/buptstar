import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Send, Trash2, UploadCloud, Loader2 } from 'lucide-react';
import {
  DraftScoreItem,
  ScoreConfig,
  ScoreConfigCategory,
  ScoreProofFile,
  ScoreReport,
  ScoreSummary
} from '../types';
import {
  fetchMyScoreReports,
  fetchScoreConfig,
  fetchScoreDraft,
  saveScoreDraft,
  submitScoreDraft,
  uploadScoreProofs
} from '../services/scoreReportService';

interface ComprehensiveScorePageProps {
  token: string;
}

const OTHER_VALUE = '__other__';

const defaultSummary: ScoreSummary = {
  moral_education: 0,
  intellectual_education: 0,
  physical_aesthetic_labor: 0,
  pendingCount: 0,
  approvedCount: 0,
  rejectedCount: 0
};

const statusText: Record<string, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回'
};

const statusClass: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
};

const randomId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const createEmptyItem = (config: ScoreConfig): DraftScoreItem => {
  const moduleKey = 'moral_education' as keyof ScoreConfig;
  const category = config[moduleKey].categories[0];
  const firstItem = category.items[0];

  return {
    localId: randomId(),
    moduleKey,
    categoryName: category.name,
    itemLabel: firstItem?.value || firstItem?.label || '',
    customItemLabel: '',
    customDescription: '',
    selfScore: '',
    firstUnitConfirmed: false,
    activityName: '',
    activityDuration: '',
    proofFiles: []
  };
};

const normalizeDraftItemsFromServer = (items: Omit<DraftScoreItem, 'localId'>[]): DraftScoreItem[] =>
  (items || []).map((item) => ({
    ...item,
    localId: randomId(),
    selfScore: String(item.selfScore ?? '')
  }));

const toServerDraftItem = (item: DraftScoreItem): Omit<DraftScoreItem, 'localId'> => ({
  moduleKey: item.moduleKey,
  categoryName: item.categoryName,
  itemLabel: item.itemLabel,
  customItemLabel: item.customItemLabel || '',
  customDescription: item.customDescription || '',
  selfScore: item.selfScore,
  firstUnitConfirmed: !!item.firstUnitConfirmed,
  activityName: item.activityName || '',
  activityDuration: item.activityDuration || '',
  proofFiles: item.proofFiles || []
});

const ComprehensiveScorePage: React.FC<ComprehensiveScorePageProps> = ({ token }) => {
  const [config, setConfig] = useState<ScoreConfig | null>(null);
  const [entryEnabled, setEntryEnabled] = useState(true);
  const [draftItems, setDraftItems] = useState<DraftScoreItem[]>([]);
  const [reports, setReports] = useState<ScoreReport[]>([]);
  const [summary, setSummary] = useState<ScoreSummary>(defaultSummary);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ config: cfg, entryEnabled: enabled }, mine] = await Promise.all([
        fetchScoreConfig(),
        fetchMyScoreReports(token)
      ]);
      setConfig(cfg);
      setEntryEnabled(enabled && mine.entryEnabled !== false);
      setReports(mine.reports || []);
      setSummary(mine.summary || defaultSummary);

      if (enabled) {
        const draft = await fetchScoreDraft(token);
        const loaded = normalizeDraftItemsFromServer(draft.items);
        setDraftItems(loaded.length ? loaded : [createEmptyItem(cfg)]);
      } else {
        setDraftItems([]);
      }
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [token]);

  const groupedReports = useMemo(() => {
    const map = new Map<string, ScoreReport[]>();
    reports.forEach((report) => {
      const list = map.get(report.submission_id) || [];
      list.push(report);
      map.set(report.submission_id, list);
    });
    return Array.from(map.entries()).map(([submissionId, list]) => ({
      submissionId,
      createdAt: list[0]?.created_at,
      reports: list
    }));
  }, [reports]);

  const updateItem = (localId: string, updater: (item: DraftScoreItem) => DraftScoreItem) => {
    setDraftItems((prev) => prev.map((item) => (item.localId === localId ? updater(item) : item)));
  };

  const getCategories = (moduleKey: keyof ScoreConfig): ScoreConfigCategory[] => config?.[moduleKey].categories || [];

  const getItems = (moduleKey: keyof ScoreConfig, categoryName: string) => {
    const category = getCategories(moduleKey).find((cat) => cat.name === categoryName);
    return category?.items || [];
  };

  const handleModuleChange = (localId: string, moduleKey: keyof ScoreConfig) => {
    const categories = getCategories(moduleKey);
    const category = categories[0];
    const firstItem = category?.items[0];

    updateItem(localId, (item) => ({
      ...item,
      moduleKey,
      categoryName: category?.name || '',
      itemLabel: firstItem?.value || firstItem?.label || '',
      firstUnitConfirmed: false
    }));
  };

  const handleCategoryChange = (localId: string, categoryName: string) => {
    const item = draftItems.find((x) => x.localId === localId);
    if (!item) return;

    const items = getItems(item.moduleKey, categoryName);
    updateItem(localId, (it) => ({
      ...it,
      categoryName,
      itemLabel: items[0]?.value || items[0]?.label || ''
    }));
  };

  const handleUploadProof = async (localId: string, files: FileList | null) => {
    if (!files || !files.length) return;
    setError(null);
    setSuccess(null);

    setUploadingItemId(localId);
    try {
      const uploaded = await uploadScoreProofs(token, Array.from(files));
      updateItem(localId, (item) => ({
        ...item,
        proofFiles: [...item.proofFiles, ...uploaded]
      }));
    } catch (err: any) {
      setError(err.message || '上传材料失败');
    } finally {
      setUploadingItemId(null);
    }
  };

  const removeProof = (localId: string, filename: string) => {
    updateItem(localId, (item) => ({
      ...item,
      proofFiles: item.proofFiles.filter((proof) => proof.filename !== filename)
    }));
  };

  const handleSaveDraft = async () => {
    if (!entryEnabled) {
      setError('综测入口已关闭，暂不可保存');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await saveScoreDraft(
        token,
        draftItems.map(toServerDraftItem)
      );
      setSuccess('草稿已保存');
    } catch (err: any) {
      setError(err.message || '保存草稿失败');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitAll = async () => {
    if (!entryEnabled) {
      setError('综测入口已关闭，暂不可提交');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await saveScoreDraft(
        token,
        draftItems.map(toServerDraftItem)
      );
      const result = await submitScoreDraft(token);
      setSuccess(`已提交 ${result.reports.length} 条加分项，等待审核`);
      await loadAll();
    } catch (err: any) {
      setError(err.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-bupt-blue" />
        <span className="ml-2 text-gray-600">加载综测模块...</span>
      </div>
    );
  }

  if (!config) {
    return <div className="pt-24 text-center text-red-500">{error || '配置加载失败'}</div>;
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">综测加分上报</h1>
          <p className="text-gray-500 mt-2">支持先保存草稿，再一次性提交全部加分项。审核结果和打回原因会在下方记录中显示。</p>
        </div>

        {!entryEnabled && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3">
            当前管理员已关闭综测上报入口，你暂时无法编辑与提交。历史记录仍可查看。
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="text-sm text-gray-500">德育累计（待审+通过）</div>
            <div className="text-2xl font-bold text-star-red">{summary.moral_education.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="text-sm text-gray-500">智育累计（待审+通过）</div>
            <div className="text-2xl font-bold text-bupt-blue">{summary.intellectual_education.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="text-sm text-gray-500">体美劳累计（待审+通过）</div>
            <div className="text-2xl font-bold text-green-700">{summary.physical_aesthetic_labor.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">草稿填报</h2>
          </div>

          {draftItems.length === 0 && (
            <div className="text-sm text-gray-500">暂无草稿项，点击“添加加分项”开始填写。</div>
          )}

          <div className="space-y-4">
            {draftItems.map((item, idx) => {
              const categories = getCategories(item.moduleKey);
              const items = getItems(item.moduleKey, item.categoryName);
              const isOther = item.itemLabel === OTHER_VALUE;
              const isIntellectual = item.moduleKey === 'intellectual_education';
              const isDaily =
                item.moduleKey === 'physical_aesthetic_labor' && item.categoryName === '日常活动积分';

              return (
                <div key={item.localId} className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">加分项 #{idx + 1}</h3>
                    <button
                      disabled={!entryEnabled || draftItems.length === 1}
                      onClick={() => setDraftItems((prev) => prev.filter((x) => x.localId !== item.localId))}
                      className="text-red-600 hover:text-red-700 disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={item.moduleKey}
                      disabled={!entryEnabled}
                      onChange={(e) => handleModuleChange(item.localId, e.target.value as keyof ScoreConfig)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {Object.entries(config).map(([key, module]) => (
                        <option key={key} value={key}>
                          {module.module_name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={item.categoryName}
                      disabled={!entryEnabled}
                      onChange={(e) => handleCategoryChange(item.localId, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={item.itemLabel}
                      disabled={!entryEnabled}
                      onChange={(e) => updateItem(item.localId, (it) => ({ ...it, itemLabel: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {items.map((x) => (
                        <option key={x.value || x.label} value={x.value || x.label}>
                          {x.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isOther && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        value={item.customItemLabel || ''}
                        disabled={!entryEnabled}
                        onChange={(e) => updateItem(item.localId, (it) => ({ ...it, customItemLabel: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="自定义加分项名称"
                      />
                      <input
                        value={item.customDescription || ''}
                        disabled={!entryEnabled}
                        onChange={(e) => updateItem(item.localId, (it) => ({ ...it, customDescription: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="说明（如几作、队员折算规则）"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      value={item.selfScore}
                      disabled={!entryEnabled}
                      onChange={(e) => updateItem(item.localId, (it) => ({ ...it, selfScore: e.target.value }))}
                      type="number"
                      min="0"
                      step="0.1"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="自评加分"
                    />

                    {isDaily && (
                      <>
                        <input
                          value={item.activityName || ''}
                          disabled={!entryEnabled}
                          onChange={(e) => updateItem(item.localId, (it) => ({ ...it, activityName: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="活动名称（可选）"
                        />
                        <input
                          value={item.activityDuration || ''}
                          disabled={!entryEnabled}
                          onChange={(e) => updateItem(item.localId, (it) => ({ ...it, activityDuration: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="时长/次数（可选）"
                        />
                      </>
                    )}
                  </div>

                  {isIntellectual && (
                    <label className="inline-flex items-center text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={!!item.firstUnitConfirmed}
                        disabled={!entryEnabled}
                        onChange={(e) =>
                          updateItem(item.localId, (it) => ({ ...it, firstUnitConfirmed: e.target.checked }))
                        }
                        className="mr-2"
                      />
                      承诺本项成果第一单位为北京邮电大学或企业导师所在单位
                    </label>
                  )}

                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">证明材料（可选）</div>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-bupt-blue text-sm">
                        <UploadCloud size={14} className="mr-1" />
                        {uploadingItemId === item.localId ? '上传中...' : '上传图片/PDF'}
                        <input
                          type="file"
                          multiple
                          accept="image/*,application/pdf"
                          className="hidden"
                          disabled={!entryEnabled || uploadingItemId === item.localId}
                          onChange={(e) => handleUploadProof(item.localId, e.target.files)}
                        />
                      </label>
                      <span className="text-xs text-gray-500">最多 10 个，每个 10MB</span>
                    </div>

                    {!!item.proofFiles.length && (
                      <div className="flex flex-wrap gap-2">
                        {item.proofFiles.map((proof: ScoreProofFile) => (
                          <span key={proof.filename} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                            <a href={proof.url} target="_blank" rel="noreferrer" className="text-bupt-blue hover:underline mr-2">
                              {proof.originalName}
                            </a>
                            {entryEnabled && (
                              <button onClick={() => removeProof(item.localId, proof.filename)} className="text-red-500">
                                x
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <button
              disabled={!entryEnabled}
              onClick={() => setDraftItems((prev) => [...prev, createEmptyItem(config)])}
              className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Plus size={16} className="mr-1" /> 添加加分项
            </button>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
          {success && <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">{success}</div>}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={!entryEnabled || saving || submitting}
              className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              <Save size={16} className="mr-1" /> {saving ? '保存中...' : '保存草稿'}
            </button>
            <button
              onClick={handleSubmitAll}
              disabled={!entryEnabled || submitting || saving || !draftItems.length}
              className="inline-flex items-center px-4 py-2 bg-bupt-blue text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
            >
              <Send size={16} className="mr-1" /> {submitting ? '提交中...' : '提交'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">已提交记录</h2>
          {!groupedReports.length ? (
            <p className="text-sm text-gray-500">暂无已提交记录</p>
          ) : (
            <div className="space-y-4">
              {groupedReports.map((group) => (
                <div key={group.submissionId} className="border border-gray-200 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-2">
                    提交批次：{group.submissionId} | 时间：{new Date(group.createdAt).toLocaleString()}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="py-2 pr-4">模块</th>
                          <th className="py-2 pr-4">加分项</th>
                          <th className="py-2 pr-4">自评分</th>
                          <th className="py-2 pr-4">状态</th>
                          <th className="py-2">审核意见</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.reports.map((report) => (
                          <tr key={report.id} className="border-b last:border-0">
                            <td className="py-2 pr-4">{config[report.module_key]?.module_name || report.module_key}</td>
                            <td className="py-2 pr-4">
                              {report.is_other ? report.custom_item_label || '其它' : report.item_label}
                              {report.custom_description && (
                                <div className="text-xs text-gray-500 mt-1">说明：{report.custom_description}</div>
                              )}
                            </td>
                            <td className="py-2 pr-4 font-semibold">{Number(report.self_score).toFixed(2)}</td>
                            <td className="py-2 pr-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${statusClass[report.status] || statusClass.pending}`}>
                                {statusText[report.status] || report.status}
                              </span>
                            </td>
                            <td className="py-2">{report.review_comment || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveScorePage;
