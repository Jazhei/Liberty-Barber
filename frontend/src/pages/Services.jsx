import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';

const Services = () => {
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
              <h1 className="text-xl font-bold text-gray-900">Catálogo de Servicios</h1>
            </div>
            <Button variant="primary" className="bg-purple-600 hover:bg-purple-700 shadow-sm rounded-full px-5 text-sm">
              + Nuevo Servicio
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grilla de Servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Tarjeta de Agregar Nuevo (Empty State In-Grid) */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 py-12 hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer min-h-[200px]">
            <span className="text-3xl mb-2 text-purple-400">+</span>
            <span className="font-medium text-purple-600">Crear Servicio</span>
          </div>

          {/* Ejemplo visual de cómo se vería un servicio si existiera
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl">
                ✂️
              </div>
              <button className="text-gray-400 hover:text-gray-600">⋮</button>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Corte Clásico</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">Corte de cabello tradicional con tijera y máquina, incluye lavado.</p>
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
              <span className="font-bold text-gray-900">$15.000</span>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">30 min</span>
            </div>
          </div>
          */}

        </div>
      </main>
    </div>
  );
};

export default Services;
