import React, { useState } from "react";
import TableListaPersone from "./table_listaPersone";
import LineScambiEpistolari from "./line_scambiEpistolari";
import CircleFieldScambi from "./circle_fieldScambiEpistolari";
import TablePersonCitedBtw from "./table_personeCitateScambioEpistolare";
import HistExperimentCitedBtw from "./hist_experimentCitedBtw";
import "../../Styles/PageLayoutStyle.css";

function PeoplePage() {
  const [selectedPerson1, setSelectedPerson1] = useState("Vincenzo Viviani");
  const [selectedPerson2, setSelectedPerson2] = useState("Leopoldo de' Medici");
  const [error, setError] = useState("");

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
        <TableListaPersone onView={handleSelect1} />



        <TableListaPersone onView={handleSelect2} />
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