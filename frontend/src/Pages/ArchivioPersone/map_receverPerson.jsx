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
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

const getSize = (n) => Math.max(12, Math.min(40, n * 4));

const customIcon = (size) =>
  L.divIcon({
    html: `<div style="
      background: #1677ff;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      opacity: 0.6;
      border: 2px solid white;
    "></div>`,
    className: ""
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
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          Luoghi di Provenienza dei Mittenti
        </h2>
      </div>

      <div style={styles.mapWrapper}>
        <MapContainer
          center={[45, 10]}
          zoom={5}
          style={styles.map}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {data
            .filter(
              (c) =>
                typeof c.lat === "number" &&
                typeof c.lng === "number"
            )
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
    </div>
  );
}

export default PersonReceiverMap;
const styles = {
  container: {
    height: "500px",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "10px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    overflow: "hidden"
  },

  header: {
    flexShrink: 0,
    marginBottom: "10px"
  },

  title: {
    marginBottom: "10px",
    flexShrink: 0
  },

  subtitle: {
    fontSize: "12px",
    color: "#666",
    marginTop: "4px"
  },

  mapWrapper: {
    flex: 1,
    minHeight: 0,
    borderRadius: "8px",
    overflow: "hidden"
  },

  map: {
    height: "100%",
    width: "100%"
  }
};