import React, { useState } from "react";
import TableInstrument from "./Table_listaStrumenti";
import LineInstrument from "./Line_instrumentCitationPerYear";
import HorizontalBarPersonCiting from "./HorizontalBar_PersonCitingInstrument";
import MapCitationInstrument from "./Map_CitationLocationInstrument";
import InfoMakerProponent from "./Info_MakerProponentInstument";
import ExperimentLinked from "./HorizontalBar_ExperimentLinked";
function TemiPage() {
  const [selectedInstrument, setSelectedInstrument] = useState("telescope");

  return (
    <div className="people-page">
      <div className="header">
        <h1 className="title">Instruments</h1>
      </div>
      <div className="grid-2">
        <TableInstrument onView={setSelectedInstrument} selectedInstrument={selectedInstrument}/>
        <LineInstrument selectedInstrument={selectedInstrument}/>
      </div>
      <div className="grid-2">
        <HorizontalBarPersonCiting selectedInstrument={selectedInstrument}/>
        <MapCitationInstrument selectedInstrument={selectedInstrument}/>
      </div>
       <div className="grid-2">
        <InfoMakerProponent selectedInstrument={selectedInstrument}/>
        <ExperimentLinked selectedInstrument={selectedInstrument}/>
       </div>
    </div>
  );
}

export default TemiPage;