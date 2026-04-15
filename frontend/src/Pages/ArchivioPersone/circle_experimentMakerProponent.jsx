import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";

function PersonExperimentPackingVis({ name }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!name) return;

    fetch(`http://localhost:3001/person-experiment-packing/${name}`)
      .then(res => res.json())
      .then(raw => {
        console.log("RAW EXPERIMENTS:", raw);

        const nodes = raw.map((d, i) => ({
          id: i,
          label: d.experiment || "unknown",
          value: d.count,

          group: d.type,

          color:
            d.type === "invented"
              ? "#ff4d4f"
              : "#52c41a",

          shape: "dot",
          scaling: {
            min: 10,
            max: 60
          },

          title: `
${d.experiment}
Type: ${d.type}
Citations: ${d.count}
`
        }));

        const nodesDataSet = new DataSet(nodes);

        const data = {
          nodes: nodesDataSet,
          edges: []
        };

        const options = {
          physics: {
            enabled: true,
            stabilization: false,
            solver: "barnesHut",
            barnesHut: {
              gravitationalConstant: -1300, 
              centralGravity: 0.4,          
              springLength: 60,             
              springConstant: 0.05
            },
            minVelocity: 0.75
          },

          nodes: {
            shape: "dot",
            font: {
              size: 12,
              color: "#333"
            }
          },

          interaction: {
            dragNodes: true,
            zoomView: true
          }
        };

        if (networkRef.current) {
          networkRef.current.destroy();
        }

        networkRef.current = new Network(
          containerRef.current,
          data,
          options
        );
      })
      .catch(console.error);
  }, [name]);

  return (
    <div>
      <h3>Experiment packing (Vis Network): {name}</h3>

      <div
        ref={containerRef}
        style={{ height: "600px", border: "1px solid #ddd" }}
      />
    </div>
  );
}

export default PersonExperimentPackingVis;