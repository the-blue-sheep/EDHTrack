
import { createContext } from "react";
import type {LoginResponse} from "./useAuth.ts";

export interface AuthContextType {
    user: LoginResponse  | null;
    login: (user: LoginResponse) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
