import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";

const API_URL = process.env.REACT_APP_API_URL;

const Graph = ({ label }) => {
  const ref = useRef(null);
  const networkRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!label) return;

    const fetchGraph = async () => {
      try {
        console.log("API_URL:", API_URL);

        if (!API_URL) {
          console.error("REACT_APP_API_URL non definito!");
          return;
        }

        const res = await fetch(`${API_URL}/graph/${label}`);
        const json = await res.json();

        setNodes(json.nodes || []);
        setEdges(json.edges || []);
      } catch (err) {
        console.error("Errore fetch grafo:", err);
      }
    };

    fetchGraph();
  }, [label]);

  
  useEffect(() => {
    if (!ref.current) return;
    if (nodes.length === 0) return;

  
    const normalizedEdges = edges.map((e, i) => ({
      id: `${e.from}-${e.to}-${i}`,
      from: e.from,
      to: e.to,

    
      label: `${e.rels.length}`,

    
      title: e.rels.join("\n"),

      rels: e.rels,

      smooth: {
        enabled: true,
        type: "curvedCW",
        roundness: 0.15 + (i % 5) * 0.05
      }
    }));

    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(normalizedEdges),
    };

    const options = {
      nodes: {
        shape: "dot",
        size: 18,
        font: {
          size: 14,
          face: "arial",
        },
      },

      edges: {
        arrows: { to: true },
        font: {
          size: 10,
          align: "middle",
        },
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

    network.on("click", (params) => {
      if (params.edges.length > 0) {
        const edgeId = params.edges[0];

        const edge = normalizedEdges.find(e => e.id === edgeId);

        if (edge?.rels?.length) {
console.log("Relazioni edge:", edge.rels);
        }
      }

      if (params.nodes.length > 0) {
        console.log("Nodo cliccato:", params.nodes[0]);
      }
    });

    return () => network.destroy();
  }, [nodes, edges]);

  return (
  <div style={styles.container}>
    <h2 style={styles.title}>
      Grafo Nodo: {label || "Seleziona un nodo"}
    </h2>

    <div
      ref={ref}
      style={styles.graphWrapper}
    />
  </div>
  );
};
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
export default Graph;