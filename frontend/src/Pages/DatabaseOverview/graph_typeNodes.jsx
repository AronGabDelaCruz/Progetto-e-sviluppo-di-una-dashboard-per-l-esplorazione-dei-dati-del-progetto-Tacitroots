import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";

const Graph = ({ label }) => {
  const ref = useRef(null);
  const networkRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!label) return;

    const fetchGraph = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/graph/${label}`
        );
        const json = await res.json();

        setNodes(json.nodes);
        setEdges(json.edges);
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

      // opzionale: hover con dettagli
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
    <div
      ref={ref}
      style={{
        height: "500px",
        border: "1px solid lightgray",
        borderRadius: "8px",
      }}
    />
  );
};

export default Graph;