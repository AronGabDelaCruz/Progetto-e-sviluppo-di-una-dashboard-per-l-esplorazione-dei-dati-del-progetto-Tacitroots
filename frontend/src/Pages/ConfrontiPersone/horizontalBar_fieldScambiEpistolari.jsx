import React, { useEffect, useState } from "react";
import "../../Styles/HorizontalBarStyle.css";
import "../../Styles/MultiPurposeStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

function PersonFieldPackingBar({ person1, person2 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!person1 || !person2) return;

    fetch(`${API_URL}/person-field-packing/${person1}/${person2}`)
      .then(res => res.json())
      .then(raw => {
        const formatted = (raw || [])
          .map(d => ({
            field: d.field,
            count: Number(d.count) || 0
          }))
          .filter(d => d.field)
          .sort((a, b) => b.count - a.count);

        setData(formatted);
      })
      .catch(console.error);

  }, [person1, person2]);

  if (!person1 || !person2) return null;

  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="card-container">

      <div className="card-header-legend">
        <h2 className="card-title">
          Fields of discussion
        </h2>
        <p className="card-description">place holder 4</p>
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
                {d.field}
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

export default PersonFieldPackingBar;