import React, { useState } from 'react'
import Inferences from '../Inferences/Inferences'
// --- INICIO: Nuevo Componente Analytics ---

/**
 * Icono para "Reportes Realizados"
 */
const ReportIcon = () => (
  <svg className="w-10 h-10 text-[#ff9443]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

/**
 * Icono para "Fallos Detectados"
 */
const WarningIcon = () => (
  <svg className="w-10 h-10 text-[#ff9443]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

/**
 * Icono para "Órdenes de Trabajo"
 */
const OrdersIcon = () => (
  <svg className="w-10 h-10 text-[#ff9443]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.125 1.125 0 0 1 0 2.25H5.625a1.125 1.125 0 0 1 0-2.25Z" />
  </svg>
);


/**
 * Tarjeta de estadística individual
 */
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all flex items-center space-x-4">
    <div className="flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-4xl font-bold text-[#234451]">{value}</p>
    </div>
  </div>
);

/**
 * Gráfico de barras simulado para órdenes mensuales
 */
const MonthlyChart = () => {
  const chartData = [
    { month: 'Ene', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 68 },
    { month: 'Abr', value: 60 },
    { month: 'May', value: 75 },
    { month: 'Jun', value: 80 },
  ];
  const maxVal = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all md:col-span-2 lg:col-span-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Órdenes de Trabajo Mensuales</h3>
      <div className="flex justify-around items-end h-64 space-x-2">
        {chartData.map(item => (
          // --- CORRECCIÓN AQUÍ ---
          // Añadimos "h-full" para que este div tome el 100% de la altura de h-64
          // Añadimos "justify-end" para alinear la barra y la etiqueta al fondo
          <div key={item.month} className="flex flex-col items-center justify-end flex-1 h-full">
            <div
              className="w-full bg-[#234451] hover:bg-[#ff9443] transition-all rounded-t-lg"
              style={{ height: `${(item.value / maxVal) * 100}%` }}
              title={`${item.month}: ${item.value}`}
            >
            </div>
            <p className="text-xs font-medium text-gray-500 mt-2">{item.month}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Componente principal de Analíticas
 */
const Analytics = () => {
  // Datos de prueba para las analíticas
  const [analyticsState,setanalyticsState]= useState('dashboard')
  
  const stats = {
    reportsCompleted: 128,
    failuresDetected: 34,
    workOrders: 22,
  };
  
  if(analyticsState == "dashboard"){
    return (
      <div className="w-full m-5 mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-gray">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Reportes Realizados" value={stats.reportsCompleted} icon={<ReportIcon />} />
          <StatCard title="Fallos Detectados" value={stats.failuresDetected} icon={<WarningIcon />} onClick={()=>{
            setanalyticsState('fallos')
          }}/>
          <StatCard title="Órdenes de Trabajo (Mes)" value={stats.workOrders} icon={<OrdersIcon />} />
          <MonthlyChart />
        </div>
      </div>
    );
  }else{
    return(
      <Inferences/>
    );
  
  }
  
};
// --- FIN: Nuevo Componente Analytics ---


export default Analytics
