import React, { useEffect, useState } from "react";
import "../../Styles/HorizontalBarStyle.css";
import "../../Styles/MultiPurposeStyle.css";
const API_URL = process.env.REACT_APP_API_URL;

function PersonCitedToggleBar({ name }) {
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("cited"); // cited | citedBy

  useEffect(() => {
    if (!name) return;

    const endpoint =
      mode === "cited"
        ? "person-cited"
        : "person-cited-by";

    fetch(`${API_URL}/${endpoint}/${name}`)
      .then(res => res.json())
      .then(raw => {
        const formatted = raw.map(d => ({
          person: d.person,
          count: Number(d.count) || 0
        }));

        formatted.sort((a, b) => b.count - a.count);
        setData(formatted);
      })
      .catch(console.error);
  }, [name, mode]);

  if (!name) return null;

  const max = Math.max(...data.map(d => d.count), 1);

  const title =
    mode === "cited"
      ? "Persone Citate"
      : "Da Chi è Stato Citato";

  const color =
    mode === "cited"
      ? "#fa8c16"
      : "#52c41a";

  return (
    <div className="card-container">

      <div className="card-header">
        <h2 className="card-title">
          {title}
        </h2>

        <button
          className="horizontal-bar-toggle"
          onClick={() =>
            setMode(prev =>
              prev === "cited" ? "citedBy" : "cited"
            )
          }
        >
          Capovolgi
        </button>
      </div>

      <div className="card-wrapper-scroll">

        {data.length === 0 ? (
          <div style={{ color: "#888", fontSize: "14px" }}>
            Nessuna citazione trovata
          </div>
        ) : (
          data.map((d, i) => (
            <div key={i} className="horizontal-bar-row">

              <div className="horizontal-bar-label">
                {d.person}
              </div>

              <div className="horizontal-bar-track">
                <div
                  className="horizontal-bar-fill"
                  style={{
                    width: `${(d.count / max) * 100}%`,
                    background: color
                  }}
                />
              </div>

              <div className="horizontal-bar-value">
                {d.count}
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default PersonCitedToggleBar;