import React, { useEffect, useState } from "react";
import "../../Styles/GeneralInfoStyle.css";
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
<div className="card-container">
  <h2 className="card-title">
    Informazioni Generali
  </h2>

  {!person ? (
    <p className="card-loading">Loading...</p>
  ) : (
    <div className="card-content">
      <p><strong>Name:</strong> {person.name}</p>

      <p><strong>Birth:</strong> {person.birth ?? "Unknown"}</p>

      <p><strong>Death:</strong> {person.death ?? "Unknown"}</p>

      <p><strong>Notes:</strong> {person.notes || "No notes available"}</p>

      <p>
        <strong>Wikipedia:</strong>{" "}
        {person.wikipedia ? (
          <a
            className="card-link"
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


export default PersonDetail;