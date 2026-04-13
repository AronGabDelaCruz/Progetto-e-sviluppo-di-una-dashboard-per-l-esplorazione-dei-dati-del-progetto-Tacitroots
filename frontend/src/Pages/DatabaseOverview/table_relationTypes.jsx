import { useEffect, useState } from "react";

export default function RelationTypesTable({ onView }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/relation-types")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Relation Types</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Relation</th>
              <th style={styles.th}>Count</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td style={styles.td}>{row.relation}</td>
                <td style={styles.td}>{row.count}</td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => onView(row.relation)}
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

const styles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    height: "500px",
    display: "flex",
    flexDirection: "column"
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