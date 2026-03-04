import React, { useState, useEffect, useCallback } from 'react';

const TERRA_KEY = 'terra-relevamientos';
const loadRelev = () => { try { return JSON.parse(localStorage.getItem(TERRA_KEY) || '[]'); } catch { return []; } };

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const Relevamientos = () => {
  const [activos, setActivos] = useState([]);

  const load = useCallback(() => {
    setActivos(loadRelev().filter(a => a.status === 'aprobado'));
  }, []);

  useEffect(() => {
    load();
    window.addEventListener('storage', load);
    window.addEventListener('focus', load);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('focus', load);
    };
  }, [load]);

  const grouped = activos.reduce((acc, activo) => {
    const key = activo.misionId;
    if (!acc[key]) acc[key] = { misionId: key, misionNombre: activo.misionNombre, client: activo.client, activos: [] };
    acc[key].activos.push(activo);
    return acc;
  }, {});

  const missions = Object.values(grouped);

  if (missions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-8">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Sin relevamientos aprobados</p>
        <p className="text-gray-400 text-sm mt-1">Los relevamientos aprobados por el inspector aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#234451]">Relevamientos aprobados</h1>
        <p className="text-sm text-gray-500 mt-1">{activos.length} {activos.length === 1 ? 'activo aprobado' : 'activos aprobados'} en {missions.length} {missions.length === 1 ? 'misión' : 'misiones'}</p>
      </div>

      <div className="space-y-8">
        {missions.map(mission => (
          <div key={mission.misionId}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 rounded-full bg-[#ff9443]" />
              <div>
                <h2 className="font-bold text-[#234451]">{mission.misionNombre}</h2>
                <p className="text-xs text-gray-400">{mission.client} &middot; {mission.activos.length} {mission.activos.length === 1 ? 'activo' : 'activos'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mission.activos.map((activo, i) => (
                <div key={activo.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-[#234451]/10 to-[#234451]/5 flex items-center justify-center border-b border-gray-100">
                    <div className="text-center">
                      <svg className="w-10 h-10 mx-auto text-[#234451]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                      <p className="text-xs text-gray-400 mt-1">{activo.totalFotos} fotos</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-gray-800 text-sm leading-tight">{activo.nombreActivo}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">✓</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">Aprobado {activo.approvedAt ? formatDate(activo.approvedAt) : ''}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Cartel', count: activo.fotosPorSeccion.cartel },
                        { label: 'Sup.', count: activo.fotosPorSeccion.superior },
                        { label: 'Medio', count: activo.fotosPorSeccion.medio },
                        { label: 'Inf.', count: activo.fotosPorSeccion.inferior },
                      ].map(s => (
                        <span key={s.label} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          {s.label}: {s.count}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Relevamientos;
