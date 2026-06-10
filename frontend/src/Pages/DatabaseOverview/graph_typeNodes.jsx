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
    if (!ref.current || nodes.length === 0) return;

    const normalizedEdges = edges.map((e, i) => ({
      id: `${e.from}-${e.to}-${i}`,
      from: e.from,
      to: e.to,
      label: `${e.rels.length}`,
      title: e.rels.join("\n"),
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
        font: { size: 14 }
      },
      edges: {
        arrows: { to: true },
        font: { size: 10 },
      },
      physics: { enabled: true },
      interaction: { hover: true }
    };

    if (networkRef.current) {
      networkRef.current.destroy();
    }

    networkRef.current = new Network(ref.current, data, options);

  }, [nodes, edges]);

  return (
    <div className="card-container">
      <div className="card-header-legend">
        <h2 className="card-title">
          Graph node: {label || "Seleziona un nodo"}
        </h2>
             <p className="card-description">place holder 1</p>
      </div>
      <div ref={ref} className="card-wrapper" />
    </div>
  );
};

export default Graph;