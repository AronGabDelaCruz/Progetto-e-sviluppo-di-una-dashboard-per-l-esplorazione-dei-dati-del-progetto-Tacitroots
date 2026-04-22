import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";
const API_URL = process.env.REACT_APP_API_URL;
const Graph = () => {
  const networkRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await fetch(`${API_URL}/schema-relazioni`);
        const json = await res.json();

        setNodes(json.nodes);
        setEdges(json.edges);

        console.log("NODES:", json.nodes);
        console.log("EDGES:", json.edges);
      } catch (err) {
        console.error("Errore fetch grafo:", err);
      }
    };

    fetchGraph();
  }, []);

  useEffect(() => {
    if (nodes.length === 0) return;

    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges),
    };

    const options = {
      nodes: {
        shape: "dot",
        size: 18,
        font: {
          size: 16,
          bold: true,
        },
      },
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 0.6 },
        },
        smooth: true,
      },
      physics: {
        enabled: true,
        stabilization: false,
      },
    };

    const network = new Network(networkRef.current, data, options);

    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        alert(`Hai cliccato il tipo nodo: ${nodeId}`);
      }
    });

    return () => network.destroy();
  }, [nodes, edges]);

  return (
  <div
    style={{
      width: "400px",
      height: "300px",
      border: "2px solid red",
      borderRadius: "10px",
      padding: "5px",
      boxSizing: "border-box",
    }}
  >
    <div
      ref={networkRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  </div>
  );
};

export default Graph;