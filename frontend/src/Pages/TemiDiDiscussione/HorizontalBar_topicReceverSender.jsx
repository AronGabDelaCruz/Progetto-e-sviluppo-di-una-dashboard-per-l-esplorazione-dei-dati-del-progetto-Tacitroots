import React, { useEffect, useState } from "react";

import "../../Styles/HorizontalBarStyle.css";
import "../../Styles/MultiPurposeStyle.css";

import InfoBubble from "../../Utility/Bubble";

const API_URL = process.env.REACT_APP_API_URL;

function TopicPeopleBar({ selectedTopic }) {

  const [data, setData] = useState([]);
  const [mode, setMode] = useState("sent");

 
  const colors = {
    sent: "#1890ff",
    received: "#fa541c"
  };

  useEffect(() => {

    if (!selectedTopic) return;

    const endpoint =
      mode === "sent"
        ? `${API_URL}/topic-people-sent/${selectedTopic}`
        : `${API_URL}/topic-people-received/${selectedTopic}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((raw) => {

        const formatted = raw.map((r) => ({
          person: r.person,
          count: Number(r.count) || 0
        }));

        formatted.sort((a, b) => b.count - a.count);

        setData(formatted);

      })
      .catch(console.error);

  }, [selectedTopic, mode]);

  if (!selectedTopic) return null;

  const max = Math.max(...data.map((d) => d.count), 1);

  const title =
    mode === "sent"
      ? "Senders Related to"
      : "Recepist Related to";

  const buttonLabel =
    mode === "sent"
      ? "Received documents"
      : "Sent documents";

  return (
    <div className="card-container">

      <div className="card-header-legend">

        <h2 className="card-title">
          {title} {selectedTopic}
        </h2>

        <div className="card-header-buttons">
         <InfoBubble
            text="Shows the senders/recipist associated with documents/letters related to the selected topic."
          />
          <button
            className="horizontal-bar-toggle"
            onClick={() =>
              setMode((prev) =>
                prev === "sent"
                  ? "received"
                  : "sent"
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

            <div key={i} className="horizontal-bar-row">

              <div className="horizontal-bar-label">
                {d.person}
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

          ))

        )}

      </div>

    </div>
  );
}

export default TopicPeopleBar;