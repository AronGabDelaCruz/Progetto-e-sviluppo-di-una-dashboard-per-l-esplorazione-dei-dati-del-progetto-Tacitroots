// src/components/TimelineChart.jsx
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
const API_URL = process.env.REACT_APP_API_URL;
export default function TimelineChart() {
  const [data, setData] = useState([]);

  const fetchData = () => {
    const params = new URLSearchParams(window.location.search);
    const field = params.get("field");

    const url = field
      ? fetch(`${API_URL}/lettere-per-anno?field=${encodeURIComponent(field)}`)
      : "http://localhost:3001/lettere-per-anno";

    fetch(url)
      .then(res => res.json())
      .then(rawData => {
        const start = 1645;
        const end = 1680;

        const map = {};
        rawData.forEach(d => {
          map[d.anno] = d.lettere;
        });

        const fullData = [];
        for (let year = start; year <= end; year++) {
          fullData.push({ anno: year, lettere: map[year] || 0 });
        }

        setData(fullData);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();

    
    const listener = () => fetchData();
    window.addEventListener("fieldChanged", listener);

    return () => window.removeEventListener("fieldChanged", listener);
  }, []);

  return (
    <BarChart
      width={800}
      height={400}
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="anno" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="lettere" fill="#82ca9d" />
    </BarChart>
  );
}