import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "../../Styles/MapStyle.css";
import "../../Styles/MultiPurposeStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

// fix icone leaflet
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

function ExperimentMap({ name }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/experiment-map/${name}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [name]);

  if (!name) return null;

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

  return (
    <div className="card-container">

      <div className="card-header-legend">
        <h2 className="card-title">
          Citation map
        </h2>
<p className="card-description">place holder 3</p>
      </div>

      <div className="card-wrapper">

        <MapContainer
          center={[45, 10]}   
          zoom={5}
          className="map"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {data
            .filter(d => typeof d.lat === "number" && typeof d.lng === "number")
            .map((d, i) => (
              <Marker
                key={i}
                position={[d.lat, d.lng]}
                icon={customIcon(getSize(d.count))}
              >
                <Popup>
                  <strong>{d.location}</strong>
                  <br />
                  {d.count} Citations
                </Popup>
              </Marker>
            ))}
        </MapContainer>

      </div>
    </div>
  );
}

export default ExperimentMap;