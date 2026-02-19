"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/** localStorage에 저장되는 "인증 없이 계속" 상태값 */
export const AUTH_SKIP_VALUE = "__skip__";

interface AuthContextValue {
  token: string | null;
  setToken: (token: string) => void;
  skipAuth: () => void;
  logout: () => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  setToken: () => {},
  skipAuth: () => {},
  logout: () => {},
  isReady: false,
});

const TOKEN_KEY = "auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) setTokenState(stored);
    setIsReady(true);
  }, []);

  const setToken = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setTokenState(newToken);
  }, []);

  const skipAuth = useCallback(() => {
    localStorage.setItem(TOKEN_KEY, AUTH_SKIP_VALUE);
    setTokenState(AUTH_SKIP_VALUE);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setTokenState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, skipAuth, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
