import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { Theme } from "../enums";
import { INeynarAuthenticatedUser, IUser, SetState } from "../types/common";
import { AuthContextProvider } from "./AuthContextProvider";
import {
  ToastContainer,
  ToastItem,
  ToastType,
} from "../components/shared/Toast";
import { LocalStorageKeys } from "../hooks/use-local-storage-state";

interface INeynarContext {
  client_id: string;
  theme: Theme;
  setTheme: SetState<Theme>;
  isAuthenticated: boolean;
  showToast: (type: ToastType, message: string) => void;
  user: INeynarAuthenticatedUser | null;
  logoutUser: () => void;
}

const NeynarContext = createContext<INeynarContext | undefined>(undefined);

export interface NeynarContextProviderProps {
  children: ReactNode;
  settings: {
    clientId: string;
    defaultTheme?: Theme;
    eventsCallbacks?: {
      onAuthSuccess?: (params: { user: IUser }) => void;
      onSignout?: (user: IUser | undefined) => void;
    };
  };
}

export const NeynarContextProvider: React.FC<NeynarContextProviderProps> = ({
  children,
  settings: { clientId, defaultTheme = Theme.Light, eventsCallbacks },
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

  const _setIsAuthenticated = (_isAuthenticated: boolean) => {
    setIsAuthenticated(_isAuthenticated);
  };

  const _setUser = (_user: INeynarAuthenticatedUser | null) => {
    setUser(_user);
  };

  const logoutUser = () => {
    if (user) {
      const { signer_uuid, ...rest } = user;
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(LocalStorageKeys.NEYNAR_AUTHENTICATED_USER);
      if (eventsCallbacks?.onSignout) {
        eventsCallbacks.onSignout(rest);
      }
    }
  };

  const value = useMemo(
    () => ({
      client_id,
      theme,
      isAuthenticated,
      user,
      setTheme,
      showToast,
      logoutUser,
    }),
    [client_id, theme, isAuthenticated, user, setTheme, showToast, logoutUser]
  );

  return (
    <NeynarContext.Provider value={value}>
      <AuthContextProvider
        {...{
          _setIsAuthenticated,
          _setUser,
          _onAuthSuccess: eventsCallbacks?.onAuthSuccess,
          _onSignout: eventsCallbacks?.onSignout,
        }}
      >
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
