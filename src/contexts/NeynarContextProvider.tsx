import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { Theme } from "../enums";
import { SetState } from "../types/common";
import { AuthContextProvider } from "./AuthContextProvider";

interface INeynarContext {
  client_id: string;
  theme: Theme;
  setTheme: SetState<Theme>;
  isAuthenticated: boolean;
}

const NeynarContext = createContext<INeynarContext | undefined>(undefined);

export interface NeynarContextProviderProps {
  children: ReactNode;
  clientId: string;
  defaultTheme?: Theme;
}

export const NeynarContextProvider: React.FC<NeynarContextProviderProps> = ({
  children,
  clientId,
  defaultTheme = Theme.Light,
}) => {
  const [client_id] = useState<string>(clientId);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = document.querySelector(":root");
    if (root) {
      if (theme === "dark") {
        root.classList.add("theme-dark");
        root.classList.remove("theme-light");
      } else {
        root.classList.add("theme-light");
        root.classList.remove("theme-dark");
      }
    }
  }, [theme]);

  const value = useMemo(
    () => ({ client_id, theme, isAuthenticated, setTheme }),
    [client_id, theme, isAuthenticated]
  );

  const _setIsAuthenticated = (_isAuthenticated: boolean) => {
    setIsAuthenticated(_isAuthenticated);
  };

  return (
    <NeynarContext.Provider value={value}>
      <AuthContextProvider {...{ _setIsAuthenticated }}>
        {children}
      </AuthContextProvider>
    </NeynarContext.Provider>
  );
};

export const useNeynar = () => {
  const context = useContext(NeynarContext);
  if (!context) {
    throw new Error("useNeynar must be used within a NeynarContextProvider");
  }
  return context;
};
