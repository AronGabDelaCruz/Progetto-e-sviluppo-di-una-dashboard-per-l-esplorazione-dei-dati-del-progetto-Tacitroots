export const experimentsStats = async (session) => {
  const result = await session.run(`
MATCH (e:Experiment)
OPTIONAL MATCH (e)-[r:CITED_IN]-()
RETURN e.name AS experiment, COUNT(r) AS citations
ORDER BY citations DESC
  `);

  return result.records.map(r => ({
    experiment: r.get("experiment"),
    count: r.get("citations").toNumber()
  }));
};

export const experimentTimeline = async (session, req) => {
const { name } = req.params;
  const result = await session.run(
    `
MATCH (e:Experiment {name: $name})-[:CITED_IN]->(d:Document)
WHERE d.date IS NOT NULL AND d.date <> ""

WITH toInteger(split(d.date, "-")[0]) AS year
WHERE year IS NOT NULL

RETURN 
    year,
    count(*) AS citations
ORDER BY year ASC
    `,
    { name }
  );

  return result.records.map(r => ({
    year: r.get("year").toNumber(),
    count: r.get("citations").toNumber()
  }));
};

export const experimentPeopleCitations = async (session, req) => {
  const { name } = req.params;
  const result = await session.run(
    `
    MATCH (e:Experiment {name: $name})
    MATCH (p:Person)<-[:WRITTEN_BY]-(d:Document)<-[:CITED_IN]-(e)

    RETURN 
        p.name AS person,
        count(DISTINCT d) AS citations
    ORDER BY citations DESC
    `,
    { name }
  );

  return result.records.map(r => ({
    person: r.get("person"),
    count: r.get("citations").toNumber()
  }));
};

export const experimentLocationsMap = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (e:Experiment {name: $name})-[:CITED_IN]->(d:Document)
    MATCH (d)-[:WRITTEN_FROM]->(l:Location)

    RETURN 
        l.name AS location,
        l.point AS coordinates,
        count(DISTINCT d) AS num_documents
    ORDER BY num_documents DESC
    `,
    { name }
  );

  return result.records
    .map(r => {
      const coords = r.get("coordinates");
      if (!coords) return null;

      const lat = coords.y ?? coords.latitude;
      const lng = coords.x ?? coords.longitude;

      if (typeof lat !== "number" || typeof lng !== "number") return null;

      return {
        location: r.get("location") || "Unknown",
        lat,
        lng,
        count: r.get("num_documents").toNumber()
      };
    })
    .filter(Boolean);
};

export const experimentGraph = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (e:Experiment {name: $name})

    OPTIONAL MATCH (m:Material)-[:FEATURED_IN]->(e)
    OPTIONAL MATCH (i:Instrument)-[:USED_IN]->(e)

    RETURN 
        e.name AS experiment,
        collect(DISTINCT m.name) AS materials,
        collect(DISTINCT i.name) AS instruments
    `,
    { name }
  );

  if (result.records.length === 0) return null;

  const r = result.records[0];

  const experiment = r.get("experiment");
  const materials = r.get("materials").filter(Boolean);
  const instruments = r.get("instruments").filter(Boolean);

  if (!experiment || (materials.length === 0 && instruments.length === 0)) {
    return null;
  }

  const nodes = [];
  const edges = [];

  nodes.push({
    id: "exp",
    label: experiment,
    color: { background: "#1677ff", border: "#0958d9" },
    size: 25
  });

  materials.forEach((m, i) => {
    const id = `m-${i}`;
    nodes.push({
      id,
      label: m,
      color: { background: "#52c41a", border: "#237804" }
    });

    edges.push({
      from: id,
      to: "exp"
    });
  });

  instruments.forEach((inst, i) => {
    const id = `i-${i}`;
    nodes.push({
      id,
      label: inst,
      color: { background: "#fa8c16", border: "#ad4e00" }
    });

    edges.push({
      from: id,
      to: "exp"
    });
  });

  return { nodes, edges };
};


export const experimentPeople = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (e:Experiment {name: $name})

    OPTIONAL MATCH (p1:Person)-[:MAKER_OF]->(e)
    WITH e, collect(DISTINCT p1) AS inventors

    OPTIONAL MATCH (p2:Person)-[:PROPONENT_OF]->(e)
    WITH 
        e, 
        inventors,
        [p IN collect(DISTINCT p2) WHERE NOT p IN inventors] AS proponents

    RETURN 
        e.name AS experiment,
        [p IN inventors | p.name] AS inventors,
        [p IN proponents | p.name] AS proponents
    `,
    { name }
  );

  if (result.records.length === 0) return null;

  const r = result.records[0];

  return {
    experiment: r.get("experiment"),
    inventors: r.get("inventors").filter(Boolean),
    proponents: r.get("proponents").filter(Boolean)
  };
};