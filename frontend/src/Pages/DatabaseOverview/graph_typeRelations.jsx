import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
const API_URL = process.env.REACT_APP_API_URL;
export default function RelationGraph({ relation }) {
  const ref = useRef(null);
  const networkRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!relation) return;

    fetch(`${API_URL}/graph/relation/${relation}`)
      .then(res => res.json())
      .then(data => {
        setNodes(data.nodes);
        setEdges(data.edges);
      });
  }, [relation]);

  useEffect(() => {
    if (!ref.current) return;
    if (nodes.length === 0) return;

    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges),
    };

    const options = {
      nodes: {
        shape: "dot",
        size: 18,
        font: { size: 14, face: "arial" },
      },
      edges: {
        arrows: { to: true },
        font: { size: 10, align: "middle" },
        smooth: false,
      },
      physics: {
        enabled: true,
        stabilization: false,
      },
      interaction: {
        hover: true,
      },
    };

    if (networkRef.current) {
      networkRef.current.destroy();
    }

    const network = new Network(ref.current, data, options);
    networkRef.current = network;

    return () => network.destroy();
  }, [nodes, edges]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        Grafo Relazioni: {relation || "Seleziona una relazione"}
      </h2>

      <div ref={ref} style={styles.graphWrapper} />
    </div>
  );
}
const styles = {
  container: {
    height: "500px",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "10px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  title: {
    margin: 0,
    marginBottom: "10px",
    flexShrink: 0,
  },

  graphWrapper: {
    flex: 1,
    minHeight: 0,
  }
};