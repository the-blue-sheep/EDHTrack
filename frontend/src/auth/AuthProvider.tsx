
import {useEffect, useState} from "react";
import { AuthContext } from "./AuthContext";
import type {AuthUser} from "./useAuth";
import * as React from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);

    function login(u: AuthUser) {
        setUser(u);
    }

    function logout() {
        setUser(null);
    }

    useEffect(() => {
        const stored = localStorage.getItem("authUser");
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem("authUser", JSON.stringify(user));
        } else {
            localStorage.removeItem("authUser");
        }
    }, [user]);


    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
