import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { INeynarAuthenticatedUser, IUser, SetState } from "../types/common";
import { useLocalStorage } from "../hooks";
import { LocalStorageKeys } from "../hooks/use-local-storage-state";
import { useNeynarContext } from "./NeynarContextProvider";

interface IAuthContext {
  isAuthenticated: boolean;
  setIsAuthenticated: SetState<boolean>;
  user: INeynarAuthenticatedUser | null;
  setUser: SetState<INeynarAuthenticatedUser | null>;
  onAuthSuccess: (params: { user: INeynarAuthenticatedUser }) => void;
  onSignout: (user: IUser | undefined) => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export interface AuthContextProviderProps {
  children: ReactNode;
  _setIsAuthenticated: (_isAuthenticated: boolean) => void;
  _setUser: (_user: INeynarAuthenticatedUser | null) => void;
  _onAuthSuccess?: (params: { user: INeynarAuthenticatedUser }) => void;
  _onSignout?: (user: IUser | undefined) => void;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
  _setIsAuthenticated,
  _setUser,
  _onAuthSuccess,
  _onSignout,
}) => {
  const { isAuthenticated: _isAuthenticated } = useNeynarContext();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<INeynarAuthenticatedUser | null>(null);
  const [neynarAuthenticatedUser] = useLocalStorage<INeynarAuthenticatedUser>(
    LocalStorageKeys.NEYNAR_AUTHENTICATED_USER
  );

  useEffect(() => {
    _setIsAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    setIsAuthenticated(_isAuthenticated);
  }, [_isAuthenticated]);

  useEffect(() => {
    if (neynarAuthenticatedUser) {
      setUser(neynarAuthenticatedUser);
      setIsAuthenticated(true);
      onAuthSuccess({ user: neynarAuthenticatedUser });
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    _setUser(user);
  }, [user]);

  const onAuthSuccess = (params: { user: INeynarAuthenticatedUser }) => {
    _onAuthSuccess && _onAuthSuccess(params);
  };

  const onSignout = (user: IUser | undefined) => {
    _onSignout && _onSignout(user);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      setIsAuthenticated,
      setUser,
      onAuthSuccess,
      onSignout,
    }),
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
