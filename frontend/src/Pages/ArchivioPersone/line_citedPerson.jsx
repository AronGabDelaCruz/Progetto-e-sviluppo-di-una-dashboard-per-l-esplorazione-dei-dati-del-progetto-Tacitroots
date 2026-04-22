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

import "../../Styles/CircleStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

function PersonCitationsLine({ name }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/person-citation-timeline/${name}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  return (
    <div className="circle-container">

      <div className="circle-header">
        <h2 className="circle-title">
          Citazioni nel Tempo
        </h2>
      </div>

      <div className="circle-wrapper">

        {!data.length ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: "14px"
          }}>
            Nessun dato citazioni per anno
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

export default PersonCitationsLine;