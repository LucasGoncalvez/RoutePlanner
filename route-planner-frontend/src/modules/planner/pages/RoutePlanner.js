import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { plannerActions } from '../handlers/redux';
import { DEFAULT_LOCATION } from '../helpers';

// Configurar íconos
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Colores para los segmentos de ruta y marcadores
const COLOR_PALETTE = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#F97316', // orange-500
  '#6366F1', // indigo-500
  '#D946EF', // fuchsia-500
];

// Ícono personalizado para el origen (rojo)
const originIcon = new L.Icon({
  ...L.Icon.Default.prototype.options,
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Función para crear íconos de colores
const createColoredIcon = (color) => {
  return new L.Icon({
    ...L.Icon.Default.prototype.options,
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

const createCustomSvgIcon = (hexColor) => {
  const svg = `
    <svg width="20" height="40" viewBox="0 0 30 50" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.71573 0 0 6.71573 0 15C0 27.5 15 50 15 50C15 50 30 27.5 30 15C30 6.71573 23.2843 0 15 0Z" fill="${hexColor}" stroke="#000" stroke-width="2"/>
      <circle cx="15" cy="15" r="6" fill="white"/>
    </svg>
  `;
  return new L.DivIcon({
    html: svg,
    className: "",
    iconSize: [30, 50],
    iconAnchor: [15, 50],
    popupAnchor: [0, -45],
  });
};

export default function RoutePlanner() {
  const dispatch = useDispatch();
  const {
    origin,
    destinations,
    optimalPath,
    loading,
    error: apiError,
    routeInfo
  } = useSelector(state => state.planner);

  const [newLocation, setNewLocation] = useState('');
  const [locationName, setLocationName] = useState('');
  const [error, setError] = useState('');
  const [transportMode, setTransportMode] = useState('driving-car');

  const parseLocation = (text) => {
    try {
      const [lat, lng] = text.split(',').map(coord => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) throw new Error('Coordenadas inválidas');
      return { lat, lng, name: locationName || `Ubicación (${lat.toFixed(4)}, ${lng.toFixed(4)})` };
    } catch (err) {
      setError(err.message || 'Formato inválido. Usa: lat, lng');
      return null;
    }
  };

  const handleAdd = () => {
    setError('');
    const loc = parseLocation(newLocation);
    if (!loc) return;

    if (!origin) {
      dispatch(plannerActions.setOrigin(loc));
    } else {
      dispatch(plannerActions.addDestination(loc));
    }
    setNewLocation('');
    setLocationName('');
  };
  
    const handleClear = () => {
        console.log('clear');
  };

  const handlePlanRoute = () => {
    if (!origin) {
      setError('Debes establecer un punto de origen');
      return;
    }
    if (destinations.length === 0) {
      setError('Debes agregar al menos un destino');
      return;
    }
    dispatch(plannerActions.requestOptimalPath({
      origin,
      destinations,
      mode: transportMode
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  // Función para dividir la ruta óptima en segmentos para colorear
  const getPathSegments = () => {
    if (optimalPath.length < 2) return [];

    const segments = [];
    for (let i = 0; i < optimalPath.length - 1; i++) {
      segments.push({
        positions: [optimalPath[i], optimalPath[i + 1]],
        color: COLOR_PALETTE[i % COLOR_PALETTE.length],
        index: i
      });
    }
    return segments;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Panel izquierdo - Controles y lista de ubicaciones */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Planificador de Rutas</h1>

            <div className="space-y-4">
              {/* Selector de modo de transporte */}
              <div className="flex flex-col gap-1 mt-5">
                <label className="text-sm font-medium text-gray-700">Modo de transporte:</label>
                <select
                  value={transportMode}
                  onChange={(e) => setTransportMode(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="driving-car">Automóvil</option>
                  <option value="driving-car">Moto</option>
                  <option value="foot-walking">A pie</option>
                </select>
              </div>


              {/* Lista de ubicaciones */}
              <div className="mt-6 space-y-3">
                {origin && (
                  <div className="bg-red-50 p-3 rounded border border-red-200">
                    <h3 className="font-semibold text-red-800">{origin.name}</h3>
                    <p className="text-sm text-gray-600">{origin.lat.toFixed(6)}, {origin.lng.toFixed(6)}</p>
                    <p className="text-xs text-gray-500">Punto de partida</p>
                  </div>
                )}

                {destinations.map((dest, index) => {
                  const orderIndex = optimalPath.findIndex(p => p.lat === dest.lat && p.lng === dest.lng);
                  return (
                    <div 
                      key={index} 
                      className="bg-blue-50 p-3 rounded border border-blue-200"
                      style={{ borderLeft: `4px solid ${COLOR_PALETTE[index % COLOR_PALETTE.length]}` }}
                    >
                      <h3 className="font-semibold" style={{ color: COLOR_PALETTE[index % COLOR_PALETTE.length] }}>
                        {dest.name}
                        {orderIndex > 0 && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            Orden: {orderIndex}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{dest.lat.toFixed(6)}, {dest.lng.toFixed(6)}</p>
                    </div>
                  );
                })}
              </div>
              </div>

                    <div className="flex flex-col gap-2 mt-5">
                        <input
                        type="text"
                        placeholder="Nombre del lugar (opcional)"
                        className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        />
                        <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Coordenadas: lat, lng"
                            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button 
                            onClick={handleAdd}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            Agregar
                        </button>
                    </div>
                </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

              {/* Información de la ruta */}
              {routeInfo && (
                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Información de Ruta:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Distancia total:</p>
                      <p className="text-lg font-semibold">{routeInfo.totalDistance} km</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Duración estimada:</p>
                      <p className="text-lg font-semibold">{routeInfo.totalDuration} min</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Orden óptimo */}
              {optimalPath.length > 0 && (
                <div className="mt-4 p-3 bg-indigo-50 rounded border border-indigo-200">
                  <h3 className="font-semibold text-indigo-800 mb-2">Orden Óptimo:</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li className="text-sm text-gray-700">
                      {origin.name} <span className="text-xs text-gray-500">(Origen)</span>
                    </li>
                    {optimalPath.slice(1).map((point, i) => (
                      <li key={i} className="text-sm text-gray-700">
                        {point.name || `Destino ${i + 1}`}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

            <div className="flex flex_row gap-5 mt-5">
                
                <button 
                    onClick={handlePlanRoute}
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded transition-colors ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                    {loading ? 'Calculando...' : 'Generar ruta'}
                </button>

            </div>
          </div>

          {/* Mapa */}
          <div className="w-full lg:w-2/3 h-[600px] rounded-lg shadow-md overflow-hidden">
            <MapContainer
              center={origin ? [origin.lat, origin.lng] : [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {origin && (
                <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
                  <Popup>
                    <span className="font-semibold text-red-700">{origin.name}</span><br />
                    {origin.lat.toFixed(6)}, {origin.lng.toFixed(6)}<br />
                    <span className="text-sm text-gray-600">Punto de partida</span>
                  </Popup>
                </Marker>
              )}

              {destinations.map((d, i) => {
                const orderIndex = optimalPath.findIndex(p => p.lat === d.lat && p.lng === d.lng);
                return (
                  <Marker
                    key={i}
                    position={[d.lat, d.lng]}
                    icon={createCustomSvgIcon(COLOR_PALETTE[i % COLOR_PALETTE.length])}
                  >
                    <Popup>
                      <div className="space-y-1">
                        <span
                          className="font-semibold"
                          style={{ color: COLOR_PALETTE[i % COLOR_PALETTE.length] }}
                        >
                          {d.name}
                        </span>
                        {orderIndex > 0 && (
                          <div className="text-sm bg-gray-100 px-1 rounded inline-block">
                            Orden en ruta: {orderIndex}
                          </div>
                        )}
                        <div className="text-sm text-gray-600">
                          {d.lat.toFixed(6)}, {d.lng.toFixed(6)}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {optimalPath.length > 1 && (
                <>
                  {getPathSegments().map((segment, i) => (
                    <Polyline
                      key={i}
                      positions={segment.positions.map(p => [p.lat, p.lng])}
                      color={segment.color}
                      weight={4}
                      opacity={0.7}
                    />
                  ))}

                  {/* Marcadores de orden en la ruta */}
                  {optimalPath.map((point, i) => (
                    i > 0 && (
                      <Marker
                        key={`label-${i}`}
                        position={[point.lat, point.lng]}
                        icon={L.divIcon({
                          className: 'path-label',
                          html: `<div style="background-color: ${COLOR_PALETTE[(i - 1) % COLOR_PALETTE.length]}; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${i}</div>`,
                          iconSize: [24, 24]
                        })}
                        zIndexOffset={1000}
                      />
                    )
                  ))}
                </>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}