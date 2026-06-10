import React, { useState } from "react";

import ReceiverSenderTagSankey from "./Sankey_selctedToRecever";
import PersonTagSankeyD3 from "./Sankey_tagSelcetedToSender";

function SankeyTagVisual({ name }) {
  const [mode, setMode] = useState("rst"); // rst | ptr

  if (!name) return null;

  const title =
    mode === "rst"
      ? "Distribution of sent letters by themes"
      : "Distribution of received letters by themes";

  const buttonLabel =
    mode === "rst"
      ? "Switch to received letters"
      : "Switch to sent letters";

  return (
    <div className="card-container">

      {/* HEADER */}
      <div className="card-header-legend">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">place holder 9</p>
        <div className="card-header-buttons">

          {/* placeholder come InfoBubble */}
          <div />

          <button
            className="horizontal-bar-toggle"
            onClick={() =>
              setMode((prev) => (prev === "rst" ? "ptr" : "rst"))
            }
          >
            {buttonLabel}
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="card-wrapper-scroll">
        {mode === "rst" ? (
          <ReceiverSenderTagSankey name={name} />
        ) : (
          <PersonTagSankeyD3 name={name} />
        )}
      </div>

    </div>
  );
}

export default SankeyTagVisual;