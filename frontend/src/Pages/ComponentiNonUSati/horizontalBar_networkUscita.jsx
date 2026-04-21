import React, { useEffect, useState } from "react";
import "../../Styles/HorizontalBarStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

function PersonGraphOutBar({ name }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/person-graph/${name}`)
      .then(res => res.json())
      .then(raw => {
        const formatted = raw.edges.map(e => {
          const label = e.rels?.[0] || "LETTERS: 0";
          const count = parseInt(label.replace("LETTERS: ", "")) || 0;

          return {
            person:
              raw.nodes.find(n => n.id === e.to)?.label || "Unknown",
            count
          };
        });

        formatted.sort((a, b) => b.count - a.count);
        setData(formatted.slice(0, 20));
      })
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="horizontal-bar-container">

      <div className="horizontal-bar-header">
        <h2 className="horizontal-bar-title">
          Lettere inviate
        </h2>
      </div>

      <div className="horizontal-bar-wrapper">

        {data.map((d, i) => (
          <div key={i} className="horizontal-bar-row">

            <div className="horizontal-bar-label">
              {d.person}
            </div>

            <div className="horizontal-bar-track">
              <div
                className="horizontal-bar-fill"
                style={{
                  width: `${(d.count / max) * 100}%`,
                  background: "#52c41a"
                }}
              />
            </div>

            <div className="horizontal-bar-value">
              {d.count}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default PersonGraphOutBar;