import React, { useState } from "react";
import "../../Styles/PageLayoutStyle.css";
import TableListaPersone from "./Table_listaPersone";
import PersonDetail from "./PersonDetail";
import PiePersonField from "./pie_fieldPerson";
import LineCitedPerson from "./line_citedPerson";
import InfoInstrument from "./info_instrumentMakerProponent";
import Experiment from "./horizontalBar_experimentMakerProponent";
import MapReceverPerson from "./map_receverPerson";
import GraphNetworkIn from "./horizontalBar_networkEntrata";
import TableCitedBy from "./HorizontalBar_listaCitedBy";
import SankeySelector from "./Sankey_selector";
import SankeyTagSelector from "./Sankey_tagSelector";
function PeoplePage() {
  const [selectedPerson, setSelectedPerson] =
    useState("Leopoldo de' Medici");

  return (
    <div className="people-page">

      <div className="header">
        <h1 className="title">Authors</h1>
        <div className="subtitle">Selected author: {selectedPerson}</div>
      </div>


      <div className="grid-2">
    <TableListaPersone
  onView={setSelectedPerson}
  selectedPerson={selectedPerson}
/>

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
        <Experiment name={selectedPerson} />

      </div>


      <div className="grid-2">
        <TableCitedBy name={selectedPerson} />  
        <PiePersonField name={selectedPerson} />    
      </div> 

      <div className="grid-2">
        <SankeySelector name={selectedPerson} />     
        <SankeyTagSelector name={selectedPerson} /> 
      </div>

    </div>
  );
}

export default PeoplePage;