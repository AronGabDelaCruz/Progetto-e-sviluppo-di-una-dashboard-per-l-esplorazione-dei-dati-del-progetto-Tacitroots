import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function PersonDetail({ name }) {
  const [person, setPerson] = useState(null);

  useEffect(() => {
    if (!name) return;

    setPerson(null);

    fetch(`${API_URL}/person/${name}`)
      .then(res => res.json())
      .then(data => {
        console.log("PERSON DETAIL:", data);
        setPerson(data);
      })
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  return (
    <div style={containerStyle}>
      <h2>Informazioni Generali</h2>

      {!person ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p><strong>Name:</strong> {person.name}</p>

          <p>
            <strong>Birth:</strong> {person.birth ?? "Unknown"}
          </p>

          <p>
            <strong>Death:</strong> {person.death ?? "Unknown"}
          </p>

      
          <p>
            <strong>Notes:</strong>{" "}
            {person.notes ? person.notes : "No notes available"}
          </p>

          
          <p>
            <strong>Wikipedia:</strong>{" "}
            {person.wikipedia ? (
              <a
                href={person.wikipedia}
                target="_blank"
                rel="noopener noreferrer"
              >
                Vai alla pagina
              </a>
            ) : (
              "Non disponibile"
            )}
          </p>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    height: "500px",
    display: "flex",
    flexDirection: "column",
    padding: "10px"
};

export default PersonDetail;