import axios, { AxiosError, AxiosInstance } from "axios";
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  clearTokens,
} from "./auth-client";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https:api.your-backend.com",
  withCredentials: true, // if backend uses httpOnly cookies for refresh
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pending: ((token: string) => void)[] = [];

type ErrorResponse = { message?: string };

type AxiosRequestConfigWithRetry = import("axios").AxiosRequestConfig & {
  _retry?: boolean;
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<unknown>) => {
    const original = error.config as AxiosRequestConfigWithRetry;
    const status = error.response?.status;

    // Unified error message
    const message =
      (error.response?.data as ErrorResponse)?.message || error.message;

    // If unauthorized, try refresh once
    if (status === 401 && !original._retry) {
      original._retry = true;
      try {
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("No token");
        original.headers = {
          ...(original.headers || {}),
          Authorization: `Bearer ${newToken}`,
        };
        return api(original);
      } catch {
        clearTokens();
        // Let app route guard redirect to /sign-in
      }
    }

    return Promise.reject({ ...error, unifiedMessage: message });
  }
);

async function refreshAccessToken(): Promise<string | null> {
  const r = getRefreshToken();
  if (!r) return null;

  if (isRefreshing) return new Promise((resolve) => pending.push(resolve));
  isRefreshing = true;
  try {
    const { data } = await axios.post(
      `${
        process.env.NEXT_PUBLIC_API_URL || "https://api.your-backend.com"
      }/auth/refresh`,
      { refreshToken: r },
      { withCredentials: true }
    );
    const token = data?.accessToken as string;
    if (token) {
      setAccessToken(token);
      pending.forEach((fn) => fn(token));
      pending = [];
      return token;
    }
    return null;
  } finally {
    isRefreshing = false;
  }
}

export default api;
