import React, { useState, useEffect, useCallback, useRef } from 'react';
import logo from '../../assets/Isologo principal.png';
import { getImages } from '../../store/imageStore';

const mockInspectorProfile = {
  name: 'Lucía Fernández',
  role: 'Inspectora de Calidad',
  id: 'INSP-01',
};

const TERRA_KEY = 'terra-relevamientos';
const loadRelev = () => { try { return JSON.parse(localStorage.getItem(TERRA_KEY) || '[]'); } catch { return []; } };
const saveRelev = (arr) => localStorage.setItem(TERRA_KEY, JSON.stringify(arr));

const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
};

const STATUS_CFG = {
  pendiente: { label: 'Pendiente', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  aprobado:  { label: 'Aprobado',  bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  rechazado: { label: 'Rechazado', bg: 'bg-red-100',   text: 'text-red-600',   dot: 'bg-red-500'   },
};

const StatusBadge = ({ status }) => {
  const c = STATUS_CFG[status] || STATUS_CFG.pendiente;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────

const InspectorHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-[60px] bg-[#234451] px-4 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-3">
        <img src={logo} className="w-[54px]" alt="Terra View" />
        <div className="hidden sm:flex items-center gap-2 ml-2">
          <span className="text-white/40 text-sm">|</span>
          <span className="text-white/70 text-sm font-medium">Portal Inspector</span>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-white"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.4) 0 0 4px 0px' }}
        >
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium leading-tight">{mockInspectorProfile.name}</p>
            <p className="text-[10px] text-white/60">{mockInspectorProfile.role}</p>
          </div>
          <i className="fa-solid fa-user text-white text-lg ml-1"></i>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-[10000]">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{mockInspectorProfile.name}</p>
              <p className="text-xs text-gray-500">{mockInspectorProfile.role} &middot; {mockInspectorProfile.id}</p>
            </div>
            <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100">Mi perfil</a>
            <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100">Configuración</a>
            <div className="border-t border-gray-100 my-1"></div>
            <a href="/" className="block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">Cerrar sesión</a>
          </div>
        )}
      </div>
    </header>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar = ({ activeSection, onNavigate, pendingCount }) => {
  const items = [
    {
      id: 'home', label: 'Inicio',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    },
    {
      id: 'missions', label: 'Misiones', badge: pendingCount,
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    },
  ];

  return (
    <aside className="bg-[#234451] flex flex-col items-center py-5 w-[88px] flex-shrink-0">
      <nav>
        <ul className="flex flex-col items-center space-y-2">
          {items.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center justify-center w-[72px] h-[72px] rounded-lg transition-all duration-200 text-center ${activeSection === item.id ? 'bg-[#ff9443]/15 text-[#ff9443]' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
              >
                {item.icon}
                <span className="text-[10px] font-medium mt-1 leading-tight">{item.label}</span>
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#ff9443] rounded-full text-white text-[9px] font-bold flex items-center justify-center px-1">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// ─── Home View ────────────────────────────────────────────────────────────────

const HomeView = ({ activos, onGoMissions }) => {
  const pending  = activos.filter(a => a.status === 'pendiente');
  const approved = activos.filter(a => a.status === 'aprobado');
  const rejected = activos.filter(a => a.status === 'rechazado');

  const grouped = pending.reduce((acc, a) => {
    if (!acc[a.misionId]) acc[a.misionId] = { misionNombre: a.misionNombre, client: a.client, activos: [] };
    acc[a.misionId].activos.push(a);
    return acc;
  }, {});

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#234451]">Panel de Inspector</h1>
        <p className="text-sm text-gray-500">Revisión y aprobación de relevamientos</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-amber-500">{pending.length}</p>
          <p className="text-xs font-semibold text-amber-500 mt-1">Pendientes</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{approved.length}</p>
          <p className="text-xs font-semibold text-green-600 mt-1">Aprobados</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-red-500">{rejected.length}</p>
          <p className="text-xs font-semibold text-red-500 mt-1">Rechazados</p>
        </div>
      </div>

      {pending.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-700">Pendientes de revisión</h2>
            <button onClick={onGoMissions} className="text-sm text-[#ff9443] hover:underline font-medium">Ver todas las misiones →</button>
          </div>
          <div className="space-y-3">
            {Object.values(grouped).map(m => (
              <div key={m.misionNombre} onClick={onGoMissions} className="bg-white rounded-xl border border-amber-200 shadow-sm p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
                <div>
                  <p className="font-semibold text-gray-800">{m.misionNombre}</p>
                  <p className="text-xs text-gray-400">{m.client}</p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-full">
                  {m.activos.length} pendiente{m.activos.length !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-sm font-medium">Todo al día — no hay activos pendientes</p>
        </div>
      )}
    </div>
  );
};

// ─── Mission List View ────────────────────────────────────────────────────────

const MissionListView = ({ activos, onSelectMision }) => {
  const grouped = activos.reduce((acc, a) => {
    if (!acc[a.misionId]) acc[a.misionId] = { misionId: a.misionId, misionNombre: a.misionNombre, client: a.client, activos: [] };
    acc[a.misionId].activos.push(a);
    return acc;
  }, {});

  const missions = Object.values(grouped);

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#234451]">Misiones</h1>
        <p className="text-sm text-gray-500">{missions.length} {missions.length === 1 ? 'misión con activos' : 'misiones con activos'}</p>
      </div>

      {missions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>
          <p className="text-sm font-medium">No hay misiones con activos cargados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map(m => {
            const pending  = m.activos.filter(a => a.status === 'pendiente').length;
            const approved = m.activos.filter(a => a.status === 'aprobado').length;
            const rejected = m.activos.filter(a => a.status === 'rechazado').length;
            return (
              <button
                key={m.misionId}
                onClick={() => onSelectMision(m.misionId)}
                className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between hover:shadow-md hover:border-[#ff9443]/30 transition-all text-left"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{m.misionNombre}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{m.client} &middot; {m.activos.length} activos</p>
                  <div className="flex items-center gap-2 mt-2">
                    {pending  > 0 && <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">{pending} pendiente{pending !== 1 ? 's' : ''}</span>}
                    {approved > 0 && <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">{approved} aprobado{approved !== 1 ? 's' : ''}</span>}
                    {rejected > 0 && <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">{rejected} rechazado{rejected !== 1 ? 's' : ''}</span>}
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Asset List for a Mission ─────────────────────────────────────────────────

const MissionDetailView = ({ misionId, activos, onBack, onSelectActivo }) => {
  const [filter, setFilter] = useState('all');
  const mision = activos[0];
  const filtered = filter === 'all' ? activos : activos.filter(a => a.status === filter);

  const tabs = [
    { key: 'all',       label: 'Todos',      count: activos.length },
    { key: 'pendiente', label: 'Pendientes', count: activos.filter(a => a.status === 'pendiente').length },
    { key: 'aprobado',  label: 'Aprobados',  count: activos.filter(a => a.status === 'aprobado').length },
    { key: 'rechazado', label: 'Rechazados', count: activos.filter(a => a.status === 'rechazado').length },
  ].filter(t => t.count > 0 || t.key === 'all');

  return (
    <div className="p-6 w-full">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#ff9443] transition-colors mb-4">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Misiones
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#234451]">{mision?.misionNombre}</h1>
        <p className="text-sm text-gray-500">{mision?.client} &middot; {activos.length} activos</p>
      </div>

      <div className="flex space-x-1 bg-white rounded-xl border border-gray-200 p-1 shadow-sm mb-5">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${filter === t.key ? 'bg-[#234451] text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((activo, i) => {
          const totalFotos = Object.values(activo.fotosPorSeccion).reduce((a, b) => a + b, 0);
          return (
            <button
              key={activo.id}
              onClick={() => onSelectActivo(activo.id)}
              className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4 hover:shadow-md hover:border-[#ff9443]/30 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 flex-shrink-0 text-sm font-bold text-gray-400">
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{activo.nombreActivo}</p>
                <p className="text-xs text-gray-400 mt-0.5">{totalFotos} fotos &middot; Subido {timeAgo(activo.uploadedAt)}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <StatusBadge status={activo.status} />
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Asset Detail with Images ─────────────────────────────────────────────────

const SECTIONS = [
  { key: 'cartel',   label: 'Cartel de identificación', single: true },
  { key: 'superior', label: 'Enganche superior' },
  { key: 'medio',    label: 'Enganche medio' },
  { key: 'inferior', label: 'Enganche inferior' },
];

const AssetDetailView = ({ activo, onBack, onApprove, onReject }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [lightbox, setLightbox] = useState(null);

  const images = getImages(activo.id);
  const hasImages = images && SECTIONS.some(s => (images[s.key] || []).length > 0);

  return (
    <div className="p-6 w-full">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#ff9443] transition-colors mb-4">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        {activo.misionNombre}
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#234451]">{activo.nombreActivo}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{activo.misionNombre} &middot; Subido {timeAgo(activo.uploadedAt)}</p>
          <div className="mt-2"><StatusBadge status={activo.status} /></div>
        </div>
        {activo.status === 'pendiente' && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold rounded-xl transition-all"
            >
              Rechazar
            </button>
            <button
              onClick={() => onApprove(activo.id)}
              className="px-4 py-2 bg-[#234451] hover:bg-[#ff9443] text-white text-sm font-semibold rounded-xl transition-all"
            >
              Aprobar
            </button>
          </div>
        )}
      </div>

      {/* Rejection note */}
      {activo.rejectionNote && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-red-600 mb-1">Motivo del rechazo</p>
          <p className="text-sm text-red-700">{activo.rejectionNote}</p>
        </div>
      )}

      {/* Image sections */}
      {!hasImages ? (
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          <p className="text-sm font-medium">Las imágenes no están disponibles en esta sesión</p>
          <p className="text-xs mt-1">Las fotos deben ser revisadas en la misma sesión en que el piloto las subió.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SECTIONS.map(s => (
              <span key={s.key} className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-1 rounded-lg">
                {s.label}: {activo.fotosPorSeccion[s.key]} fotos
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {SECTIONS.map(section => {
            const sectionImages = images[section.key] || [];
            if (sectionImages.length === 0) return null;
            return (
              <div key={section.key}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-gray-700">{section.label}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{sectionImages.length} {sectionImages.length === 1 ? 'foto' : 'fotos'}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {sectionImages.map(img => (
                    <button
                      key={img.id}
                      onClick={() => setLightbox(img.preview)}
                      className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-[#ff9443] hover:shadow-md transition-all group"
                    >
                      <img src={img.preview} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer approve/reject (sticky when scrolling) */}
      {activo.status === 'pendiente' && (
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 mt-8 -mx-6 px-6 py-4 flex gap-3">
          <button
            onClick={() => setShowRejectModal(true)}
            className="flex-1 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold rounded-xl transition-all"
          >
            Rechazar activo
          </button>
          <button
            onClick={() => onApprove(activo.id)}
            className="flex-1 py-2.5 bg-[#234451] hover:bg-[#ff9443] text-white text-sm font-semibold rounded-xl transition-all"
          >
            Aprobar activo
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-zoom-out p-4"
        >
          <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
          <button className="absolute top-4 right-4 text-white/70 hover:text-white">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-800 mb-1">Motivo del rechazo</h3>
            <p className="text-sm text-gray-500 mb-3">El piloto verá este mensaje para corregir las imágenes.</p>
            <textarea
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              placeholder="Ej: Faltan fotos del enganche inferior, imagen borrosa..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowRejectModal(false); setRejectNote(''); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => { onReject(activo.id, rejectNote); setShowRejectModal(false); setRejectNote(''); }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all"
              >
                Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InspectorDashboard() {
  const [activos, setActivos] = useState([]);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedMisionId, setSelectedMisionId] = useState(null);
  const [selectedActivoId, setSelectedActivoId] = useState(null);

  const load = useCallback(() => setActivos(loadRelev()), []);

  useEffect(() => {
    load();
    window.addEventListener('storage', load);
    window.addEventListener('focus', load);
    return () => { window.removeEventListener('storage', load); window.removeEventListener('focus', load); };
  }, [load]);

  const handleNavigate = (section) => {
    setActiveSection(section);
    setSelectedMisionId(null);
    setSelectedActivoId(null);
  };

  const approve = (id) => {
    const updated = loadRelev().map(a =>
      a.id === id ? { ...a, status: 'aprobado', approvedAt: new Date().toISOString(), rejectionNote: null } : a
    );
    saveRelev(updated);
    setActivos(updated);
    setSelectedActivoId(null);
  };

  const reject = (id, note) => {
    const updated = loadRelev().map(a =>
      a.id === id ? { ...a, status: 'rechazado', approvedAt: null, rejectionNote: note || 'Imágenes insuficientes o de baja calidad.' } : a
    );
    saveRelev(updated);
    setActivos(updated);
    setSelectedActivoId(null);
  };

  const pendingCount = activos.filter(a => a.status === 'pendiente').length;
  const misionActivos = activos.filter(a => a.misionId === selectedMisionId);
  const selectedActivo = activos.find(a => a.id === selectedActivoId);

  const renderContent = () => {
    if (activeSection === 'missions') {
      if (selectedActivoId && selectedActivo) {
        return <AssetDetailView activo={selectedActivo} onBack={() => setSelectedActivoId(null)} onApprove={approve} onReject={reject} />;
      }
      if (selectedMisionId) {
        return <MissionDetailView misionId={selectedMisionId} activos={misionActivos} onBack={() => setSelectedMisionId(null)} onSelectActivo={setSelectedActivoId} />;
      }
      return <MissionListView activos={activos} onSelectMision={setSelectedMisionId} />;
    }
    return <HomeView activos={activos} onGoMissions={() => handleNavigate('missions')} />;
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <InspectorHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeSection={activeSection} onNavigate={handleNavigate} pendingCount={pendingCount} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
