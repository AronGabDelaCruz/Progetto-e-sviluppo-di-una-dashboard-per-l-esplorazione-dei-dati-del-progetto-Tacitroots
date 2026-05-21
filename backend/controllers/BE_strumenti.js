// tabella con la lista di tutti gli strumenti con il numero di citazioni
export const instrumentStats = async (session) => {

  const result = await session.run(
    `
    MATCH (i:Instrument)

    OPTIONAL MATCH (i)-[:CITED_IN]->(d:Document)

    RETURN 
        i.name AS instrument,
        count(DISTINCT d) AS num_citations
    ORDER BY num_citations DESC
    `
  );

  return result.records.map((r) => ({
    instrument: r.get("instrument"),
    num_citations: r.get("num_citations").toNumber(),
  }));
};

// timeline citazioni degli strumenti citati nel corrso degli anni
export const instrumentTimeline = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (i:Instrument {name: $name})-[:CITED_IN]->(d:Document)
    WHERE d.year IS NOT NULL

    RETURN 
        d.year AS year,
        count(DISTINCT d) AS num_citations
    ORDER BY year ASC
    `,
    { name }
  );

  return result.records.map((r) => ({
    year: r.get("year").toNumber(),
    count: r.get("num_citations").toNumber(),
  }));
};

// persone che hanno citato lo struemnto selezioanto
export const instrumentPeopleBar = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (i:Instrument {name: $name})-[:CITED_IN]->(d:Document)
    MATCH (d)-[:WRITTEN_BY]->(p:Person)

    RETURN 
        p.name AS person,
        count(DISTINCT d) AS num_citations
    ORDER BY num_citations DESC
    `,
    { name }
  );

  return result.records.map((r) => ({
    person: r.get("person"),
    count: r.get("num_citations").toNumber(),
  }));
};
// mappa delle citazioni allo strumento selezionato
export const instrumentMap = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (i:Instrument {name: $name})-[:CITED_IN]->(d:Document)
    MATCH (d)-[:WRITTEN_FROM]->(l:Location)

    RETURN 
        l.name AS location,
        l.point AS coordinates,
        count(DISTINCT d) AS num_citations
    ORDER BY num_citations DESC
    `,
    { name }
  );

  return result.records
    .map((r) => {
      const coords = r.get("coordinates");
      if (!coords) return null;

      const lat = coords.y ?? coords.latitude;
      const lng = coords.x ?? coords.longitude;

      if (typeof lat !== "number" || typeof lng !== "number") return null;

      return {
        location: r.get("location") || "Unknown",
        lat,
        lng,
        count: r.get("num_citations").toNumber()
      };
    })
    .filter(Boolean);
};
// inventori e proponenti dello strumento selezionato
export const instrumentPeople = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (i:Instrument {name: $name})

    OPTIONAL MATCH (p1:Person)-[:MAKER_OF]->(i)
    WITH i, collect(DISTINCT p1) AS inventors

    OPTIONAL MATCH (p2:Person)-[:PROPONENT_OF]->(i)
    WITH 
        i,
        inventors,
        [p IN collect(DISTINCT p2) WHERE NOT p IN inventors] AS proponents

    RETURN 
        i.name AS instrument,
        [p IN inventors | p.name] AS inventors,
        [p IN proponents | p.name] AS proponents
    `,
    { name }
  );

  if (result.records.length === 0) return null;

  const r = result.records[0];

  return {
    instrument: r.get("instrument"),
    inventors: r.get("inventors").filter(Boolean),
    proponents: r.get("proponents").filter(Boolean),
  };
};

// esperimenti citati nei documenti in cui viene citato anche lo
// strumento selezionato
export const instrumentExperimentShared = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (i:Instrument {name: $name})-[:CITED_IN]->(d:Document)
    MATCH (e:Experiment)-[:CITED_IN]->(d)

    RETURN 
        e.name AS experiment,
        count(DISTINCT d) AS num_shared_documents
    ORDER BY num_shared_documents DESC
    `,
    { name }
  );

  return result.records.map((r) => ({
    experiment: r.get("experiment"),
    count: r.get("num_shared_documents").toNumber(),
  }));
};
