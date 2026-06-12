import { useEffect, useState } from "react";
import "../../Styles/TableStyle.css";
import "../../Styles/MultiPurposeStyle.css";

const API_URL = window.__API_URL__;

export default function NodeTypesTable({ onView, selectedLabel }) {
  const [data, setData] = useState([]);

  const handleView = (label) => {
    if (onView) onView(label);
  };

  useEffect(() => {
    fetch(`${API_URL}/nodes-by-label`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="card-container">

      <h2 className="card-title">Node types</h2>

      <div className="card-wrapper-scroll">

        <table className="table">

          <thead>
            <tr>
              <th>Type</th>
              <th>Count</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                onClick={() => handleView(row.label)}
                className={selectedLabel === row.label ? "table-row-active" : ""}
                style={{ cursor: "pointer" }}
              >
                <td>{row.label}</td>
                <td>{row.count}</td>
                <td>
                  <button
                    className="table-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(row.label);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}