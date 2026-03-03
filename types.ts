export interface Field {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface FieldDetailData {
  id: string;
  name: string;
  icon: string;
  overview: string;
  ideologicalPoint: string;
  history: string;
  future: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: 'red_engineering' | 'model_engineer';
  summary: string;
  date?: string;
  tags: string[];
}

export interface CaseDetailData extends CaseStudy {
  fullContent: string;
  quote: string;
  images: string[];
  relatedTech: string[];
  sourceUrl?: string;
}

export interface Company {
  name: string;
  logoInitial: string;
  url: string;
}

export interface ExternalLink {
  name: string;
  url: string;
  description: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  url?: string;
}

export enum ChatSender {
  USER = 'user',
  AI = 'ai'
}

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  timestamp: Date;
}

export interface Spirit {
  name: string;
  note?: string;
  details: string;
}

export interface SpiritCategory {
  period: string;
  spirits: Spirit[][];
}

export type UserRole = 'student' | 'admin';

export interface AuthUser {
  id: number;
  username: string;
  displayName: string;
  role: UserRole;
}

export interface AuthPayload {
  token: string;
  user: AuthUser;
}

export interface ScoreConfigItem {
  label: string;
  value: string;
  base_score: number;
  is_other?: boolean;
}

export interface ScoreConfigCategory {
  name: string;
  max_limit?: number | null;
  max_limit_note?: string;
  items: ScoreConfigItem[];
}

export interface ScoreConfigModule {
  module_name: string;
  max_limit?: number | null;
  categories: ScoreConfigCategory[];
}

export interface ScoreConfig {
  moral_education: ScoreConfigModule;
  intellectual_education: ScoreConfigModule;
  physical_aesthetic_labor: ScoreConfigModule;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ScoreProofFile {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface DraftScoreItem {
  localId: string;
  moduleKey: keyof ScoreConfig;
  categoryName: string;
  itemLabel: string;
  customItemLabel?: string;
  customDescription?: string;
  selfScore: string;
  firstUnitConfirmed?: boolean;
  activityName?: string;
  activityDuration?: string;
  proofFiles: ScoreProofFile[];
}

export interface ScoreReport {
  id: number;
  submission_id: string;
  user_id: number;
  username?: string;
  display_name?: string;
  module_key: keyof ScoreConfig;
  category_name: string;
  item_label: string;
  custom_item_label?: string;
  custom_description?: string;
  is_other: boolean;
  base_score: number | null;
  self_score: number;
  first_unit_confirmed: boolean;
  activity_name?: string;
  activity_duration?: string;
  status: ReviewStatus;
  review_comment?: string;
  reviewer_name?: string;
  reviewer_username?: string;
  created_at: string;
  reviewed_at?: string;
  proofFiles: ScoreProofFile[];
}

export interface ScoreSummary {
  moral_education: number;
  intellectual_education: number;
  physical_aesthetic_labor: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface ScoreReportListResponse {
  reports: ScoreReport[];
  summary: ScoreSummary;
  entryEnabled: boolean;
}

export interface ScoreDraftResponse {
  items: Omit<DraftScoreItem, 'localId'>[];
  updatedAt: string | null;
  entryEnabled?: boolean;
}

export interface UserListItem {
  id: number;
  username: string;
  display_name: string;
  role: UserRole;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserPayload {
  username: string;
  displayName?: string;
  role: UserRole;
  password: string;
}

export interface ScoreReviewStudent {
  user_id: number;
  username: string;
  display_name?: string;
  pending_count: number;
  total_count: number;
  latest_updated_at?: string;
}
