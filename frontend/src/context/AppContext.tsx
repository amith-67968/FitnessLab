"use client";

import React, { createContext, useContext, useState, useSyncExternalStore, ReactNode } from "react";
import type { AnalyzeResponse } from "@/services/api";

interface StoredState {
  isLoggedIn: boolean;
  userEmail: string;
  accessToken: string;
  analysisResult: AnalyzeResponse | null;
}

interface AppState {
  isLoggedIn: boolean;
  userEmail: string;
  accessToken: string;
  analysisResult: AnalyzeResponse | null;
  setLoggedIn: (email: string, token: string) => void;
  logout: () => void;
  setAnalysisResult: (data: AnalyzeResponse) => void;
  clearResult: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

function readStoredState(): StoredState {
  if (typeof window === "undefined") {
    return {
      isLoggedIn: false,
      userEmail: "",
      accessToken: "",
      analysisResult: null,
    };
  }

  const storedEmail = localStorage.getItem("fitnesslab_email") || "";
  const storedToken = localStorage.getItem("fitnesslab_token") || "";
  const storedResult = localStorage.getItem("fitnesslab_result");
  let analysisResult: AnalyzeResponse | null = null;

  if (storedResult) {
    try {
      analysisResult = JSON.parse(storedResult);
    } catch {
      localStorage.removeItem("fitnesslab_result");
    }
  }

  return {
    isLoggedIn: Boolean(storedEmail && storedToken),
    userEmail: storedEmail,
    accessToken: storedToken,
    analysisResult,
  };
}

function subscribeToHydration() {
  return () => {};
}

export function AppProvider({ children }: { children: ReactNode }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => readStoredState().isLoggedIn);
  const [userEmail, setUserEmail] = useState(() => readStoredState().userEmail);
  const [accessToken, setAccessToken] = useState(() => readStoredState().accessToken);
  const [analysisResult, setAnalysisResultState] = useState<AnalyzeResponse | null>(
    () => readStoredState().analysisResult
  );

  const setLoggedIn = (email: string, token: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setAccessToken(token);
    localStorage.setItem("fitnesslab_email", email);
    localStorage.setItem("fitnesslab_token", token);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setAccessToken("");
    setAnalysisResultState(null);
    localStorage.removeItem("fitnesslab_email");
    localStorage.removeItem("fitnesslab_token");
    localStorage.removeItem("fitnesslab_result");
  };

  const setAnalysisResult = (data: AnalyzeResponse) => {
    setAnalysisResultState(data);
    localStorage.setItem("fitnesslab_result", JSON.stringify(data));
  };

  const clearResult = () => {
    setAnalysisResultState(null);
    localStorage.removeItem("fitnesslab_result");
  };

  if (!hydrated) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        userEmail,
        accessToken,
        analysisResult,
        setLoggedIn,
        logout,
        setAnalysisResult,
        clearResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
