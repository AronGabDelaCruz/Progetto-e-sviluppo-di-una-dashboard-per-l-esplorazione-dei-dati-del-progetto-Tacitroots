import React, { useState } from "react";
import TableExperiment from "./table_experiment";
import LineEsperimentiPerAnno from "./line_esprimentiPerAnno";
import HorizontalBarCitedBy from "./horizontalBar_experimentCitedBy";
import MapExperimetCitedLocation from "./map_experimentCitedLocation";
import GraphExperiment from "./graph_experimentMaterialInstrument";
import InfoMakerProponent from "./info_experimentMakerProponent"
function ExperimentPagePage() {
const [selectedExperiment, setSelectedExperiment] = useState("barometric experiment");
 return (
    <div className="people-page">

      <div className="header">
        <h1 className="title">Experiments</h1>
      </div>


      <div className="grid-2">
        <TableExperiment onView={setSelectedExperiment}selectedExperiment={selectedExperiment}/>
        <LineEsperimentiPerAnno name={selectedExperiment} />
      </div>

      <div className="grid-2">
        < HorizontalBarCitedBy name={selectedExperiment} />
        < MapExperimetCitedLocation name={selectedExperiment} />
      </div>

      <div className="grid-2">
        < GraphExperiment name={selectedExperiment} />
        < InfoMakerProponent name={selectedExperiment} />
      </div>
    </div>
  );
}
export default ExperimentPagePage;