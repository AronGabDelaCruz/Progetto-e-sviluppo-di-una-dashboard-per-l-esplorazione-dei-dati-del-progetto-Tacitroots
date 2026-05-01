import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";
import "../../Styles/CircleStyle.css";
import "../../Styles/MultiPurposeStyle.css";
const API_URL = process.env.REACT_APP_API_URL;

function PersonExperimentPackingVis({ name }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/person-experiment-packing/${name}`)
      .then(res => res.json())
      .then(raw => {
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
            color: "#1f1f1f"
          },

          title: `Experiment: ${d.experiment}\nType: ${d.type}\nCitations: ${d.count}`
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
      gravitationalConstant: -900,  
      centralGravity: 0.3,
      springLength: 200,            
      springConstant: 0.04,
      damping: 0.09
    }
    
          },
          interaction: {
            hover: true,
            dragNodes: true,
            zoomView: true
          },
            nodes: {
    shape: "dot",
    font: {
      size: 30,
      face: "arial",
      color: "#1f1f1f",
      bold: true
    }
  },
        };

        if (networkRef.current) {
          networkRef.current.destroy();
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
    <div className="card-container">

      <div className="card-header">
        <h2 className="card-title">
          Esperimenti Proposti/Inventati
        </h2>

        <div className="circle-legend">
          <div className="circle-legend-item">
            <span className="circle-dot" style={{ background: "#ff4d4f" }} />
            Invented
          </div>

          <div className="circle-legend-item">
            <span className="circle-dot" style={{ background: "#52c41a" }} />
            Proposed
          </div>
        </div>
      </div>

      <div ref={containerRef} className="card-wrapper" />

    </div>
  );
}

export default PersonExperimentPackingVis;