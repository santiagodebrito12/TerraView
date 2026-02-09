import React, { useState, useMemo } from 'react';
import foto from '../../assets/Pozo-124/DJI_20251206125129_0098_V.jpg';
import foto2 from '../../assets/Pozo-124/DJI_20251206125136_0099_V.jpg';
import foto3 from '../../assets/Pozo-124/DJI_20251206125208_0113_V.jpg';
import foto4 from '../../assets/Pozo-124/DJI_20251206125213_0114_V.jpg';
import foto5 from '../../assets/Pozo-124/DJI_20251206125220_0115_V.jpg';
import foto6 from '../../assets/Pozo-124/DJI_20251206125224_0116_V.jpg';
import foto7 from '../../assets/Pozo-124/DJI_20251206125226_0117_V.jpg';

const mockPhotos = [
  {
    id: 'p1',
    assetId: 'P-44',
    assetName: 'P-44',
    url: foto,
    description: 'Se observa corrosion significativa en la base de la pala 3. Requiere inspeccion detallada.',
    inspectionDate: new Date('2025-12-06T10:30:00'),
  },
  {
    id: 'p2',
    assetId: 'P-44',
    assetName: 'P-44',
    url: foto2,
    description: 'Fuga menor detectada en el sello mecanico principal. Se programo mantenimiento.',
    inspectionDate: new Date('2025-12-06T14:15:00'),
  },
  {
    id: 'p3',
    assetId: 'TP-44',
    assetName: 'TP-44',
    url: foto3,
    description: 'Vibracion normal registrada durante el arranque. Todo en orden.',
    inspectionDate: new Date('2025-11-15T11:00:00'),
  },
  {
    id: 'p4',
    assetId: 'P-44',
    assetName: 'P-44',
    url: foto4,
    description: 'Medicion de nivel de crudo. Sin anomalias.',
    inspectionDate: new Date('2025-11-15T09:00:00'),
  },
  {
    id: 'p5',
    assetId: 'P-44',
    assetName: 'P-44',
    url: foto7,
    description: 'Lectura de presion de salida estable.',
    inspectionDate: new Date('2025-10-28T14:30:00'),
  },
  {
    id: 'p6',
    assetId: 'TP-44',
    assetName: 'TP-44',
    url: foto5,
    description: 'Inspeccion termica de rodamientos. Temperatura dentro de los parametros.',
    inspectionDate: new Date('2025-10-28T11:15:00'),
  },
  {
    id: 'p7',
    assetId: 'P-44',
    assetName: 'P-44',
    url: foto6,
    description: 'Inspeccion de techo flotante. Sin acumulacion de agua.',
    inspectionDate: new Date('2025-09-20T09:45:00'),
  },
];

const Timeline = ({ photos = mockPhotos }) => {
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

  // Group photos by date (same day = same inspection)
  const groupedByDate = useMemo(() => {
    const groups = {};
    filteredPhotos.forEach((photo) => {
      const dateKey = new Date(photo.inspectionDate).toISOString().split('T')[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(photo);
    });
    // Sort keys descending (most recent first)
    const sortedKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));
    return sortedKeys.map((key) => ({
      date: key,
      photos: groups[key],
    }));
  }, [filteredPhotos]);

  const formatDateLong = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Timeline</h1>
        <div>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="block w-full sm:w-64 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white"
          >
            <option value="all">Todos los Activos</option>
            {uniqueAssets.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      {groupedByDate.length > 0 ? (
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: 'var(--blue-principal, #2563eb)' }}
          />

          <div className="space-y-8">
            {groupedByDate.map((group, index) => (
              <div key={group.date} className="relative pl-16">
                {/* Node dot */}
                <div
                  className="absolute left-4 top-1 w-5 h-5 rounded-full border-4 border-white shadow"
                  style={{
                    backgroundColor: index === 0
                      ? 'var(--orange, #f97316)'
                      : 'var(--blue-principal, #2563eb)',
                  }}
                />

                {/* Card */}
                <div className="bg-white rounded-lg shadow-md p-5">
                  {/* Date header */}
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900 capitalize">
                      {formatDateLong(group.date)}
                    </h2>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: 'var(--blue-principal, #2563eb)' }}
                    >
                      {group.photos.length} {group.photos.length === 1 ? 'imagen' : 'imagenes'}
                    </span>
                  </div>

                  {/* Description summary */}
                  <p className="text-sm text-gray-600 mb-4">
                    {group.photos[0].description}
                  </p>

                  {/* Horizontal scrollable thumbnails */}
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {group.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden cursor-pointer group relative"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.description || photo.assetName}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                          {photo.assetName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-600">No hay inspecciones disponibles</p>
          <p className="text-gray-500">No se encontraron inspecciones para el activo seleccionado.</p>
        </div>
      )}

      {/* Lightbox Modal (same pattern as Gallery) */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 transition-opacity duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 p-1 rounded-full text-gray-400 bg-white/30 hover:bg-white/70 hover:text-gray-700 transition"
              aria-label="Cerrar modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-full md:w-2/3 bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.description || selectedPhoto.assetName}
                className="max-w-full max-h-[50vh] md:max-h-[90vh] object-contain"
              />
            </div>

            <div className="w-full md:w-1/3 p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPhoto.assetName}</h2>
              <p className="text-sm text-gray-500 mb-4">
                Inspeccion del {formatDate(selectedPhoto.inspectionDate)}
              </p>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Descripcion:</h4>
              <p className="text-base text-gray-700">
                {selectedPhoto.description || 'No hay descripcion disponible.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
