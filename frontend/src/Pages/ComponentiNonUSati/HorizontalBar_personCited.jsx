import React, { useEffect, useState } from "react";
import "../../Styles/HorizontalBarStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

function PersonCitedBar({ name }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/person-cited/${name}`)
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
  }, [name]);

  if (!name) return null;

  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="horizontal-bar-container">

      <div className="horizontal-bar-header">
        <h2 className="horizontal-bar-title">
          Persone Citate
        </h2>
      </div>

      <div className="horizontal-bar-wrapper">

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
                    background: "#fa8c16"
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

export default PersonCitedBar;