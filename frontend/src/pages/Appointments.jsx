import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';

const Appointments = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent">
      {/* Navbar Simple */}
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
              <h1 className="text-xl font-bold text-gray-900">Agenda de Citas</h1>
            </div>
            <Button variant="primary" className="shadow-sm rounded-full px-5 text-sm">
              + Nueva Cita
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controles y Filtros */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1 w-full sm:w-auto">
            {['Hoy', 'Semana', 'Mes'].map((tab, i) => (
              <button key={i} className={`px-4 py-1.5 text-sm font-medium rounded-md ${i === 0 ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-auto">
            <input type="date" className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full outline-none" />
          </div>
        </div>

        {/* Contenedor de Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-semibold">Hora</th>
                  <th className="p-4 font-semibold">Cliente</th>
                  <th className="p-4 font-semibold">Servicio</th>
                  <th className="p-4 font-semibold">Barbero</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Ejemplo de fila vacía estilizada */}
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <span className="text-4xl mb-3">📭</span>
                      <p className="text-lg font-medium text-gray-900 mb-1">Sin citas programadas</p>
                      <p className="text-sm">No hay citas para la fecha seleccionada.</p>
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

export default Appointments;
