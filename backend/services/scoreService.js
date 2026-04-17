const path = require('path');
const fs = require('fs');
const {
  MANUAL_SCORING_MODE,
  COMPETITION_PARTICIPATION_SCORING_MODE,
  calculateItemScore
} = require('./scoreCalculationService');

const configPath = path.join(__dirname, '..', 'data', 'comprehensiveScoreConfig.json');

const OTHER_ITEM_VALUE = '__other__';
const VALID_SCORING_MODES = new Set([
  MANUAL_SCORING_MODE,
  'competition_team',
  COMPETITION_PARTICIPATION_SCORING_MODE,
  'student_work_dual_role',
  'paper_authorship'
]);

const clone = (value) => JSON.parse(JSON.stringify(value));

const normalizeNumber = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
};

const requiredModuleKeys = ['moral_education', 'intellectual_education', 'physical_aesthetic_labor'];

const assertValidRawConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw { code: 'CONFIG_INVALID', status: 400, message: '配置必须是 JSON 对象' };
  }

  requiredModuleKeys.forEach((moduleKey) => {
    const moduleConfig = config[moduleKey];
    if (!moduleConfig || typeof moduleConfig !== 'object') {
      throw { code: 'CONFIG_INVALID', status: 400, message: `缺少模块：${moduleKey}` };
    }
    if (!Array.isArray(moduleConfig.categories)) {
      throw { code: 'CONFIG_INVALID', status: 400, message: `模块 ${moduleKey} 的 categories 必须为数组` };
    }

    moduleConfig.categories.forEach((category, categoryIndex) => {
      if (!category || typeof category !== 'object') {
        throw { code: 'CONFIG_INVALID', status: 400, message: `模块 ${moduleKey} 的第 ${categoryIndex + 1} 个类别格式无效` };
      }
      if (!category.name || typeof category.name !== 'string') {
        throw { code: 'CONFIG_INVALID', status: 400, message: `模块 ${moduleKey} 的第 ${categoryIndex + 1} 个类别缺少 name` };
      }
      if (!Array.isArray(category.items)) {
        throw { code: 'CONFIG_INVALID', status: 400, message: `模块 ${moduleKey} 类别 ${category.name} 的 items 必须为数组` };
      }

      category.items.forEach((item, itemIndex) => {
        if (!item || typeof item !== 'object') {
          throw {
            code: 'CONFIG_INVALID',
            status: 400,
            message: `模块 ${moduleKey} 类别 ${category.name} 的第 ${itemIndex + 1} 个加分项格式无效`
          };
        }
        if (!item.label || typeof item.label !== 'string') {
          throw {
            code: 'CONFIG_INVALID',
            status: 400,
            message: `模块 ${moduleKey} 类别 ${category.name} 的第 ${itemIndex + 1} 个加分项缺少 label`
          };
        }
        if (item.base_score !== null && item.base_score !== undefined && !Number.isFinite(Number(item.base_score))) {
          throw {
            code: 'CONFIG_INVALID',
            status: 400,
            message: `模块 ${moduleKey} 类别 ${category.name} 的加分项 ${item.label} base_score 必须是数字或 null`
          };
        }
        if (item.scoring_mode !== undefined && !VALID_SCORING_MODES.has(item.scoring_mode)) {
          throw {
            code: 'CONFIG_INVALID',
            status: 400,
            message: `模块 ${moduleKey} 类别 ${category.name} 的加分项 ${item.label} scoring_mode 非法`
          };
        }
      });
    });
  });
};

const loadRawConfig = () => {
  const rawText = fs.readFileSync(configPath, 'utf-8');
  const parsed = JSON.parse(rawText);
  assertValidRawConfig(parsed);
  return parsed;
};

const buildConfigWithOther = (raw) => {
  const config = clone(raw);
  Object.values(config).forEach((moduleConfig) => {
    moduleConfig.categories.forEach((category) => {
      category.items = (category.items || []).map((item) => ({
        ...item,
        value: item.label,
        is_other: false,
        scoring_mode: item.scoring_mode || MANUAL_SCORING_MODE
      }));
      category.items.push({
        label: '其它（自定义）',
        value: OTHER_ITEM_VALUE,
        base_score: 0,
        is_other: true,
        scoring_mode: MANUAL_SCORING_MODE
      });
    });
  });
  return config;
};

const findModule = (config, moduleKey) => config[moduleKey] || null;

const findCategory = (config, moduleKey, categoryName) => {
  const moduleConfig = findModule(config, moduleKey);
  if (!moduleConfig) return null;
  return moduleConfig.categories.find((category) => category.name === categoryName) || null;
};

