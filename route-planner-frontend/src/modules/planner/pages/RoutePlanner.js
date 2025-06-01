import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
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

export default function RoutePlanner() {
    const dispatch = useDispatch();
    const { origin, destinations, optimalPath, loading } = useSelector(state => state.planner);

    const [newLocation, setNewLocation] = useState('');

    const parseLocation = (text) => {
        const [lat, lng] = text.split(',').map(Number);
        return { lat, lng };
    };

    const handleAdd = () => {
        const loc = parseLocation(newLocation);
        if (!origin) {
            dispatch(plannerActions.setOrigin(loc));
        } else {
            dispatch(plannerActions.addDestination(loc));
        }
        setNewLocation('');
    };

    const handlePlanRoute = () => {
        if (origin && destinations.length > 0) {
            console.log(origin, destinations);
            // dispatch(plannerActions.requestOptimalPath({ origin, destinations }));
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Planificador de Rutas</h1>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Lat,Lng"
                    className="border p-2 rounded w-full"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                />
                <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Agregar
                </button>
            </div>

            <button onClick={handlePlanRoute} className="bg-green-600 text-white px-4 py-2 rounded">
                Calcular Ruta Óptima
            </button>

            {loading && <p>Cargando ruta óptima...</p>}

            <div className="h-[500px] mt-4">
                <MapContainer
                    center={origin ? [origin.lat, origin.lng] : [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]}
                    zoom={13}
                    className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {origin && <Marker position={[origin.lat, origin.lng]} />}
                    {destinations.map((d, i) => (
                        <Marker key={i} position={[d.lat, d.lng]} />
                    ))}
                    {optimalPath.length > 1 && (
                        <Polyline positions={optimalPath.map(p => [p.lat, p.lng])} color="blue" />
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
