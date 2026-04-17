import {
  DraftScoreItem,
  PaperAuthorshipRole,
  ScoreCalculationInput,
  ScoreCalculationMode,
  ScoreCalculationResult,
  ScoreConfigCategory,
  ScoreConfigItem
} from '../types';

export const MANUAL_SCORING_MODE: ScoreCalculationMode = 'manual';
export const COMPETITION_TEAM_SCORING_MODE: ScoreCalculationMode = 'competition_team';
export const COMPETITION_PARTICIPATION_SCORING_MODE: ScoreCalculationMode = 'competition_participation';
export const STUDENT_WORK_DUAL_ROLE_SCORING_MODE: ScoreCalculationMode = 'student_work_dual_role';
export const PAPER_AUTHORSHIP_SCORING_MODE: ScoreCalculationMode = 'paper_authorship';

export const paperAuthorshipOptions: Array<{ value: PaperAuthorshipRole; label: string; factor: number }> = [
  { value: 'first_author', label: '本人一作', factor: 1 },
  { value: 'advisor_first_student_second', label: '导师一作，本人二作', factor: 1 },
  { value: 'second_author', label: '本人二作', factor: 0.5 },
  { value: 'third_author', label: '本人三作', factor: 0.2 },
  { value: 'fourth_or_later', label: '第四作者及以后', factor: 0 }
];

const roundScore = (value: number) => Number((Math.round(value * 100) / 100).toFixed(2));

const normalizeNumber = (value: unknown): number | null => {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
};

const findItem = (category: ScoreConfigCategory, label?: string): ScoreConfigItem | undefined =>
  (category.items || []).find((item) => !item.is_other && (item.value === label || item.label === label));

export const getScoringMode = (item?: ScoreConfigItem): ScoreCalculationMode =>
  item?.scoring_mode || MANUAL_SCORING_MODE;

export const buildDefaultCalculationInput = (
  item?: ScoreConfigItem
): ScoreCalculationInput | undefined => {
  switch (getScoringMode(item)) {
    case COMPETITION_TEAM_SCORING_MODE:
      return { isTeamProject: false, isLeader: false, teamSize: '' };
    case STUDENT_WORK_DUAL_ROLE_SCORING_MODE:
      return { secondaryItemLabel: '' };
    case PAPER_AUTHORSHIP_SCORING_MODE:
      return { authorshipRole: 'first_author' };
    default:
      return undefined;
  }
};

export const getRuleHint = (item?: ScoreConfigItem): string => {
  switch (getScoringMode(item)) {
    case COMPETITION_TEAM_SCORING_MODE:
      return '系统会按个人/团体、队长/队员、项目人数自动计算得分。';
    case COMPETITION_PARTICIPATION_SCORING_MODE:
      return '成功参赛奖固定记 0.5 分，系统会校验累计不超过 2 分。';
    case STUDENT_WORK_DUAL_ROLE_SCORING_MODE:
      return '系统按“最高项 + 第二项 × 0.4”自动计算，最多合并两项学生工作。';
    case PAPER_AUTHORSHIP_SCORING_MODE:
      return '系统会按作者顺位自动计算：一作/导师一作学生二作 100%，二作 50%，三作 20%，四作及以后不计分。';
    default:
      return '';
  }
};

export const calculateDraftItemPreview = (
  itemMeta: ScoreConfigItem | undefined,
  category: ScoreConfigCategory | undefined,
  draftItem: DraftScoreItem
): ScoreCalculationResult | null => {
  if (!itemMeta || !category) return null;

  const baseScore = normalizeNumber(itemMeta.base_score);
  if (baseScore === null) return null;

  const input = draftItem.calculationInput || {};
  const scoringMode = getScoringMode(itemMeta);

  switch (scoringMode) {
    case COMPETITION_TEAM_SCORING_MODE: {
      if (!input.isTeamProject) {
        return {
          finalScore: roundScore(baseScore),
          summary: `个人项目：${roundScore(baseScore).toFixed(2)}`
        };
      }
      const teamSize = normalizeNumber(input.teamSize);
      if (teamSize === null || teamSize < 2) return null;
      const numerator = input.isLeader ? 2 : 1;
      const denominator = teamSize + 1;
      const finalScore = roundScore(baseScore * (numerator / denominator));
      return {
        finalScore,
        summary: `${input.isLeader ? '队长' : '队员'}：${roundScore(baseScore).toFixed(2)} × ${numerator}/${denominator} = ${finalScore.toFixed(2)}`
      };
    }
    case COMPETITION_PARTICIPATION_SCORING_MODE:
      return {
        finalScore: roundScore(baseScore),
        summary: `成功参赛奖固定计分：${roundScore(baseScore).toFixed(2)}`
      };
    case STUDENT_WORK_DUAL_ROLE_SCORING_MODE: {
      const secondary = findItem(category, input.secondaryItemLabel);
      if (!secondary) {
        return {
          finalScore: roundScore(baseScore),
          summary: `单项任职：${roundScore(baseScore).toFixed(2)}`
        };
      }
      const secondaryScore = normalizeNumber(secondary.base_score);
      if (secondaryScore === null) return null;
      const high = Math.max(baseScore, secondaryScore);
      const low = Math.min(baseScore, secondaryScore);
      const finalScore = roundScore(high + low * 0.4);
      return {
        finalScore,
        summary: `兼任两项：最高项 ${high.toFixed(2)} + 次高项 ${low.toFixed(2)} × 0.4 = ${finalScore.toFixed(2)}`
      };
    }
    case PAPER_AUTHORSHIP_SCORING_MODE: {
      const option = paperAuthorshipOptions.find((item) => item.value === input.authorshipRole);
      if (!option) return null;
      const finalScore = roundScore(baseScore * option.factor);
      return {
        finalScore,
        summary: `${option.label}：${roundScore(baseScore).toFixed(2)} × ${option.factor} = ${finalScore.toFixed(2)}`
      };
    }
    default:
      return null;
  }
};
