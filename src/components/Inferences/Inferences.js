import React from 'react'
import { useState,useMemo } from 'react';
import foto from '../../assets/inference/DJI_20251206125122_0097_V.jpg'
import foto2 from '../../assets/inference/DJI_20251206125129_0098_V.jpg'
import foto3 from '../../assets/inference/DJI_20251206125122_0097_V.jpg'
import foto4 from '../../assets/inference/DJI_20251206125136_0099_V.jpg'
import foto5 from '../../assets/inference/DJI_20251206125230_0118_V.jpg'
import foto6 from '../../assets/inference/DJI_20251206125301_0120_V.jpg'
import foto7 from '../../assets/inference/DJI_20251206125311_0121_V.jpg'
// --- Datos de Prueba (Mock Data) ---
// Simula los datos que recibirías como props desde tu API.
const mockPhotos = [
  {
    id: 'p1',
    assetId: 'P-44',
    assetName: 'P-44',
    url: foto,
    description: 'Se observa corrosión significativa en la base de la pala 3. Requiere inspección detallada.',
    inspectionDate: new Date('2025-10-28T10:30:00'),
  },
  {
    id: 'p2',
    assetId: 'P-44',
    assetName: 'P-44',
    url: foto2,
    description: 'Fuga menor detectada en el sello mecánico principal. Se programó mantenimiento.',
    inspectionDate: new Date('2025-10-27T14:15:00'),
  },
  {
    id: 'p3',
    assetId: 'TP-44',
    assetName: 'P-44',
    url: foto3,
    description: 'Vibración normal registrada durante el arranque. Todo en orden.',
    inspectionDate: new Date('2025-10-28T11:00:00'),
  },
  {
    id: 'p4',
    assetId: 'P-44',
    assetName: 'P-44',
    url: foto4,
    description: 'Medición de nivel de crudo. Sin anomalías.',
    inspectionDate: new Date('2025-10-26T09:00:00'),
  },
  {
    id: 'p5',
    assetId: 'P-44',
    assetName: 'P-44',
    url:foto7,
    description: 'Lectura de presión de salida estable.',
    inspectionDate: new Date('2025-10-27T14:30:00'),
  },
  {
    id: 'p6',
    assetId: 'P-44',
    assetName: 'P-44',
    url: foto5,
    description: 'Inspección térmica de rodamientos. Temperatura dentro de los parámetros.',
    inspectionDate: new Date('2025-10-28T11:15:00'),
  },
  {
    id: 'p7',
    assetId: 'P-44',
    assetName: 'P-44',
    url: foto6,
    description: 'Inspección de techo flotante. Sin acumulación de agua.',
    inspectionDate: new Date('2025-10-26T09:45:00'),
  },
];
const Inferences = ({ photos = mockPhotos }) => {
  const [selectedAsset, setSelectedAsset] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // 1. Obtenemos la lista de activos únicos para el dropdown
  const uniqueAssets = useMemo(() => {
    const assetNames = photos.map((photo) => photo.assetName);
    // Usamos Set para obtener solo valores únicos y lo volvemos un array
    return [...new Set(assetNames)];
  }, [photos]);

  // 2. Filtramos las fotos basadas en el activo seleccionado
  const filteredPhotos = useMemo(() => {
    if (selectedAsset === 'all') {
      return photos;
    }
    return photos.filter((photo) => photo.assetName === selectedAsset);
  }, [photos, selectedAsset]);

  // 3. Función helper para formatear la fecha
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
 
 
  return (
    // Contenedor principal con el fondo gris claro, igual que tu pág de Analytics
    <div className="p-6 md:p-8 bg-gray-50 min-h-full">
      {/* Cabecera con Título y Filtro */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Fallas Detectadas</h1>
        
        {/* Filtro Dropdown */}
        <div>
          <label htmlFor="assetFilter" className="block text-sm font-medium text-gray-700 sr-only">
            Filtrar por activo
          </label>
          <select
            id="assetFilter"
            name="assetFilter"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="block w-full sm:w-64 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white"
          >
            <option value="all">Todos los Activos</option>
            {uniqueAssets.map((assetName) => (
              <option key={assetName} value={assetName}>
                {assetName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Galería de Fotos / Estado Vacío */}
      {filteredPhotos.length > 0 ? (
        // Grid Responsivo
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer aspect-w-1 aspect-h-1"
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Imagen */}
              <img
                src={photo.url}
                alt={photo.description || photo.assetName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay en Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-lg truncate">{photo.assetName}</h3>
                <p className="text-gray-200 text-sm">{formatDate(photo.inspectionDate)}</p>
              </div>
              {/* Etiqueta fija (alternativa o complemento al hover) */}
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full group-hover:opacity-0 transition-opacity">
                {photo.assetName}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Estado Vacío
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="mt-4 text-lg font-medium text-gray-600">No hay fotos disponibles</p>
          <p className="text-gray-500">No se encontraron imágenes para el activo seleccionado.</p>
        </div>
      )}

      {/* Modal (Lightbox) */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 transition-opacity duration-300"
          onClick={() => setSelectedPhoto(null)} // Cierra el modal al hacer clic en el fondo
        >
          <div
            className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Evita que el clic en el contenido cierre el modal
          >
            {/* Botón de Cerrar */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 p-1 rounded-full text-gray-400 bg-white/30 hover:bg-white/70 hover:text-gray-700 transition"
              aria-label="Cerrar modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Imagen del Modal */}
            <div className="w-full md:w-2/3 bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.description || selectedPhoto.assetName}
                className="max-w-full max-h-[50vh] md:max-h-[90vh] object-contain"
              />
            </div>

            {/* Información del Modal */}
            <div className="w-full md:w-1/3 p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPhoto.assetName}</h2>
              <p className="text-sm text-gray-500 mb-4">
                Inspección del {formatDate(selectedPhoto.inspectionDate)}
              </p>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Descripción:</h4>
              <p className="text-base text-gray-700">
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
