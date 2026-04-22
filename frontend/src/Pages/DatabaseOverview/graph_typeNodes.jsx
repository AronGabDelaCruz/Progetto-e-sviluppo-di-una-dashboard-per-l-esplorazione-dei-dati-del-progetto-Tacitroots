import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "../../Styles/MultiPurposeStyle.css";

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
        if (!API_URL) return;

        const res = await fetch(`${API_URL}/graph/${label}`);
        const json = await res.json();

        setNodes(json.nodes || []);
        setEdges(json.edges || []);
      } catch (err) {
        console.error(err);
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
      networkRef.current = null;
    }

 
    networkRef.current = new Network(ref.current, data, options);


    requestAnimationFrame(() => {
      if (networkRef.current) {
        networkRef.current.fit();
        networkRef.current.redraw();
      }
    });


    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [nodes, edges]);

  return (
    <div className="card-container">
      <h2 className="card-title">
        Grafo Nodo: {label || "Seleziona un nodo"}
      </h2>

      <div ref={ref} className="card-wrapper" />
    </div>
  );
};

export default Graph;