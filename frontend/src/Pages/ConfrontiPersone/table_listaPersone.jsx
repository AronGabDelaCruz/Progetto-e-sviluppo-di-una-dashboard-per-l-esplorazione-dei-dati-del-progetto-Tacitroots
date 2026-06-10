import React, { useEffect, useState } from "react";
import "../../Styles/TableStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

function TableListaPersone({ onView, selectedPerson }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/people-stats`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="card-container">
      <h2 className="card-title">Letter writers</h2>
      <p className="card-description">place holder 1</p>
      <div className="card-wrapper-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Total</th>
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
              data.map((person, index) => (
                <tr
                  key={index}
                  onClick={() => onView(person.name)}
                  className={
                    selectedPerson === person.name
                      ? "table-row-active"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td>{person.name}</td>
                  <td>{person.totalLetters}</td>
                  <td>
                    <button
                      className="table-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(person.name);
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

export default TableListaPersone;