import React, { useEffect, useState } from "react";

import "../../Styles/HorizontalBarStyle.css";
import "../../Styles/MultiPurposeStyle.css";

import InfoBubble from "../../Utility/Bubble";

const API_URL = process.env.REACT_APP_API_URL;

function TopicBooksTagsBar({ selectedTopic }) {

  const [data, setData] = useState([]);
  const [mode, setMode] = useState("books"); 
 

  const [expandedItem, setExpandedItem] = useState(null);

  const colors = {
    books: "#1677ff",
    tags: "#722ed1"
  };

  useEffect(() => {

    if (!selectedTopic) return;

    const endpoint =
      mode === "books"
        ? `${API_URL}/topic-books/${selectedTopic}`
        : `${API_URL}/field-tags/${selectedTopic}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((raw) => {

        const formatted = raw.map((d) => ({
          label: mode === "books" ? d.book : d.tag,
          count: Number(d.count) || 0
        }));

        formatted.sort((a, b) => b.count - a.count);

        setData(formatted);

      })
      .catch(console.error);

  }, [selectedTopic, mode]);

  if (!selectedTopic) return null;

  const max = Math.max(...data.map((d) => d.count), 1);

  const truncate = (text) =>
    text && text.length > 20 ? text.slice(0, 20) + "..." : text;

  const toggleItem = (label) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  const title =
    mode === "books"
      ? "Cited books linked to"
      : "Cited themes linked to";

  const buttonLabel =
    mode === "books"
      ? "Show themes"
      : "Show books";


  return (
    <div className="card-container">

      <div className="card-header-legend">

        <h2 className="card-title">
          {title} { selectedTopic }
        </h2>

        <div className="card-header-buttons">

          <button
            className="horizontal-bar-toggle"
            onClick={() =>
              setMode((prev) =>
                prev === "books" ? "tags" : "books"
              )
            }
          >
            {buttonLabel}
          </button>

          <InfoBubble text="Shows books/themes cited by documents/leters related to the selected topic." />

        </div>

      </div>

      <div className="card-wrapper-scroll">

        {data.length === 0 ? (

          <div style={{ color: "#888", fontSize: "14px" }}>
            No data available
          </div>

        ) : (

          data.map((d, i) => (

            <div key={i}>

              
              <div
                className="horizontal-bar-row"
                onClick={() => toggleItem(d.label)}
                style={{ cursor: "pointer" }}
              >

                <div className="horizontal-bar-label">
                  {truncate(d.label)}
                </div>

                <div className="horizontal-bar-track">

                  <div
                    className="horizontal-bar-fill"
                    style={{
                      width: `${(d.count / max) * 100}%`,
                      background: colors[mode]
                    }}
                  />

                </div>

                <div className="horizontal-bar-value">
                  {d.count}
                </div>

              </div>

              {expandedItem === d.label && (
                <div
                  style={{
                    padding: "8px 12px",
                    marginLeft: "10px",
                    fontSize: "13px",
                    color: "#333",
                    background: "#f5f5f5",
                    borderLeft: `3px solid ${colors[mode]}`,
                    borderRadius: "4px"
                  }}
                >
                  {d.label}
                </div>
              )}

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default TopicBooksTagsBar;