import React, { useState } from "react";
import TableListaPersone from "./Table_listaPersone";
import PersonDetail from "./PersonDetails";

function PeoplePage() {
  const [selectedPerson, setSelectedPerson] = useState(null);

  return (
    <div>
      <h1>People</h1>

      <TableListaPersone onView={setSelectedPerson} />

      {selectedPerson && (
        <PersonDetail name={selectedPerson} />
      )}
    </div>
  );
}

export default PeoplePage;