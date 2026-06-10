import React, { useEffect, useState } from "react";

import "../../Styles/HorizontalBarStyle.css";
import "../../Styles/MultiPurposeStyle.css";



const API_URL = process.env.REACT_APP_API_URL;

function InstrumentExperimentBar({ selectedInstrument }) {

  const [data, setData] = useState([]);

  useEffect(() => {

    if (!selectedInstrument) return;

    fetch(`${API_URL}/instrument-experiment-shared/${selectedInstrument}`)
      .then(res => res.json())
      .then(raw => {

        const formatted = raw.map(d => ({
          experiment: d.experiment,
          count: Number(d.count) || 0
        }));

        formatted.sort((a, b) => b.count - a.count);

        setData(formatted);

      })
      .catch(console.error);

  }, [selectedInstrument]);

  if (!selectedInstrument) return null;

  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="card-container">

      <div className="card-header-legend">

        <h2 className="card-title">
          Linked experiments
        </h2>

       <p className="card-description">place holder 5</p>
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
                {d.experiment}
              </div>

              <div className="horizontal-bar-track">

                <div
                  className="horizontal-bar-fill"
                  style={{
                    width: `${(d.count / max) * 100}%`,
                    background: "#1677ff"
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

export default InstrumentExperimentBar;