const findItem = (config, moduleKey, categoryName, itemLabel) => {
  const category = findCategory(config, moduleKey, categoryName);
  if (!category) return null;
  return category.items.find((item) => item.value === itemLabel || item.label === itemLabel) || null;
};

const sanitizeProofFiles = (proofFiles) => {
  if (!Array.isArray(proofFiles)) return [];
  return proofFiles
    .map((proof) => ({
      filename: String(proof.filename || ''),
      originalName: String(proof.originalName || ''),
      mimeType: String(proof.mimeType || ''),
      size: Number(proof.size || 0),
      url: String(proof.url || '')
    }))
    .filter((proof) => proof.filename && proof.url);
};

const sanitizeDraftItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 200).map((item) => ({
    moduleKey: String(item.moduleKey || '').trim(),
    categoryName: String(item.categoryName || '').trim(),
    itemLabel: String(item.itemLabel || '').trim(),
    customItemLabel: String(item.customItemLabel || '').trim(),
    customDescription: String(item.customDescription || '').trim(),
    selfScore: item.selfScore,
    firstUnitConfirmed: !!item.firstUnitConfirmed,
    activityName: String(item.activityName || '').trim(),
    activityDuration: String(item.activityDuration || '').trim(),
    proofFiles: sanitizeProofFiles(item.proofFiles),
    calculationInput:
      item.calculationInput && typeof item.calculationInput === 'object' && !Array.isArray(item.calculationInput)
        ? clone(item.calculationInput)
        : {}
  }));
};

