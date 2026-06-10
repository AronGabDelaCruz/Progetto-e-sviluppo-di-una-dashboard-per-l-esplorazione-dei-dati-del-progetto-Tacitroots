import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

const API_URL = process.env.REACT_APP_API_URL;

export default function ReceiverSenderFieldSankey({ name }) {
  const ref = useRef();
  const containerRef = useRef();

  const [data, setData] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/receiver-sender-field-sankey/${name}`)
      .then(res => res.json())
      .then(setData);
  }, [name]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;

      setSize(prev =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height: Math.max(height, 400) }
      );
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!data || !size.width || !size.height) return;

    d3.select(ref.current).selectAll("*").remove();

    if (!data.links?.length) {
      d3.select(ref.current)
        .append("div")
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "flex")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .style("color", "#666")
        .text("No data available");

      return;
    }

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${size.width} ${size.height}`);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const graph = sankey()
      .nodeWidth(16)
      .nodePadding(12)
      .extent([[10, 10], [size.width - 10, size.height - 10]])({
        nodes: data.nodes.map(d => ({ ...d })),
        links: data.links.map(d => ({ ...d }))
      });

    // -----------------------------
    // LINKS
    // -----------------------------
    svg.append("g")
      .selectAll("path")
      .data(graph.links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("fill", "none")
      .attr("stroke", d => color(d.source.name))
      .attr("stroke-width", d => Math.max(1, d.width))
      .attr("opacity", 0.4);

    // -----------------------------
    // NODES
    // -----------------------------
    const node = svg.append("g")
      .selectAll("g")
      .data(graph.nodes)
      .join("g");

    node.append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.name))
      .attr("rx", 3);

    // -----------------------------
    // LABELS (FIX LOGICO)
    // -----------------------------
    node.append("text")
      .attr("x", d => (d.depth === 2 ? d.x0 - 6 : d.x1 + 6))
      .attr("y", d => (d.y0 + d.y1) / 2)
      .attr("text-anchor", d => (d.depth === 2 ? "end" : "start"))
      .style("font-size", "10px")
      .style("fill", "#333")
      .each(function (d) {
        const text = d3.select(this);
        text.text(null);

        // 🔥 SOLO COLONNA DESTRA = WRAP
        if (d.depth === 2) {
          const words = String(d.name).split(" ");

          words.forEach((word, i) => {
            text.append("tspan")
              .attr("x", d.x0 - 6)
              .attr("dy", i === 0 ? "0em" : "1.1em")
              .text(word);
          });
        }

        // 🔥 SINISTRA + CENTRO = TESTO NORMALE
        else {
          text.text(d.name);
        }
      });

  }, [data, size]);

  return (
  <div style={{ height: "500px", width: "100%" }}>
    <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <div ref={ref} />
    </div>
  </div>
  );
}