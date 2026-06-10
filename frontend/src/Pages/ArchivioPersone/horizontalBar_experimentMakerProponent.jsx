import React, { useEffect, useState } from "react";
import "../../Styles/HorizontalBarStyle.css";
import "../../Styles/MultiPurposeStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

function PersonExperimentPackingBar({ name }) {
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("invented"); // invented | proposed

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/person-experiment-packing/${name}`)
      .then(res => res.json())
      .then(raw => {
        const filtered = raw
          .filter(d => d.type === mode)
          .map(d => ({
            experiment: d.experiment,
            count: Number(d.count) || 0
          }))
          .sort((a, b) => b.count - a.count);

        setData(filtered);
      })
      .catch(console.error);
  }, [name, mode]);

  if (!name) return null;

  const max = Math.max(...data.map(d => d.count), 1);

  const title =
    mode === "invented"
      ? "Experiments made"
      : "Experiments proposed";
  
  const buttonLabel =
  mode === "invented"
    ? "experiments proposed"
    : "experiments made";

  const color =
    mode === "invented"
      ? "#ff4d4f"
      : "#52c41a";

  return (
    <div className="card-container">

      <div className="card-header-legend">

        <h2 className="card-title">
          {title}
        </h2>
        <p className="card-description">place holder 5</p>
        <div className="card-header-buttons">
        <button
          className="horizontal-bar-toggle"
          onClick={() =>
            setMode(prev =>
              prev === "invented" ? "proposed" : "invented"
            )
          }
        >
         Switch to {buttonLabel}
        </button>
        </div>
      </div>

      <div className="card-wrapper-scroll">

        {data.length === 0 ? (
          <div style={{ color: "#888", fontSize: "14px" }}>
            No data available
          </div>
        ) : (
          data.map((d, i) => (
            <div key={i} className="horizontal-bar-row">

              <div className="horizontal-bar-label">
                {d.experiment}
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

export default PersonExperimentPackingBar;