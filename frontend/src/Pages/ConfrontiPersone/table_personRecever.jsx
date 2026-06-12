import React, { useEffect, useState } from "react";
import "../../Styles/TableStyle.css";


const API_URL = window.__API_URL__;

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
        Letter receivers
      </h2>
   <p className="card-description">place holder 2</p>
      

      <div className="card-wrapper-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Received</th>
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
                      Select
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