import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function TableListaPersone({ onView, selectedPerson }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/people-stats`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  const handleView = (name) => {
    if (onView) onView(name);
  };

  return (
    <div className="card-container">
      <h2 className="card-title">People list</h2>

      <div className="card-wrapper-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sent</th>
              <th>Receive</th>
              <th>action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className="table-empty" colSpan={4}>
                  No data available
                </td>
              </tr>
            ) : (
              data.map((person, index) => (
                <tr
                  key={index}
                  onClick={() => handleView(person.name)}
                  className={
                    selectedPerson === person.name
                      ? "table-row-active"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td>{person.name}</td>
                  <td>{person.sent}</td>
                  <td>{person.received}</td>
                  <td>
                    <button
                      className="table-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(person.name);
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

export default TableListaPersone;