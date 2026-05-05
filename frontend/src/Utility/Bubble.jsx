import React, { useState } from "react";

export default function InfoBubble({ text, label = "Info" }) {
  const [show, setShow] = useState(false);

  return (
    <div className="bubble-container">
      <button
        className="horizontal-bar-toggle"
        onClick={() => setShow(prev => !prev)}
      >
        {label}
      </button>

      {show && (
        <div className="bubble">
          {text}
        </div>
      )}
    </div>
  );
}