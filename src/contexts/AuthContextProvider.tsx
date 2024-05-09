import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { INeynarAuthenticatedUser, SetState } from "../types/common";
import { useLocalStorage } from "../hooks";

interface IAuthContext {
  isAuthenticated: boolean;
  setIsAuthenticated: SetState<boolean>;
  user: INeynarAuthenticatedUser | null;
  setUser: SetState<INeynarAuthenticatedUser | null>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export interface AuthContextProviderProps {
  children: ReactNode;
  _setIsAuthenticated: (_isAuthenticated: boolean) => void;
  _setUser: (_user: INeynarAuthenticatedUser | null) => void;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
  _setIsAuthenticated,
  _setUser,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<INeynarAuthenticatedUser | null>(null);
  const [neynarAuthenticatedUser] = useLocalStorage<INeynarAuthenticatedUser>(
    "neynar_authenticated_user"
  );

  useEffect(() => {
    _setIsAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (neynarAuthenticatedUser) {
      setUser(neynarAuthenticatedUser);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    _setUser(user);
  }, [user]);

  const value = useMemo(
    () => ({ isAuthenticated, user, setIsAuthenticated, setUser }),
    [isAuthenticated, user]
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
