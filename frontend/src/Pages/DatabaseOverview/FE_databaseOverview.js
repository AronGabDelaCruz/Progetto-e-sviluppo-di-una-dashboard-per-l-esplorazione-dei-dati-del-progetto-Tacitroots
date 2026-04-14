import React, { useState } from "react";
import DatabaseOverview from "./info_dbOverview"; 
import NodeTypesTable from "./table_nodeTypes";
import Graph from "./graph_typeNodes";
import RelationTypesTable from "./table_relationTypes";
import GraphRel from "./graph_typeRelations";
import "./databaseOverview.css";

function DatabaseOverviewPage() {
  const [selectedLabel, setSelectedLabel] = useState("Person"); 
  const [selectedRelation, setSelectedRelation] = useState("TAGGED_WITH");

  return (
    <div className="page-container">
      <h1>Database Overview</h1>

      <DatabaseOverview />

  
      <div className="grid-container">
       
          <NodeTypesTable onView={setSelectedLabel} />
          <Graph label={selectedLabel} />
      </div>


      <div className="grid-container">
        
          <RelationTypesTable onView={setSelectedRelation} />
          <GraphRel relation={selectedRelation} />
      </div>
    </div>
  );
}

export default DatabaseOverviewPage;