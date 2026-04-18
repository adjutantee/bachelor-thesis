import React, { useState } from "react";
import { loginUser } from "./api";

function Login() {
    const [credentials, setCredentials] = useState({
        loginUserName: "",
        loginPassword: "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(credentials);
            localStorage.setItem("token", data.token);
            setError(null);
            alert("Авторизация успешна!");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Авторизация</h2>
            <form onSubmit={handleSubmit}>
                <input name="loginUserName" placeholder="Имя пользователя или Email" onChange={handleChange} />
                <input name="loginPassword" type="password" placeholder="Пароль" onChange={handleChange} />
                <button type="submit">Войти</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Login;
