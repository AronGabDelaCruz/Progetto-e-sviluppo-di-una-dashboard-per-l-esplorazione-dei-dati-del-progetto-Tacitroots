import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
const API_URL = process.env.REACT_APP_API_URL;
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const getSize = (n) => Math.max(15, Math.min(50, n * 5));

const customIcon = (size) =>
  L.divIcon({
    html: `<div style="
      background: blue;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      opacity: 0.6;
      border: 2px solid white;
    "></div>`,
    className: "",
  });

function PersonReceiverMap({ name }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/person-receiver-map/${name}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Mappa lettere RICEVUTE da: {name}</h3>

      <MapContainer
        center={[45, 10]}
        zoom={5}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {data
          .filter((c) => typeof c.lat === "number" && typeof c.lng === "number")
          .map((c, i) => (
            <Marker
              key={i}
              position={[c.lat, c.lng]}
              icon={customIcon(getSize(c.count))}
            >
              <Popup>
                <strong>{c.location}</strong>
                <br />
                {c.count} lettere ricevute
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

export default PersonReceiverMap;