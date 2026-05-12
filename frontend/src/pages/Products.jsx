import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';

const Products = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              >
                ←
              </button>
              <h1 className="text-xl font-bold text-gray-900">Inventario de Productos</h1>
            </div>
            <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 shadow-sm rounded-full px-5 text-sm">
              + Agregar Producto
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Búsqueda */}
        <div className="mb-6 flex">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Buscar productos por nombre o ID..." 
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
                  <th className="p-4 font-semibold">Producto</th>
                  <th className="p-4 font-semibold">Precio Unitario</th>
                  <th className="p-4 font-semibold">Stock Disponible</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Ejemplo vacío */}
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <span className="text-4xl mb-3">📦</span>
                      <p className="text-lg font-medium text-gray-900 mb-1">Sin productos</p>
                      <p className="text-sm">Agrega tu primer producto al inventario para comenzar.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
