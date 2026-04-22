import { useEffect, useState } from "react";
import "../../Styles/TableStyle.css";
import "../../Styles/MultiPurposeStyle.css";
const API_URL = process.env.REACT_APP_API_URL;

export default function NodeTypesTable({ onView }) {
  const [data, setData] = useState([]);

  const handleView = (label) => {
    onView(label);
  };

  useEffect(() => {
    fetch(`${API_URL}/nodes-by-label`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="card-container">

      <h2 className="card-title">Node Types</h2>

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
              <tr key={index}>
                <td>{row.label}</td>
                <td>{row.count}</td>
                <td>
                  <button
                    className="table-button"
                    onClick={() => handleView(row.label)}
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