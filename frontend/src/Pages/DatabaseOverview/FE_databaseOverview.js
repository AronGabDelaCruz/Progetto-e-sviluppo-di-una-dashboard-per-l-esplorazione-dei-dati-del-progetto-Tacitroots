import React, { useState } from "react";
import DatabaseOverview from "./info_dbOverview"; 
import NodeTypesTable from "./table_nodeTypes";
import Graph from "./graph_typeNodes";
import RelationTypesTable from "./table_relationTypes";
import GraphRel from "./graph_typeRelations";

function NuovaPagina() {
  const [selectedLabel, setSelectedLabel] = useState("Person"); 
  const [selectedRelation, setSelectedRelation] = useState(null);

  return (
    <div>
      <h1>Database Overview</h1>

      <DatabaseOverview />

      {/* NODI */}
      <NodeTypesTable onView={setSelectedLabel} />
      <Graph label={selectedLabel} />

      <hr />

      {/* RELAZIONI */}
  <RelationTypesTable onView={setSelectedRelation} />

<GraphRel relation={selectedRelation} />

    </div>
  );
}

export default NuovaPagina;