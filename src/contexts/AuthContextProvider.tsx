import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { SetState } from "../types/common";

interface IAuthContext {
  isAuthenticated: boolean;
  setIsAuthenticated: SetState<boolean>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export interface AuthContextProviderProps {
  children: ReactNode;
  _setIsAuthenticated: (_isAuthenticated: boolean) => void;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
  _setIsAuthenticated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    _setIsAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({ isAuthenticated, setIsAuthenticated }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }
  return context;
};
