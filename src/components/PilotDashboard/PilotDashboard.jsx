import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import logo from '../../assets/Isologo principal.png';
import { storeImages } from '../../store/imageStore';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockPilotProfile = {
  name: 'Martín Aguirre',
  callsign: 'PILOT-03',
  totalFlightHours: 342,
  inspectionsThisMonth: 8,
};

const mockInspections = [
  {
    id: 'INS-0998',
    assetName: 'Batería A-15',
    client: 'YPF S.A.',
    date: new Date('2025-10-28T08:00:00'),
    location: 'Neuquén, Vaca Muerta - Lote 12',
    coords: { lat: -38.5012, lng: -68.3765 },
    status: 'Completada',
    instructions: 'Inspección de tanques y cañerías. Detección de fugas.',
    requiredImages: 36,
    uploadedImages: 36,
  },
  {
    id: 'INS-0995',
    assetName: 'Torre Eólica W-19',
    client: 'Genneia',
    date: new Date('2025-10-20T09:30:00'),
    location: 'Rawson, Chubut',
    coords: { lat: -43.3002, lng: -65.1023 },
    status: 'Completada',
    instructions: 'Inspección completa de palas y nacelle.',
    requiredImages: 54,
    uploadedImages: 54,
  },
  {
    id: 'INS-0991',
    assetName: 'Oleoducto L-22',
    client: 'Pan American Energy',
    date: new Date('2025-10-10T07:00:00'),
    location: 'Comodoro Rivadavia - Sector 3',
    coords: { lat: -45.8145, lng: -67.5102 },
    status: 'Completada',
    instructions: 'Relevamiento tramo norte 2.8km.',
    requiredImages: 96,
    uploadedImages: 96,
  },
  {
    id: 'INS-1005',
    assetName: 'Tendido electrico',
    client: 'Transpa S.A.',
    date: new Date('2025-11-20T08:00:00'),
    location: 'Comodoro Rivadavia',
    coords: { lat: -34.3850, lng: -58.9020 },
    status: 'Pendiente',
    instructions: 'Relevamiento de tendido eléctrico. Registrar cartel de identificación y fotografiar enganches superior, medio e inferior de cada poste. Presentarse en la Base de Transpa S.A a las 8am',
    requiredImages: 0,
    uploadedImages: 0,
    formType: 'tendido_electrico',
  },
];

// ─── Utility Functions ───────────────────────────────────────────────────────

