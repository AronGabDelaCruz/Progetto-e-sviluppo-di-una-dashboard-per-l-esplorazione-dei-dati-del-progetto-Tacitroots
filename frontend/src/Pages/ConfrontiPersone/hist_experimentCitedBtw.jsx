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

const API_URL = process.env.REACT_APP_API_URL;

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
    <div className="hist-container">

      <div className="hist-header">
        <h2 className="hist-title">
          Esperimenti citati
        </h2>
      </div>

      <div className="hist-wrapper">
        {!data.length ? (
          <div className="hist-empty">
            Nessun dato disponibile
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