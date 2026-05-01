// backend
import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import neo4j from 'neo4j-driver';
import cors from 'cors';
import {
  letterePerPersona,cittaLettere, grafoPersona, personList, letterePerAnno, fieldsList, schemaGrafo, schemaRelazioni
} from "./controllers/test.js";
import { handleRoute} from "./controllerWrapper.js";

import { dbOverview, nodesByLabel, graphByNodeLabels, relationTypes, graphByRelationType } from './controllers/BE_databaseOverview.js';
import {peopleStats, personDetail, personGraph,
   personFieldPie, personWritingMap, personCitationTimeline, 
   personCitedBy, personInstrumentPacking, personExperimentPacking,
  personCited, personReceiverMap, personGraphIn } from "./controllers/BE_archivioPersone.js"
// configurazione express
import {personsExchangeTimeline, personFieldPacking,
  personCitedBetween, personExperimentHistogram
} from "./controllers/BE_confrontiPersone.js";
const app = express();
app.use(cors());
app.use(express.json());

// connesione a neo4j
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD
  )
);

// Rotta di test
app.get("/", (req, res) => res.send("Backend attivo!"));


// Componenti di Test
app.get("/lettere-per-persona", handleRoute(driver, letterePerPersona));
app.get("/citta-lettere", handleRoute(driver, cittaLettere));
app.get("/grafo-persona/:nome", handleRoute(driver, grafoPersona));
app.get("/person-list", handleRoute(driver, personList));
app.get("/lettere-per-anno", handleRoute(driver, letterePerAnno));
app.get("/fields-list", handleRoute(driver, fieldsList));
app.get("/schema-grafo", handleRoute(driver, schemaGrafo));
app.get("/schema-relazioni", handleRoute(driver, schemaRelazioni));

// Rotte utili per Database Overview
app.get("/db-overview", handleRoute(driver, dbOverview));
app.get("/nodes-by-label", handleRoute(driver, nodesByLabel));
app.get("/graph/:label", handleRoute(driver, graphByNodeLabels));
app.get("/relation-types", handleRoute(driver, relationTypes));
app.get("/graph/relation/:relation", handleRoute(driver, graphByRelationType));

// Rotte utili per Archivio Persone
app.get("/people-stats", handleRoute(driver, peopleStats));
app.get("/person/:name", handleRoute(driver, personDetail));
app.get("/person-graph/:name", handleRoute(driver, personGraph));
app.get("/person-field-pie/:name", handleRoute(driver, personFieldPie));
app.get("/person-writing-map/:name",handleRoute(driver, personWritingMap));
app.get("/person-citation-timeline/:name",handleRoute(driver, personCitationTimeline));
app.get("/person-cited-by/:name",handleRoute(driver, personCitedBy));
app.get("/person-instrument-packing/:name",handleRoute(driver, personInstrumentPacking));
app.get("/person-experiment-packing/:name",handleRoute(driver, personExperimentPacking));
app.get("/person-cited/:name",handleRoute(driver, personCited));
app.get("/person-receiver-map/:name",handleRoute(driver, personReceiverMap ));
app.get("/person-graph-in/:name",handleRoute(driver, personGraphIn));

// Rotte utili per confronti tra Persone
app.get("/persons-exchange-timeline/:name1/:name2",handleRoute(driver, personsExchangeTimeline));
app.get("/person-field-packing/:name1/:name2",handleRoute(driver, personFieldPacking));
app.get("/person-cited-between/:name1/:name2",handleRoute(driver, personCitedBetween));
app.get("/person-experiment-histogram/:name1/:name2",handleRoute(driver, personExperimentHistogram));
app.listen(3001, () => console.log("Server attivo su http://localhost:3001"));