
import { createContext } from "react";
import type {AuthUser} from "./useAuth.ts";

export interface AuthContextType {
    user: AuthUser  | null;
    login: (user: AuthUser) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
