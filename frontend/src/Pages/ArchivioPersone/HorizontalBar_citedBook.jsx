import React, { useEffect, useState } from "react";

import "../../Styles/HorizontalBarStyle.css";
import "../../Styles/MultiPurposeStyle.css";

import InfoBubble from "../../Utility/Bubble";

const API_URL = process.env.REACT_APP_API_URL;

function PersonBooksTagsToggleBar({ name }) {

  const [data, setData] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);

  const [mode, setMode] = useState("books");

  useEffect(() => {

    if (!name) return;

    const endpoint =
      mode === "books"
        ? `${API_URL}/person-books/${name}`
        : `${API_URL}/person-tags/${name}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((raw) => {

        const formatted = raw.map((d) => ({
          label:
            mode === "books"
              ? d.book
              : d.tag,

          count: Number(d.count) || 0
        }));

        formatted.sort((a, b) => b.count - a.count);

        setData(formatted);

      })
      .catch(console.error);

  }, [name, mode]);

  if (!name) return null;

  const max = Math.max(...data.map((d) => d.count), 1);

  const truncate = (text) =>
    text && text.length > 20
      ? text.slice(0, 20) + "..."
      : text;

  const toggleExpanded = (label) => {
    setExpandedItem((prev) =>
      prev === label ? null : label
    );
  };

  const title =
    mode === "books"
      ? "Cited books"
      : "Cited themes";

  const buttonLabel =
    mode === "books"
      ? "Show themes"
      : "Show books";

  const color =
    mode === "books"
      ? "#1677ff"
      : "#13c2c2";


  return (

    <div className="card-container">

      <div className="card-header-legend">

        <h2 className="card-title">
          {title}
        </h2>

        <div className="card-header-buttons">

          <InfoBubble text="Shows books/themes cited by documents/letters associated with the selected person." />

          <button
            className="horizontal-bar-toggle"
            onClick={() =>
              setMode((prev) =>
                prev === "books"
                  ? "tags"
                  : "books"
              )
            }
          >
            {buttonLabel}
          </button>

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
                onClick={() => toggleExpanded(d.label)}
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
                      background: color
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
                    borderLeft: `3px solid ${color}`,
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

export default PersonBooksTagsToggleBar;