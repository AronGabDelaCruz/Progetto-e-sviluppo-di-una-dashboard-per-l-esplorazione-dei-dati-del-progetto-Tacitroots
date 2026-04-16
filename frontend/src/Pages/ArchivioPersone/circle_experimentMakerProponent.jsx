import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";

const API_URL = process.env.REACT_APP_API_URL;

function PersonExperimentPackingVis({ name }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/person-experiment-packing/${name}`)
      .then(res => res.json())
      .then(raw => {
        console.log("RAW EXPERIMENTS:", raw);

        const nodes = raw.map((d, i) => ({
          id: i,
          label: d.experiment || "unknown",
          value: d.count,
          group: d.type,
          shape: "dot",

          scaling: {
            min: 12,
            max: 55
          },

          color:
            d.type === "invented"
              ? {
                  background: "#ff4d4f",
                  border: "#a8071a"
                }
              : {
                  background: "#52c41a",
                  border: "#237804"
                },

          font: {
            size: 12,
            color: "#1f1f1f",
            face: "arial",
            align: "center"
          },

          title: `
Experiment: ${d.experiment}
Type: ${d.type}
Citations: ${d.count}
`
        }));

        const data = {
          nodes: new DataSet(nodes),
          edges: []
        };

        const options = {
          physics: {
            enabled: true,
            stabilization: false,
            solver: "barnesHut",
            barnesHut: {
              gravitationalConstant: -1200,
              centralGravity: 0.35,
              springLength: 70,
              springConstant: 0.05
            },
            minVelocity: 0.5
          },

          nodes: {
            shape: "dot",
            borderWidth: 1,
            scaling: {
              min: 12,
              max: 55
            }
          },

          interaction: {
            dragNodes: true,
            zoomView: true,
            hover: true
          }
        };

        if (networkRef.current) {
          networkRef.current.destroy();
          networkRef.current = null;
        }

        networkRef.current = new Network(
          containerRef.current,
          data,
          options
        );
      })
      .catch(console.error);
  }, [name]);

  if (!name) return null;

return (
  <div style={styles.container}>
    
    <div style={styles.header}>
      <h2 style={styles.title}>
        Esperimenti Proposti/Inventati
      </h2>

      {/* 🔥 LEGEND */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <span style={{ ...styles.dot, background: "#ff4d4f" }} />
          Invented
        </div>

        <div style={styles.legendItem}>
          <span style={{ ...styles.dot, background: "#52c41a" }} />
          Proposed
        </div>
      </div>
    </div>

    <div ref={containerRef} style={styles.graphWrapper} />
  </div>
);
}

export default PersonExperimentPackingVis;

const styles = {
  container: {
    height: "500px",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "12px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    overflow: "hidden"
  },

  title: {
    marginBottom: "10px",
    flexShrink: 0
  },

  subtitle: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "10px",
    flexShrink: 0
  },

  graphWrapper: {
    flex: 1,
    minHeight: 0
  },
  header: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
  flexShrink: 0
},

legend: {
  display: "flex",
  gap: "12px",
  fontSize: "12px",
  color: "#333",
  alignItems: "center"
},

legendItem: {
  display: "flex",
  alignItems: "center",
  gap: "6px"
},

dot: {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  display: "inline-block"
}
};