const validateSubmitItems = ({ items, userId, database }) => {
  const rawConfig = loadRawConfig();
  const config = buildConfigWithOther(rawConfig);
  const sanitized = sanitizeDraftItems(items);
  if (!sanitized.length) {
    throw { code: 'VALIDATION_ERROR', status: 400, message: '请先添加至少一条加分项' };
  }

  const prepared = sanitized.map((item, index) => {
    const moduleKey = item.moduleKey;
    const categoryName = item.categoryName;
    const itemLabel = item.itemLabel;

    if (!moduleKey || !categoryName || !itemLabel) {
      throw {
        code: 'VALIDATION_ERROR',
        status: 400,
        message: `第 ${index + 1} 条：模块、类别、加分项为必填`
      };
    }

    const moduleConfig = findModule(config, moduleKey);
    if (!moduleConfig) {
      throw { code: 'VALIDATION_ERROR', status: 400, message: `第 ${index + 1} 条：模块无效` };
    }

    const category = findCategory(config, moduleKey, categoryName);
    if (!category) {
      throw { code: 'VALIDATION_ERROR', status: 400, message: `第 ${index + 1} 条：类别无效` };
    }

    const itemMeta = findItem(config, moduleKey, categoryName, itemLabel);
    if (!itemMeta) {
      throw { code: 'VALIDATION_ERROR', status: 400, message: `第 ${index + 1} 条：加分项无效` };
    }

    const isOther = itemMeta.is_other || itemLabel === OTHER_ITEM_VALUE;
    if (isOther && !item.customItemLabel) {
      throw { code: 'VALIDATION_ERROR', status: 400, message: `第 ${index + 1} 条：其它项必须填写自定义加分项` };
    }

    if (isOther && !item.customDescription) {
      throw { code: 'VALIDATION_ERROR', status: 400, message: `第 ${index + 1} 条：其它项必须填写说明` };
    }

    const firstUnitConfirmed = !!item.firstUnitConfirmed;
    if (moduleKey === 'intellectual_education' && !firstUnitConfirmed) {
      throw { code: 'VALIDATION_ERROR', status: 400, message: `第 ${index + 1} 条：智育加分需确认第一单位承诺` };
    }

    let selfScore = normalizeNumber(item.selfScore);
    let calculationMode = itemMeta.scoring_mode || MANUAL_SCORING_MODE;
    let calculationPayload = null;
    let calculationResult = null;

    if (!isOther && calculationMode !== MANUAL_SCORING_MODE) {
      try {
        const computed = calculateItemScore({
          itemMeta,
          categoryItems: category.items,
          calculationInput: item.calculationInput || {}
        });
        selfScore = computed.finalScore;
        calculationPayload = clone(item.calculationInput || {});
        calculationResult = {
          summary: computed.summary,
          detail: computed.detail || {},
          finalScore: computed.finalScore
        };
      } catch (error) {
        throw {
          code: 'VALIDATION_ERROR',
          status: 400,
          message: `第 ${index + 1} 条：${error.message || '自动算分失败'}`
        };
      }
    }

    if (selfScore === null || selfScore <= 0) {
      throw { code: 'VALIDATION_ERROR', status: 400, message: `第 ${index + 1} 条：加分结果必须大于0` };
    }

    return {
      userId,
      moduleKey,
      categoryName,
      itemLabel,
      customItemLabel: isOther ? item.customItemLabel : '',
      customDescription: isOther ? item.customDescription : '',
      isOther,
      baseScore: isOther ? null : Number(itemMeta.base_score),
      selfScore,
      calculationMode: isOther ? MANUAL_SCORING_MODE : calculationMode,
      calculationPayload,
      calculationResult,
      firstUnitConfirmed,
      activityName: item.activityName,
      activityDuration: item.activityDuration,
      proofFiles: sanitizeProofFiles(item.proofFiles)
    };
  });

  // 上限校验：历史有效 + 本次提交
  const added = {
    moral: 0,
    palHonor: 0,
    volunteer: 0,
    socialPracticeCount: 0,
    competitionParticipation: 0
  };

  prepared.forEach((item, index) => {
    if (item.moduleKey === 'moral_education') {
      added.moral += item.selfScore;
      const current = database.sumSelfScoreByModuleV2(userId, 'moral_education');
      if (current + added.moral > 30) {
        throw {
          code: 'LIMIT_EXCEEDED',
          status: 400,
          message: `第 ${index + 1} 条触发德育上限（30分）`,
          detail: { current, incomingAccumulated: added.moral, limit: 30 }
        };
      }
    }

    if (item.calculationMode === COMPETITION_PARTICIPATION_SCORING_MODE) {
      added.competitionParticipation += item.selfScore;
      const current = database.sumSelfScoreByCalculationModeV2(userId, COMPETITION_PARTICIPATION_SCORING_MODE);
      if (current + added.competitionParticipation > 2) {
        throw {
          code: 'LIMIT_EXCEEDED',
          status: 400,
          message: `第 ${index + 1} 条触发成功参赛奖上限（2分）`,
          detail: { current, incomingAccumulated: added.competitionParticipation, limit: 2 }
        };
      }
    }

    if (item.moduleKey === 'physical_aesthetic_labor') {
      const text = `${item.itemLabel} ${item.customItemLabel} ${item.customDescription}`;

      if (item.categoryName === '赛事及荣誉加分') {
        added.palHonor += item.selfScore;
        const current = database.sumSelfScoreByModuleAndCategoryV2(userId, item.moduleKey, item.categoryName);
        if (current + added.palHonor > 30) {
          throw {
            code: 'LIMIT_EXCEEDED',
            status: 400,
            message: `第 ${index + 1} 条触发体美劳赛事及荣誉上限（30分）`,
            detail: { current, incomingAccumulated: added.palHonor, limit: 30 }
          };
        }
      }

      if (item.categoryName === '日常活动积分') {
        if (text.includes('志愿服务')) {
          added.volunteer += item.selfScore;
          const current = database.sumSelfScoreByTextV2(userId, item.moduleKey, '志愿服务');
          if (current + added.volunteer > 20) {
            throw {
              code: 'LIMIT_EXCEEDED',
              status: 400,
              message: `第 ${index + 1} 条触发志愿服务上限（20分）`,
              detail: { current, incomingAccumulated: added.volunteer, limit: 20 }
            };
          }
        }

        if (text.includes('社会实践立项')) {
          added.socialPracticeCount += 1;
          const currentCount = database.countReportsByTextV2(userId, item.moduleKey, '社会实践立项');
          if (currentCount + added.socialPracticeCount > 2) {
            throw {
              code: 'LIMIT_EXCEEDED',
              status: 400,
              message: `第 ${index + 1} 条触发社会实践立项次数上限（2次）`,
              detail: { currentCount, incomingCount: added.socialPracticeCount, limit: 2 }
            };
          }
        }
      }
    }
  });

  return prepared;
};

const buildSummary = (reports) => {
  const summary = {
    moral_education: 0,
    intellectual_education: 0,
    physical_aesthetic_labor: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0
  };

  reports.forEach((report) => {
    const score = Number(report.self_score || 0);
    if (report.status !== 'rejected' && summary[report.module_key] !== undefined) {
      summary[report.module_key] += score;
    }
    if (report.status === 'pending') summary.pendingCount += 1;
    if (report.status === 'approved') summary.approvedCount += 1;
    if (report.status === 'rejected') summary.rejectedCount += 1;
  });

  return summary;
};

module.exports = {
  OTHER_ITEM_VALUE,
  getScoreConfig: () => buildConfigWithOther(loadRawConfig()),
  getRawScoreConfig: () => loadRawConfig(),
  saveRawScoreConfig: (nextConfig) => {
    assertValidRawConfig(nextConfig);
    fs.writeFileSync(configPath, `${JSON.stringify(nextConfig, null, 2)}\n`, 'utf-8');
    return loadRawConfig();
  },
  sanitizeDraftItems,
  validateSubmitItems,
  buildSummary
};
