import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Scissors,
  CreditCard,
  BarChart2,
  CalendarDays,
  Package,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import Button from "../components/atoms/Button";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuOptions = [
    {
      title: "Generar Venta",
      icon: CreditCard,
      description: "Registrar un nuevo pago",
      color:
        "bg-yellow-50 text-yellow-600 border-yellow-100 hover:border-yellow-300",
      iconColor: "text-yellow-500",
      path: "/sales/new",
    },
    {
      title: "Finanzas",
      icon: BarChart2,
      description: "Dashboard y estadísticas",
      color:
        "bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-300",
      iconColor: "text-indigo-500",
      path: "/finances",
    },
    {
      title: "Gestión de Citas",
      icon: CalendarDays,
      description: "Visualiza y administra la agenda",
      color: "bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300",
      iconColor: "text-blue-500",
      path: "/appointments",
    },
    {
      title: "Stock de Productos",
      icon: Package,
      description: "Control de inventario y ventas",
      color:
        "bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300",
      iconColor: "text-emerald-500",
      path: "/products",
    },
    {
      title: "Servicios",
      icon: Scissors,
      description: "Cortes, coloración, perfilado",
      color:
        "bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-300",
      iconColor: "text-purple-500",
      path: "/services",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <Scissors className="w-6 h-6 text-gray-800" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                Liberty Barber
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {user.full_name || "Admin"}
              </div>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm py-1.5 px-4 rounded-full border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 animate-fade-in-up flex items-center gap-3">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              Bienvenido de vuelta
              <Sparkles className="w-7 h-7 text-yellow-400" />
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              ¿Qué te gustaría gestionar hoy en tu barbería?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(option.path)}
                className={`bg-white rounded-2xl shadow-sm border p-6 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${option.color}`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-4 bg-white rounded-xl shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon
                      className={`w-8 h-8 ${option.iconColor}`}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-500 font-medium">
                  {option.description}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
