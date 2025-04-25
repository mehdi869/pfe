import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet';
import Data from '../Map/Data.json';

export const Map = () => {
  const icon = L.icon({
    iconUrl: iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34] // ⚠️ Corrigé ici aussi ("popupAnchor", pas "popunAnchor")
  });

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[28.0339, 1.6596]}
        zoom={6 }
        maxBounds={[[18, -9], [38, 12]]}
        scrollWheelZoom={false}
        style={{ height: '92%', width: '100%' }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributeurs'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {Data.map((position, index) => {
          const pos = [position.Latitude, position.Longitude]; // 🔄 assure-toi que c'est bien "latitude" et "longitude"
          return (
            <Marker key={index} position={pos} icon={icon}>
              <Popup>
                <strong>{position.ville}</strong>
              </Popup>
            </Marker>
          );
        })}

      </MapContainer>
    </div>
  );
};
