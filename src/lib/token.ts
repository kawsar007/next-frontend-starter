/**
 * Token utilities — manage JWT cookies client-side.
 * Uses js-cookie for browser-compatible cookie access.
 * For SSR, tokens are read from request cookies via middleware.
 */
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '@/types';

const ACCESS_KEY  = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY  ?? 'access_token';
const REFRESH_KEY = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY ?? 'refresh_token';

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  path: '/',
  sameSite: 'lax',
  // In production set secure: true and httpOnly via server-side Set-Cookie
  secure: process.env.NODE_ENV === 'production',
};

export const tokenStore = {
  getAccess:     () => Cookies.get(ACCESS_KEY),
  getRefresh:    () => Cookies.get(REFRESH_KEY),
  setAccess:     (t: string) => Cookies.set(ACCESS_KEY, t, { ...COOKIE_OPTIONS, expires: 1 / 96 }), // 15m
  setRefresh:    (t: string) => Cookies.set(REFRESH_KEY, t, { ...COOKIE_OPTIONS, expires: 7 }),
  clearAll:      () => { Cookies.remove(ACCESS_KEY); Cookies.remove(REFRESH_KEY); },
  setTokenPair:  (access: string, refresh: string) => {
    tokenStore.setAccess(access);
    tokenStore.setRefresh(refresh);
  },
};

/** Decode a JWT without verifying signature (client-side display only). */
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

/** Returns true if the token expires within `bufferSecs` seconds. */
export function isTokenExpired(token: string, bufferSecs = 30): boolean {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;
  return payload.exp - bufferSecs < Date.now() / 1000;
}
