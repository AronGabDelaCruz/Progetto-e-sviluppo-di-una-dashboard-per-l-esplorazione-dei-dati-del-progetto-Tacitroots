// backend
import express from 'express';
import neo4j from 'neo4j-driver';
import cors from 'cors';
import {
  letterePerPersona,cittaLettere, grafoPersona, personList, letterePerAnno, fieldsList, schemaGrafo, schemaRelazioni
} from "./controllers/test.js";
import { handleRoute} from "./controllerWrapper.js";

import { dbOverview, nodesByLabel, graphByNodeLabels, relationTypes, graphByRelationType } from './controllers/BE_databaseOverview.js';
import {peopleStats, personDetail } from "./controllers/BE_archivioPersone.js"
// configurazione express
const app = express();
app.use(cors());
app.use(express.json());

// connesione a neo4j
const driver = neo4j.driver(
  "bolt://localhost:7687",     // bolt://localhost:7687 per locale
            // bolt://neo4j:7687 se usi Docker con nome servizio "neo4j"
  neo4j.auth.basic("neo4j", "Nov081995")
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


app.listen(3001, () => console.log("Server attivo su http://localhost:3001"));

