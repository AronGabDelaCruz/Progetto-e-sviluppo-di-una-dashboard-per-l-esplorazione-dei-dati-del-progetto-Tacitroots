import React, { useEffect, useState } from "react";
import "../../Styles/HorizontalBarStyle.css";
import "../../Styles/MultiPurposeStyle.css";
const API_URL = process.env.REACT_APP_API_URL;

function PersonGraphBar({ name }) {
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("in"); // "in" = ricevute, "out" = inviate

  useEffect(() => {
    if (!name) return;

    const endpoint =
      mode === "in"
        ? `${API_URL}/person-graph-in/${name}`
        : `${API_URL}/person-graph/${name}`;

    fetch(endpoint)
      .then(res => res.json())
      .then(raw => {
        const formatted = raw.edges.map(e => {
          const label = e.rels?.[0] || "LETTERS: 0";
          const count = parseInt(label.replace("LETTERS: ", "")) || 0;

          return {
            person:
              mode === "in"
                ? raw.nodes.find(n => n.id === e.from)?.label
                : raw.nodes.find(n => n.id === e.to)?.label,
            count
          };
        });

        formatted.sort((a, b) => b.count - a.count);

        // opzionale: limita solo per "out"
        setData(mode === "out" ? formatted.slice(0, 20) : formatted);
      })
      .catch(console.error);

  }, [name, mode]);

  if (!name) return null;

  const max = Math.max(...data.map(d => d.count), 1);

  const title =
    mode === "in" ? "Lettere ricevute" : "Lettere inviate";

  return (
    <div className="card-container">

      <div className="card-header">

        <h2 className="card-title">
          {title}
        </h2>

        <button
          onClick={() =>
            setMode(prev => (prev === "in" ? "out" : "in"))
          }
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            cursor: "pointer",
            background: "#f5f5f5"
          }}
        >
          Capovolgi
        </button>

      </div>

      <div className="card-wrapper-scroll">

        {data.length === 0 ? (
          <div style={{ color: "#888", fontSize: "14px" }}>
            Nessun dato disponibile
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
                    background: "#1890ff"
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

export default PersonGraphBar;