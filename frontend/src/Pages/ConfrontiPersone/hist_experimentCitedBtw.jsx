import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import "../../Styles/HistStyle.css";
import "../../Styles/MultiPurposeStyle.css";
const API_URL = window.__API_URL__;

function PersonExperimentHistogram({ person1, person2 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!person1 || !person2) return;

    fetch(`${API_URL}/person-experiment-histogram/${person1}/${person2}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [person1, person2]);

  if (!person1 || !person2) return null;

  return (
    <div className="card-container">

      <div className="card-header-legend">
        <h2 className="card-title">
          Cited experiments
        </h2>
      <p className="card-description">place holder 6</p>
      </div>

      <div className="card-wrapper">
        {!data.length ? (
          <div className="hist-empty">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="experiment" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="count"
                fill="#8884d8"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}

export default PersonExperimentHistogram;