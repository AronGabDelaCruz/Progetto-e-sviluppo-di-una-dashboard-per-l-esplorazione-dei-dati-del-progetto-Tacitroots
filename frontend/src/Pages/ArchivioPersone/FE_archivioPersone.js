import React, { useState } from "react";
import TableListaPersone from "./Table_listaPersone";
import PersonDetail from "./PersonDetail";
import PersonGraph from "./PersonGraph";
import PiePersonField from "./pie_fieldPerson"
import MapWritingPerson from "./map_writingPerson"
import LineCitedPerson from "./line_citedPerson";
import TablePersonCitedBy from "./table_listaCitedBy";
import CircleInstrument from "./circle_instrumentMakerProponent";
import CircleExperiment from "./circle_experimentMakerProponent";
import TablePersonCited from "./table_personCited";
import MapReceverPerson from "./map_receverPerson";
import GraphNetworkIn from "./graph_networkEntrata";
function PeoplePage() {
  const [selectedPerson, setSelectedPerson] = useState("Leopoldo de' Medici");

  return (
    <div>
      <h1>People</h1>
      <TableListaPersone onView={setSelectedPerson} />
      <CircleInstrument name={selectedPerson} />
      <GraphNetworkIn name={selectedPerson} />
      <MapReceverPerson name={selectedPerson} />
      <TablePersonCited name={selectedPerson} />
      <CircleExperiment name={selectedPerson} />
      <TablePersonCitedBy name={selectedPerson} />
      <LineCitedPerson name={selectedPerson} />
      <PersonDetail name={selectedPerson} />
      <PersonGraph name={selectedPerson} />
      <PiePersonField name={selectedPerson} />
      <MapWritingPerson name={selectedPerson} />
    </div>
  );
}

export default PeoplePage;