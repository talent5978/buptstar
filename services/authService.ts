import { AuthPayload, AuthUser, UserRole } from '../types';

const AUTH_STORAGE_KEY = 'buptstar_auth';
const SHA256_HEX_RE = /^[a-f0-9]{64}$/i;

const parseJson = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const getStoredAuth = (): AuthPayload | null => {
  return parseJson<AuthPayload>(localStorage.getItem(AUTH_STORAGE_KEY));
};

export const storeAuth = (payload: AuthPayload) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const sha256Hex = async (input: string): Promise<string> => {
  const normalized = String(input || '');
  if (SHA256_HEX_RE.test(normalized)) {
    return normalized.toLowerCase();
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(hashBuffer));
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const login = async (params: {
  role: UserRole;
  username: string;
  password: string;
}): Promise<AuthPayload> => {
  const passwordDigest = await sha256Hex(params.password);
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      role: params.role,
      username: params.username,
      passwordDigest
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `登录失败(${response.status})`);
  }

  if (!data.token || !data.user) {
    throw new Error('登录响应格式错误');
  }

  return { token: data.token, user: data.user as AuthUser };
};

export const fetchCurrentUser = async (token: string): Promise<AuthUser> => {
  const response = await fetch('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `鉴权失败(${response.status})`);
  }

  return data.user as AuthUser;
};

export const logout = async (token: string): Promise<void> => {
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).catch(() => undefined);
};

export const authHeader = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`
});
