
import React, { useEffect, useState } from "react";

export default function FieldSelector() {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/fields-list")
      .then(res => res.json())
      .then(setFields)
      .catch(err => console.error(err));

    
    const params = new URLSearchParams(window.location.search);
    setSelectedField(params.get("field"));
  }, []);

  const handleClick = (field) => {
    const url = new URL(window.location);
    url.searchParams.set("field", field); 
    window.history.pushState({}, "", url); 
    setSelectedField(field); 
    
    window.dispatchEvent(new Event("fieldChanged"));
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      {fields.map((f, i) => (
        <button
          key={i}
          onClick={() => handleClick(f)}
          style={{
            margin: "5px",
            padding: "5px 10px",
            backgroundColor: f === selectedField ? "red" : "#1f77b4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}