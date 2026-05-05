import React, { useEffect, useState } from "react";
import "../../Styles/ColumnListStyle.css";
import InfoBubble from "../../Utility/Bubble";
const API_URL = process.env.REACT_APP_API_URL;

function ExperimentPeopleList({ name }) {
  const [inventors, setInventors] = useState([]);
  const [proponents, setProponents] = useState([]);

  useEffect(() => {
    if (!name) return;

    fetch(`${API_URL}/experiment-people/${name}`)
      .then(res => res.json())
      .then(data => {
        setInventors(data.inventors || []);
        setProponents(data.proponents || []);
      })
      .catch(console.error);
  }, [name]);

  if (!name) return null;

  return (
    <div className="card-compact">

      <h3 className="card-title-compact">
        Persone coinvolte
      </h3>
                <InfoBubble 
                text="TBD" />
      <div className="card-grid-compact">


        <div className="card-column-compact">
          <h4 className="card-subtitle-invented">
            Inventors
          </h4>

          {inventors.length === 0 ? (
            <div className="card-empty">
              Nessun inventore
            </div>
          ) : (
            inventors.map((name, i) => (
              <div key={i} className="card-item-compact">
                <span>{name}</span>
              </div>
            ))
          )}
        </div>

        {/* PROPONENTS */}
        <div className="card-column-compact">
          <h4 className="card-subtitle-proposed">
            Proponents
          </h4>

          {proponents.length === 0 ? (
            <div className="card-empty">
              Nessun proponente
            </div>
          ) : (
            proponents.map((name, i) => (
              <div key={i} className="card-item-compact">
                <span>{name}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default ExperimentPeopleList;