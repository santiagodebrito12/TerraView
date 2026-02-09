import React, { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts'
import Inferences from '../Inferences/Inferences'

// --- Data ---

const trendData = [
  { mes: 'Ene', inspecciones: 42, fallas: 12 },
  { mes: 'Feb', inspecciones: 38, fallas: 10 },
  { mes: 'Mar', inspecciones: 55, fallas: 15 },
  { mes: 'Abr', inspecciones: 48, fallas: 11 },
  { mes: 'May', inspecciones: 62, fallas: 18 },
  { mes: 'Jun', inspecciones: 58, fallas: 14 },
  { mes: 'Jul', inspecciones: 70, fallas: 20 },
  { mes: 'Ago', inspecciones: 65, fallas: 16 },
  { mes: 'Sep', inspecciones: 72, fallas: 19 },
  { mes: 'Oct', inspecciones: 80, fallas: 22 },
  { mes: 'Nov', inspecciones: 75, fallas: 17 },
  { mes: 'Dic', inspecciones: 128, fallas: 34 },
]

const faultDistribution = [
  { name: 'Corrosión', value: 32 },
  { name: 'Fugas', value: 24 },
  { name: 'Vibración Anormal', value: 18 },
  { name: 'Desgaste Mecánico', value: 15 },
  { name: 'Anomalía Térmica', value: 11 },
]

const PIE_COLORS = ['#234451', '#ff9443', '#38bdf8', '#f87171', '#a78bfa']

const assetStatusData = [
  { activo: 'Pozo P-44', operativo: 80, mantenimiento: 15, fueraServicio: 5 },
  { activo: 'Pozo P-12', operativo: 65, mantenimiento: 25, fueraServicio: 10 },
  { activo: 'Oleoducto L-45', operativo: 90, mantenimiento: 8, fueraServicio: 2 },
  { activo: 'Turbina E-102', operativo: 50, mantenimiento: 30, fueraServicio: 20 },
  { activo: 'Batería A-15', operativo: 75, mantenimiento: 20, fueraServicio: 5 },
]

const inspectionsByAsset = [
  { activo: 'P-44', programadas: 30, completadas: 28 },
  { activo: 'P-12', programadas: 25, completadas: 20 },
  { activo: 'L-45', programadas: 22, completadas: 22 },
  { activo: 'E-102', programadas: 28, completadas: 18 },
  { activo: 'A-15', programadas: 23, completadas: 21 },
]

const workOrders = [
  { id: 'OT-1021', activo: 'Turbina E-102', falla: 'Vibración Anormal', prioridad: 'Alta', estado: 'En Progreso', fecha: '2025-01-15' },
  { id: 'OT-1020', activo: 'Pozo P-12', falla: 'Corrosión', prioridad: 'Media', estado: 'Pendiente', fecha: '2025-01-14' },
  { id: 'OT-1019', activo: 'Oleoducto L-45', falla: 'Fugas', prioridad: 'Alta', estado: 'Completada', fecha: '2025-01-13' },
  { id: 'OT-1018', activo: 'Batería A-15', falla: 'Anomalía Térmica', prioridad: 'Baja', estado: 'Pendiente', fecha: '2025-01-12' },
  { id: 'OT-1017', activo: 'Pozo P-44', falla: 'Desgaste Mecánico', prioridad: 'Media', estado: 'Completada', fecha: '2025-01-11' },
]

const kpis = [
  { title: 'Inspecciones Realizadas', value: '128', delta: '+12%', deltaUp: true },
  { title: 'Fallas Detectadas', value: '34', delta: '-8%', deltaUp: false },
  { title: 'Órdenes de Trabajo Abiertas', value: '22', delta: '+5%', deltaUp: true },
  { title: 'Tasa de Resolución', value: '87%', delta: '+3%', deltaUp: false },
]

// --- Components ---

const StatCard = ({ title, value, delta, deltaUp }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-3xl font-bold text-[#234451] mt-1">{value}</p>
    <span className={`text-sm font-semibold mt-2 inline-block ${deltaUp ? 'text-red-500' : 'text-green-500'}`}>
      {delta} vs mes anterior
    </span>
  </div>
)

const priorityColor = {
  Alta: 'bg-red-100 text-red-700',
  Media: 'bg-yellow-100 text-yellow-700',
  Baja: 'bg-green-100 text-green-700',
}

const estadoColor = {
  'En Progreso': 'text-blue-600',
  Pendiente: 'text-yellow-600',
  Completada: 'text-green-600',
}

const renderPieLabel = ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
)

// --- Main ---

const Analytics = () => {
  const [analyticsState, setanalyticsState] = useState('dashboard')

  if (analyticsState !== 'dashboard') {
    return <Inferences analyticsState={analyticsState} setanalyticsState={setanalyticsState} />
  }

  return (
    <div className="w-full m-5 mx-auto p-6">
      {/* Tabs */}
      <div className="flex space-x-6 mb-8 border-b border-gray-200">
        <button
          className="pb-2 text-lg font-bold text-[#234451] border-b-2 border-[#ff9443]"
        >
          Analytics
        </button>
        <button
          className="pb-2 text-lg font-bold text-gray-400 hover:text-gray-600 border-b-2 border-transparent"
          onClick={() => setanalyticsState('fallos')}
        >
          Inferences
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map(k => <StatCard key={k.title} {...k} />)}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Tendencia de Inspecciones y Fallas">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="inspecciones" stroke="#234451" fill="#234451" fillOpacity={0.3} name="Inspecciones" />
              <Area type="monotone" dataKey="fallas" stroke="#ff9443" fill="#ff9443" fillOpacity={0.3} name="Fallas" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribución de Tipos de Falla">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={faultDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={renderPieLabel}
              >
                {faultDistribution.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Estado Operativo de Activos">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assetStatusData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis type="category" dataKey="activo" width={110} />
              <Tooltip />
              <Legend />
              <Bar dataKey="operativo" stackId="a" fill="#22c55e" name="Operativo" />
              <Bar dataKey="mantenimiento" stackId="a" fill="#facc15" name="En Mantenimiento" />
              <Bar dataKey="fueraServicio" stackId="a" fill="#ef4444" name="Fuera de Servicio" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Inspecciones por Activo">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inspectionsByAsset}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="activo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="programadas" fill="#234451" name="Programadas" />
              <Bar dataKey="completadas" fill="#ff9443" name="Completadas" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Work Orders Table */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Últimas Órdenes de Trabajo</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Activo</th>
                <th className="py-3 px-4">Tipo de Falla</th>
                <th className="py-3 px-4">Prioridad</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map(wo => (
                <tr key={wo.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-[#234451]">{wo.id}</td>
                  <td className="py-3 px-4">{wo.activo}</td>
                  <td className="py-3 px-4">{wo.falla}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColor[wo.prioridad]}`}>
                      {wo.prioridad}
                    </span>
                  </td>
                  <td className={`py-3 px-4 font-medium ${estadoColor[wo.estado]}`}>{wo.estado}</td>
                  <td className="py-3 px-4 text-gray-500">{wo.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics
