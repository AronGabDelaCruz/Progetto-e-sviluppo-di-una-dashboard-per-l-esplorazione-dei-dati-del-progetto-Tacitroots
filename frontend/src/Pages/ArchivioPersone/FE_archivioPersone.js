import React, { useState } from "react";
import TableListaPersone from "./Table_listaPersone";
import PersonDetail from "./PersonDetail";
import PersonGraph from "./PersonGraph";
import PiePersonField from "./pie_fieldPerson"
import MapWritingPerson from "./map_writingPerson"
function PeoplePage() {
  const [selectedPerson, setSelectedPerson] = useState("Leopoldo de' Medici");

  return (
    <div>
      <h1>People</h1>
      <TableListaPersone onView={setSelectedPerson} />
      <PersonDetail name={selectedPerson} />
      <PersonGraph name={selectedPerson} />
      <PiePersonField name={selectedPerson} />
      <MapWritingPerson name={selectedPerson} />
    </div>
  );
}

export default PeoplePage;