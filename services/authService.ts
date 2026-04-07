import { AuthPayload, AuthUser, UserRole } from '../types';

const AUTH_STORAGE_KEY = 'buptstar_auth';
const SHA256_HEX_RE = /^[a-f0-9]{64}$/i;
const SHA256_K = [
  0x428a2f98,
  0x71374491,
  0xb5c0fbcf,
  0xe9b5dba5,
  0x3956c25b,
  0x59f111f1,
  0x923f82a4,
  0xab1c5ed5,
  0xd807aa98,
  0x12835b01,
  0x243185be,
  0x550c7dc3,
  0x72be5d74,
  0x80deb1fe,
  0x9bdc06a7,
  0xc19bf174,
  0xe49b69c1,
  0xefbe4786,
  0x0fc19dc6,
  0x240ca1cc,
  0x2de92c6f,
  0x4a7484aa,
  0x5cb0a9dc,
  0x76f988da,
  0x983e5152,
  0xa831c66d,
  0xb00327c8,
  0xbf597fc7,
  0xc6e00bf3,
  0xd5a79147,
  0x06ca6351,
  0x14292967,
  0x27b70a85,
  0x2e1b2138,
  0x4d2c6dfc,
  0x53380d13,
  0x650a7354,
  0x766a0abb,
  0x81c2c92e,
  0x92722c85,
  0xa2bfe8a1,
  0xa81a664b,
  0xc24b8b70,
  0xc76c51a3,
  0xd192e819,
  0xd6990624,
  0xf40e3585,
  0x106aa070,
  0x19a4c116,
  0x1e376c08,
  0x2748774c,
  0x34b0bcb5,
  0x391c0cb3,
  0x4ed8aa4a,
  0x5b9cca4f,
  0x682e6ff3,
  0x748f82ee,
  0x78a5636f,
  0x84c87814,
  0x8cc70208,
  0x90befffa,
  0xa4506ceb,
  0xbef9a3f7,
  0xc67178f2
];
const SHA256_INIT = [
  0x6a09e667,
  0xbb67ae85,
  0x3c6ef372,
  0xa54ff53a,
  0x510e527f,
  0x9b05688c,
  0x1f83d9ab,
  0x5be0cd19
];

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

const rotateRight = (value: number, shift: number) => (value >>> shift) | (value << (32 - shift));

const encodeUtf8 = (input: string): Uint8Array => {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(input);
  }

  const encoded = unescape(encodeURIComponent(input));
  const bytes = new Uint8Array(encoded.length);
  for (let i = 0; i < encoded.length; i += 1) {
    bytes[i] = encoded.charCodeAt(i);
  }
  return bytes;
};

const sha256Fallback = (input: string): string => {
  const source = encodeUtf8(input);
  const bitLength = source.length * 8;
  const paddedLength = Math.ceil((source.length + 9) / 64) * 64;
  const bytes = new Uint8Array(paddedLength);
  bytes.set(source);
  bytes[source.length] = 0x80;

  const highBits = Math.floor(bitLength / 0x100000000);
  const lowBits = bitLength >>> 0;
  bytes[paddedLength - 8] = (highBits >>> 24) & 0xff;
  bytes[paddedLength - 7] = (highBits >>> 16) & 0xff;
  bytes[paddedLength - 6] = (highBits >>> 8) & 0xff;
  bytes[paddedLength - 5] = highBits & 0xff;
  bytes[paddedLength - 4] = (lowBits >>> 24) & 0xff;
  bytes[paddedLength - 3] = (lowBits >>> 16) & 0xff;
  bytes[paddedLength - 2] = (lowBits >>> 8) & 0xff;
  bytes[paddedLength - 1] = lowBits & 0xff;

  const hash = [...SHA256_INIT];
  const words = new Uint32Array(64);

  for (let offset = 0; offset < bytes.length; offset += 64) {
    for (let i = 0; i < 16; i += 1) {
      const index = offset + i * 4;
      words[i] =
        ((bytes[index] << 24) | (bytes[index + 1] << 16) | (bytes[index + 2] << 8) | bytes[index + 3]) >>> 0;
    }

    for (let i = 16; i < 64; i += 1) {
      const s0 = rotateRight(words[i - 15], 7) ^ rotateRight(words[i - 15], 18) ^ (words[i - 15] >>> 3);
      const s1 = rotateRight(words[i - 2], 17) ^ rotateRight(words[i - 2], 19) ^ (words[i - 2] >>> 10);
      words[i] = (words[i - 16] + s0 + words[i - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = hash;

    for (let i = 0; i < 64; i += 1) {
      const s1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + ch + SHA256_K[i] + words[i]) >>> 0;
      const s0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
    hash[5] = (hash[5] + f) >>> 0;
    hash[6] = (hash[6] + g) >>> 0;
    hash[7] = (hash[7] + h) >>> 0;
  }

  return hash.map((value) => value.toString(16).padStart(8, '0')).join('');
};

const getSubtleCrypto = (): SubtleCrypto | null => {
  const maybeCrypto = globalThis.crypto as (Crypto & { webkitSubtle?: SubtleCrypto }) | undefined;
  if (maybeCrypto?.subtle && typeof maybeCrypto.subtle.digest === 'function') {
    return maybeCrypto.subtle;
  }
  if (maybeCrypto?.webkitSubtle && typeof maybeCrypto.webkitSubtle.digest === 'function') {
    return maybeCrypto.webkitSubtle;
  }
  return null;
};

export const sha256Hex = async (input: string): Promise<string> => {
  const normalized = String(input || '');
  if (SHA256_HEX_RE.test(normalized)) {
    return normalized.toLowerCase();
  }

  const subtle = getSubtleCrypto();
  if (subtle) {
    const data = encodeUtf8(normalized);
    const hashBuffer = await subtle.digest('SHA-256', data);
    const bytes = Array.from(new Uint8Array(hashBuffer));
    return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  return sha256Fallback(normalized);
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
