import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/atoms/Button";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isInsumo, setIsInsumo] = useState("false");

  const fetchProducts = () => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        is_insumo: isInsumo === "true",
      };
      const res = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowModal(false);
        fetchProducts();
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
      } else {
        alert("Error al guardar");
      }
    } catch (e) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 204) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar");
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
              <h1 className="text-xl font-bold text-gray-900">
                Inventario de Productos
              </h1>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-sm rounded-full px-5 text-sm"
            >
              + Agregar Producto
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        {/* Búsqueda */}
        <div className="mb-6 flex">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Buscar productos por nombre..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Tabla Minimalista */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Producto</th>
                  <th className="p-4 font-semibold">Precio Unitario</th>
                  <th className="p-4 font-semibold">Stock Disponible</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <span className="text-4xl mb-3">📦</span>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                          Sin productos
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-500">#{p.id}</td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900">
                          {p.name}
                          <span
                            className={`ml-2 px-1.5 py-0.5 text-xs rounded-md ${p.is_insumo ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}
                          >
                            {p.is_insumo ? "Insumo" : "Producto"}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">{p.description}</p>
                      </td>
                      <td className="p-4 font-medium">
                        ${p.price.toLocaleString()}
                      </td>

                      <td className="p-4 flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-bold ${p.stock > 10 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {p.stock} unid.
                        </span>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-400 hover:text-red-600 transition-colors text-xs font-bold"
                          title="Eliminar producto"
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

      {/* Modal Nuevo Producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Agregar Producto
              </h2>
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
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ej: Cera mate"
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
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={isInsumo}
                  onChange={(e) => setIsInsumo(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="false">Producto</option>
                  <option value="true">Insumo</option>
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
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
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

export default Products;
