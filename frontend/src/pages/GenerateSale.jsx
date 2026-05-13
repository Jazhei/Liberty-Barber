import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/atoms/Button";

const GenerateSale = () => {
  const navigate = useNavigate();

  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [appointmentId, setAppointmentId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({}); // { id: quantity }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://liberty-barber.onrender.com/api/users/barbers")
      .then((res) => res.json())
      .then((data) => setBarbers(data));
    fetch("https://liberty-barber.onrender.com/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data));
    fetch("https://liberty-barber.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
    fetch("https://liberty-barber.onrender.com/api/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data));
  }, []);

  const handleAppointmentChange = (e) => {
    const id = e.target.value;
    setAppointmentId(id);

    if (id) {
      const app = appointments.find((a) => a.id === parseInt(id));
      if (app) {
        setBarberId(app.barber_id.toString());
      }
    }
  };

  const handleServiceToggle = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((sId) => sId !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleProductQuantity = (id, increment) => {
    const current = selectedProducts[id] || 0;
    const next = current + increment;
    if (next < 0) return;

    setSelectedProducts({
      ...selectedProducts,
      [id]: next,
    });
  };

  const calculateTotal = () => {
    let total = 0;
    selectedServices.forEach((id) => {
      const svc = services.find((s) => s.id === id);
      if (svc) total += svc.price;
    });

    Object.keys(selectedProducts).forEach((id) => {
      const prod = products.find((p) => p.id === parseInt(id));
      if (prod) total += prod.price * selectedProducts[id];
    });

    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = calculateTotal();
    if (total === 0) {
      alert("Debes seleccionar al menos un servicio o producto");
      return;
    }
    if (selectedServices.length > 0 && !barberId) {
      alert("Selecciona un barbero para los servicios realizados");
      return;
    }

    // Generar descripción combinada
    const descParts = [];
    selectedServices.forEach((id) =>
      descParts.push(services.find((s) => s.id === id)?.name),
    );
    Object.keys(selectedProducts).forEach((id) => {
      const prod = products.find((p) => p.id === parseInt(id));
      if (prod && selectedProducts[id] > 0) {
        descParts.push(`${selectedProducts[id]}x ${prod.name}`);
      }
    });

    const payload = {
      amount: total,
      description: descParts.join(" + ") || "Venta de productos",
      date: new Date().toISOString(),
      barber_id: barberId ? parseInt(barberId) : null,
    };

    let url = "https://liberty-barber.onrender.com/api/sales";
    if (appointmentId) {
      url += `?appointment_id=${appointmentId}`;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert(`Venta exitosa registrada por $${total.toLocaleString()}`);
        navigate("/dashboard");
      } else {
        alert("Error al registrar la venta");
      }
    } catch (e) {
      alert("Error de conexión");
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
                ←
              </button>
              <h1 className="text-xl font-bold text-gray-900">Nueva Venta</h1>
            </div>
            <div className="text-xl font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              Total: ${calculateTotal().toLocaleString()}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              ¿El cliente tenía cita? (Opcional)
            </h2>
            <select
              value={appointmentId}
              onChange={handleAppointmentChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">
                -- Selecciona una cita para autocompletar --
              </option>
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.date} {a.time} - {a.client_name} (Barbero: {a.barber_name})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Al seleccionar una cita, se completará el barbero automáticamente.
              Al registrar la venta, la cita se eliminará.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              1. Selecciona al Barbero (Opcional si es solo productos)
            </h2>
            <select
              value={barberId}
              onChange={(e) => setBarberId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">-- Elige un barbero --</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              2. Servicios Realizados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((svc) => (
                <label
                  key={svc.id}
                  className={`flex items-start p-4 border rounded-xl cursor-pointer transition-colors ${selectedServices.includes(svc.id) ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50 border-gray-200"}`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 text-blue-600 rounded"
                    checked={selectedServices.includes(svc.id)}
                    onChange={() => handleServiceToggle(svc.id)}
                  />
                  <div className="ml-3">
                    <span className="block font-bold text-gray-900">
                      {svc.name}
                    </span>
                    <span className="block text-sm text-gray-500">
                      ${svc.price.toLocaleString()}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              3. Productos / Insumos (Opcional)
            </h2>
            <div className="space-y-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50"
                >
                  <div>
                    <span className="font-bold text-gray-900 block">
                      {prod.name}
                    </span>
                    <span className="text-sm text-gray-500 block">
                      ${prod.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleProductQuantity(prod.id, -1)}
                      className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium">
                      {selectedProducts[prod.id] || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleProductQuantity(prod.id, 1)}
                      className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold hover:bg-blue-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 text-xl font-bold shadow-md hover:shadow-lg rounded-xl"
          >
            Confirmar e Ingresar Pago
          </Button>
        </form>
      </main>
    </div>
  );
};

export default GenerateSale;
