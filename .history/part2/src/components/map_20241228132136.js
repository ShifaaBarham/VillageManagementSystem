import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ villages }) => {
  useEffect(() => {
    if (villages && villages.length > 0) {
      const map = L.map("map").setView([32.465, 35.294], 8);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

      villages.forEach((village) => {
        L.marker([village.latitude, village.longitude])
          .addTo(map)
          .bindPopup(`<b>${village.name}</b><br>Population: ${village.population}`);
      });
    }
  }, [villages]);

  return <div id="map" style={{ height: "300px" }}></div>;
};

export default Map;
