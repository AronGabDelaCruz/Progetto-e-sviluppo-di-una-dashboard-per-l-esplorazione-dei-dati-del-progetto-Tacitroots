import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const API_URL = process.env.REACT_APP_API_URL;

function PersonsExchangeLine({ person1, person2 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!person1 || !person2) return;

    fetch(`${API_URL}/persons-exchange-timeline/${person1}/${person2}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [person1, person2]);

  if (!person1 || !person2) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          Scambio lettere: {person1} ↔ {person2}
        </h2>
      </div>

      <div style={styles.chartWrapper}>
        {!data.length ? (
          <div style={styles.empty}>
            Nessun dato disponibile
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default PersonsExchangeLine;
const styles = {
  container: {
    height: "500px",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "10px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    overflow: "hidden"
  },

  header: {
    flexShrink: 0,
    marginBottom: "10px"
  },

  title: {
    marginBottom: "10px"
  },

  chartWrapper: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  empty: {
    color: "#888",
    fontSize: "14px"
  }
};