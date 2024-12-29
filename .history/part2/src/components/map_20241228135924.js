import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = ({ villages }) => {
  if (!villages || villages.length === 0) {
    return <p>No villages data available!</p>;
  }

  return (
    <MapContainer center={[32.465, 35.294]} zoom={8} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      {villages.map((village, index) => (
        <Marker key={index} position={[village.latitude, village.longitude]}>
          <Popup>
            <b>{village.name}</b>
            <br />
            Population: {village.population}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
