import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Send, Trash2, UploadCloud, Loader2 } from 'lucide-react';
import {
  DraftScoreItem,
  PaperAuthorshipRole,
  ScoreConfig,
  ScoreConfigCategory,
  ScoreConfigItem,
  ScoreCalculationInput,
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
import {
  buildDefaultCalculationInput,
  calculateDraftItemPreview,
  COMPETITION_PARTICIPATION_SCORING_MODE,
  COMPETITION_TEAM_SCORING_MODE,
  getRuleHint,
  getScoringMode,
  MANUAL_SCORING_MODE,
  paperAuthorshipOptions,
  PAPER_AUTHORSHIP_SCORING_MODE,
  STUDENT_WORK_DUAL_ROLE_SCORING_MODE
} from '../services/scoreCalculation';

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

const normalizeDraftItemsFromServer = (items: Omit<DraftScoreItem, 'localId'>[]): DraftScoreItem[] =>
  (items || []).map((item) => ({
    ...item,
    localId: randomId(),
    selfScore: String(item.selfScore ?? ''),
    calculationInput: item.calculationInput || undefined,
    calculationResult: item.calculationResult || null
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
  proofFiles: item.proofFiles || [],
  calculationInput: item.calculationInput || undefined
});

const createDraftItem = (
  moduleKey: keyof ScoreConfig,
  categoryName: string,
  itemLabel: string,
  itemMeta?: ScoreConfigItem,
  overrides?: Partial<DraftScoreItem>
): DraftScoreItem => ({
  localId: randomId(),
  moduleKey,
  categoryName,
  itemLabel,
  customItemLabel: '',
  customDescription: '',
  selfScore: '',
  firstUnitConfirmed: false,
  activityName: '',
  activityDuration: '',
  proofFiles: [],
  calculationInput: buildDefaultCalculationInput(itemMeta),
  calculationResult: null,
  ...overrides
});

const getCategoryItems = (config: ScoreConfig | null, moduleKey: keyof ScoreConfig, categoryName: string): ScoreConfigItem[] => {
  if (!config) return [];
  const category = config[moduleKey].categories.find((item) => item.name === categoryName);
  return category?.items || [];
};

const getItemMeta = (config: ScoreConfig | null, item: DraftScoreItem): ScoreConfigItem | undefined =>
  getCategoryItems(config, item.moduleKey, item.categoryName).find(
    (candidate) => candidate.value === item.itemLabel || candidate.label === item.itemLabel
  );

const getCategoryMeta = (
  config: ScoreConfig | null,
  moduleKey: keyof ScoreConfig,
  categoryName: string
): ScoreConfigCategory | undefined => config?.[moduleKey].categories.find((item) => item.name === categoryName);

const getModuleItemCount = (draftItems: DraftScoreItem[], moduleKey: keyof ScoreConfig) =>
  draftItems.filter((item) => item.moduleKey === moduleKey).length;

const getCategoryItemCount = (draftItems: DraftScoreItem[], moduleKey: keyof ScoreConfig, categoryName: string) =>
  draftItems.filter((item) => item.moduleKey === moduleKey && item.categoryName === categoryName).length;

const getCustomItemCount = (draftItems: DraftScoreItem[], moduleKey: keyof ScoreConfig, categoryName: string) =>
  draftItems.filter(
    (item) => item.moduleKey === moduleKey && item.categoryName === categoryName && item.itemLabel === OTHER_VALUE
  ).length;

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
        setDraftItems(normalizeDraftItemsFromServer(draft.items));
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

  const updateCalculationInput = (
    localId: string,
    updater: (current: ScoreCalculationInput | undefined) => ScoreCalculationInput | undefined
  ) => {
    setDraftItems((prev) =>
      prev.map((item) => {
        if (item.localId !== localId) return item;
        return {
          ...item,
          calculationInput: updater(item.calculationInput),
          calculationResult: null
        };
      })
    );
  };

  const removeItem = (localId: string) => {
    setDraftItems((prev) => prev.filter((item) => item.localId !== localId));
  };

  const isConfiguredItemSelected = (
    moduleKey: keyof ScoreConfig,
    categoryName: string,
    itemLabel: string
  ) => draftItems.some(
    (item) =>
      item.moduleKey === moduleKey &&
      item.categoryName === categoryName &&
      item.itemLabel === itemLabel &&
      item.itemLabel !== OTHER_VALUE
  );

  const toggleConfiguredItem = (moduleKey: keyof ScoreConfig, categoryName: string, itemLabel: string) => {
    setDraftItems((prev) => {
      const itemMeta = getCategoryItems(config, moduleKey, categoryName).find(
        (item) => (item.value || item.label) === itemLabel
      );
      const existing = prev.find(
        (item) =>
          item.moduleKey === moduleKey &&
          item.categoryName === categoryName &&
          item.itemLabel === itemLabel &&
          item.itemLabel !== OTHER_VALUE
      );

      if (existing) {
        return prev.filter((item) => item.localId !== existing.localId);
      }

      const nextItem = createDraftItem(moduleKey, categoryName, itemLabel, itemMeta);
      const scoringMode = getScoringMode(itemMeta);
      const filtered =
        scoringMode === STUDENT_WORK_DUAL_ROLE_SCORING_MODE
          ? prev.filter(
              (item) =>
                !(
                  item.moduleKey === moduleKey &&
                  item.categoryName === categoryName &&
                  item.itemLabel !== OTHER_VALUE
                )
            )
          : prev;

      return [...filtered, nextItem];
    });
  };

  const addCustomItem = (moduleKey: keyof ScoreConfig, categoryName: string) => {
    setDraftItems((prev) => [
      ...prev,
      createDraftItem(moduleKey, categoryName, OTHER_VALUE, undefined, {
        customItemLabel: '',
        customDescription: ''
      })
    ]);
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

  const renderDraftEditor = (item: DraftScoreItem, options?: { showTitle?: boolean; index?: number }) => {
    const itemMeta = getItemMeta(config, item);
    const categoryMeta = getCategoryMeta(config, item.moduleKey, item.categoryName);
    const isOther = item.itemLabel === OTHER_VALUE;
    const isIntellectual = item.moduleKey === 'intellectual_education';
    const isDaily =
      item.moduleKey === 'physical_aesthetic_labor' && item.categoryName === '日常活动积分';
    const scoringMode = getScoringMode(itemMeta);
    const isAutoScoring = !isOther && scoringMode !== MANUAL_SCORING_MODE;
    const calculationPreview = !isOther ? calculateDraftItemPreview(itemMeta, categoryMeta, item) : null;
    const ruleHint = !isOther ? getRuleHint(itemMeta) : '';
    const itemTitle = isOther
      ? item.customItemLabel || `自定义项 #${(options?.index || 0) + 1}`
      : itemMeta?.label || item.itemLabel;

    return (
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
        {options?.showTitle && (
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {config[item.moduleKey]?.module_name} / {item.categoryName}
              </div>
              <h3 className="font-semibold text-slate-900 mt-1">{itemTitle}</h3>
              {!isOther && itemMeta && (
                <div className="text-xs text-slate-500 mt-1">
                  参考分值 {Number(itemMeta.base_score).toFixed(2)}
                  {ruleHint ? ` · ${ruleHint}` : ''}
                </div>
              )}
            </div>
            <button
              disabled={!entryEnabled}
              onClick={() => removeItem(item.localId)}
              className="text-red-600 hover:text-red-700 disabled:opacity-40"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {isAutoScoring && categoryMeta && (
          <div className="rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-3 space-y-3">
            {scoringMode === COMPETITION_TEAM_SCORING_MODE && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="inline-flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={!!item.calculationInput?.isTeamProject}
                    disabled={!entryEnabled}
                    onChange={(e) =>
                      updateCalculationInput(item.localId, (current) => ({
                        ...(current || {}),
                        isTeamProject: e.target.checked,
                        isLeader: e.target.checked ? !!current?.isLeader : false,
                        teamSize: e.target.checked ? current?.teamSize || '' : ''
                      }))
                    }
                    className="mr-2"
                  />
                  团体项目
                </label>

                {!!item.calculationInput?.isTeamProject && (
                  <>
                    <label className="inline-flex items-center text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={!!item.calculationInput?.isLeader}
                        disabled={!entryEnabled}
                        onChange={(e) =>
                          updateCalculationInput(item.localId, (current) => ({
                            ...(current || {}),
                            isTeamProject: true,
                            isLeader: e.target.checked
                          }))
                        }
                        className="mr-2"
                      />
                      队长
                    </label>
                    <input
                      value={item.calculationInput?.teamSize ?? ''}
                      disabled={!entryEnabled}
                      onChange={(e) =>
                        updateCalculationInput(item.localId, (current) => ({
                          ...(current || {}),
                          isTeamProject: true,
                          teamSize: e.target.value
                        }))
                      }
                      type="number"
                      min="2"
                      step="1"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="项目人数"
                    />
                  </>
                )}
              </div>
            )}

            {scoringMode === STUDENT_WORK_DUAL_ROLE_SCORING_MODE && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="text-sm text-gray-700">
                  当前主项：<span className="font-medium">{itemMeta?.label || item.itemLabel}</span>
                </div>
                <select
                  value={item.calculationInput?.secondaryItemLabel || ''}
                  disabled={!entryEnabled}
                  onChange={(e) =>
                    updateCalculationInput(item.localId, (current) => ({
                      ...(current || {}),
                      secondaryItemLabel: e.target.value
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">无第二项学生工作</option>
                  {categoryMeta.items
                    .filter((candidate) => !candidate.is_other && (candidate.value || candidate.label) !== item.itemLabel)
                    .map((candidate) => (
                      <option key={candidate.value || candidate.label} value={candidate.value || candidate.label}>
                        {candidate.label}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {scoringMode === PAPER_AUTHORSHIP_SCORING_MODE && (
              <select
                value={item.calculationInput?.authorshipRole || ''}
                disabled={!entryEnabled}
                onChange={(e) =>
                  updateCalculationInput(item.localId, (current) => ({
                    ...(current || {}),
                    authorshipRole: e.target.value as PaperAuthorshipRole
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">请选择作者顺位</option>
                {paperAuthorshipOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {(calculationPreview?.summary || scoringMode === COMPETITION_PARTICIPATION_SCORING_MODE) && (
              <div className="text-sm text-blue-900 bg-white border border-blue-200 rounded-lg px-3 py-2">
                {calculationPreview?.summary || '成功参赛奖固定按 0.5 分计入，累计上限 2 分。'}
              </div>
            )}
          </div>
        )}

        {isOther && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={item.customItemLabel || ''}
              disabled={!entryEnabled}
              onChange={(e) => updateItem(item.localId, (current) => ({ ...current, customItemLabel: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="自定义加分项名称"
            />
            <input
              value={item.customDescription || ''}
              disabled={!entryEnabled}
              onChange={(e) => updateItem(item.localId, (current) => ({ ...current, customDescription: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="说明（如几作、队员折算规则）"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={isAutoScoring ? String(calculationPreview?.finalScore ?? '') : item.selfScore}
            disabled={!entryEnabled || isAutoScoring}
            onChange={(e) => updateItem(item.localId, (current) => ({ ...current, selfScore: e.target.value }))}
            type="number"
            min="0"
            step="0.1"
            className="px-3 py-2 border border-gray-300 rounded-lg"
            placeholder={isAutoScoring ? '系统自动计算' : '自评加分'}
          />

          {isDaily && (
            <>
              <input
                value={item.activityName || ''}
                disabled={!entryEnabled}
                onChange={(e) => updateItem(item.localId, (current) => ({ ...current, activityName: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="活动名称（可选）"
              />
              <input
                value={item.activityDuration || ''}
                disabled={!entryEnabled}
                onChange={(e) =>
                  updateItem(item.localId, (current) => ({ ...current, activityDuration: e.target.value }))
                }
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
                updateItem(item.localId, (current) => ({ ...current, firstUnitConfirmed: e.target.checked }))
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
    <div className="pt-20 min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">综测加分上报</h1>
          <p className="text-gray-500 mt-2">先在树状清单里勾选要填报的加分项，再在下方补充自评得分、说明与材料。</p>
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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-gray-900">选择加分项</h2>
              <p className="text-sm text-gray-500 mt-1">按模块与类别展开浏览。勾选后就在当前项目下方直接填写；自定义项在每个类别底部添加。</p>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-slate-100 text-sm text-slate-700">
              已选择 {draftItems.length} 项
            </div>
          </div>

          <div className="space-y-5">
            {(Object.entries(config) as Array<[keyof ScoreConfig, ScoreConfig[keyof ScoreConfig]]>).map(([moduleKey, module]) => (
              <section
                key={moduleKey}
                className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,1),_rgba(248,250,252,0.92))] p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                  <div>
                    <div className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400">{moduleKey}</div>
                    <div className="text-2xl font-bold text-slate-900">{module.module_name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {module.max_limit ? `模块加分上限 ${module.max_limit} 分` : '模块加分不设总上限'}
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-sm">
                    {getModuleItemCount(draftItems, moduleKey)} 项待填
                  </div>
                </div>

                <div className="space-y-4">
                  {module.categories.map((category: ScoreConfigCategory) => {
                    const configuredItems = category.items.filter((item) => !item.is_other);
                    const customCount = getCustomItemCount(draftItems, moduleKey, category.name);
                    const categoryCount = getCategoryItemCount(draftItems, moduleKey, category.name);
                    const customItems = draftItems.filter(
                      (item) =>
                        item.moduleKey === moduleKey &&
                        item.categoryName === category.name &&
                        item.itemLabel === OTHER_VALUE
                    );

                    return (
                      <div key={`${moduleKey}-${category.name}`} className="relative pl-6">
                        <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-200" />
                        <div className="absolute left-2 top-8 w-4 h-px bg-slate-300" />
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                          <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                            <div>
                              <div className="text-lg font-semibold text-slate-900">{category.name}</div>
                              <div className="text-xs text-slate-500 mt-1">
                                {category.max_limit ? `本类上限 ${category.max_limit} 分` : '按规则填写'}
                                {category.max_limit_note ? ` · ${category.max_limit_note}` : ''}
                                {categoryCount ? ` · 已选 ${categoryCount} 项` : ''}
                              </div>
                            </div>
                            <button
                              type="button"
                              disabled={!entryEnabled}
                              onClick={() => addCustomItem(moduleKey, category.name)}
                              className="inline-flex items-center px-3 py-2 rounded-lg border border-dashed border-slate-300 text-sm text-slate-700 hover:border-bupt-blue hover:text-bupt-blue disabled:opacity-50"
                            >
                              <Plus size={15} className="mr-1" /> 添加自定义项
                            </button>
                          </div>

                          <div className="space-y-2">
                            {configuredItems.map((item) => {
                              const checked = isConfiguredItemSelected(moduleKey, category.name, item.value || item.label);
                              const selectedItem = draftItems.find(
                                (draft) =>
                                  draft.moduleKey === moduleKey &&
                                  draft.categoryName === category.name &&
                                  draft.itemLabel === (item.value || item.label) &&
                                  draft.itemLabel !== OTHER_VALUE
                              );
                              return (
                                <div
                                  key={`${moduleKey}-${category.name}-${item.value || item.label}`}
                                  className={`rounded-xl border p-3 transition-colors ${
                                    checked
                                      ? 'border-bupt-blue bg-blue-50/80 shadow-[0_10px_24px_rgba(37,99,235,0.08)]'
                                      : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white'
                                  } ${!entryEnabled ? 'opacity-70' : ''}`}
                                >
                                  <label
                                    className={`flex items-start gap-3 w-full ${entryEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      disabled={!entryEnabled}
                                      onChange={() => toggleConfiguredItem(moduleKey, category.name, item.value || item.label)}
                                      className="mt-1 h-4 w-4 rounded border-slate-300 text-bupt-blue focus:ring-bupt-blue"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="font-medium text-slate-800 leading-6">{item.label}</div>
                                        <div className="text-xs text-slate-500 whitespace-nowrap">
                                          参考分值 {Number(item.base_score).toFixed(2)}
                                        </div>
                                      </div>
                                    </div>
                                  </label>

                                  {checked && selectedItem && renderDraftEditor(selectedItem)}
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div>
                                <div className="text-sm font-medium text-slate-700">自定义项</div>
                                <div className="text-xs text-slate-500">用于不在清单中的奖项、荣誉或活动。</div>
                              </div>
                              <div className="text-xs text-slate-500">
                                {customCount ? `当前已添加 ${customCount} 条自定义项` : '尚未添加'}
                              </div>
                            </div>

                            {!!customItems.length && (
                              <div className="mt-3 space-y-3">
                                {customItems.map((customItem, customIndex) => (
                                  <div key={customItem.localId} className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
                                    {renderDraftEditor(customItem, { showTitle: true, index: customIndex })}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          {!draftItems.length && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              还没有选择任何加分项。请先在上方树状清单中勾选，或在分类底部添加自定义项。
            </div>
          )}

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
                              {report.calculation_result?.summary && (
                                <div className="text-xs text-blue-700 mt-1">计算：{report.calculation_result.summary}</div>
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
