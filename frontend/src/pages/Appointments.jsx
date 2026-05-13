import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/atoms/Button";

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [barberId, setBarberId] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/appointments");
      if (res.ok) setAppointments(await res.json());
    } catch (e) {
      console.error("Error fetching appointments");
    }
  };

  const fetchUsers = async () => {
    try {
      const bRes = await fetch("http://localhost:8000/api/users/barbers");
      if (bRes.ok) setBarbers(await bRes.json());
    } catch (e) {
      console.error("Error fetching users");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        date,
        time: time + ":00",
        client_name: clientName,
        barber_id: parseInt(barberId),
      };

      const res = await fetch("http://localhost:8000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchAppointments();
      } else {
        alert("Error al crear la cita");
      }
    } catch (e) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta cita?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/appointments/${id}`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 204) {
        setAppointments((prev) => prev.filter((app) => app.id !== id));
      } else {
        alert("Error al eliminar");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Navbar Simple */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              >
                ←
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                Agenda de Citas
              </h1>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              className="shadow-sm rounded-full px-5 text-sm"
            >
              + Nueva Cita
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        {/* Contenedor de Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-semibold">Fecha</th>
                  <th className="p-4 font-semibold">Hora</th>
                  <th className="p-4 font-semibold">Cliente</th>
                  <th className="p-4 font-semibold">Barbero</th>
                  <th className="p-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <span className="text-4xl mb-3">📭</span>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                          Sin citas programadas
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  appointments.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="p-4">{app.date}</td>
                      <td className="p-4">{app.time.slice(0, 5)}</td>
                      <td className="p-4 font-medium">{app.client_name}</td>
                      <td className="p-4">{app.barber_name}</td>
                      <td className="p-4">
                        <span className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs">
                          {app.status === "pending" ? "Pendiente" : app.status}
                        </span>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-red-400 hover:text-red-600 transition-colors text-xs font-bold"
                          title="Eliminar cita"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Nueva Cita */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Agendar Cita</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Barbero
                </label>
                <select
                  required
                  value={barberId}
                  onChange={(e) => setBarberId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un barbero</option>
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="w-full">
                  {loading ? "Guardando..." : "Agendar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
