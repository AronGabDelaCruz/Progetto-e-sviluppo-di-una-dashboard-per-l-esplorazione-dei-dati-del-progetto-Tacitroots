import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";

function PersonGraph({ name }) {
  const ref = useRef(null);
  const networkRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!name) return;
    setNodes([]);
    setEdges([]);

  if (!name) return;
    fetch(`http://localhost:3001/person-graph/${name}`)
      .then(res => res.json())
      .then(data => {
        setNodes(data.nodes);
        setEdges(data.edges);
      })
      .catch(console.error);
  }, [name]);

  useEffect(() => {
    if (!ref.current || nodes.length === 0) return;
    if (networkRef.current) {
  networkRef.current.destroy();
  networkRef.current = null;
}   
    
    const styledNodes = nodes.map(n => ({
      ...n,

      label: n.label, // testo dentro il nodo

      shape: "dot",
      size: n.label === name ? 35 : 25,

      color: n.label === name
        ? {
            background: "#ff4d4f",
            border: "#a8071a",
            highlight: {
              background: "#ff7875",
              border: "#a8071a"
            }
          }
        : {
            background: "#69c0ff",
            border: "#096dd9",
            highlight: {
              background: "#91d5ff",
              border: "#096dd9"
            }
          },

      font: {
        color: "#000",
        size: 14,
        face: "arial",
        align: "center"
      }
    }));

    
    const normalizedEdges = edges.map((e, i) => ({
  id: `${e.from}-${e.to}-${i}`,
  from: e.from,
  to: e.to,

  label: "", // 
  title: e.rels.join("\n"),

  arrows: "to",

  smooth: {
    enabled: true,
    type: "curvedCW",
    roundness: 0.2
  }
}));

    const data = {
      nodes: new DataSet(styledNodes),
      edges: new DataSet(normalizedEdges)
    };

    const options = {
      nodes: {
        shape: "dot"
      },

      edges: {
        arrows: { to: true }
      },

      physics: {
        enabled: true,
        stabilization: false
      },

      interaction: {
        hover: true
      }
    };

    if (networkRef.current) networkRef.current.destroy();

    const network = new Network(ref.current, data, options);
    networkRef.current = network;

    return () => network.destroy();
  }, [nodes, edges, name]);

  if (!name) return null;

  return (
    <div style={containerStyle}>
      <h3>Connessioni di: {name}</h3>
      <div ref={ref} style={{ height: "400px" }} />
    </div>
  );
}

const containerStyle = {
  marginTop: "20px",
  border: "1px solid #ddd",
  padding: "10px",
  borderRadius: "8px"
};

export default PersonGraph;