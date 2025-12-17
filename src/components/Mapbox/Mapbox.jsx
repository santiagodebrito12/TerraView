import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'; // Estilos
import { Feature } from 'ol';
import { Point, Polygon } from 'ol/geom';
import { Draw, Select, Modify } from 'ol/interaction'; // Interacciones
import VectorLayer from 'ol/layer/Vector'; // Capa para dibujar
import VectorSource from 'ol/source/Vector'; // Fuente de la capa de dibujo
import XYZ from 'ol/source/XYZ'; // Usaremos XYZ para Mapbox también
import { fromLonLat } from 'ol/proj'; // ¡Importante para el buscador!
import 'ol/ol.css';
import './Mapbox.css'
import { coordenadas2 } from '../../utils/ejemplo-cordenadas';

// --- CONFIGURACIÓN DE MAPBOX ---
const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FuZGVicml0bzEyIiwiYSI6ImNtaG1iYW5oNzJic3YyanBxdTJ0MDQya3oifQ.OesuKnFEMDMPSawBZzhNAw';
const mapboxStyleId = 'mapbox.satellite'; 
const mapboxTileUrl = `https://api.mapbox.com/v4/${mapboxStyleId}/{z}/{x}/{y}@2x.png?access_token=${MAPBOX_TOKEN}`;
const coordenadas = [-7602547.489464367, -5741244.559162434];

// --- ESTILOS ---
const styles = {
    'Polygon': new Style({
      stroke: new Stroke({ color: 'rgba(52, 152, 219, 1.0)', width: 3 }),
      fill: new Fill({ color: 'rgba(52, 152, 219, 0.3)' }),
    }),
    'LineString': new Style({
      stroke: new Stroke({ color: 'rgba(231, 76, 60, 1.0)', width: 3 }),
    }),
    'Point': new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: 'rgba(241, 196, 15, 1.0)' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
      }),
    }),
};
  
const selectStyle = new Style({
    stroke: new Stroke({ color: 'rgba(255, 255, 0, 1.0)', width: 4 }),
    fill: new Fill({ color: 'rgba(255, 255, 0, 0.5)' }),
    image: new CircleStyle({
        radius: 8,
        fill: new Fill({ color: 'rgba(255, 255, 0, 1.0)' }),
    }),
});

