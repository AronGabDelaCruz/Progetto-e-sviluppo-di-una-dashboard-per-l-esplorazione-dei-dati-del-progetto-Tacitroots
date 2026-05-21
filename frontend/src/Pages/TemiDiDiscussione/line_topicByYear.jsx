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
import InfoBubble from "../../Utility/Bubble";

const API_URL = process.env.REACT_APP_API_URL;

function TopicTimeline({ selectedTopic }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!selectedTopic) return;

    fetch(`${API_URL}/topic-timeline/${selectedTopic}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);

  }, [selectedTopic]);

  if (!selectedTopic) return null;

  return (
    <div className="card-container">

      <div className="card-header-legend">
        <h2 className="card-title">
        Trend of { selectedTopic } over the years
        </h2>

        <InfoBubble text="Shows how many documents/letters are associated with this topic over time." />
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

export default TopicTimeline;