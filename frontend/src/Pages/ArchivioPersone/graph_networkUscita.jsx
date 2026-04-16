import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";

const API_URL = process.env.REACT_APP_API_URL;

function PersonGraph({ name }) {
  const ref = useRef(null);
  const networkRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!name) return;

    setNodes([]);
    setEdges([]);

    fetch(`${API_URL}/person-graph/${name}`)
      .then(res => res.json())
      .then(data => {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      })
      .catch(console.error);
  }, [name]);

  useEffect(() => {
    if (!ref.current) return;
    if (nodes.length === 0) return;

    const styledNodes = nodes.map(n => ({
      ...n,
      label: n.label,
      shape: "dot",
      size: n.label === name ? 22 : 18,
      color:
        n.label === name
          ? {
              background: "#ff4d4f",
              border: "#a8071a"
            }
          : {
              background: "#69c0ff",
              border: "#096dd9"
            }
    }));

    const normalizedEdges = edges.map((e, i) => ({
      id: `${e.from}-${e.to}-${i}`,
      from: e.from,
      to: e.to,
      label: "",
      title: e.rels?.join("\n") || "",
      arrows: "to",
      smooth: {
        enabled: true,
        type: "curvedCW",
        roundness: 0.15 + (i % 5) * 0.05
      }
    }));

    const data = {
      nodes: new DataSet(styledNodes),
      edges: new DataSet(normalizedEdges)
    };

    const options = {
      nodes: {
        shape: "dot",
        size: 18,
        font: {
          size: 14,
          face: "arial"
        }
      },

      edges: {
        arrows: { to: true },
        font: {
          size: 10,
          align: "middle"
        },
        smooth: false
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
      networkRef.current = null;
    }

    const network = new Network(ref.current, data, options);
    networkRef.current = network;

    return () => network.destroy();
  }, [nodes, edges, name]);

  if (!name) return null;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        Network in Uscita
      </h2>

      <div ref={ref} style={styles.graphWrapper} />
    </div>
  );
}

export default PersonGraph;

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
    overflow: "hidden"
  },

  title: {
    margin: 0,
    marginBottom: "10px",
    flexShrink: 0
  },

  graphWrapper: {
    flex: 1,
    minHeight: 0
  }
};