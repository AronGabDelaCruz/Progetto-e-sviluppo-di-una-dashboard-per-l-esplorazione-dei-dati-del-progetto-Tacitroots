import React, { useEffect, useState } from "react";
import "../../Styles/TableStyle.css";
import InfoBubble from "../../Utility/Bubble";

const API_URL = process.env.REACT_APP_API_URL;

function PersonReceivedTable({ person1, onView, selectedPerson }) {
  const [data, setData] = useState([]);

  // Fetch dati
  useEffect(() => {
    if (!person1) return;

    fetch(`${API_URL}/person-received-letters/${person1}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [person1]);

  // Gestione selezione automatica
  useEffect(() => {
    if (data.length === 0) return;

    if (!selectedPerson || !data.find(d => d.person === selectedPerson)) {
      onView?.(data[0].person);
    }
  }, [data, selectedPerson, onView]); 

  if (!person1) return null;

  const handleView = (name) => {
    if (onView) onView(name);
  };

  return (
    <div className="card-container">
      <h2 className="card-title">
        Recever of: {person1}
      </h2>
    <div className="card-header-legend"><InfoBubble text="TBD" /></div>
      

      <div className="card-wrapper-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Receved</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className="table-empty" colSpan={3}>
                  No Data Available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => handleView(row.person)}
                  className={
                    selectedPerson === row.person
                      ? "table-row-active"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td>{row.person}</td>
                  <td>{row.letters}</td>
                  <td>
                    <button
                      className="table-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(row.person);
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

export default PersonReceivedTable;