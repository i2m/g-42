import { createContext, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { login, logout, me, type User } from "./Users.api";

interface AuthContextState {
  isAuthenticated: boolean | undefined;
  user: User | undefined;
  login: (params: { username: string; password: string }) => Promise<User>;
  logout: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextState | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context == null) {
    throw new Error(
      "useAuthContext must be used within an AuthContext.Provider",
    );
  }
  return context;
}

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | undefined>(undefined);

  const queryClient = useQueryClient();

  const {
    data: meData,
    isLoading: isLoadingMe,
    isError,
  } = useQuery<User>({
    queryKey: ["me"],
    queryFn: me,
    retry: false,
  });

  const { mutateAsync: loginAsync } = useMutation({
    mutationFn: (params: { username: string; password: string }) => {
      return login(params.username, params.password);
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const { mutateAsync: logoutAsync } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(undefined);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const isAuthenticated = isLoadingMe
    ? undefined
    : !isError && (meData !== undefined || user !== undefined);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: user || meData,
        login: loginAsync,
        logout: logoutAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
