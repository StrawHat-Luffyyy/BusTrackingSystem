import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const refresh = useCallback(async () => {
    try {
      const res = await authService.me();
      setUser(res.data.data.user);
      return res.data.data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async ({ email, password }) => {
    await authService.login({ email, password });
    const current = await refresh();
    return current;
  }, [refresh]);

  const signup = useCallback(async ({ name, email, password }) => {
    await authService.signup({ name, email, password });
    const current = await refresh();
    return current;
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, loading, login, signup, logout, refresh }),
    [user, isAuthenticated, loading, login, signup, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}

