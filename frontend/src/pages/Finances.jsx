import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Finances = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Semana'); // 'Día', 'Semana', 'Mes'
  const [sales, setSales] = useState([]);
  const [barbers, setBarbers] = useState([]);
  
  const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b'];

  useEffect(() => {
    fetch('http://localhost:8000/api/users/barbers')
      .then(res => res.json())
      .then(data => setBarbers(data))
      .catch(e => console.error(e));
      
    fetch('http://localhost:8000/api/sales')
      .then(res => res.json())
      .then(data => setSales(data))
      .catch(e => console.error(e));
  }, []);

  // Filter sales based on the selected time frame
  const getFilteredSales = () => {
    const now = new Date();
    return sales.filter(sale => {
      // Fix for timezone issue: Add 'Z' if the DB stripped it, so it's parsed as UTC correctly
      const dateStr = sale.date.endsWith('Z') ? sale.date : sale.date + 'Z';
      const saleDate = new Date(dateStr);
      
      if (filter === 'Día') {
        return saleDate.toDateString() === now.toDateString();
      }
      if (filter === 'Semana') {
        const pastWeek = new Date();
        pastWeek.setDate(now.getDate() - 7);
        return saleDate >= pastWeek; // Removed '<= now' to avoid timezone bugs hiding today's sales
      }
      if (filter === 'Mes') {
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredSales = getFilteredSales();

  // Process data for PieChart (Total per Barber)
  const getPieData = () => {
    const data = barbers.map(barber => {
      const total = filteredSales
        .filter(s => s.barber_id === barber.id)
        .reduce((sum, s) => sum + s.amount, 0);
      return { name: barber.full_name, value: total };
    });
    
    // Add "Solo Productos" (null barber)
    const totalProducts = filteredSales
      .filter(s => s.barber_id === null)
      .reduce((sum, s) => sum + s.amount, 0);
      
    if (totalProducts > 0) {
      data.push({ name: 'Solo Productos', value: totalProducts });
    }
    
    return data.filter(d => d.value > 0);
  };

  // Process data for BarChart (Sales per Day)
  const getBarData = () => {
    // Generate empty days array based on filter
    const daysMap = {};
    const now = new Date();
    
    if (filter === 'Día') {
      daysMap['Hoy'] = {};
    } else if (filter === 'Semana') {
      const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        daysMap[days[d.getDay()]] = {};
      }
    } else if (filter === 'Mes') {
      // Simplified: Just groups by actual date string day
      filteredSales.forEach(s => {
        const dateStr = new Date(s.date).getDate().toString();
        daysMap[dateStr] = daysMap[dateStr] || {};
      });
    }

    // Initialize all barbers + products to 0 for all days
    Object.keys(daysMap).forEach(day => {
      barbers.forEach(b => {
        daysMap[day][b.full_name] = 0;
      });
      daysMap[day]['Solo Productos'] = 0;
    });

    // Populate data
    filteredSales.forEach(sale => {
      const dateStr = sale.date.endsWith('Z') ? sale.date : sale.date + 'Z';
      const date = new Date(dateStr);
      let dayKey = '';
      
      if (filter === 'Día') dayKey = 'Hoy';
      else if (filter === 'Semana') {
        const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        dayKey = days[date.getDay()];
      }
      else if (filter === 'Mes') dayKey = date.getDate().toString();
      
      if (sale.barber_id === null) {
        if (daysMap[dayKey]) {
          daysMap[dayKey]['Solo Productos'] += sale.amount;
        }
      } else {
        const barber = barbers.find(b => b.id === sale.barber_id);
        if (barber && daysMap[dayKey]) {
          daysMap[dayKey][barber.full_name] += sale.amount;
        }
      }
    });

    return Object.keys(daysMap).map(day => {
      return { name: day, ...daysMap[day] };
    });
  };

  const pieData = getPieData();
  const barData = getBarData();

  const handleDownloadExcel = () => {
    // Preparar datos consolidados (todas las ventas de este periodo)
    const dataToExport = filteredSales.map(sale => {
      const dateStr = sale.date.endsWith('Z') ? sale.date : sale.date + 'Z';
      const saleDate = new Date(dateStr);
      
      const barber = barbers.find(b => b.id === sale.barber_id);
      
      return {
        'ID Venta': sale.id,
        'Fecha': saleDate.toLocaleDateString(),
        'Monto ($)': sale.amount,
        'Descripción': sale.description,
        'Barbero / Categoría': barber ? barber.full_name : 'Solo Productos'
      };
    });

    if (dataToExport.length === 0) {
      alert("No hay datos para exportar en este período.");
      return;
    }

    // Crear libro y hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Reporte_${filter}`);
    
    // Generar archivo y descargarlo
    XLSX.writeFile(workbook, `Reporte_Financiero_${filter}_${new Date().getTime()}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">←</button>
              <h1 className="text-xl font-bold text-gray-900">Dashboard Financiero</h1>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1 mr-4">
              {['Día', 'Semana', 'Mes'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button 
              onClick={handleDownloadExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <span>📊</span> Descargar Excel
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Torta */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center animate-fade-in-up">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Ventas por Barbero ({filter})</h2>
            {pieData.length === 0 ? (
              <div className="flex h-80 items-center justify-center text-gray-400">Sin ventas en este período</div>
            ) : (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Gráfico de Barras */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Ingresos por Fecha</h2>
            {barData.length === 0 ? (
               <div className="flex h-80 items-center justify-center text-gray-400">Sin ventas en este período</div>
            ) : (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value >= 1000 ? value / 1000 + 'k' : value}`} />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    {barbers.map((b, index) => (
                      <Bar key={b.id} dataKey={b.full_name} stackId="a" fill={COLORS[index % COLORS.length]} radius={[0, 0, 0, 0]} />
                    ))}
                    <Bar dataKey="Solo Productos" stackId="a" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Finances;
