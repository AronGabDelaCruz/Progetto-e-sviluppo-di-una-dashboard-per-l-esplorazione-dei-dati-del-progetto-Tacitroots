import { useEffect, useState } from "react";

export default function NodeTypesTable({ onView }) {
  const [data, setData] = useState([]);
const handleView = (label) => {
  onView(label);
};
  useEffect(() => {
    fetch("http://localhost:3001/nodes-by-label")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Node Types</h2>

  
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Count</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td style={styles.td}>{row.label}</td>
                <td style={styles.td}>{row.count}</td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => handleView(row.label)}
                    >
                    View
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ROW_HEIGHT = 45; // altezza riga

const styles = {
  container: {
    marginTop: "30px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },
  title: {
    marginBottom: "15px"
  },

  // 👇 SCROLL QUI
  tableWrapper: {
    maxHeight: `${ROW_HEIGHT * 10 + 50}px`, // 10 righe + header
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
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer"
  }
};