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
import "../../Styles/MultiPurposeStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

function ExperimentTimeline({ name }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/experiment-timeline/${name}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  return (
    <div className="card-container">

      <div className="card-header-legend">
        <h2 className="card-title">
          Citation over the years
        </h2>
        <p className="card-description">place holder 1</p>
      </div>

      <div className="card-wrapper">

        {!data.length ? (
          <div style={{ color: "#888", fontSize: "14px" }}>
            No data available
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

export default ExperimentTimeline;