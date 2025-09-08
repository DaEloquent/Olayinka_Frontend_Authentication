"use client";


import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import {
  clearTokens,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from "../lib/auth-client";

export type User = { id: string; email: string; username?: string };

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signUp: (payload: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => void;
  fetchMe: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Persist auth across refresh: try to fetch profile if token exists
    const token = getAccessToken();
    if (!token) return setLoading(false);
    fetchMe().finally(() => setLoading(false));
  }, []);

  async function fetchMe() {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      setError(null);
    } catch (e: unknown) {
      setUser(null);
      if (typeof e === "object" && e !== null && "unifiedMessage" in e) {
        setError(
          (e as { unifiedMessage?: string }).unifiedMessage ||
            "Failed to load user"
        );
      } else {
        setError("Failed to load user");
      }
    }
  }

  async function signIn(payload: { email: string; password: string }) {
    setError(null);
    try {
      const { data } = await api.post("/auth/login", payload);
      if (data?.accessToken) setAccessToken(data.accessToken);
      if (data?.refreshToken) setRefreshToken(data.refreshToken);
      await fetchMe();
      router.push("/");
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "unifiedMessage" in e) {
        setError(
          (e as { unifiedMessage?: string }).unifiedMessage || "Sign-in failed"
        );
      } else {
        setError("Sign-in failed");
      }
      throw e;
    }
  }

  async function signUp(payload: {
    username: string;
    email: string;
    password: string;
  }) {
    setError(null);
    try {
      await api.post("/auth/register", payload);
      // Backend should send email verification link
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "unifiedMessage" in e) {
        setError(
          (e as { unifiedMessage?: string }).unifiedMessage || "Sign-up failed"
        );
      } else {
        setError("Sign-up failed");
      }
      throw e;
    }
  }

  function signOut() {
    clearTokens();
    setUser(null);
    router.push("/sign-in");
  }

  const value: AuthState = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    fetchMe,
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
