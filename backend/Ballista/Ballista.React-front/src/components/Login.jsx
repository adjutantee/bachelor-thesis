import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
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
      // Temporarily commented out until API is ready
      // const data = await loginUser(credentials);
      // localStorage.setItem("token", data.token);
      setError(null);
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="loginUserName" className="sr-only">
            Имя пользователя или Email
          </label>
          <input
            id="loginUserName"
            name="loginUserName"
            type="text"
            required
            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Имя пользователя или Email"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="loginPassword" className="sr-only">
            Пароль
          </label>
          <input
            id="loginPassword"
            name="loginPassword"
            type="password"
            required
            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Пароль"
            onChange={handleChange}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          Войти
        </button>
      </div>
    </form>
  );
}

export default Login;