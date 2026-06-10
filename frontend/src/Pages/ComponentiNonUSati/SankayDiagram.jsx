import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

export default function VivianiSankeyD3() {
  const ref = useRef();

  const data = {
    nodes: [
      { name: "Vincenzo Viviani" },
      { name: "math" },
      { name: "ita" },
      { name: "storia" },
      { name: "filosofia" },
      { name: "religione" },
      { name: "matematica" },
      { name: "optics" },
      { name: "astronomy" },
      { name: "mechanics" },
      { name: "geometry" },
      { name: "Luca" },
      { name: "Luigi" },
      { name: "Arima" },
      { name: "Elena" },
      { name: "Marco" },
      { name: "Pietro" },
      { name: "Giovanni" },
      { name: "Carlo" },
      { name: "Pietro II" },
      { name: "Alessandro" },
      { name: "Francesca" },
      { name: "Matteo" },
      { name: "Isabella" },
      { name: "Lorenzo" },
      { name: "Sofia" }
    ],
    links: [
      { source: 0, target: 1, value: 66 },
      { source: 0, target: 2, value: 40 },
      { source: 0, target: 3, value: 30 },
      { source: 0, target: 4, value: 25 },
      { source: 0, target: 5, value: 20 },
      { source: 0, target: 6, value: 15 },
      { source: 0, target: 7, value: 18 },
      { source: 0, target: 8, value: 22 },
      { source: 0, target: 9, value: 17 },
      { source: 0, target: 10, value: 28 },

      { source: 1, target: 11, value: 20 },
      { source: 1, target: 13, value: 20 },
      { source: 1, target: 22, value: 26 },

      { source: 2, target: 11, value: 22 },
      { source: 2, target: 14, value: 18 },
      { source: 2, target: 21, value: 12 },

      { source: 3, target: 15, value: 19 },
      { source: 3, target: 18, value: 11 },
      { source: 3, target: 24, value: 14 },

      { source: 4, target: 12, value: 20 },
      { source: 4, target: 20, value: 5 },
      { source: 4, target: 25, value: 10 },

      { source: 5, target: 16, value: 20 },
      { source: 5, target: 23, value: 10 },

      { source: 6, target: 12, value: 15 },
      { source: 6, target: 19, value: 15 },

      { source: 7, target: 11, value: 9 },
      { source: 7, target: 17, value: 9 },

      { source: 8, target: 18, value: 12 },
      { source: 8, target: 20, value: 10 },

      { source: 9, target: 22, value: 17 },
      { source: 10, target: 19, value: 14 },
      { source: 10, target: 24, value: 14 }
    ]
  };

  useEffect(() => {
    if (!data) return;

    const width = 1100;
    const height = 700;

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 🔥 SANKEY LAYOUT
    const graph = sankey()
      .nodeWidth(20)
      .nodePadding(15)
      .extent([[1, 1], [width - 1, height - 6]])({
        nodes: data.nodes.map(d => ({ ...d })),
        links: data.links.map(d => ({ ...d }))
      });

    // -------------------
    // LINKS (SOURCE COLOR)
    // -------------------
    svg.append("g")
      .selectAll("path")
      .data(graph.links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("fill", "none")
      .attr("stroke", d => color(d.source.name))
      .attr("stroke-width", d => Math.max(1, d.width))
      .attr("opacity", 0.5);

    // -------------------
    // NODES
    // -------------------
    const node = svg.append("g")
      .selectAll("g")
      .data(graph.nodes)
      .join("g");

    node.append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => color(d.name));

    node.append("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .style("font-size", "11px")
      .text(d => d.name);

  }, []);

  return <div ref={ref} />;
}