const formatDate = (date) => {
  if (!(date instanceof Date)) return '';
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTime = (date) => {
  if (!(date instanceof Date)) return '';
  return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
};

const formatDateLong = (date) => {
  if (!(date instanceof Date)) return '';
  return date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const statusColors = {
  'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'En curso': 'bg-blue-100 text-blue-800 border-blue-300',
  'Completada': 'bg-green-100 text-green-800 border-green-300',
};

// ─── Sidebar Navigation Items ────────────────────────────────────────────────

const pilotNavItems = [
  {
    id: 'dashboard',
    label: 'Inicio',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mb-1">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    id: 'inspections',
    label: 'Misiones',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mb-1">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"></path>
        <path d="M9 5a2 2 0 002 2h2a2 2 0 002-2"></path>
        <path d="M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        <line x1="9" y1="12" x2="15" y2="12"></line>
        <line x1="9" y1="16" x2="15" y2="16"></line>
      </svg>
    ),
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, accent }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent ? 'bg-[#ff9443]/10 text-[#ff9443]' : 'bg-[#234451]/10 text-[#234451]'}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium truncate">{label}</p>
      <p className="text-lg font-bold text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

const BadgeStatus = ({ status }) => (
  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusColors[status] || 'bg-gray-100 text-gray-600 border-gray-300'}`}>
    {status}
  </span>
);

const FileUploadPanel = ({ inspection }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleFiles = useCallback((newFiles) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/x-adobe-dng'];
    const validFiles = Array.from(newFiles).filter(f =>
      validTypes.includes(f.type) || /\.(jpg|jpeg|png|tif|tiff|raw|dng)$/i.test(f.name)
    );

    const withPreviews = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }));

    setFiles(prev => [...prev, ...withPreviews]);

    withPreviews.forEach(f => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress(prev => ({ ...prev, [f.id]: Math.min(Math.round(progress), 100) }));
      }, 300);
    });
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const removeFile = (id) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
    setUploadProgress(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const totalUploaded = inspection.uploadedImages + files.filter(f => uploadProgress[f.id] === 100).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#ff9443]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Subida de Imágenes
        </h3>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${totalUploaded >= inspection.requiredImages ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
          {totalUploaded} / {inspection.requiredImages} requeridas
        </span>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-[#ff9443] bg-orange-50' : 'border-gray-300 hover:border-[#ff9443] hover:bg-gray-50'}`}
      >
        <svg className="w-10 h-10 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm text-gray-600 font-medium">Arrastrá imágenes o hacé clic para seleccionar</p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, TIFF, RAW</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.tif,.tiff,.raw,.dng"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {files.map(f => {
            const progress = uploadProgress[f.id] || 0;
            return (
              <div key={f.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                  {progress < 100 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 relative">
                        <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#ffffff33" strokeWidth="3" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="white" strokeWidth="3"
                            strokeDasharray={`${progress * 0.88} 88`} strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">{progress}%</span>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  &times;
                </button>
                <p className="text-[10px] text-gray-500 truncate mt-1">{f.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Pilot Header ────────────────────────────────────────────────────────────

const PilotHeader = () => {
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
          <span className="text-white/70 text-sm font-medium">Portal Piloto</span>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-white"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.4) 0 0 4px 0px' }}
        >
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium leading-tight">{mockPilotProfile.name}</p>
            <p className="text-[10px] text-white/60">{mockPilotProfile.callsign}</p>
          </div>
          <i className="fa-solid fa-user text-white text-lg ml-1"></i>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-[10000]">
            <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
              <p className="text-sm font-semibold text-gray-800">{mockPilotProfile.name}</p>
              <p className="text-xs text-gray-500">{mockPilotProfile.callsign}</p>
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

// ─── Pilot Sidebar ───────────────────────────────────────────────────────────

const PilotSidebar = ({ activeSection, onNavigate }) => (
  <aside className="bg-[#234451] h-full flex flex-col items-center py-5 w-[88px] flex-shrink-0">
    <nav>
      <ul className="flex flex-col items-center space-y-2">
        {pilotNavItems.map(item => (
          <li key={item.id} onClick={() => onNavigate(item.id)}>
            <a
              href="#"
              className={`flex flex-col items-center justify-center w-[72px] h-[72px] rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-[#ff9443]/15 text-[#ff9443]'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
              title={item.label}
              onClick={(e) => e.preventDefault()}
            >
              {item.icon}
              <span className="text-[11px] font-medium">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

// ─── Shared Storage ──────────────────────────────────────────────────────────

const TERRA_KEY = 'terra-relevamientos';
const loadRelev = () => { try { return JSON.parse(localStorage.getItem(TERRA_KEY) || '[]'); } catch { return []; } };
const saveRelev = (arr) => localStorage.setItem(TERRA_KEY, JSON.stringify(arr));

// ─── Structured Upload: Tendido Eléctrico ────────────────────────────────────

const makeFileObj = (file) => ({
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: file.name,
  preview: URL.createObjectURL(file),
});

const ImageUploadField = ({ label, multiple = false, files, onAdd, onRemove }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;
    onAdd(multiple ? selected : [selected[0]]);
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {files.length > 0 && (
          <span className="text-xs text-gray-400">{files.length} {files.length === 1 ? 'foto' : 'fotos'}</span>
        )}
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-[#ff9443] hover:bg-orange-50/40 transition-all"
      >
        <svg className="w-7 h-7 mx-auto mb-1.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-xs text-gray-400">
          {multiple ? 'Seleccionar fotos' : 'Seleccionar foto'}
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept=".jpg,.jpeg,.png,.tif,.tiff,.raw,.dng"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
          {files.map((f) => (
            <div key={f.id} className="relative group aspect-square">
              <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => onRemove(f.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const emptyAssetForm = () => ({
  nombreActivo: '',
  cartel: [],
  superior: [],
  medio: [],
  inferior: [],
});

const AssetStatusBadge = ({ status }) => {
  if (status === 'aprobado') return (
    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />Aprobado
    </span>
  );
  if (status === 'rechazado') return (
    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />Rechazado
    </span>
  );
  return (
    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />Pendiente de aprobación
    </span>
  );
};

const TendidoElectricoUploadForm = ({ inspection }) => {
  const [assets, setAssets] = useState(() =>
    loadRelev()
      .filter(a => a.misionId === inspection.id)
      .map(a => ({ id: a.id, nombreActivo: a.nombreActivo, cartel: [], superior: [], medio: [], inferior: [], status: a.status, fotosPorSeccion: a.fotosPorSeccion }))
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyAssetForm());

  useEffect(() => {
    const sync = () => {
      const stored = loadRelev().filter(a => a.misionId === inspection.id);
      setAssets(prev => prev.map(a => {
        const s = stored.find(s => s.id === a.id);
        return s ? { ...a, status: s.status } : a;
      }));
    };
    window.addEventListener('focus', sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('focus', sync); window.removeEventListener('storage', sync); };
  }, [inspection.id]);

  const addFiles = (field, replace = false) => (newFiles) => {
    const objs = newFiles.map(makeFileObj);
    setForm((prev) => ({ ...prev, [field]: replace ? objs : [...prev[field], ...objs] }));
  };

  const removeFile = (field) => (id) => {
    setForm((prev) => {
      const f = prev[field].find((f) => f.id === id);
      if (f) URL.revokeObjectURL(f.preview);
      return { ...prev, [field]: prev[field].filter((f) => f.id !== id) };
    });
  };

  const handleSave = () => {
    if (!form.nombreActivo.trim()) return;
    const id = `activo-${Date.now()}`;
    const fotosPorSeccion = { cartel: form.cartel.length, superior: form.superior.length, medio: form.medio.length, inferior: form.inferior.length };
    const newAsset = { ...form, id, status: 'pendiente', fotosPorSeccion };
    setAssets(prev => [...prev, newAsset]);
    const stored = loadRelev();
    stored.push({
      id, misionId: inspection.id, misionNombre: inspection.assetName, client: inspection.client,
      nombreActivo: form.nombreActivo, fotosPorSeccion,
      totalFotos: Object.values(fotosPorSeccion).reduce((a, b) => a + b, 0),
      status: 'pendiente', uploadedAt: new Date().toISOString(), approvedAt: null, rejectionNote: null,
    });
    saveRelev(stored);
    storeImages(id, {
      cartel: form.cartel,
      superior: form.superior,
      medio: form.medio,
      inferior: form.inferior,
    });
    setForm(emptyAssetForm());
    setShowForm(false);
  };

  const handleCancel = () => { setForm(emptyAssetForm()); setShowForm(false); };

  const removeAsset = (id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    saveRelev(loadRelev().filter(a => a.id !== id));
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#234451]">Nuevo activo</h3>
          <span className="text-xs text-gray-400">Activo #{assets.length + 1}</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <label className="text-sm font-semibold text-gray-700 block mb-2">Nombre del activo</label>
          <input
            type="text"
            value={form.nombreActivo}
            onChange={(e) => setForm((prev) => ({ ...prev, nombreActivo: e.target.value }))}
            placeholder="Ej: Poste 47 — Tramo Norte"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff9443]/40 focus:border-[#ff9443]"
          />
        </div>

        <ImageUploadField
          label="Cartel de identificación"
          multiple={false}
          files={form.cartel}
          onAdd={addFiles('cartel', true)}
          onRemove={removeFile('cartel')}
        />
        <ImageUploadField
          label="Enganche superior"
          multiple={true}
          files={form.superior}
          onAdd={addFiles('superior')}
          onRemove={removeFile('superior')}
        />
        <ImageUploadField
          label="Enganche medio"
          multiple={true}
          files={form.medio}
          onAdd={addFiles('medio')}
          onRemove={removeFile('medio')}
        />
        <ImageUploadField
          label="Enganche inferior"
          multiple={true}
          files={form.inferior}
          onAdd={addFiles('inferior')}
          onRemove={removeFile('inferior')}
        />

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!form.nombreActivo.trim()}
            className="flex-1 py-2.5 rounded-lg bg-[#234451] text-white text-sm font-medium hover:bg-[#1a3340] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Guardar activo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-[#234451]">Activos relevados</p>
          <p className="text-xs text-gray-400">{assets.length} {assets.length === 1 ? 'activo cargado' : 'activos cargados'}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#ff9443] hover:bg-[#e07830] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agregar activo
        </button>
      </div>

      {assets.length === 0 ? (
        <div
          onClick={() => setShowForm(true)}
          className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-[#ff9443] hover:bg-orange-50/30 transition-all"
        >
          <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-sm font-medium text-gray-400">Agregá el primer activo del relevamiento</p>
          <p className="text-xs text-gray-300 mt-1">Podés cargar todos los activos del día en una sola misión</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assets.map((asset, i) => {
            const totalFotos = asset.fotosPorSeccion
              ? Object.values(asset.fotosPorSeccion).reduce((a, b) => a + b, 0)
              : asset.cartel.length + asset.superior.length + asset.medio.length + asset.inferior.length;
            const thumb = asset.cartel[0] || asset.superior[0] || asset.medio[0] || asset.inferior[0];
            return (
              <div key={asset.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                  {thumb
                    ? <img src={thumb.preview} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                        </svg>
                      </div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{asset.nombreActivo}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    <span>Activo #{i + 1}</span>
                    <span>&middot;</span>
                    <span>{totalFotos} {totalFotos === 1 ? 'foto' : 'fotos'}</span>
                  </div>
                  <div className="mt-1.5">
                    <AssetStatusBadge status={asset.status || 'pendiente'} />
                  </div>
                </div>
                <button
                  onClick={() => removeAsset(asset.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Inspection Detail View ──────────────────────────────────────────────────

const InspectionDetail = ({ inspection, onBack }) => {
  const [showUpload, setShowUpload] = useState(false);

  if (showUpload) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setShowUpload(false)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#ff9443] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la misión
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[#234451] truncate">{inspection.assetName}</h2>
            <p className="text-sm text-gray-500">{inspection.id} &middot; Subida de imágenes</p>
          </div>
        </div>
        {inspection.formType === 'tendido_electrico'
          ? <TendidoElectricoUploadForm inspection={inspection} />
          : <FileUploadPanel inspection={inspection} />
        }
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#ff9443] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-[#234451] truncate">{inspection.assetName}</h2>
            <BadgeStatus status={inspection.status} />
          </div>
          <p className="text-sm text-gray-500">{inspection.id} &middot; {inspection.client}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Fecha y hora</p>
            <p className="font-medium text-gray-800">{formatDateLong(inspection.date)} &middot; {formatTime(inspection.date)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Ubicación</p>
            <p className="font-medium text-gray-800">{inspection.location}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Coordenadas</p>
            <p className="font-mono text-gray-700 text-xs">{inspection.coords.lat.toFixed(4)}, {inspection.coords.lng.toFixed(4)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 bg-[#1a2e3b] h-48 flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #ff944333 0%, transparent 70%)',
          }}></div>
          <div className="text-center z-10">
            <svg className="w-8 h-8 mx-auto mb-2 text-[#ff9443]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <p className="text-gray-400 text-xs font-mono">{inspection.coords.lat.toFixed(4)}, {inspection.coords.lng.toFixed(4)}</p>
            <p className="text-gray-500 text-xs mt-1">{inspection.location}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Instrucciones de vuelo</p>
          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">{inspection.instructions}</p>
        </div>
      </div>

      <button
        onClick={() => setShowUpload(true)}
        className="w-full flex items-center justify-between bg-gradient-to-r from-[#ff9443] to-[#e07830] rounded-xl shadow-md p-5 hover:shadow-lg hover:from-[#e07830] hover:to-[#c96820] active:scale-[0.99] transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-bold text-white text-base">Subir imágenes</p>
            <p className="text-xs text-white/70">{inspection.uploadedImages}/{inspection.requiredImages} imágenes cargadas</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// ─── Section: Dashboard Home ─────────────────────────────────────────────────

const DashboardHome = ({ onSelectInspection }) => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcoming = useMemo(() =>
    mockInspections
      .filter(i => i.status === 'Pendiente' || i.status === 'En curso')
      .sort((a, b) => a.date - b.date),
    []
  );

  const completed = useMemo(() =>
    mockInspections
      .filter(i => i.status === 'Completada')
      .sort((a, b) => b.date - a.date),
    []
  );

  const nextInspection = upcoming[0];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#234451]">Panel de Piloto</h1>
          <p className="text-sm text-gray-500">{mockPilotProfile.callsign} &middot; {mockPilotProfile.name}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDateLong(new Date())}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          label="Este mes"
          value={`${mockPilotProfile.inspectionsThisMonth} inspecciones`}
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Horas de vuelo"
          value={`${mockPilotProfile.totalFlightHours}h`}
          accent
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          label="Pendientes"
          value={upcoming.length}
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          label="Completadas"
          value={completed.length}
          accent
        />
      </div>

      {/* Next Inspection Banner */}
      {nextInspection && (
        <div
          onClick={() => onSelectInspection(nextInspection)}
          className="mb-6 bg-gradient-to-r from-[#234451] to-[#1a3340] rounded-xl p-4 md:p-5 text-white cursor-pointer hover:shadow-lg transition-shadow border border-[#2d5466]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff9443] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-300 uppercase tracking-wide">Próxima misión</p>
                <p className="font-bold text-lg">{nextInspection.assetName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-1.5 text-gray-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(nextInspection.date)} &middot; {formatTime(nextInspection.date)}
              </div>
              <div className="flex items-center gap-1.5 text-gray-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate max-w-[200px]">{nextInspection.location}</span>
              </div>
              <svg className="w-5 h-5 text-[#ff9443] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Inspections List */}
      <div>
          <div className="flex space-x-1 mb-4 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'upcoming' ? 'bg-[#234451] text-white shadow' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Próximas ({upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'completed' ? 'bg-[#234451] text-white shadow' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Realizadas ({completed.length})
            </button>
          </div>

          <div className="space-y-3">
            {(activeTab === 'upcoming' ? upcoming : completed).map(insp => (
              <div
                key={insp.id}
                onClick={() => onSelectInspection(insp)}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md hover:border-[#ff9443]/30 transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{insp.assetName}</h3>
                      <BadgeStatus status={insp.status} />
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{insp.client}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(insp.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate max-w-[150px]">{insp.location}</span>
                    </div>
                    {insp.status !== 'Completada' && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {insp.uploadedImages}/{insp.requiredImages}
                      </div>
                    )}
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}

            {(activeTab === 'upcoming' ? upcoming : completed).length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No hay inspecciones {activeTab === 'upcoming' ? 'pendientes' : 'completadas'}</p>
              </div>
            )}
          </div>
        </div>
    </>
  );
};

// ─── Section: Inspections Full List ──────────────────────────────────────────

const InspectionsSection = ({ onSelectInspection }) => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcoming = useMemo(() =>
    mockInspections
      .filter(i => i.status === 'Pendiente' || i.status === 'En curso')
      .sort((a, b) => a.date - b.date),
    []
  );

  const completed = useMemo(() =>
    mockInspections
      .filter(i => i.status === 'Completada')
      .sort((a, b) => b.date - a.date),
    []
  );

  const activeList = activeTab === 'upcoming' ? upcoming : completed;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#234451]">Mis Misiones</h1>
        <p className="text-sm text-gray-500">Inspecciones asignadas y completadas</p>
      </div>

      <div className="flex space-x-1 mb-5 bg-white rounded-lg border border-gray-200 p-1 shadow-sm max-w-md">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'upcoming' ? 'bg-[#234451] text-white shadow' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          Próximas ({upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'completed' ? 'bg-[#234451] text-white shadow' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          Realizadas ({completed.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeList.map(insp => (
          <div
            key={insp.id}
            onClick={() => onSelectInspection(insp)}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-[#ff9443]/30 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-mono">{insp.id}</span>
              <BadgeStatus status={insp.status} />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">{insp.assetName}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{insp.client}</p>

            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(insp.date)} &middot; {formatTime(insp.date)}
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate max-w-[180px]">{insp.location}</span>
              </div>
            </div>

            {insp.status !== 'Completada' && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Imágenes</span>
                  <span className="font-medium text-gray-600">{insp.uploadedImages}/{insp.requiredImages}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-[#ff9443] transition-all"
                    style={{ width: `${Math.round((insp.uploadedImages / insp.requiredImages) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {activeList.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>No hay misiones {activeTab === 'upcoming' ? 'pendientes' : 'completadas'}</p>
        </div>
      )}
    </>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const PilotDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedInspection, setSelectedInspection] = useState(null);

  const handleSelectInspection = (insp) => {
    setSelectedInspection(insp);
  };

  const handleBack = () => {
    setSelectedInspection(null);
  };

  const renderContent = () => {
    if (selectedInspection) {
      return <InspectionDetail inspection={selectedInspection} onBack={handleBack} />;
    }

    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome onSelectInspection={handleSelectInspection} />;
      case 'inspections':
        return <InspectionsSection onSelectInspection={handleSelectInspection} />;
      default:
        return <DashboardHome onSelectInspection={handleSelectInspection} />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Pilot's own header */}
      <PilotHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Pilot's own sidebar */}
        <PilotSidebar
          activeSection={selectedInspection ? null : activeSection}
          onNavigate={(section) => {
            setSelectedInspection(null);
            setActiveSection(section);
          }}
        />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PilotDashboard;
