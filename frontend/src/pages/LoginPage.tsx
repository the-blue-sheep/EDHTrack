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
    console.log("Ignore this" + props, email, password);
    return (
        <>
            <div>Login Page</div>
            <form onSubmit={doLogin}>
                <label>E-mail:
                    <input onChange={
                        (e) =>
                            setEmail(e.target.value)}
                    placeholder="Enter your email"
                    />
                </label>

                <label>Password:
                    <input onChange={
                        (e) =>
                            setPassword(e.target.value)}
                    placeholder="Enter your password"
                    type="password"
                    />
                </label>
            </form>
            <button onClick={doLogin}>Login</button>
        </>
    )
}
