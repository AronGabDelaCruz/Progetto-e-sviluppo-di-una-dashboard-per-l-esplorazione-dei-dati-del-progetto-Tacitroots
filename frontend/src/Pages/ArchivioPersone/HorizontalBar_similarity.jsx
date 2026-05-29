import React, { useEffect, useState } from "react";

import "../../Styles/HorizontalBarStyle.css";
import "../../Styles/MultiPurposeStyle.css";

import InfoBubble from "../../Utility/Bubble";

const API_URL = process.env.REACT_APP_API_URL;

function PersonSimilarityToggleBar({ name }) {

  const [data, setData] = useState([]);
  const [mode, setMode] = useState("fields");


  useEffect(() => {

    if (!name) return;

    let endpoint = "";

    if (mode === "fields") {
      endpoint = "person-sim-fields";
    } 
    else if (mode === "quoted") {
      endpoint = "person-quoted-sim";
    } 
    else {
      endpoint = "person-cited-entity-similarity";
    }

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

  const config = {
    fields: {
      title: "Persons having fields in common with",
      button: "FIelds",
      color: "#1677ff"
    },
    quoted: {
      title: "Shared quoted documents",
      button: "Quoted",
      color: "#722ed1"
    },
    entitySimilarity: {
      title: "Shared cited entities",
      button: "Entity",
      color: "#fa541c"
    }
  };

  const c = config[mode];


  return (
    <div className="card-container">

      <div className="card-header-legend">

        <h2 className="card-title">
          {c.title} with {name}
        </h2>

<div className="card-header-buttons">
 <InfoBubble text="Fields: shows the similarity between two people based on their common fields, 
 Quoted: shows the the similarity between two people based on document/letters where they are quoted together
 Entities: shows the similarity between two people based on their citetion to books, instuments or or experiments on their document/letters" />

  <button
    className={`horizontal-bar-toggle ${mode === "fields" ? "active" : ""}`}
    onClick={() => setMode("fields")}
  >
    Fields
  </button>

  <button
    className={`horizontal-bar-toggle ${mode === "quoted" ? "active" : ""}`}
    onClick={() => setMode("quoted")}
  >
    Quoted
  </button>

  <button
    className={`horizontal-bar-toggle ${mode === "entitySimilarity" ? "active" : ""}`}
    onClick={() => setMode("entitySimilarity")}
  >
    Entities
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
                    background: c.color
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

export default PersonSimilarityToggleBar;