import React, { useEffect, useState } from "react";

function PersonInstrumentList({ name }) {
  const [invented, setInvented] = useState([]);
  const [proposed, setProposed] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`http://localhost:3001/person-instrument-packing/${name}`)
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
      <h3>Strumenti di {name}</h3>

      <div style={gridStyle}>
        {/* INVENTED */}
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

        {/* PROPOSED */}
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
  marginTop: "20px",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  background: "#fafafa"
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