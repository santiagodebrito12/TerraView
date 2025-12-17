import React, { useState, useMemo } from 'react';

/**
 * Componente: InspectionsOverview
 * Plataforma: Terra Vision
 * Descripción: Muestra dos listas de inspecciones (Próximas y Realizadas)
 * usando Tabs para alternar entre ellas.
 */
const mockInspections = [
  {
    id: '1',
    assetName: 'Turbina E-102',
    inspectionDate: new Date('2025-11-10'),
    status: 'Scheduled',
    technicianName: 'Carlos Méndez',
  },
  {
    id: '2',
    assetName: 'Oleoducto L-45',
    inspectionDate: new Date('2025-10-28'),
    status: 'Completed',
    technicianName: 'Lucía Fernández',
    reportUrl: 'https://terravision.ai/reports/oleoducto-L45',
  },
  {
    id: '3',
    assetName: 'Bateria A-15',
    inspectionDate: new Date('2025-10-28'),
    status: 'Completed',
    technicianName: 'Lucía Fernández',
    reportUrl: 'https://terravision.ai/reports/oleoducto-L45',
  },
  {
    id: '4',
    assetName: 'Bateria A-16',
    inspectionDate: new Date('2025-10-28'),
    status: 'Completed',
    technicianName: 'Lucía Fernández',
    reportUrl: 'https://terravision.ai/reports/oleoducto-L45',
  },
  {
    id: '5',
    assetName: 'Subestación Norte',
    inspectionDate: new Date('2025-11-06'),
    status: 'Scheduled',
    technicianName: 'Juan Pérez',
  },
  {
    id: '6',
    assetName: 'Torre Eólica W-19',
    inspectionDate: new Date('2025-09-12'),
    status: 'Scheduled',
    technicianName: 'Sofía García',
    reportUrl: 'https://terravision.ai/reports/torre-W19',
  },
  {
    id: '7',
    assetName: 'A/B W-193',
    inspectionDate: new Date('2025-09-12'),
    status: 'Scheduled',
    technicianName: 'Sofía García',
    reportUrl: 'https://terravision.ai/reports/torre-W19',
  },
  
];

const InspectionsOverview = () => {
  const [activeTab, setActiveTab] = useState('Scheduled'); // 'Scheduled' | 'Completed'

  // Filtro optimizado de inspecciones próximas
  const upcomingInspections = useMemo(() => {
    return mockInspections
      .filter((i) => i.status === 'Scheduled')
      .sort((a, b) => a.inspectionDate - b.inspectionDate);
  }, [mockInspections]);

  // Filtro optimizado de inspecciones completadas
  const completedInspections = useMemo(() => {
    return mockInspections
      .filter((i) => i.status === 'Completed')
      .sort((a, b) => b.inspectionDate - a.inspectionDate);
  }, [mockInspections]);

  const formatDate = (date) => {
    if (!(date instanceof Date)) return '';
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderInspectionCard = (inspection) => {
    return (
      <div
        key={inspection.id}
        className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition-all"
      >
        <h3 className="text-lg font-semibold text-gray-800">{inspection.assetName}</h3>
        <p className="text-sm text-gray-500">
          Fecha: {formatDate(inspection.inspectionDate)}
        </p>
        {inspection.status === 'Scheduled' && (
          <p className="text-sm text-gray-600">Técnico: {inspection.technicianName}</p>
        )}
        {inspection.status === 'Completed' && (
          <div className="mt-3">
            <a
              href={inspection.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#234451] hover:bg-[#ff9443] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
            >
              Ver Reporte
            </a>
          </div>
        )}
      </div>
    );
  };

  const activeList =
    activeTab === 'Scheduled' ? upcomingInspections : completedInspections;
  const emptyMessage =
    activeTab === 'Scheduled'
      ? 'No hay inspecciones programadas en este momento.'
      : 'No hay inspecciones completadas aún.';

  return (
    <div className="w-full  mx-auto  p-6 rounded-2xl m-5">
      {/* Tabs de navegación */}
      <div className="flex justify-center space-x-6 mb-6 border-b border-gray-300 pb-3">
        <button
          onClick={() => setActiveTab('Scheduled')}
          className={`pb-2 font-medium text-base ${
            activeTab === 'Scheduled'
              ? 'text-[#ff9443] border-b-2 border-[#ff9443]'
              : 'text-gray-500 hover:text-[#ff9443]'
          }`}
        >
          Próximas
        </button>
        <button
          onClick={() => setActiveTab('Completed')}
          className={`pb-2 font-medium text-base ${
            activeTab === 'Completed'
             ? 'text-[#ff9443] border-b-2 border-[#ff9443]'
              : 'text-gray-500 hover:text-[#ff9443]'
          }`}
        >
          Realizadas
        </button>
      </div>

      {/* Listado */}
      {activeList.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {activeList.map((inspection) => renderInspectionCard(inspection))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">{emptyMessage}</div>
      )}
    </div>
  );
};

export default InspectionsOverview;