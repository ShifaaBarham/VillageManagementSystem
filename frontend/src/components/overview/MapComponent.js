import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ villages }) => {
  const center = [31.7683, 35.2137]; // location (Jerusalem)

  return (
    <MapContainer center={center} zoom={8} style={{ height: '400px', width: '100%' }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />
  {villages && villages.map((village) => {
  return village.latitude && village.longitude ? (
    <Marker key={village.id} position={[village.latitude, village.longitude]}>
      <Popup>
        <strong>{village.name}</strong>
        <br />
        Population: {village.population}
        <br />
        Area: {village.land_area} km²
      </Popup>
    </Marker>
  ) : null;
})}

</MapContainer>

  );
};

export default MapComponent;
