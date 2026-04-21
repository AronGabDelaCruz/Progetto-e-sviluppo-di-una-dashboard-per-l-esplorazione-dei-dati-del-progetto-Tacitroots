import React, { useEffect, useState } from "react";
import "../../Styles/TableStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

function TableListaPersone({ onView }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/people-stats`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="table-container">
      <h2 className="table-title">Lista Persone</h2>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Sent</th>
              <th>Received</th>
              <th>Totale</th>
              <th>Azione</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className="table-empty" colSpan={5}>
                  Nessun dato disponibile
                </td>
              </tr>
            ) : (
              data.map((person, index) => (
                <tr key={index}>
                  <td>{person.name}</td>
                  <td>{person.sent}</td>
                  <td>{person.received}</td>
                  <td>{person.totalLetters}</td>
                  <td>
                    <button
                      className="table-button"
                      onClick={() => onView(person.name)}
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