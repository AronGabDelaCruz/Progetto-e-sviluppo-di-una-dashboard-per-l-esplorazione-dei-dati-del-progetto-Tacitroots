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
function PersonCitationsLine({ name }) {
  const [data, setData] = useState([]);

useEffect(() => {
  if (!name) return;

  fetch(`${API_URL}/person-citation-timeline/${name}`)
    .then(res => res.json())
    .then(data => {
      console.log("DATA BACKEND:", data); 
      setData(data);
    })
    .catch(console.error);
}, [name]);

  if (!name) return null;

  if (!data.length) {
    return <p>Nessun dato citazioni per anno</p>;
  }

  return (
    <div style={{ width: "100%", height: 400, marginTop: 20 }}>
      <h3>Citations per year: {name}</h3>

      <ResponsiveContainer>
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
    </div>
  );
}

export default PersonCitationsLine;