import React, { useState } from "react";
import { registerUser } from "./api";

function Register() {
    const [formData, setFormData] = useState({
        registerUserName: "",
        registerEmail: "",
        registerFirstName: "",
        registerLastName: "",
        registerPassword: "",
        registerReTypePassword: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            setSuccess("Регистрация успешна!");
            setError(null);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <input name="registerUserName" placeholder="Имя пользователя" onChange={handleChange} />
                <input name="registerEmail" placeholder="Email" onChange={handleChange} />
                <input name="registerFirstName" placeholder="Имя" onChange={handleChange} />
                <input name="registerLastName" placeholder="Фамилия" onChange={handleChange} />
                <input name="registerPassword" type="password" placeholder="Пароль" onChange={handleChange} />
                <input name="registerReTypePassword" type="password" placeholder="Повторите пароль" onChange={handleChange} />
                <button type="submit">Зарегистрироваться</button>
            </form>
            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Register;
