import React, { useEffect, useState } from "react";

function PersonDetail({ name }) {
  const [person, setPerson] = useState(null);

  useEffect(() => {
    if (!name) return;

    fetch(`http://localhost:3001/person/${name}`)
      .then(res => res.json())
      .then(setPerson)
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  return (
    <div style={containerStyle}>
      <h2>Person Details</h2>

      {!person ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p><strong>Name:</strong> {person.name}</p>
          <p><strong>Birth:</strong> {person.birth ?? "Unknown"}</p>
          <p><strong>Death:</strong> {person.death ?? "Unknown"}</p>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  marginTop: "20px",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  background: "#fafafa"
};

export default PersonDetail;