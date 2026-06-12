import React, { useEffect, useState } from "react";
import "../../Styles/HorizontalBarStyle.css";
import "../../Styles/MultiPurposeStyle.css";

const API_URL = window.__API_URL__;

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
      ? "Persons citing"
      : "Persons cited by";
const buttonLabel =
  mode === "cited"
    ? "persons cited by"
    : "persons citing";
  const color =
    mode === "cited"
      ? "#fa8c16"
      : "#52c41a";

  return (
    <div className="card-container">

      <div className="card-header-legend">
        
        <h2 className="card-title">
          {title} {name}
        </h2>
        <p className="card-description">place holder 6</p>
        <div className="card-header-buttons">
        <button
          className="horizontal-bar-toggle"
          onClick={() =>
            setMode(prev =>
              prev === "cited" ? "citedBy" : "cited"
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