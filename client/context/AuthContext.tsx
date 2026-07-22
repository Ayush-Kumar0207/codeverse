"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { SharedUser } from "@shared/types/user";
import { fetchProfile, logoutRequest } from "@/services/auth";

type AuthContextType = {
  user: SharedUser | null;
  token: string | null;
  loading: boolean;
  login: (user: SharedUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SESSION_MARKER = "http-only-cookie";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SharedUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    fetchProfile()
      .then(({ user: profile }) => {
        if (!active) return;
        setUser(profile);
        setToken(SESSION_MARKER);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setToken(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = (nextUser: SharedUser) => {
    setUser(nextUser);
    setToken(SESSION_MARKER);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    void logoutRequest();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
