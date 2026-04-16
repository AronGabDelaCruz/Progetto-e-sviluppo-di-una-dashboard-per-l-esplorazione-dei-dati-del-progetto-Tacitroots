import React, { useState } from "react";
import "./PeoplePage.css";
import TableListaPersone from "./Table_listaPersone";
import PersonDetail from "./PersonDetail";
import PersonGraph from "./graph_networkUscita";
import PiePersonField from "./pie_fieldPerson";
import MapWritingPerson from "./map_writingPerson";
import LineCitedPerson from "./line_citedPerson";
import InfoInstrument from "./info_instrumentMakerProponent";
import CircleExperiment from "./circle_experimentMakerProponent";
import TablePersonCited from "./table_personCited";
import MapReceverPerson from "./map_receverPerson";
import GraphNetworkIn from "./graph_networkEntrata";
import TableCitedBy from "./table_listaCitedBy";

function PeoplePage() {
  const [selectedPerson, setSelectedPerson] =
    useState("Leopoldo de' Medici");

  return (
    <div className="people-page">

      <div className="header">
        <h1 className="title">Archivio Persone</h1>
        <div className="subtitle">Persona Selezionata: {selectedPerson}</div>
      </div>


      <div className="grid-3">

        <TableListaPersone onView={setSelectedPerson} />
        <PersonDetail name={selectedPerson} />
        <InfoInstrument name={selectedPerson} />

      </div>

    
      <div className="grid-2">

        
        <MapWritingPerson name={selectedPerson} />
        <PersonGraph name={selectedPerson} />
      </div>

      <div className="grid-2">

        <GraphNetworkIn name={selectedPerson} />
        <MapReceverPerson name={selectedPerson} />

      </div>


      <div className="grid-2">

        <LineCitedPerson name={selectedPerson} />
        <CircleExperiment name={selectedPerson} />

      </div>


      <div className="grid-3">
        <TableCitedBy name={selectedPerson} />
        <PiePersonField name={selectedPerson} />
        <TablePersonCited name={selectedPerson} />

      </div>

    </div>
  );
}

export default PeoplePage;