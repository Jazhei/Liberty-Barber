import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.detail || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md transform transition-all hover:scale-[1.01] animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-3xl text-white">✂️</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Liberty Barber
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="tu@email.com"
            id="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="transition-colors duration-200"
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            id="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="transition-colors duration-200"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center"
          >
            {isLoading ? <span className="animate-spin mr-2">⏳</span> : null}
            {isLoading ? "Iniciando..." : "Iniciar Sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
