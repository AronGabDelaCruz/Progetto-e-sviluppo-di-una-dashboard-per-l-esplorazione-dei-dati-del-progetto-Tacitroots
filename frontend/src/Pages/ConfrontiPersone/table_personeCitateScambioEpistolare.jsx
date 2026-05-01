import React, { useEffect, useState } from "react";
import "../../Styles/HorizontalBarStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

function PersonCitedBetweenBar({ person1, person2 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!person1 || !person2) return;

    fetch(`${API_URL}/person-cited-between/${person1}/${person2}`)
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
  }, [person1, person2]);

  if (!person1 || !person2) return null;

  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="card-container">

      <div className="card-header">
        <h2 className="card-title">
          Persone citate
        </h2>
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

export default PersonCitedBetweenBar;