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
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff"
  },

  title: {
    marginBottom: "10px"
  },

  tableWrapper: {
    maxHeight: "400px",
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
    padding: "8px",
    borderBottom: "2px solid #eee"
  },

  td: {
    padding: "8px",
    borderBottom: "1px solid #eee"
  },

  button: {
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};