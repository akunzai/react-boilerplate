import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { UserService } from '../../api';
import { User } from '../../types';

export interface AuthContextValue {
  user: User | undefined;
  loading: boolean;
  setUser: (user: User | undefined) => void;
  login: (email: string, password: string) => Promise<User | undefined>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const defaultContextValue: AuthContextValue = {
  user: undefined,
  loading: false,
  setUser: () => undefined,
  login: async () => undefined,
  logout: () => undefined,
  refreshUser: async () => undefined,
};

export const AuthContext = createContext<AuthContextValue>(defaultContextValue);

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const userService = useMemo(() => new UserService(), []);
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const current = await userService.getMe();
      setUser(current);
    } catch {
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [userService]);

  const login = async (email: string, password: string): Promise<User | undefined> => {
    const loggedUser = await userService.login(email, password);
    if (loggedUser) {
      setUser(loggedUser);
    }
    return loggedUser;
  };

  const logout = (): void => {
    setUser(undefined);
    userService.logout().catch(() => undefined);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
