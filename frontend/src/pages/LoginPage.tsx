import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import * as React from "react";
import {useAuth} from "../auth/useAuth.ts";

interface AuthUser {
    username: string;
    role: "USER" | "ADMIN";
    playerId?: number;
}


export default function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { login } = useAuth();

    function doLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        axios.post<AuthUser>("/api/auth/login", {
            username,
            password
        }).then(res => {
            login(res.data);
            navigate("/");
        }).catch(() => {
            alert("Invalid credentials");
        });

    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-purple-800 mb-6">
                Login
            </h2>

            <form onSubmit={doLogin} className="space-y-4">
                <div>
                    <label className="block text-purple-900 font-bold mb-1">
                        Username
                    </label>
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-purple-900 font-bold mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-6 py-2 bg-purple-700 text-white font-semibold rounded-md"
                >
                    Login
                </button>
            </form>
        </div>
    )
}
