import React, { useEffect, useState } from "react";

function PersonCitedByTable({ name }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`http://localhost:3001/person-cited-by/${name}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  return (
    <div style={containerStyle}>
      <h3 style={{ padding: "10px" }}>Chi ha citato: {name}</h3>

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Persona</th>
            <th style={thStyle}>Numero citazioni</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td style={tdStyle} colSpan="2">
                Nessuno ha citato questa persona
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i}>
                <td style={tdStyle}>{row.person}</td>
                <td style={tdStyle}>{row.count}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PersonCitedByTable;
const containerStyle = {
  maxHeight: "400px",
  overflowY: "auto",
  border: "1px solid #ddd",
  marginTop: "20px"
};

const tableStyle = {
  borderCollapse: "collapse",
  width: "100%"
};

const theadStyle = {
  position: "sticky",
  top: 0,
  backgroundColor: "#f4f4f4",
  zIndex: 1
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left"
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px"
};