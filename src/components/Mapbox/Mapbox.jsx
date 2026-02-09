import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { Feature } from 'ol';
import { Point, Polygon } from 'ol/geom';
import { Draw, Select, Modify } from 'ol/interaction';
import Overlay from 'ol/Overlay';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import './Mapbox.css';
import { coordenadas2 } from '../../utils/ejemplo-cordenadas';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FuZGVicml0bzEyIiwiYSI6ImNtaG1iYW5oNzJic3YyanBxdTJ0MDQya3oifQ.OesuKnFEMDMPSawBZzhNAw';
const mapboxStyleId = 'mapbox.satellite';
const mapboxTileUrl = `https://api.mapbox.com/v4/${mapboxStyleId}/{z}/{x}/{y}@2x.png?access_token=${MAPBOX_TOKEN}`;
const defaultCenter = [-7508872.250819117, -5867490.846949427];

const styles = {
    'Polygon': new Style({
      stroke: new Stroke({ color: 'rgba(52, 152, 219, 1.0)', width: 3 }),
      fill: new Fill({ color: 'rgba(52, 152, 219, 0.3)' }),
    }),
    'LineString': new Style({
      stroke: new Stroke({ color: 'rgba(231, 76, 60, 1.0)', width: 3 }),
    }),
};

const getPointStyle = (feature) => {
    const count = feature.get('imageCount') || 0;
    const radius = Math.max(18, 14 + count);
    return new Style({
        image: new CircleStyle({
            radius: radius,
            fill: new Fill({ color: '#ff9443' }),
            stroke: new Stroke({ color: '#fff', width: 2.5 }),
        }),
        text: new Text({
            text: count.toString(),
            font: 'bold 13px sans-serif',
            fill: new Fill({ color: '#fff' }),
            textAlign: 'center',
            textBaseline: 'middle',
        }),
    });
};

const selectStyle = new Style({
    stroke: new Stroke({ color: 'rgba(255, 255, 0, 1.0)', width: 4 }),
    fill: new Fill({ color: 'rgba(255, 255, 0, 0.5)' }),
    image: new CircleStyle({
        radius: 20,
        fill: new Fill({ color: '#234451' }),
        stroke: new Stroke({ color: '#ff9443', width: 3 }),
    }),
});

