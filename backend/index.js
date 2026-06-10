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
  personCited, personReceiverMap, personGraphIn, personSharedCitedEntities,
personQuotedSimilarity, personSharedFields, personBooksBar, personTagsBar,
getPersonSankey, personReceiverSenderFieldSankey, getPersonTagSankey,
personReceiverSenderTagSankey  } from "./controllers/BE_archivioPersone.js"
// configurazione express 
import {personsExchangeTimeline, personFieldPacking,
  personCitedBetween, personExperimentHistogram, personReceivedLetters
} from "./controllers/BE_confrontiPersone.js";

import { experimentsStats, experimentTimeline, experimentPeopleCitations,
  experimentLocationsMap, experimentGraph, experimentPeople} from "./controllers/BE_esperimenti.js";

import {topicsStats, topicTimelineWithCitations, topicPeopleSent, topicPeopleReceived,
  topicInstruments, topicExperiments, topicSenderLocations, topicReceiverLocations, topicBooks,
  fieldTags
} from "./controllers/BE_temiDiDIscussione.js"
import {instrumentStats, instrumentTimeline, instrumentPeopleBar, instrumentMap, instrumentPeople
  ,instrumentExperimentShared
} from "./controllers/BE_strumenti.js"


const app = express();
app.use(cors());
app.use(express.json());
console.log(`Neo4j URI: ${process.env.NEO4J_URI}`);
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
app.get("/person-cited-entity-similarity/:name",handleRoute(driver, personSharedCitedEntities));
app.get("/person-quoted-sim/:name", handleRoute(driver, personQuotedSimilarity));
app.get("/person-sim-fields/:name", handleRoute(driver, personSharedFields));
app.get("/person-books/:name", handleRoute(driver, personBooksBar));
app.get("/person-tags/:name",handleRoute(driver, personTagsBar));
app.get("/person-field-receiver-sankey/:name",handleRoute(driver, getPersonSankey));
app.get("/receiver-sender-field-sankey/:name",handleRoute(driver, personReceiverSenderFieldSankey));
app.get("/sankey-tag-selected-recever/:name",handleRoute(driver, getPersonTagSankey));
app.get("/sankey-tag-selected-sender/:name",handleRoute(driver, personReceiverSenderTagSankey));
// Rotte utili per confronti tra Persone
app.get("/persons-exchange-timeline/:name1/:name2",handleRoute(driver, personsExchangeTimeline));
app.get("/person-field-packing/:name1/:name2",handleRoute(driver, personFieldPacking));
app.get("/person-cited-between/:name1/:name2",handleRoute(driver, personCitedBetween));
app.get("/person-experiment-histogram/:name1/:name2",handleRoute(driver, personExperimentHistogram));
app.get("/person-received-letters/:name",handleRoute(driver, personReceivedLetters));
// Rotte utili per Experiement
app.get("/experiments-stats",handleRoute(driver, experimentsStats));
app.get("/experiment-timeline/:name",handleRoute(driver, experimentTimeline));
app.get("/experiment-person-citations/:name",handleRoute(driver, experimentPeopleCitations));
app.get("/experiment-map/:name",handleRoute(driver, experimentLocationsMap));
app.get("/experiment-graph/:name", handleRoute(driver, experimentGraph));
app.get("/experiment-people/:name", handleRoute(driver, experimentPeople));

// Rotte utili per Topics
app.get("/topics-stats",handleRoute(driver, topicsStats));
app.get("/field-timeline-citations/:name",handleRoute(driver, topicTimelineWithCitations));
app.get("/topic-people-sent/:name",handleRoute(driver, topicPeopleSent));
app.get("/topic-people-received/:name",handleRoute(driver, topicPeopleReceived));
app.get("/topic-experiments/:name",handleRoute(driver, topicExperiments));
app.get("/topic-instruments/:name",handleRoute(driver, topicInstruments));
app.get("/topic-sender-map/:name",handleRoute(driver, topicSenderLocations));
app.get("/topic-receiver-map/:name",handleRoute(driver, topicReceiverLocations));
app.get("/topic-books/:name",handleRoute(driver, topicBooks));
app.get("/field-tags/:field", handleRoute(driver, fieldTags));

// Rotte utili per Instrument
app.get("/instrument-stats",handleRoute(driver, instrumentStats));
app.get("/instrument-timeline/:name",handleRoute(driver, instrumentTimeline));
app.get("/instrument-person-citations/:name",handleRoute(driver, instrumentPeopleBar));
app.get("/instrument-map/:name",handleRoute(driver, instrumentMap));
app.get("/instrument-people/:name",handleRoute(driver, instrumentPeople));
app.get("/instrument-experiment-shared/:name",handleRoute(driver, instrumentExperimentShared));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});
