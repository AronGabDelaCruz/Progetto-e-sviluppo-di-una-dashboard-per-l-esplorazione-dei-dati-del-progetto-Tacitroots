import React, { useEffect, useState } from "react";

import "../../Styles/HorizontalBarStyle.css";
import "../../Styles/MultiPurposeStyle.css";



const API_URL = process.env.REACT_APP_API_URL;

function TopicExperimentsInstrumentsBar({ selectedTopic }) {

  const [data, setData] = useState([]);
  const [mode, setMode] = useState("experiments");

  
  const colors = {
    experiments: "#1677ff",
    instruments: "#722ed1"
  };

  useEffect(() => {

    if (!selectedTopic) return;

    const endpoint =
      mode === "experiments"
        ? `${API_URL}/topic-experiments/${selectedTopic}`
        : `${API_URL}/topic-instruments/${selectedTopic}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((raw) => {

        const formatted = raw.map((r) => ({
          entity: r.entity,
          count: Number(r.count) || 0
        }));

        formatted.sort((a, b) => b.count - a.count);

        setData(formatted);

      })
      .catch(console.error);

  }, [selectedTopic, mode]);

  if (!selectedTopic) return null;

  const max = Math.max(...data.map((d) => d.count), 1);

  const title =
    mode === "experiments"
      ? "Experiments linked to "
      : "Instruments linked to ";

  const buttonLabel =
    mode === "experiments"
      ? "show instruments"
      : "show experiments";

  return (
    <div className="card-container">

      <div className="card-header-legend">

        <h2 className="card-title">
          {title} { selectedTopic }
        </h2>
        <p className="card-description">place holder 4</p>
        <div className="card-header-buttons">
          
          <button
            className="horizontal-bar-toggle"
            onClick={() =>
              setMode((prev) =>
                prev === "experiments"
                  ? "instruments"
                  : "experiments"
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
                {d.entity}
              </div>

              <div className="horizontal-bar-track">

                <div
                  className="horizontal-bar-fill"
                  style={{
                    width: `${(d.count / max) * 100}%`,
                    background: colors[mode]
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

export default TopicExperimentsInstrumentsBar;