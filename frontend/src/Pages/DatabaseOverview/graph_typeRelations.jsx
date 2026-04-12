import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";

export default function RelationGraph({ relation }) {
  const ref = useRef(null);
  const networkRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!relation) return;

    fetch(`http://localhost:3001/graph/relation/${relation}`)
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
        size: 16,
        font: { size: 14 }
      },
      edges: {
        arrows: "to",
        font: { size: 12 },
        smooth: true
      },
      physics: {
        stabilization: false
      }
    };

    if (networkRef.current) {
      networkRef.current.destroy();
    }

    networkRef.current = new Network(ref.current, data, options);

  }, [nodes, edges]);

  return (
    <div>
      <h3>Graph View</h3>

      {!relation && (
        <p>Select a relation to view the graph</p>
      )}

      <div
        ref={ref}
        style={{
          height: "500px",
          border: "1px solid #ddd"
        }}
      />
    </div>
  );
}