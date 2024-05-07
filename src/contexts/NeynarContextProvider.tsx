import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { Theme } from "../enums";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface INeynarContext {
  client_id: string;
  theme: Theme;
  setTheme: SetState<Theme>;
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

  const value = useMemo(() => ({ client_id, theme, setTheme }), [theme]);

  return (
    <NeynarContext.Provider value={value}>{children}</NeynarContext.Provider>
  );
};

export const useNeynar = () => {
  const context = useContext(NeynarContext);
  if (!context) {
    throw new Error("useNeynar must be used within a NeynarContextProvider");
  }
  return context;
};
