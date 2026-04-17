const MANUAL_SCORING_MODE = 'manual';
const COMPETITION_TEAM_SCORING_MODE = 'competition_team';
const COMPETITION_PARTICIPATION_SCORING_MODE = 'competition_participation';
const STUDENT_WORK_DUAL_ROLE_SCORING_MODE = 'student_work_dual_role';
const PAPER_AUTHORSHIP_SCORING_MODE = 'paper_authorship';

const PAPER_AUTHORSHIP_FACTORS = {
  first_author: { factor: 1, label: '本人一作' },
  advisor_first_student_second: { factor: 1, label: '导师一作，本人二作' },
  second_author: { factor: 0.5, label: '本人二作' },
  third_author: { factor: 0.2, label: '本人三作' },
  fourth_or_later: { factor: 0, label: '第四作者及以后' }
};

const normalizeNumber = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
};

const roundScore = (value) => Number((Math.round(value * 100) / 100).toFixed(2));

const findCategoryItem = (categoryItems, label) =>
  (categoryItems || []).find((item) => !item.is_other && (item.value === label || item.label === label)) || null;

const calculateCompetitionTeamScore = (baseScore, calculationInput = {}) => {
  if (!calculationInput.isTeamProject) {
    return {
      finalScore: roundScore(baseScore),
      summary: `个人项目：${roundScore(baseScore).toFixed(2)}`,
      detail: { baseScore, isTeamProject: false }
    };
  }

  const teamSize = normalizeNumber(calculationInput.teamSize);
  if (teamSize === null || teamSize < 2) {
    throw new Error('团体项目人数必须为不小于2的整数');
  }

  const isLeader = !!calculationInput.isLeader;
  const numerator = isLeader ? 2 : 1;
  const denominator = teamSize + 1;
  const factor = numerator / denominator;
  const finalScore = roundScore(baseScore * factor);

  return {
    finalScore,
    summary: `${isLeader ? '队长' : '队员'}：${roundScore(baseScore).toFixed(2)} × ${numerator}/${denominator} = ${finalScore.toFixed(2)}`,
    detail: {
      baseScore,
      isTeamProject: true,
      isLeader,
      teamSize,
      factorNumerator: numerator,
      factorDenominator: denominator,
      factor
    }
  };
};

const calculateCompetitionParticipationScore = (baseScore) => {
  const finalScore = roundScore(baseScore);
  return {
    finalScore,
    summary: `成功参赛奖固定计分：${finalScore.toFixed(2)}`,
    detail: { baseScore }
  };
};

const calculateStudentWorkScore = (baseScore, categoryItems, calculationInput = {}) => {
  const secondaryItemLabel = String(calculationInput.secondaryItemLabel || '').trim();
  if (!secondaryItemLabel) {
    const finalScore = roundScore(baseScore);
    return {
      finalScore,
      summary: `单项任职：${finalScore.toFixed(2)}`,
      detail: { baseScore, secondaryItemLabel: '' }
    };
  }

  const secondaryItem = findCategoryItem(categoryItems, secondaryItemLabel);
  if (!secondaryItem) {
    throw new Error('第二项学生工作无效');
  }

  const secondaryBaseScore = normalizeNumber(secondaryItem.base_score);
  if (secondaryBaseScore === null) {
    throw new Error('第二项学生工作的参考分值无效');
  }

  const higher = Math.max(baseScore, secondaryBaseScore);
  const lower = Math.min(baseScore, secondaryBaseScore);
  const secondaryFactor = 0.4;
  const finalScore = roundScore(higher + lower * secondaryFactor);

  return {
    finalScore,
    summary: `兼任两项：最高项 ${higher.toFixed(2)} + 次高项 ${lower.toFixed(2)} × 0.4 = ${finalScore.toFixed(2)}`,
    detail: {
      baseScore,
      secondaryItemLabel,
      secondaryBaseScore,
      higher,
      lower,
      secondaryFactor
    }
  };
};

const calculatePaperAuthorshipScore = (baseScore, calculationInput = {}) => {
  const authorshipRole = String(calculationInput.authorshipRole || '').trim();
  const authorship = PAPER_AUTHORSHIP_FACTORS[authorshipRole];
  if (!authorship) {
    throw new Error('论文作者顺位无效');
  }

  const finalScore = roundScore(baseScore * authorship.factor);
  return {
    finalScore,
    summary: `${authorship.label}：${roundScore(baseScore).toFixed(2)} × ${authorship.factor} = ${finalScore.toFixed(2)}`,
    detail: {
      baseScore,
      authorshipRole,
      authorshipLabel: authorship.label,
      factor: authorship.factor
    }
  };
};

const calculateItemScore = ({ itemMeta, categoryItems, calculationInput = {} }) => {
  const scoringMode = itemMeta?.scoring_mode || MANUAL_SCORING_MODE;
  const baseScore = normalizeNumber(itemMeta?.base_score);

  if (
    scoringMode !== MANUAL_SCORING_MODE &&
    (baseScore === null || baseScore < 0)
  ) {
    throw new Error('自动算分项缺少有效的参考分值');
  }

  switch (scoringMode) {
    case COMPETITION_TEAM_SCORING_MODE:
      return {
        scoringMode,
        ...calculateCompetitionTeamScore(baseScore, calculationInput)
      };
    case COMPETITION_PARTICIPATION_SCORING_MODE:
      return {
        scoringMode,
        ...calculateCompetitionParticipationScore(baseScore)
      };
    case STUDENT_WORK_DUAL_ROLE_SCORING_MODE:
      return {
        scoringMode,
        ...calculateStudentWorkScore(baseScore, categoryItems, calculationInput)
      };
    case PAPER_AUTHORSHIP_SCORING_MODE:
      return {
        scoringMode,
        ...calculatePaperAuthorshipScore(baseScore, calculationInput)
      };
    default:
      return {
        scoringMode: MANUAL_SCORING_MODE,
        finalScore: null,
        summary: '',
        detail: null
      };
  }
};

module.exports = {
  MANUAL_SCORING_MODE,
  COMPETITION_TEAM_SCORING_MODE,
  COMPETITION_PARTICIPATION_SCORING_MODE,
  STUDENT_WORK_DUAL_ROLE_SCORING_MODE,
  PAPER_AUTHORSHIP_SCORING_MODE,
  PAPER_AUTHORSHIP_FACTORS,
  calculateItemScore,
  roundScore
};
