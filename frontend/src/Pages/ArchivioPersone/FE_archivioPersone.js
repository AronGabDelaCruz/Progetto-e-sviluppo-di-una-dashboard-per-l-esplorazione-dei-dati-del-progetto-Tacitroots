import React, { useState } from "react";
import "../../Styles/PageLayoutStyle.css";
import TableListaPersone from "./Table_listaPersone";
import PersonDetail from "./PersonDetail";

import PiePersonField from "./pie_fieldPerson";

import LineCitedPerson from "./line_citedPerson";
import InfoInstrument from "./info_instrumentMakerProponent";
import CircleExperiment from "./circle_experimentMakerProponent";

import MapReceverPerson from "./map_receverPerson";
import GraphNetworkIn from "./horizontalBar_networkEntrata";
import TableCitedBy from "./HorizontalBar_listaCitedBy";

function PeoplePage() {
  const [selectedPerson, setSelectedPerson] =
    useState("Leopoldo de' Medici");

  return (
    <div className="people-page">

      <div className="header">
        <h1 className="title">Archivio Persone</h1>
        <div className="subtitle">Persona Selezionata: {selectedPerson}</div>
      </div>


      <div className="grid-2">
      <TableListaPersone onView={setSelectedPerson} />

      <div className="grid-1-2">
        <PersonDetail name={selectedPerson} />
        <InfoInstrument name={selectedPerson} />
      </div>
    </div>

      <div className="grid-2">

        <GraphNetworkIn name={selectedPerson} />
        <MapReceverPerson name={selectedPerson} />

      </div>


      <div className="grid-2">

        <LineCitedPerson name={selectedPerson} />
        <CircleExperiment name={selectedPerson} />

      </div>


      <div className="grid-2">
        <TableCitedBy name={selectedPerson} />  
        <PiePersonField name={selectedPerson} />    
      </div> 
    </div>
  );
}

export default PeoplePage;