import React, { useEffect, useState } from "react";

import "../../Styles/ColumnListStyle.css";
import "../../Styles/MultiPurposeStyle.css";


const API_URL = process.env.REACT_APP_API_URL;

function InstrumentPeopleList({ selectedInstrument }) {

  const [inventors, setInventors] = useState([]);
  const [proponents, setProponents] = useState([]);

  useEffect(() => {

    if (!selectedInstrument) return;

    fetch(`${API_URL}/instrument-people/${selectedInstrument}`)
      .then(res => res.json())
      .then(data => {

        setInventors(data.inventors || []);
        setProponents(data.proponents || []);

      })
      .catch(console.error);

  }, [selectedInstrument]);

  if (!selectedInstrument) return null;

  return (
    <div className="card-compact">

      <h2 className="card-title-compact">
        People involved
      </h2>

      <div className="card-header-legend">

        <p className="card-description">place holder 4</p>
      </div>

      <div className="card-grid-compact">

        <div className="card-column-compact">

          <h4 className="card-subtitle-invented">
            Makers
          </h4>

          {inventors.length === 0 ? (

            <div className="card-empty">
              No data available
            </div>

          ) : (

            inventors.map((name, i) => (
              <div key={i} className="card-item-compact">
                <span>{name}</span>
              </div>
            ))

          )}

        </div>
        <div className="card-column-compact">

          <h4 className="card-subtitle-proposed">
            Proponents
          </h4>

          {proponents.length === 0 ? (

            <div className="card-empty">
              No data available
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

export default InstrumentPeopleList;