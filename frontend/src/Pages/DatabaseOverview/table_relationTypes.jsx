import { useEffect, useState } from "react";
import "../../Styles/TableStyle.css";
import "../../Styles/MultiPurposeStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function RelationTypesTable({ onView, selectedRelation }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/relation-types`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const handleView = (relation) => {
    if (onView) onView(relation);
  };

  return (
    <div className="card-container">

      <h2 className="card-title">Relation types</h2>

      <div className="card-wrapper-scroll">

        <table className="table">

          <thead>
            <tr>
              <th>Relation</th>
              <th>Count</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                onClick={() => handleView(row.relation)}
                className={selectedRelation === row.relation ? "table-row-active" : ""}
                style={{ cursor: "pointer" }}
              >
                <td>{row.relation}</td>
                <td>{row.count}</td>
                <td>
                  <button
                    className="table-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(row.relation);
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