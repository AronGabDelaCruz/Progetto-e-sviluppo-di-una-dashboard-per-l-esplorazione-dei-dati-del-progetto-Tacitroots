import React, { useState, useEffect } from "react";
import TableListaPersone from "./table_listaPersone";
import LineScambiEpistolari from "./line_scambiEpistolari";
import CircleFieldScambi from "./horizontalBar_fieldScambiEpistolari";
import TablePersonCitedBtw from "./horizontalBar_personeCitateScambioEpistolare";
import HistExperimentCitedBtw from "./hist_experimentCitedBtw";
import TableRecever from "./table_personRecever";
import "../../Styles/PageLayoutStyle.css";

function PeoplePage() {
  const [people, setPeople] = useState([]);

  const [selectedPerson1, setSelectedPerson1] = useState("Vincenzo Viviani");
  const [selectedPerson2, setSelectedPerson2] = useState(null);

  const [error, setError] = useState("");

  // prende lista persone UNA volta
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/people-stats`)
      .then(res => res.json())
      .then(data => {
        setPeople(data);

        // 👇 default dinamico = prima persona della tabella
        if (data.length > 0) {
          setSelectedPerson2(data[0].name);
        }
      })
      .catch(console.error);
  }, []);

  const handleSelect1 = (name) => {
    if (name === selectedPerson2) {
      setError("Non puoi selezionare la stessa persona");
      return;
    }
    setError("");
    setSelectedPerson1(name);
  };

  const handleSelect2 = (name) => {
    if (name === selectedPerson1) {
      setError("Non puoi selezionare la stessa persona");
      return;
    }
    setError("");
    setSelectedPerson2(name);
  };

  if (!selectedPerson2) return null; // evita render iniziale vuoto

  return (
    <div className="people-page">

      <div className="header">
        <h1 className="title">Confronto Tra Persone</h1>
        <div className="subtitle">
          {selectedPerson1} ↔ {selectedPerson2}
        </div>
      </div>

      {error && <p>{error}</p>}

      <div className="grid-2">
          <TableListaPersone onView={handleSelect1} selectedPerson={selectedPerson1}/>
          <TableRecever person1={selectedPerson1} onView={handleSelect2} selectedPerson={selectedPerson2}/>
      </div>

      <div className="grid-2">
        <LineScambiEpistolari
          person1={selectedPerson1}
          person2={selectedPerson2}
        />
        <CircleFieldScambi
          person1={selectedPerson1}
          person2={selectedPerson2}
        />


      </div>
      <div className="grid-2">
        <TablePersonCitedBtw
          person1={selectedPerson1}
          person2={selectedPerson2}
        />

        <HistExperimentCitedBtw
          person1={selectedPerson1}
          person2={selectedPerson2}
        />
      </div>
    </div>
  );
}

export default PeoplePage;