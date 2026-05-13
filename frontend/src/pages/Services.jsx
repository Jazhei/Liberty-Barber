import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Scissors, X, Loader2 } from "lucide-react";
import Button from "../components/atoms/Button";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const fetchServices = () => {
    fetch("https://liberty-barber.onrender.com/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name,
        description,
        price: parseFloat(price),
        duration_minutes: parseInt(duration),
      };
      const res = await fetch(
        "https://liberty-barber.onrender.com/api/services",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (res.ok) {
        setShowModal(false);
        fetchServices();
        setName("");
        setDescription("");
        setPrice("");
        setDuration("");
      } else {
        alert("Error al guardar");
      }
    } catch (e) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                Catálogo de Servicios
              </h1>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 shadow-sm rounded-full px-5 text-sm"
            >
              <Plus className="w-4 h-4" />
              Nuevo Servicio
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Tarjeta de Agregar Nuevo */}
          <div
            onClick={() => setShowModal(true)}
            className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 py-12 hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer min-h-[200px]"
          >
            <Plus className="w-8 h-8 mb-2 text-purple-400" strokeWidth={1.5} />
            <span className="font-medium text-purple-600">Crear Servicio</span>
          </div>

          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Scissors
                    className="w-5 h-5 text-purple-600"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{svc.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {svc.description}
              </p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                <span className="font-bold text-gray-900">
                  ${svc.price.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {svc.duration_minutes} min
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal Nuevo Servicio */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Crear Servicio
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Servicio
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Corte Degradado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Opcional"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
