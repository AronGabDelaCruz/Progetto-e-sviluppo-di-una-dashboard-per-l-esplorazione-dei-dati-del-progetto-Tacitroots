import React, { useState } from "react";

import ReceiverSenderFieldSankey from "./Sankey_senderFieldsToRecever";
import PersonSankeyD3 from "./Sankey_toSelecetedPerson";

function SankeyVisual({ name }) {
  const [mode, setMode] = useState("rsf"); // rsf | pfr

  if (!name) return null;

  const title =
    mode === "rsf"
      ? "Distribution of sent letters by fields"
      : "Distribution of received letters by fields";

  const buttonLabel =
    mode === "rsf"
      ? "Switch to received letters"
      : "Switch to sent letters";

  return (
    <div className="card-container">

      {/* HEADER come MapToggle */}
      <div className="card-header-legend">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">place holder 8</p>
        <div className="card-header-buttons">

          {/* placeholder come InfoBubble (coerenza UI) */}
          <div />

          <button
            className="horizontal-bar-toggle"
            onClick={() =>
              setMode((prev) => (prev === "rsf" ? "pfr" : "rsf"))
            }
          >
            {buttonLabel}
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="card-wrapper-scroll">
        {mode === "rsf" ? (
          <ReceiverSenderFieldSankey name={name} />
        ) : (
          <PersonSankeyD3 name={name} />
        )}
      </div>

    </div>
  );
}

export default SankeyVisual;