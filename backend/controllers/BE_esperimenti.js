export const experimentsStats = async (session) => {
  const result = await session.run(`
MATCH (d:Document)<-[:CITED_IN]-(i:Experiment)

OPTIONAL MATCH (root)-[:PARENT_OF*1]->(i)

WITH d, CASE WHEN root IS NOT NULL THEN root ELSE i END AS parent

WHERE parent IS NOT NULL AND parent.name IS NOT NULL

WITH parent, count(DISTINCT d) AS num_mentions

RETURN 
    parent.name AS experiment,
    num_mentions
ORDER BY num_mentions DESC
  `);

  return result.records.map(r => ({
    experiment: r.get("experiment"),
    count: r.get("num_mentions").toNumber()
  }));
};

export const experimentTimeline = async (session, req) => {
const { name } = req.params;
  const result = await session.run(
    `
MATCH (e:Experiment {name: $name})

OPTIONAL MATCH (e)-[:PARENT_OF*0..]->(root)

WITH COALESCE(root, e) AS experiment

MATCH (experiment)-[:CITED_IN]->(d:Document)
WHERE d.date IS NOT NULL AND d.date <> ""

WITH toInteger(split(d.date, "-")[0]) AS year, d

RETURN 
    year,
    count(DISTINCT d) AS citations
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

  OPTIONAL MATCH (e)-[:PARENT_OF*0..]->(root)

  WITH COALESCE(root, e) AS experiment

  MATCH (experiment)-[:CITED_IN]->(d:Document)
  MATCH (p:Person)<-[:WRITTEN_BY]-(d)

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
    MATCH (e:Experiment {name: $name})

    OPTIONAL MATCH (e)-[:PARENT_OF*0..]->(root)

    WITH COALESCE(root, e) AS experiment

    MATCH (experiment)-[:CITED_IN]->(d:Document)
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

    OPTIONAL MATCH (e)-[:PARENT_OF*0..]->(root)

    WITH COALESCE(root, e) AS experiment

    OPTIONAL MATCH (m:Material)-[:FEATURED_IN]->(experiment)
    OPTIONAL MATCH (i:Instrument)-[:USED_IN]->(experiment)

    RETURN 
        experiment.name AS experiment,
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

    OPTIONAL MATCH (e)-[:PARENT_OF*0..]->(root)

    WITH COALESCE(root, e) AS experiment

    OPTIONAL MATCH (p1:Person)-[:MAKER_OF]->(experiment)
    WITH experiment, collect(DISTINCT p1) AS inventors

    OPTIONAL MATCH (p2:Person)-[:PROPONENT_OF]->(experiment)
    WITH experiment, inventors, collect(DISTINCT p2) AS all_proponents

    WITH experiment, inventors,
        [p IN all_proponents WHERE NOT p IN inventors] AS proponents

    RETURN 
        experiment.name AS experiment,
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