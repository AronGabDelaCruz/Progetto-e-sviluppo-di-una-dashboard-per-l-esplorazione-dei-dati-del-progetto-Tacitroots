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
    <div className="card-container">

      <div className="card-header">
        <h2 className="card-title">
          Scambio lettere negli anni
        </h2>
      </div>

      <div className="card-wrapper">
        {!data.length ? (
          <div style={{ color: "#888", fontSize: "14px" }}>
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