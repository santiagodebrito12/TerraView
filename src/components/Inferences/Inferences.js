import React from 'react'
import { useState, useMemo } from 'react';
import foto from '../../assets/inference/DJI_20251206125122_0097_V.jpg'
import foto2 from '../../assets/inference/DJI_20251206125129_0098_V.jpg'
import foto3 from '../../assets/inference/DJI_20251206125122_0097_V.jpg'
import foto4 from '../../assets/inference/DJI_20251206125136_0099_V.jpg'
import foto5 from '../../assets/inference/DJI_20251206125230_0118_V.jpg'
import foto6 from '../../assets/inference/DJI_20251206125301_0120_V.jpg'
import foto7 from '../../assets/inference/DJI_20251206125311_0121_V.jpg'

const mockPhotos = [
  {
    id: 'p1',
    assetId: 'P-44',
    assetName: 'Pozo P-44',
    url: foto,
    description: 'Se observa corrosión significativa en la base de la pala 3. Requiere inspección detallada.',
    inspectionDate: new Date('2025-10-28T10:30:00'),
    faultType: 'Corrosión',
    severity: 'Alta',
    confidence: 94,
  },
  {
    id: 'p2',
    assetId: 'P-44',
    assetName: 'Pozo P-44',
    url: foto2,
    description: 'Fuga menor detectada en el sello mecánico principal. Se programó mantenimiento.',
    inspectionDate: new Date('2025-10-27T14:15:00'),
    faultType: 'Fugas',
    severity: 'Media',
    confidence: 87,
  },
  {
    id: 'p3',
    assetId: 'TP-44',
    assetName: 'Turbina E-102',
    url: foto3,
    description: 'Vibración anormal registrada durante el arranque. Requiere monitoreo.',
    inspectionDate: new Date('2025-10-28T11:00:00'),
    faultType: 'Vibración Anormal',
    severity: 'Media',
    confidence: 78,
  },
  {
    id: 'p4',
    assetId: 'P-44',
    assetName: 'Pozo P-44',
    url: foto4,
    description: 'Desgaste mecánico visible en válvula de control. Programar reemplazo.',
    inspectionDate: new Date('2025-10-26T09:00:00'),
    faultType: 'Desgaste Mecánico',
    severity: 'Baja',
    confidence: 91,
  },
  {
    id: 'p5',
    assetId: 'P-44',
    assetName: 'Pozo P-44',
    url: foto7,
    description: 'Anomalía térmica detectada en rodamientos del motor principal.',
    inspectionDate: new Date('2025-10-27T14:30:00'),
    faultType: 'Anomalía Térmica',
    severity: 'Alta',
    confidence: 96,
  },
  {
    id: 'p6',
    assetId: 'L-45',
    assetName: 'Oleoducto L-45',
    url: foto5,
    description: 'Inspección térmica de sección 12. Punto caliente identificado en junta de soldadura.',
    inspectionDate: new Date('2025-10-28T11:15:00'),
    faultType: 'Anomalía Térmica',
    severity: 'Media',
    confidence: 82,
  },
  {
    id: 'p7',
    assetId: 'A-15',
    assetName: 'Batería A-15',
    url: foto6,
    description: 'Corrosión superficial en techo flotante. Monitorear evolución.',
    inspectionDate: new Date('2025-10-26T09:45:00'),
    faultType: 'Corrosión',
    severity: 'Baja',
    confidence: 73,
  },
];

const severityStyles = {
  Alta: 'bg-red-100 text-red-700',
  Media: 'bg-yellow-100 text-yellow-700',
  Baja: 'bg-green-100 text-green-700',
}

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const Inferences = ({ photos = mockPhotos, analyticsState, setanalyticsState }) => {
  const [selectedAsset, setSelectedAsset] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const uniqueAssets = useMemo(() => {
    const assetNames = photos.map((photo) => photo.assetName);
    return [...new Set(assetNames)];
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    if (selectedAsset === 'all') return photos;
    return photos.filter((photo) => photo.assetName === selectedAsset);
  }, [photos, selectedAsset]);

  return (
    <div className="w-full m-5 mx-auto p-6">
      {/* Tabs - matching Analytics */}
      <div className="flex space-x-6 mb-8 border-b border-gray-200">
        <button
          className="pb-2 text-lg font-bold text-gray-400 hover:text-gray-600 border-b-2 border-transparent"
          onClick={() => setanalyticsState && setanalyticsState('dashboard')}
        >
          Analytics
        </button>
        <button
          className="pb-2 text-lg font-bold text-[#234451] border-b-2 border-[#ff9443]"
        >
          Inferences
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Fallas Detectadas</h2>
          <p className="text-sm text-gray-500 mt-1">{filteredPhotos.length} resultado{filteredPhotos.length !== 1 ? 's' : ''}</p>
        </div>
        <select
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
          className="block w-full sm:w-64 rounded-lg border-gray-300 shadow-sm focus:border-[#234451] focus:ring-[#234451] sm:text-sm bg-white px-3 py-2 border"
        >
          <option value="all">Todos los Activos</option>
          {uniqueAssets.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {/* Gallery */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.description || photo.assetName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Severity badge */}
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${severityStyles[photo.severity]}`}>
                  {photo.severity}
                </span>
                {/* Confidence badge */}
                <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {photo.confidence}% conf.
                </span>
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[#234451]">{photo.assetName}</span>
                  <span className="text-xs text-gray-400">{formatDate(photo.inspectionDate)}</span>
                </div>
                <span className="inline-block text-xs font-medium text-[#ff9443] bg-orange-50 px-2 py-0.5 rounded mb-2">
                  {photo.faultType}
                </span>
                <p className="text-sm text-gray-600 line-clamp-2">{photo.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl shadow-sm border border-gray-200">
          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="mt-4 text-lg font-medium text-gray-600">No hay fotos disponibles</p>
          <p className="text-sm text-gray-400">No se encontraron imágenes para el activo seleccionado.</p>
        </div>
      )}

      {/* Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full text-gray-400 bg-white/80 hover:bg-white hover:text-gray-700 transition"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Image */}
            <div className="w-full md:w-2/3 bg-gray-900 flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.description || selectedPhoto.assetName}
                className="max-w-full max-h-[50vh] md:max-h-[90vh] object-contain"
              />
            </div>

            {/* Details panel */}
            <div className="w-full md:w-1/3 p-6 overflow-y-auto">
              <h2 className="text-xl font-bold text-[#234451] mb-1">{selectedPhoto.assetName}</h2>
              <p className="text-sm text-gray-400 mb-4">{formatDate(selectedPhoto.inspectionDate)}</p>

              <div className="flex gap-2 mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${severityStyles[selectedPhoto.severity]}`}>
                  Severidad: {selectedPhoto.severity}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {selectedPhoto.confidence}% confianza
                </span>
              </div>

              <div className="mb-4">
                <span className="inline-block text-xs font-medium text-[#ff9443] bg-orange-50 px-2.5 py-1 rounded-full">
                  {selectedPhoto.faultType}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-gray-700 mb-1">Descripción</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedPhoto.description || 'No hay descripción disponible.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inferences
