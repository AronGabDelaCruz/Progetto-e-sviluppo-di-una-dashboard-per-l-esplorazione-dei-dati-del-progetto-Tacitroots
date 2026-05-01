import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";
import "../../Styles/CircleStyle.css";
import "../../Styles/MultiPurposeStyle.css";
const API_URL = process.env.REACT_APP_API_URL;

function PersonFieldPackingVis({ person1, person2 }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    if (!person1 || !person2) return;

    fetch(`${API_URL}/person-field-packing/${person1}/${person2}`)
      .then(res => res.json())
      .then(raw => {

        // distruggi vecchio grafo
        if (networkRef.current) {
          networkRef.current.destroy();
          networkRef.current = null;
        }

        // nessun dato
        if (!raw || raw.length === 0) {
          setHasData(false);
          if (containerRef.current) {
            containerRef.current.innerHTML = "";
          }
          return;
        }

        setHasData(true);

        const colorMap = {};

        const getRandomColor = (key) => {
          if (colorMap[key]) return colorMap[key];

          const color =
            "#" + Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0");

          colorMap[key] = color;
          return color;
        };

        const nodes = raw.map((d, i) => ({
          id: i,
          label: d.field || "unknown",
          value: Number(d.count) || 1,
          shape: "dot",
          color: {
            background: getRandomColor(d.field),
            border: "#333"
          },
          scaling: {
            min: 15,
            max: 60
          },
          font: {
            size: 12,
            color: "#111"
          },
          title: `${d.field} - ${d.count}`
        }));

        const data = {
          nodes: new DataSet(nodes),
          edges: []
        };

        const options = {
          physics: { enabled: true },
          interaction: { hover: true }
        };

        // piccolo delay per evitare bug resize
        setTimeout(() => {
          if (!containerRef.current) return;

          networkRef.current = new Network(
            containerRef.current,
            data,
            options
          );
        }, 50);
      })
      .catch(err => {
        console.error("FETCH ERROR:", err);
        setHasData(false);
      });

  }, [person1, person2]);

  return (
    <div className="card-container">

      <div className="card-header">
        <h2 className="card-title">
          Temi di Discussione
        </h2>
      </div>

      {!hasData && (
        <div
          className="card-wrapper"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: "14px",
            fontStyle: "italic"
          }}
        >
          Nessun dato disponibile
        </div>
      )}

      <div
        ref={containerRef}
        className="card-wrapper"
        style={{ display: hasData ? "block" : "none" }}
      />

    </div>
  );
}

export default PersonFieldPackingVis;