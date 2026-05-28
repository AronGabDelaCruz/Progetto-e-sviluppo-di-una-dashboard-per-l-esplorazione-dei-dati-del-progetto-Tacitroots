import { useEffect, useState } from "react";
import "../../Styles/TableStyle.css";
import "../../Styles/MultiPurposeStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function ExperimentsTable({ onView, selectedExperiment }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/experiments-stats`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const handleView = (name) => {
    if (onView) onView(name);
  };

  return (
    <div className="card-container">

      <h2 className="card-title">
        Experiments
      </h2>

      <div className="card-wrapper-scroll">

        <table className="table">

          <thead>
            <tr>
              <th>Experiment</th>
              <th>Citations</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="table-empty">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => handleView(row.experiment)}
                  className={
                    selectedExperiment === row.experiment
                      ? "table-row-active"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td>{row.experiment}</td>
                  <td>{row.count}</td>
                  <td>
                    <button
                      className="table-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(row.experiment);
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