const MapBox = () => {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const popupCloserRef = useRef(null);
  const [activeTool, setActiveTool] = useState('navigate');
  const [searchQuery, setSearchQuery] = useState('');
  const [popupData, setPopupData] = useState(null);

  const mapInstance = useRef(null);
  const vectorSource = useRef(null);
  const drawInteraction = useRef(null);
  const selectInteraction = useRef(null);
  const modifyInteraction = useRef(null);
  const overlayRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery || !mapInstance.current) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        const newCenter = fromLonLat([parseFloat(result.lon), parseFloat(result.lat)]);
        mapInstance.current.getView().animate({ center: newCenter, zoom: 14, duration: 1000 });
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
    }
  };

  useEffect(() => {
    if (mapInstance.current || !MAPBOX_TOKEN.startsWith('pk.')) return;

    vectorSource.current = new VectorSource();
    const drawingLayer = new VectorLayer({
        source: vectorSource.current,
        style: (feature) => {
            const type = feature.getGeometry().getType();
            return type === 'Point' ? getPointStyle(feature) : styles[type];
        },
    });

    // Popup overlay
    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: true,
      autoPanAnimation: { duration: 250 },
    });
    overlayRef.current = overlay;

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new XYZ({ url: mapboxTileUrl }) }), drawingLayer],
      overlays: [overlay],
      view: new View({ center: defaultCenter, zoom: 13, projection: 'EPSG:3857' }),
    });

    // Click on feature → show popup
    mapInstance.current.on('click', (event) => {
        const feature = mapInstance.current.forEachFeatureAtPixel(event.pixel, (feat) => feat);
        if (feature && feature.getGeometry().getType() === 'Point' && feature.get('name')) {
            const coords = feature.getGeometry().getCoordinates();
            setPopupData({
              name: feature.get('name'),
              imageCount: feature.get('imageCount') || 0,
            });
            overlay.setPosition(coords);
        } else {
            overlay.setPosition(undefined);
            setPopupData(null);
        }
    });

    // Pointer cursor on hover over features
    mapInstance.current.on('pointermove', (e) => {
        const hit = mapInstance.current.hasFeatureAtPixel(e.pixel);
        mapInstance.current.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    coordenadas2.forEach((asset) => {
        const { name, type, coordenadas, imageCount } = asset;
        if (type === 'point') {
          vectorSource.current.addFeature(new Feature({
            geometry: new Point(coordenadas),
            name: name,
            imageCount: imageCount || 0
          }));
        } else if (type === 'Polygon') {
          vectorSource.current.addFeature(new Feature({
            geometry: new Polygon(coordenadas),
            name: name,
          }));
        }
    });

    selectInteraction.current = new Select({ style: selectStyle });
    modifyInteraction.current = new Modify({ features: selectInteraction.current.getFeatures() });
    mapInstance.current.addInteraction(selectInteraction.current);
    mapInstance.current.addInteraction(modifyInteraction.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    if (drawInteraction.current) mapInstance.current.removeInteraction(drawInteraction.current);

    selectInteraction.current.setActive(activeTool === 'delete');
    modifyInteraction.current.setActive(false);

    if (['Point', 'LineString', 'Polygon'].includes(activeTool)) {
      drawInteraction.current = new Draw({
        source: vectorSource.current,
        type: activeTool,
        style: activeTool === 'Point' ? getPointStyle(new Feature()) : styles[activeTool],
      });
      drawInteraction.current.on('drawend', (e) => {
        e.feature.set('id', new Date().getTime());
        if (activeTool === 'Point') e.feature.set('imageCount', 0);
      });
      mapInstance.current.addInteraction(drawInteraction.current);
    }
  }, [activeTool]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />

      {/* Search */}
      <div className="absolute top-4 z-10 contenedor-search-input">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar..." className="px-3 py-2 rounded-lg shadow-md border focus:outline-none" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">Buscar</button>
        </form>
      </div>

      {/* Tools */}
      <div className="absolute top-4 right-4 bg-opacity-60 p-2 z-10">
        <div className="flex flex-col gap-2 text-white contenedor-botones">
          {['navigate', 'Point', 'Polygon', 'delete'].map((tool) => (
             <button key={tool} className={`bg-white p-3 rounded-2xl shadow-md text-gray-800 ${activeTool === tool ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setActiveTool(tool)}>
                <i className={`fa-solid ${tool === 'navigate' ? 'fa-map' : tool === 'Point' ? 'fa-map-pin' : tool === 'Polygon' ? 'fa-draw-polygon' : 'fa-crosshairs'}`}></i>
             </button>
          ))}
          <button className="bg-white p-3 rounded-2xl shadow-md text-gray-800 hover:bg-red-500 hover:text-white" onClick={() => {
              const sel = selectInteraction.current.getFeatures();
              sel.getArray().forEach(f => vectorSource.current.removeFeature(f));
              sel.clear();
          }}><i className="fa-solid fa-trash"></i></button>
        </div>
      </div>

      {/* Popup overlay */}
      <div ref={popupRef} className="ol-popup">
        {popupData && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 min-w-[180px]">
            <button
              ref={popupCloserRef}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => {
                overlayRef.current?.setPosition(undefined);
                setPopupData(null);
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-sm font-bold text-[#234451] mb-1">{popupData.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 bg-orange-50 text-[#ff9443] text-xs font-semibold px-2.5 py-1 rounded-full">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {popupData.imageCount} imagen{popupData.imageCount !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapBox;
