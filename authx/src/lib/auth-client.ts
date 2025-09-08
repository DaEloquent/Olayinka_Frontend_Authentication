const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken"; // if backend returns a refresh token to client-side

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}
export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, token);
}
export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}
export function setRefreshToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_KEY, token);
}
export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
