import React, { useEffect, useState } from "react";
const API_URL = process.env.REACT_APP_API_URL;

function TableListaPersone({ onView }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/people-stats`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lista Persone</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>Sent</th>
              <th style={styles.th}>Received</th>
              <th style={styles.th}>Totale</th>
              <th style={styles.th}>Azione</th>
            </tr>
          </thead>

          <tbody>
            {data.map((person, index) => (
              <tr key={index}>
                <td style={styles.td}>{person.name}</td>
                <td style={styles.td}>{person.sent}</td>
                <td style={styles.td}>{person.received}</td>
                <td style={styles.td}>{person.totalLetters}</td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => onView(person.name)}
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

export default TableListaPersone;