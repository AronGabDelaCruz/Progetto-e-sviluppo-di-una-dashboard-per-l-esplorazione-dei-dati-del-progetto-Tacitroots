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

import "../../Styles/MultiPurposeStyle.css";


const API_URL = process.env.REACT_APP_API_URL;

function FieldTimelineWithCitations({ selectedTopic }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!selectedTopic) return;

    fetch(`${API_URL}/field-timeline-citations/${selectedTopic}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [selectedTopic]);

  if (!selectedTopic) return null;

  return (
    <div className="card-container">

      <div className="card-header-legend">
        <h2 className="card-title">
          Field activity vs book citations
        </h2>
        <p className="card-description">place holder 1</p>
        </div>

      <div className="card-wrapper">

        {!data.length ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: "14px"
          }}>
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />

              {/* Line 1 */}
              <Line
                type="monotone"
                dataKey="field_discussions"
                stroke="#8884d8"
                strokeWidth={2}
                name="Field discussions"
              />

              {/* Line 2 */}
              <Line
                type="monotone"
                dataKey="book_citations"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Book citations"
              />

            </LineChart>
          </ResponsiveContainer>
        )}

      </div>
    </div>
  );
}

export default FieldTimelineWithCitations;