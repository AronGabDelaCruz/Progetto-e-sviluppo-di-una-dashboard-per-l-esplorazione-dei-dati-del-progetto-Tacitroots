import React, { useEffect, useState } from "react";
import {ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ffc0cb"
];

function PersonFieldPie({ name }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`http://localhost:3001/person-field-pie/${name}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  if (data.length === 0) {
    return <p>No field data for this person</p>;
  }

  return (
<div style={{ width: "100%", height: 300 }}>
  <ResponsiveContainer>
    <PieChart>
      <Pie
        data={data}
        dataKey="count"
        nameKey="field"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>
  );
}

const containerStyle = {
  marginTop: "20px",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  background: "#fafafa"
};

export default PersonFieldPie;