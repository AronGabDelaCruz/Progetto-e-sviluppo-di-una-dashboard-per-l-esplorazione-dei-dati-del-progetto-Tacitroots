import { useEffect, useState } from "react";

export default function DatabaseOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/db-overview")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Stat label="Nodes" value={data.totalNodes} />
        <Stat label="Relationships" value={data.totalRelationships} />
        <Stat label="Node Types" value={data.totalNodeTypes} />
        <Stat label="Rel Types" value={data.totalRelationshipTypes} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <div style={styles.value}>{value}</div>
      <div style={styles.label}>{label}</div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom:"20px",
    width: "100%"
  },
  card: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },
  stat: {
    textAlign: "center",
    flex: 1
  },
  value: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "5px"
  },
  label: {
    fontSize: "14px",
    color: "#666"
  }
};