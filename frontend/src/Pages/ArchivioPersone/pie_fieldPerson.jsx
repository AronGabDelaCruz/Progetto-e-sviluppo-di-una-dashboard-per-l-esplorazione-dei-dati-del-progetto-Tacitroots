import React, { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "../../Styles/MultiPurposeStyle.css";
import InfoBubble from "../../Utility/Bubble";
const API_URL = process.env.REACT_APP_API_URL;

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
  const [radius, setRadius] = useState(100);
  const [fontSize, setFontSize] = useState(12);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;

      if (w < 480) {
        setRadius(60);
        setFontSize(9);
      } else if (w < 768) {
        setRadius(80);
        setFontSize(10);
      } else {
        setRadius(100);
        setFontSize(12);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/person-field-pie/${name}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  return (
    <div className="card-container">

      <div className="card-header-legend">
        <h2 className="card-title">
          Main topics
        </h2>
        <InfoBubble 
        text="TBD" />

      </div>

      <div className="card-wrapper">

        {data.length === 0 ? (
          <div className="pie-empty">
            No field data for this person
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={data}
                dataKey="count"
                nameKey="field"
                cx="50%"
                cy="50%"
                outerRadius={radius}
                label={{ fontSize }}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{ fontSize }}
              />

              <Legend
                wrapperStyle={{ fontSize }}
              />

            </PieChart>
          </ResponsiveContainer>
        )}

      </div>
    </div>
  );
}

export default PersonFieldPie;