const MapBox = () => {
  const mapRef = useRef(null);
  const [activeTool, setActiveTool] = useState('navigate');
  const [searchQuery, setSearchQuery] = useState(''); // Estado para el buscador

  const mapInstance = useRef(null);
  const vectorSource = useRef(null);
  const drawInteraction = useRef(null);
  const selectInteraction = useRef(null);
  const modifyInteraction = useRef(null);

  // --- 0. Función de Búsqueda (Geocodificación) ---
  const handleSearch = async (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    if (!searchQuery || !mapInstance.current) return;

    // Llama a la API de Nominatim (OpenStreetMap)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lon = parseFloat(result.lon);
        const lat = parseFloat(result.lat);

        // ¡Importante! Convierte Lon/Lat (EPSG:4326) a la proyección del mapa (EPSG:3857)
        const newCenter = fromLonLat([lon, lat]);

        // Anima el mapa a la nueva ubicación
        mapInstance.current.getView().animate({
          center: newCenter,
          zoom: 14, // Zoom más cercano para el resultado
          duration: 1000,
        });
      } else {
        alert("Lugar no encontrado.");
      }
    } catch (error) {
      console.error("Error en la búsqueda de geocodificación:", error);
      alert("Error al buscar el lugar.");
    }
  };


  // --- 1. Efecto de Montaje del Mapa ---
  useEffect(() => {
    if (mapInstance.current || !MAPBOX_TOKEN.startsWith('pk.')) {
      return;
    }

    vectorSource.current = new VectorSource();

    const drawingLayer = new VectorLayer({
        source: vectorSource.current,
        style: (feature) => styles[feature.getGeometry().getType()],
    });

    const mapboxSatelliteLayer = new TileLayer({
        source: new XYZ({ url: mapboxTileUrl }),
    });
    
   
    selectInteraction.current = new Select({
      style: selectStyle,
    });
    

    modifyInteraction.current = new Modify({
        features: selectInteraction.current.getFeatures(),
    });
   
    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        mapboxSatelliteLayer,
        drawingLayer 
      ],
      view: new View({
        center: coordenadas, // ¡Centrado en tu punto!
        zoom: 10,            // ¡Zoom más cercano!
        projection: 'EPSG:3857',
      }),
    });

    // --- AÑADIR PUNTO INICIAL ---

    coordenadas2.map((asset)=>{
        const {name,type,coordenadas}=asset;  
      if(type=='point'){
          const puntoInicial = new Feature({
            geometry: new Point(coordenadas),
            name: name,
          });
          vectorSource.current.addFeature(puntoInicial);
        }else if(type == 'Polygon'){
          const puntoInicial = new Feature({
            geometry: new Polygon(coordenadas),
            name: name,
          });
          vectorSource.current.addFeature(puntoInicial);
        }

        
    })

    // 1. Crea el "Feature" (el objeto en el mapa)
   
    
    // 2. Aplica el estilo directamente al feature (o deja que la capa lo haga)
    // puntoInicial.setStyle(styles['Point']);
    // 3. Añade el feature a la capa de dibujo
  
    // --- FIN AÑADIR PUNTO INICIAL ---
  
    // 4. Añade las interacciones al mapa
    mapInstance.current.addInteraction(selectInteraction.current);
    mapInstance.current.addInteraction(modifyInteraction.current);

    // Limpieza
    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  }, []); // El array vacío asegura que se ejecute una sola vez


  // --- 2. Efecto de Cambio de Herramienta ---
  useEffect(() => {
    if (!mapInstance.current || !selectInteraction.current || !modifyInteraction.current) return; 

    if (drawInteraction.current) {
      mapInstance.current.removeInteraction(drawInteraction.current);
    }
    selectInteraction.current.setActive(false);
    if (selectInteraction.current.getFeatures()) {
        selectInteraction.current.getFeatures().clear();
    }
    modifyInteraction.current.setActive(false);

    if (activeTool === 'navigate') {
      // No se hace nada, navegación por defecto
    } 
    else if (activeTool === 'delete') {
      selectInteraction.current.setActive(true);
    } 
    else if (activeTool === 'Point' || activeTool === 'LineString' || activeTool === 'Polygon') {
      drawInteraction.current = new Draw({
        source: vectorSource.current,
        type: activeTool,
        style: styles[activeTool],
      });
      
      drawInteraction.current.on('drawend', (event) => {
        const feature = event.feature;
        feature.set('id', new Date().getTime());
        feature.set('assetType', activeTool);
        console.log(feature)
        console.log(`Nuevo ${activeTool} guardado.`);
      });
      
      mapInstance.current.addInteraction(drawInteraction.current);
    }
  }, [activeTool]);

  
  // --- 3. Manejadores de Botones ---
  const handleToolChange = (tool) => {
    setActiveTool(tool);
  };

  const handleDeleteSelected = () => {
    if (activeTool !== 'delete' || !selectInteraction.current) {
      return; 
    }
    
    const selectedFeatures = selectInteraction.current.getFeatures();
    
    if (selectedFeatures.getLength() === 0) {
      alert("No hay nada seleccionado.");
      return;
    }
    
    selectedFeatures.getArray().forEach((feature) => {
      vectorSource.current.removeFeature(feature);
    });
    
    selectedFeatures.clear();
  };


  // --- Renderizado del componente ---
  if (!MAPBOX_TOKEN.startsWith('pk.')) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-red-100 border-2 border-red-500 rounded-lg">
        <p className="text-red-700 font-semibold text-lg">
          Por favor, añade tu Access Token de Mapbox.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />

      {/* --- BARRA DE BÚSQUEDA (NUEVO) --- */}
      <div className="absolute top-4 z-10 contenedor-search-input">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar lugar..."
            className="px-3 py-2 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Buscar
          </button>
        </form>
      </div>
      {/* --- FIN BARRA DE BÚSQUEDA --- */}


      {/* Tu barra de controles (ahora conectada a React) */}
      <div className="absolute top-4 right-4 bg-opacity-60 p-2 z-10">
        <div className="flex flex-col gap-2 text-white contenedor-botones">
          <button 
            title="Navegar"
            className={`bg-white p-3 rounded-2xl shadow-md border border-gray- text-gray-800 hover:shadow-lg hover:bg-gray-50 focus:outline-none transition-all ${activeTool === 'navigate' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleToolChange('navigate')}>
           <i className="fa-solid fa-map"></i>
          </button>
          <button
            title="Añadir Punto"
            className={`bg-white p-3 rounded-2xl shadow-md border border-gray- text-gray-800 hover:shadow-lg hover:bg-gray-50 focus:outline-none transition-all ${activeTool === 'Point' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleToolChange('Point')}>
           <i className="fa-solid fa-map-pin"></i>
          </button>
          <button 
            title="Dibujar Línea"
            className={`bg-white p-3 rounded-2xl shadow-md border border-gray- text-gray-800 hover:shadow-lg hover:bg-gray-50 focus:outline-none transition-all ${activeTool === 'LineString' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleToolChange('LineString')}>
            <i className="fa-solid fa-pencil"></i>
          </button>
          <button 
            title="Dibujar Polígono"
            className={`bg-white p-3 rounded-2xl shadow-md border border-gray- text-gray-800 hover:shadow-lg hover:bg-gray-50 focus:outline-none transition-all ${activeTool === 'Polygon' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleToolChange('Polygon')}>
            <i className="fa-solid fa-draw-polygon"></i>
          </button>
          <button 
            title="Seleccionar"
            className={`bg-white p-3 rounded-2xl shadow-md border border-gray- text-gray-800 hover:shadow-lg hover:bg-gray-50 focus:outline-none transition-all ${activeTool === 'delete' ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => handleToolChange('delete')}>
            <i className="fa-solid fa-crosshairs"></i>
          </button>
          <button 
            title="Eliminar Seleccionado"
            className="bg-white p-3 rounded-2xl shadow-md border border-gray- text-gray-800 hover:shadow-lg hover:bg-red-500 hover:text-white focus:outline-none transition-all"
            onClick={handleDeleteSelected}>
           <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MapBox;