import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { Theme } from "../enums";
import { INeynarAuthenticatedUser, SetState } from "../types/common";
import { AuthContextProvider } from "./AuthContextProvider";
import { ToastContainer, ToastItem, ToastType } from "../components/Toast";

interface INeynarContext {
  client_id: string;
  theme: Theme;
  setTheme: SetState<Theme>;
  isAuthenticated: boolean;
  showToast: (type: ToastType, message: string) => void;
  user: INeynarAuthenticatedUser | null;
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
  const [toasts, setToasts] = useState<{ type: string; message: string }[]>([]);
  const [user, setUser] = useState<INeynarAuthenticatedUser | null>(null);

  

  const showToast = (type: ToastType, message: string) => {
    const newToast = { type, message };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    setTimeout(() => removeToast(newToast), 5000); // Remove toast after 5 seconds
  };

  const removeToast = (toastToRemove: { type: string; message: string }) => {
    setToasts((prevToasts) =>
      prevToasts.filter((toast) => toast !== toastToRemove)
    );
  };

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
    () => ({ client_id, theme, isAuthenticated, user, setTheme, showToast }),
    [client_id, theme, isAuthenticated]
  );

  const _setIsAuthenticated = (_isAuthenticated: boolean) => {
    setIsAuthenticated(_isAuthenticated);
  };

  const _setUser = (_user: INeynarAuthenticatedUser | null) => {
    setUser(_user);
  };

  return (
    <NeynarContext.Provider value={value}>
      <AuthContextProvider {...{ _setIsAuthenticated, _setUser }}>
        {children}
        <ToastContainer>
          {toasts.map((toast, index) => (
            <ToastItem key={index} type={toast.type}>
              {toast.message}
            </ToastItem>
          ))}
        </ToastContainer>
      </AuthContextProvider>
    </NeynarContext.Provider>
  );
};

export const useNeynarContext = () => {
  const context = useContext(NeynarContext);
  if (!context) {
    throw new Error(
      "useNeynarContext must be used within a NeynarContextProvider"
    );
  }
  return context;
};
