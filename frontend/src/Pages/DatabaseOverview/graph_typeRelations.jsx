import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "../../Styles/MultiPurposeStyle.css";

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
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
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
        Grafo Relazioni: {relation || "Seleziona una relazione"}
      </h2>

      <div ref={ref} className="card-wrapper" />

    </div>
  );
}