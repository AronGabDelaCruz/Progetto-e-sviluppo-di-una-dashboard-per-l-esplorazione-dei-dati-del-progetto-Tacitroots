import React, { useEffect, useState } from "react";
const API_URL = process.env.REACT_APP_API_URL;
function PersonInstrumentList({ name }) {
  const [invented, setInvented] = useState([]);
  const [proposed, setProposed] = useState([]);

  useEffect(() => {
    if (!name) return;
    
    fetch(`${API_URL}/person-instrument-packing/${name}`)
      .then(res => res.json())
      .then(raw => {
        console.log("RAW:", raw);

        const inv = raw.filter(d => d.type === "invented");
        const prop = raw.filter(d => d.type === "proposed");

        setInvented(inv);
        setProposed(prop);
      })
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  return (
    <div style={containerStyle}>
      <h3>Strumenti Inventati/Proposti</h3>
      <div style={gridStyle}>
        <div style={columnStyle}>
          <h4 style={{ color: "#ff4d4f" }}>Invented</h4>

          {invented.length === 0 ? (
            <p>Nessuno strumento inventato</p>
          ) : (
            invented.map((d, i) => (
              <div key={i} style={itemStyle}>
                <strong>{d.instrument || "unknown"}</strong>
                <span>{d.count} citazioni</span>
              </div>
            ))
          )}
        </div>

        <div style={columnStyle}>
          <h4 style={{ color: "#52c41a" }}>Proposed</h4>

          {proposed.length === 0 ? (
            <p>Nessuno strumento proposto</p>
          ) : (
            proposed.map((d, i) => (
              <div key={i} style={itemStyle}>
                <strong>{d.instrument || "unknown"}</strong>
                <span>{d.count} citazioni</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonInstrumentList;
const containerStyle = {
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    height: "500px",
    display: "flex",
    flexDirection: "column",
    padding: "10px"
};

const gridStyle = {
  display: "flex",
  gap: "20px"
};

const columnStyle = {
  flex: 1,
  padding: "10px",
  border: "1px solid #eee",
  borderRadius: "6px",
  background: "white"
};

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: "1px solid #eee"
};