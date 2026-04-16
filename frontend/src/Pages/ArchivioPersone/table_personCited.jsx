import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function PersonCitedByTable({ name }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/person-cited/${name}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Persone Citate</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Persona</th>
              <th style={styles.th}>Numero citazioni</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td style={styles.td} colSpan={2}>
                  Nessuno ha citato questa persona
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i}>
                  <td style={styles.td}>{row.person}</td>
                  <td style={styles.td}>{row.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PersonCitedByTable;

const styles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    height: "500px",
    display: "flex",
    flexDirection: "column",
    padding: "10px"
  },

  title: {
    marginBottom: "10px",
    flexShrink: 0
  },

  tableWrapper: {
    flex: 1,
    overflowY: "auto",
    border: "1px solid #eee",
    borderRadius: "8px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    position: "sticky",
    top: 0,
    backgroundColor: "#fafafa",
    textAlign: "left",
    padding: "10px",
    borderBottom: "2px solid #eee",
    zIndex: 1
  },

  td: {
    padding: "10px",
    borderBottom: "1px solid #eee"
  },

  button: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#dddddd",
    color: "black",
    cursor: "pointer"
  }
};