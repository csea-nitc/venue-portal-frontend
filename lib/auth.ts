import { extractJwtRoles, setStoredRoles } from '@/lib/utils';

export interface DecodedJwtPayload {
  userId?: number | string;
  email?: string;
  name?: string;
  role?: string | string[];
  roles?: unknown;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

const AUTH_STORAGE_KEYS = [
  'perms_token',
  'perms_logged_in',
  'perms_user_id',
  'perms_user_name',
  'perms_user_email',
  'perms_user_role',
  'perms_user_roles',
  'perms_active_role',
] as const;

/** Get the currently stored JWT access token */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('perms_token');
}

/** Safely decode base64 JWT payload */
export function parseJwt(token: string): DecodedJwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as DecodedJwtPayload;
  } catch {
    return null;
  }
}

/** Check whether a token is absent, unparseable, or expired within bufferSeconds */
export function isTokenExpired(token?: string | null, bufferSeconds = 60): boolean {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds + bufferSeconds;
}

/** Remove all auth-related items from localStorage */
export function clearAuthTokens(): void {
  if (typeof window === 'undefined') return;
  for (const key of AUTH_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}

/** Determine backend origin URL without trailing slashes or /api prefix */
export function getAuthBackendUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  return envUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
}

/** In-flight refresh promise to prevent duplicate concurrent refresh requests */
let refreshPromise: Promise<string> | null = null;

/**
 * Call GET /api/auth/refresh with credentials to obtain a new JWT using httpOnly cookie.
 * If successful, updates localStorage with the new token & user data.
 * If refresh fails, automatically removes all tokens and redirects to /login.
 */
export async function refreshAccessToken(): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Cannot refresh token outside browser environment');
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const backendUrl = getAuthBackendUrl();
      const res = await fetch(`${backendUrl}/api/auth/refresh`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Token refresh failed with status ${res.status}`);
      }

      const data = (await res.json()) as { token?: string };
      const newToken = data?.token;
      if (!newToken || typeof newToken !== 'string') {
        throw new Error('Invalid token returned from refresh endpoint');
      }

      // Update localStorage with new token & payload details
      localStorage.setItem('perms_token', newToken);
      localStorage.setItem('perms_logged_in', 'true');

      const payload = parseJwt(newToken);
      if (payload) {
        if (payload.userId !== undefined) {
          localStorage.setItem('perms_user_id', String(payload.userId));
        }
        if (payload.name) {
          localStorage.setItem('perms_user_name', String(payload.name));
        }
        if (payload.email) {
          localStorage.setItem('perms_user_email', String(payload.email));
        }
        const roles = extractJwtRoles(payload);
        if (roles.length > 0) {
          setStoredRoles(roles);
        }
      }

      return newToken;
    } catch (err) {
      // If refresh doesn't work, automatically remove all token/auth info
      clearAuthTokens();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?error=Session+expired.+Please+sign+in+again.';
      }
      throw err;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Ensures a valid access token exists:
 * - If valid and not expired, returns it.
 * - If expired or missing but user was logged in, automatically refreshes via cookie.
 * - If refresh fails, cleans up tokens and returns null.
 */
export async function getValidAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('perms_token');
  const loggedIn = localStorage.getItem('perms_logged_in');

  if (isTokenExpired(token)) {
    if (loggedIn || token) {
      try {
        return await refreshAccessToken();
      } catch {
        return null;
      }
    }
    return null;
  }

  return token;
}

/** Log out the user from both server and local storage */
export async function logoutUser(): Promise<void> {
  try {
    const backendUrl = getAuthBackendUrl();
    await fetch(`${backendUrl}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.error('Error logging out from server:', err);
  } finally {
    clearAuthTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}
