import { createContext, useContext } from 'react';

interface AuthContextType {
  isAuth: boolean,
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
}


let AuthContext: React.Context<AuthContextType>;

export function setAuthContext(obj: AuthContextType) {
  AuthContext = createContext(obj);
  return AuthContext;
}

export function useAuth() {
  return useContext(AuthContext);
}
