import React, { useEffect, useState } from "react";
import "../../Styles/HorizontalBarStyle.css";
import "../../Styles/MultiPurposeStyle.css";
import InfoBubble from "../../Utility/Bubble";
const API_URL = process.env.REACT_APP_API_URL;

function ExperimentPeopleBar({ name }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/experiment-person-citations/${name}`)
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
    <div className="card-container">

      <div className="card-header-legend">
        <h2 className="card-title">
          Citazioni per persona
        </h2>
              <InfoBubble 
              text="TBD" />
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
                    background: "#1677ff"
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

export default ExperimentPeopleBar;