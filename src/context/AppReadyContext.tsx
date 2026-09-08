"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AppReadyContextValue {
  isAppReady: boolean;
  setAppReady: () => void;
}

const AppReadyContext = createContext<AppReadyContextValue | null>(null);

export function AppReadyProvider({ children }: { children: ReactNode }) {
  const [isAppReady, setIsAppReady] = useState(false);
  const setAppReady = useCallback(() => setIsAppReady(true), []);

  const value = useMemo(
    () => ({ isAppReady, setAppReady }),
    [isAppReady, setAppReady]
  );

  return (
    <AppReadyContext.Provider value={value}>{children}</AppReadyContext.Provider>
  );
}

export function useAppReady() {
  const context = useContext(AppReadyContext);
  if (!context) {
    throw new Error("useAppReady must be used within AppReadyProvider");
  }
  return context;
}
