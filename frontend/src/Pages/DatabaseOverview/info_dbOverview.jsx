import { useEffect, useState } from "react";
import "../../Styles/MiniContainer.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function DatabaseOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/db-overview`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="db-container">
      <div className="db-card">
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
    <div className="db-stat">
      <div className="db-value">{value}</div>
      <div className="db-label">{label}</div>
    </div>
  );
}

