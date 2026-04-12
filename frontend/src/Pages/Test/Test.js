import React from "react";
import GraficoPersone from "./GraficoPersone";
import GraficoMappa from "./GraficoMappa";
import GrafoPersone from "./GrafoPersone";
import FieldSelector from "./FieldSelector";
import GraficoTimeline from "./GraficoTimeLine";
import SchemaGraph from "./SchemaGraph";
import SchemaRel from "./GraphRel";

function Test() {
  return (
    <>
      <div className="container">
        <h1>Lettere Storiche prova</h1>
        <h2>Numero di lettere inviate per persona</h2>
        <GraficoPersone />
      </div>
      <div>
        <h1>Lettere per città</h1>
        <GraficoMappa />
      </div>
      <div>
        <h1>Network lettere tra persone</h1>
        <GrafoPersone />
      </div>
      <div>
        <h2>Lettere per anno</h2>
        <FieldSelector />
        <GraficoTimeline />
      </div>
      <div>
        <h1>Schema Grafo</h1>
        <SchemaGraph />
      </div>
      <div>
        <h1>Schema Graph: SIMILAR_TO_QUOTED</h1>
        <SchemaRel />
      </div>
    </>
  );
}

export default Test;