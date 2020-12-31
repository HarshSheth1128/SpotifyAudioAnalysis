import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuth: boolean,
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
}

let AuthContext: React.Context<AuthContextType>;

export function useCreateAuthContext() {
  const isAuthDefault = JSON.parse(localStorage.getItem('isAuth') || 'false');
  const [isAuth, setIsAuth] = useState(isAuthDefault);
  const defaultVal = {
    isAuth,
    setIsAuth
  };
  AuthContext = createContext(defaultVal);
  return [AuthContext, defaultVal] as [typeof AuthContext, typeof defaultVal];
};

export function useAuth() {
  return useContext(AuthContext);
}
