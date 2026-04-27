"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

/* ── Types ── */
export interface AnalysisResult {
  bmi?: number;
  category?: string;
  ai_plan?: {
    goal?: string;
    diet_plan?: string;
    workout_plan?: string;
    timeline?: string[];
  };
  nutrition_feedback?: string[];
  images?: string[];
}

interface AppState {
  isLoggedIn: boolean;
  userEmail: string;
  analysisResult: AnalysisResult | null;
  setLoggedIn: (email: string) => void;
  logout: () => void;
  setAnalysisResult: (data: AnalysisResult) => void;
  clearResult: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

/* ── Provider ── */
export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [analysisResult, setAnalysisResultState] = useState<AnalysisResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem("fitnesslab_email");
      const storedResult = localStorage.getItem("fitnesslab_result");
      if (storedEmail) {
        setIsLoggedIn(true);
        setUserEmail(storedEmail);
      }
      if (storedResult) {
        setAnalysisResultState(JSON.parse(storedResult));
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true);
  }, []);

  const setLoggedIn = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem("fitnesslab_email", email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setAnalysisResultState(null);
    localStorage.removeItem("fitnesslab_email");
    localStorage.removeItem("fitnesslab_result");
  };

  const setAnalysisResult = (data: AnalysisResult) => {
    setAnalysisResultState(data);
    localStorage.setItem("fitnesslab_result", JSON.stringify(data));
  };

  const clearResult = () => {
    setAnalysisResultState(null);
    localStorage.removeItem("fitnesslab_result");
  };

  // Prevent SSR hydration mismatch
  if (!hydrated) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        userEmail,
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

/* ── Hook ── */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
