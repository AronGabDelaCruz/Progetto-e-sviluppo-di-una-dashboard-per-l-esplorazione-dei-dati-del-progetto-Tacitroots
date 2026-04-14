import React, { useEffect, useState } from "react";

function TableListaPersone({ onView }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/people-stats")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Nome</th>
            <th style={thStyle}>Sent</th>
            <th style={thStyle}>Received</th>
            <th style={thStyle}>Totale</th>
            <th style={thStyle}>Azione</th>
          </tr>
        </thead>
        <tbody>
          {data.map((person, index) => (
            <tr key={index}>
              <td style={tdStyle}>{person.name}</td>
              <td style={tdStyle}>{person.sent}</td>
              <td style={tdStyle}>{person.received}</td>
              <td style={tdStyle}>{person.totalLetters}</td>
              <td style={tdStyle}>
                <button onClick={() => onView(person.name)}>
                View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// styles (uguali a prima)
const containerStyle = {
  maxHeight: "400px",
  overflowY: "auto",
  border: "1px solid #ddd"
};

const tableStyle = {
  borderCollapse: "collapse",
  width: "100%"
};

const theadStyle = {
  position: "sticky",
  top: 0,
  backgroundColor: "#f4f4f4",
  zIndex: 1
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left"
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px"
};

export default TableListaPersone;