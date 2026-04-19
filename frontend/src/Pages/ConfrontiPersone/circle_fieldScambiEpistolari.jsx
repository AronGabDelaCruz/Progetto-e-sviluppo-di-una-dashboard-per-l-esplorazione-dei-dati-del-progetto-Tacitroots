import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";

const API_URL = process.env.REACT_APP_API_URL;

function PersonFieldPackingVis({ person1, person2 }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!person1 || !person2) return;

    fetch(`${API_URL}/person-field-packing/${person1}/${person2}`)
      .then(res => res.json())
      .then(raw => {
        console.log("RAW BACKEND:", raw);

        if (!raw || raw.length === 0) {
          console.warn("NO DATA FROM BACKEND");
          return;
        }

        if (!containerRef.current) {
          console.warn("CONTAINER NOT READY");
          return;
        }
const colorMap = {};

function getRandomColor(key) {
  if (colorMap[key]) return colorMap[key];

  const color =
    "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

  colorMap[key] = color;
  return color;
}
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
          physics: {
            enabled: true
          },
          interaction: {
            hover: true
          }
        };


        if (networkRef.current) {
          networkRef.current.destroy();
          networkRef.current = null;
        }

        setTimeout(() => {
          networkRef.current = new Network(
            containerRef.current,
            data,
            options
          );
        }, 50);
      })
      .catch(err => console.error("FETCH ERROR:", err));
  }, [person1, person2]);

  return (
    <div style={{ height: "500px", border: "1px solid #ddd" }}>
      <h3>Temi di Discussione</h3>

      <div
        ref={containerRef}
        style={{ height: "450px", width: "100%" }}
      />
    </div>
  );
}

export default PersonFieldPackingVis;