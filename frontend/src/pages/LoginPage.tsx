// src/pages/LoginPage.tsx
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export default function LoginPage(props:Readonly<any>) {
    const login = useNavigate();

    function doLogin() {
        //Login logik
        login("/");
    }

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-purple-800 space-x-6 mb-6">Login Page</h2>
            <form onSubmit={doLogin}>
                <label className="text-purple-900 font-bold mr-2">
                    E-mail:
                </label>
                    <input
                        onChange={
                        (e) =>
                            setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="min-w-[200px] border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mr-4"
                    />

                <label className="text-purple-900 font-bold mr-2">
                    Password:
                </label>
                    <input
                        onChange={
                        (e) =>
                            setPassword(e.target.value)}
                        placeholder="Enter your password"
                        type="password"
                        className="min-w-[200px] border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mr-4"
                    />
                <button
                    onClick={doLogin}
                    className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800"
                >
                    Login
                </button>
            </form>
        </div>
    )
}
