import React, { useEffect, useState } from "react";
import "../../Styles/ColumnListStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

function PersonInstrumentList({ name }) {
  const [invented, setInvented] = useState([]);
  const [proposed, setProposed] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/person-instrument-packing/${name}`)
      .then(res => res.json())
      .then(raw => {
        const inv = raw.filter(d => d.type === "invented");
        const prop = raw.filter(d => d.type === "proposed");

        setInvented(inv);
        setProposed(prop);
      })
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  return (
  <div className="card-compact">

    <h3 className="card-title-compact">
      Strumenti
    </h3>

    <div className="card-grid-compact">

      <div className="card-column-compact">
        <h4 className="card-subtitle-invented">
          Invented
        </h4>

        {invented.length === 0 ? (
          <div className="card-empty">
            Nessuno elemento
          </div>
        ) : (
          invented.map((d, i) => (
            <div key={i} className="card-item-compact">
              <span>{d.instrument || "unknown"}</span>
              <span>Citazioni {d.count}</span>
            </div>
          ))
        )}
      </div>

      <div className="card-column-compact">
        <h4 className="card-subtitle-proposed">
          Proposed
        </h4>

        {proposed.length === 0 ? (
          <div className="card-empty">
            Nessun elemento
          </div>
        ) : (
          proposed.map((d, i) => (
            <div key={i} className="card-item-compact">
              <span>{d.instrument || "unknown"}</span>
              <span>Citazioni {d.count}</span>
            </div>
          ))
        )}
      </div>

    </div>
  </div>
);
}

export default PersonInstrumentList;