import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "../../Styles/MapStyle.css";
import "../../Styles/MultiPurposeStyle.css";

import InfoBubble from "../../Utility/Bubble";

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

function TopicLocationMap({ selectedTopic }) {

  const [data, setData] = useState([]);
  const [mode, setMode] = useState("receiver");

  useEffect(() => {

    if (!selectedTopic) return;

    const endpoint =
      mode === "receiver"
        ? "topic-receiver-map"
        : "topic-sender-map";

    fetch(`${API_URL}/${endpoint}/${selectedTopic}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);

  }, [selectedTopic, mode]);

  if (!selectedTopic) return null;

  const title =
    mode === "receiver"
      ? "Recipients’ locations"
      : "Senders’ locations";

  const buttonLabel =
    mode === "receiver"
      ? "Show senders"
      : "Show recipients";

  const color =
    mode === "receiver" ? "#1677ff" : "#ff4d4f";

  const customIcon = (size) =>
    L.divIcon({
      html: `<div style="
        background: ${color};
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
          {title}
        </h2>

        <div className="card-header-buttons">

          <button
            className="horizontal-bar-toggle"
            onClick={() =>
              setMode((prev) =>
                prev === "receiver"
                  ? "sender"
                  : "receiver"
              )
            }
          >
            {buttonLabel}
          </button>

          <InfoBubble
            text="Shows geographical distribution of senders and receivers for documents/letters of the selected topic."
          />

        </div>

      </div>

      <div className="card-wrapper">

        <MapContainer
          center={[45, 10]}
          zoom={5}
          className="map"
        >

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {data
            .filter(c =>
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
                  {c.count} documents
                </Popup>
              </Marker>
            ))}

        </MapContainer>

      </div>

    </div>
  );
}

export default TopicLocationMap;