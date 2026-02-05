import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export interface LoginResponse {
    token: string;
    username: string;
    role: "USER" | "SUPERUSER" | "ADMIN";
    playerId?: number;
}


export function useAuth() {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return ctx;
}
