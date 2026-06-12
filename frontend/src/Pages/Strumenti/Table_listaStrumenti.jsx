import React, { useEffect, useState } from "react";

const API_URL = window.__API_URL__;

function TableListaInstruments({ onView, selectedInstrument }) {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetch(`${API_URL}/instrument-stats`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error(err));

  }, []);

  const handleView = (instrument) => {
    if (onView) onView(instrument);
  };

  return (
    <div className="card-container">

      <h2 className="card-title">
        Instruments list
      </h2>

      <div className="card-wrapper-scroll">

        <table className="table">

          <thead>
            <tr>
              <th>Instrument</th>
              <th>Citations</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {data.length === 0 ? (

              <tr>
                <td className="table-empty" colSpan={3}>
                  No data available
                </td>
              </tr>

            ) : (

              data.map((instrument, index) => (

                <tr
                  key={index}
                  onClick={() =>
                    handleView(instrument.instrument)
                  }
                  className={
                    selectedInstrument === instrument.instrument
                      ? "table-row-active"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                >

                  <td>{instrument.instrument}</td>

                  <td>{instrument.num_citations}</td>

                  <td>
                    <button
                      className="table-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(instrument.instrument);
                      }}
                    >
                      View
                    </button>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default TableListaInstruments;