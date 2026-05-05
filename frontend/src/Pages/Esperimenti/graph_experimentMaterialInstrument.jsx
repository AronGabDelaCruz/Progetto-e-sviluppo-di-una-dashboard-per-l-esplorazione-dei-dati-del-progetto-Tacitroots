import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "../../Styles/MultiPurposeStyle.css";
import InfoBubble from "../../Utility/Bubble";
const API_URL = process.env.REACT_APP_API_URL;

function ExperimentGraph({ name }) {
  const ref = useRef(null);
  const networkRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/experiment-graph/${name}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.nodes || data.nodes.length === 0) {
          setError(true);
          setNodes([]);
          setEdges([]);
        } else {
          setError(false);
          setNodes(data.nodes);
          setEdges(data.edges);
        }
      })
      .catch(() => setError(true));
  }, [name]);

  useEffect(() => {
    if (!ref.current || nodes.length === 0) return;

    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges),
    };

    const options = {
      nodes: {
        shape: "dot",
        size: 18,
        font: { size: 14 }
      },
      edges: {
        smooth: true
      },
      physics: {
        enabled: true,
        stabilization: false
      },
      interaction: {
        hover: true
      }
    };

    if (networkRef.current) {
      networkRef.current.destroy();
    }

    networkRef.current = new Network(ref.current, data, options);

    requestAnimationFrame(() => {
      networkRef.current?.fit();
    });

    return () => {
      networkRef.current?.destroy();
    };
  }, [nodes, edges]);

  if (!name) return null;

  return (
    <div className="card-container">

  <div className="card-header-legend">
    <h2 className="card-title">
      Esperimento: {name}
    </h2>
          <InfoBubble 
          text="TBD" />
    <div className="legend">
      <div className="legend-item">
        <span className="legend-dot" style={{ background: "#1677ff" }} />
        Esperimento
      </div>

      <div className="legend-item">
        <span className="legend-dot" style={{ background: "#52c41a" }} />
        Materiali
      </div>

      <div className="legend-item">
        <span className="legend-dot" style={{ background: "#fa8c16" }} />
        Strumenti
      </div>
    </div>
  </div>

      <div className="card-wrapper">

        {error ? (
          <div style={{ color: "#888", fontSize: "14px" }}>
            Nessun dato disponibile per questo esperimento
          </div>
        ) : (
          <div ref={ref} style={{ width: "100%", height: "100%" }} />
        )}

      </div>

    </div>
  );
}

export default ExperimentGraph;