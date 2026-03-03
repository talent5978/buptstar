import {
  CreateUserPayload,
  DraftScoreItem,
  ScoreConfig,
  ScoreDraftResponse,
  ScoreProofFile,
  ScoreReport,
  ScoreReportListResponse,
  ScoreReviewStudent,
  UserListItem
} from '../types';
import { authHeader, sha256Hex } from './authService';

const readErrorMessage = async (response: Response): Promise<string> => {
  const data = await response.json().catch(() => ({}));
  return data.error || `请求失败(${response.status})`;
};

export const fetchScoreConfig = async (): Promise<{ config: ScoreConfig; entryEnabled: boolean }> => {
  const response = await fetch('/api/score/config');
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
};

export const fetchScoreEntryStatus = async (): Promise<{ enabled: boolean }> => {
  const response = await fetch('/api/score/entry-status');
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
};

export const fetchMyScoreReports = async (token: string): Promise<ScoreReportListResponse> => {
  const response = await fetch('/api/score-reports/mine', { headers: authHeader(token) });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
};

export const fetchScoreDraft = async (token: string): Promise<ScoreDraftResponse> => {
  const response = await fetch('/api/score-draft', { headers: authHeader(token) });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
};

export const saveScoreDraft = async (
  token: string,
  items: Omit<DraftScoreItem, 'localId'>[]
): Promise<ScoreDraftResponse> => {
  const response = await fetch('/api/score-draft', {
    method: 'PUT',
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ items })
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
};

export const submitScoreDraft = async (token: string): Promise<{ submissionId: string; reports: ScoreReport[] }> => {
  const response = await fetch('/api/score-reports/submit-draft', {
    method: 'POST',
    headers: authHeader(token)
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
};

export const uploadScoreProofs = async (token: string, files: File[]): Promise<ScoreProofFile[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await fetch('/api/score-proofs', {
    method: 'POST',
    headers: authHeader(token),
    body: formData
  });

  if (!response.ok) throw new Error(await readErrorMessage(response));
  const data = await response.json();
  return data.proofFiles as ScoreProofFile[];
};

export const fetchAdminUsers = async (token: string): Promise<UserListItem[]> => {
  const response = await fetch('/api/admin/users', { headers: authHeader(token) });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const data = await response.json();
  return data.users as UserListItem[];
};

export const createAdminUser = async (token: string, payload: CreateUserPayload): Promise<UserListItem> => {
  const passwordDigest = await sha256Hex(payload.password);
  const response = await fetch('/api/admin/users', {
    method: 'POST',
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: payload.username,
      displayName: payload.displayName,
      role: payload.role,
      passwordDigest
    })
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const data = await response.json();
  return data.user as UserListItem;
};

export const importUsersBulk = async (
  token: string,
  users: Array<{ username: string; displayName?: string; role?: 'student' | 'admin'; password?: string }>
): Promise<{ created: number; updated: number; failed: Array<{ index: number; error: string }> }> => {
  const normalized = await Promise.all(
    users.map(async (user) => {
      const raw = String(user.password || user.username || '');
      return {
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        passwordDigest: await sha256Hex(raw)
      };
    })
  );

  const response = await fetch('/api/admin/users/bulk', {
    method: 'POST',
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ users: normalized })
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
};

export const resetUserPassword = async (token: string, userId: number, password: string): Promise<void> => {
  const passwordDigest = await sha256Hex(password);
  const response = await fetch(`/api/admin/users/${userId}/password`, {
    method: 'PATCH',
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ passwordDigest })
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
};

export const updateUserProfile = async (
  token: string,
  userId: number,
  payload: { displayName?: string; isActive: boolean }
): Promise<UserListItem> => {
  const response = await fetch(`/api/admin/users/${userId}/profile`, {
    method: 'PATCH',
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const data = await response.json();
  return data.user as UserListItem;
};

export const fetchAdminEntryStatus = async (token: string): Promise<{ enabled: boolean }> => {
  const response = await fetch('/api/admin/score/entry-status', { headers: authHeader(token) });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
};

export const setAdminEntryStatus = async (token: string, enabled: boolean): Promise<{ enabled: boolean }> => {
  const response = await fetch('/api/admin/score/entry-status', {
    method: 'PATCH',
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ enabled })
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
};

export const fetchReviewStudents = async (token: string, search = ''): Promise<ScoreReviewStudent[]> => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await fetch(`/api/admin/score-review/students${query}`, {
    headers: authHeader(token)
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const data = await response.json();
  return data.students as ScoreReviewStudent[];
};

export const fetchReviewStudentReports = async (
  token: string,
  userId: number
): Promise<{ user: UserListItem; reports: ScoreReport[] }> => {
  const response = await fetch(`/api/admin/score-review/students/${userId}`, {
    headers: authHeader(token)
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const data = await response.json();
  return { user: data.user as UserListItem, reports: data.reports as ScoreReport[] };
};

export const batchReviewReports = async (
  token: string,
  payload: { reportIds: number[]; status: 'approved' | 'rejected'; reviewComment?: string }
): Promise<{ success: boolean; changes: number }> => {
  const response = await fetch('/api/admin/score-review/batch', {
    method: 'PATCH',
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  return response.json();
};

export const fetchAdminScoreConfig = async (token: string): Promise<Record<string, any>> => {
  const response = await fetch('/api/admin/score-config', { headers: authHeader(token) });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const data = await response.json();
  return data.config as Record<string, any>;
};

export const saveAdminScoreConfig = async (
  token: string,
  config: Record<string, any>
): Promise<Record<string, any>> => {
  const response = await fetch('/api/admin/score-config', {
    method: 'PUT',
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ config })
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const data = await response.json();
  return data.config as Record<string, any>;
};
