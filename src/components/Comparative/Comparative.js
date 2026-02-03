import React, { useState } from 'react';

const Comparative = () => {
  // Estados para manejar las imágenes seleccionadas (puedes conectarlos a tu base de datos luego)
  const [imageLeft, setImageLeft] = useState(null);
  const [imageRight, setImageRight] = useState(null);

  const handleImageUpload = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (side === 'left') setImageLeft(imageUrl);
      else setImageRight(imageUrl);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 p-4 text-white">
      {/* Cabecera del Componente */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-orange-500">Módulo A/B</h2>
          <p className="text-slate-400 text-sm">Comparativa temporal de activos mediante IA</p>
        </div>
        <button 
          onClick={() => { setImageLeft(null); setImageRight(null); }}
          className="bg-slate-700 hover:bg-red-600 transition-colors px-4 py-2 rounded-lg text-sm"
        >
          Limpiar Comparación
        </button>
      </div>

      {/* Cuadrilla de Comparación (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        
        {/* Panel Izquierdo: Estado Anterior / Histórico */}
        <div className="relative border-2 border-dashed border-slate-700 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center">
          {imageLeft ? (
            <>
              <img src={imageLeft} alt="Estado Anterior" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded text-xs">HISTÓRICO (T-1)</div>
            </>
          ) : (
            <label className="cursor-pointer flex flex-col items-center">
              <i className="fa-solid fa-cloud-arrow-up text-4xl mb-2 text-slate-500"></i>
              <span>Cargar Imagen Anterior</span>
              <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'left')} />
            </label>
          )}
        </div>

        {/* Panel Derecho: Estado Actual / Inspección Nueva */}
        <div className="relative border-2 border-dashed border-slate-700 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center">
          {imageRight ? (
            <>
              <img src={imageRight} alt="Estado Actual" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-orange-500/80 px-3 py-1 rounded text-xs font-bold">ACTUAL (T-0)</div>
            </>
          ) : (
            <label className="cursor-pointer flex flex-col items-center">
              <i className="fa-solid fa-cloud-arrow-up text-4xl mb-2 text-slate-500"></i>
              <span>Cargar Imagen Reciente</span>
              <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'right')} />
            </label>
          )}
        </div>

      </div>

      {/* Barra de Herramientas Inferior */}
      <div className="mt-6 p-4 bg-slate-800 rounded-lg flex justify-around items-center border border-slate-700">
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase">Detección de Cambios</p>
          <p className="text-lg font-semibold">--%</p>
        </div>
        <div className="h-8 w-[1px] bg-slate-700"></div>
        <button className="bg-orange-600 hover:bg-orange-500 px-8 py-2 rounded-full font-bold transition-all transform hover:scale-105">
          Ejecutar Análisis IA
        </button>
        <div className="h-8 w-[1px] bg-slate-700"></div>
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase">Anomalías Detectadas</p>
          <p className="text-lg font-semibold text-red-400">0</p>
        </div>
      </div>
    </div>
  );
};

export default Comparative;