import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function TableListaTopics({ onView, selectedTopic }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/topics-stats`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error(err));
  }, []);

  const handleView = (topic) => {
    if (onView) onView(topic);
  };

  return (
    <div className="card-container">
      <h2 className="card-title">Topics list</h2>

      <div className="card-wrapper-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>N Doc</th>
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
              data.map((topic, index) => (
                <tr
                  key={index}
                  onClick={() => handleView(topic.field)}
                  className={
                    selectedTopic === topic.field
                      ? "table-row-active"
                      : ""
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td>{topic.field}</td>
                  <td>{topic.num_documents}</td>

                  <td>
                    <button
                      className="table-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(topic.field);
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

export default TableListaTopics;