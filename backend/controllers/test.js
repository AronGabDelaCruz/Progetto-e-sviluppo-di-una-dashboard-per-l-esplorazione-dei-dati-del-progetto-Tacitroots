export const letterePerPersona = async (session) => {
  const result = await session.run(`
    MATCH (d:Document)-[:WRITTEN_BY]->(p:Person)
    WITH p, COUNT(d) AS lettere_inviate
    WHERE lettere_inviate > 30
    RETURN p.name AS persona, lettere_inviate
    ORDER BY lettere_inviate DESC
  `);

  return result.records.map(r => ({
    persona: r.get("persona"),
    lettere_inviate: r.get("lettere_inviate").toNumber()
  }));
};

export const cittaLettere = async (session) => {
  const result = await session.run(`
    MATCH (d:Document)-[:WRITTEN_FROM]->(l:Location)
    WHERE l.point IS NOT NULL
    RETURN 
      l.name AS city,
      COUNT(d) AS lettere,
      l.point.y AS lat,
      l.point.x AS lng
    ORDER BY lettere DESC
  `);

  return result.records.map(r => ({
    name: r.get("city"),
    lettere: r.get("lettere").toNumber(),
    lat: r.get("lat"),
    lng: r.get("lng")
  }));
};

export const grafoPersona = async (session, req) => {
  const nome = req.params.nome;
  const result = await session.run(`
    MATCH (p1:Person {name: $nome})<-[:WRITTEN_BY]-(d:Document)-[:RECEIVED_BY]->(p2:Person)
    RETURN 
      p1.name AS source,
      p2.name AS target,
      COUNT(d) AS weight
    UNION
    MATCH (p2:Person)<-[:WRITTEN_BY]-(d:Document)-[:RECEIVED_BY]->(p1:Person {name: $nome})
    RETURN 
      p2.name AS source,
      p1.name AS target,
      COUNT(d) AS weight
  `, { nome });

  return result.records.map(r => ({
    source: r.get("source"),
    target: r.get("target"),
    weight: r.get("weight").toNumber()
  }));
};


export const personList = async (session) => {
  const result = await session.run(`
    MATCH (p:Person)<-[:WRITTEN_BY]-(d:Document)-[:RECEIVED_BY]->(:Person)
    RETURN p.name AS name, COUNT(d) AS lettere_totali
    ORDER BY lettere_totali DESC
  `);

  return result.records.map(r => r.get("name"));
};

export const letterePerAnno = async (session, req) => {
  const field = req.query.field; 
  const query = field
    ? `
      MATCH (d:Document)-[:WRITTEN_IN_FIELD|TAGGED_WITH]->(f:Field)
      WHERE trim(toLower(f.name)) = trim(toLower($field))
      WITH d, split(d.date, "-")[0] AS annoStr
      WITH d, toInteger(annoStr) AS anno
      WHERE anno IS NOT NULL AND anno > 1400 AND anno < 1800
      RETURN anno, COUNT(d) AS lettere
      ORDER BY anno
    `
    : `
      MATCH (d:Document)
      WITH d, split(d.date, "-")[0] AS annoStr
      WITH d, toInteger(annoStr) AS anno
      WHERE anno IS NOT NULL AND anno > 1400 AND anno < 1800
      RETURN anno, COUNT(d) AS lettere
      ORDER BY anno
    `;

  const result = await session.run(query, { field });

  return result.records.map(r => ({
    anno: r.get("anno").toNumber(),
    lettere: r.get("lettere").toNumber()
  }));
};

export const fieldsList = async (session) => {
  const result = await session.run(`
    MATCH (d:Document)-[:TAGGED_WITH]->(f:Field)
    RETURN f.name AS name, COUNT(d) AS lettere
    ORDER BY lettere DESC
  `);

  return result.records.map(r => r.get("name"));
};

export const schemaGrafo = async (session) => {
  const result = await session.run(`
    MATCH (a)-[r]->(b)
    WHERE 'Person' IN labels(a) OR 'Person' IN labels(b)
    RETURN DISTINCT 
      head(labels(a)) AS from,
      type(r) AS rel,
      head(labels(b)) AS to
    ORDER BY rel
  `);

  // Creiamo una mappa da coppia from-to a array di relazioni
  const map = {};

  result.records.forEach(record => {
    const from = record.get("from");
    const to = record.get("to");
    const rel = record.get("rel");

    const key = `${from},${to}`; // chiave "from,to"

    if (!map[key]) {
      map[key] = [];
    }

    map[key].push(rel);
  });

  return map;
};

export const schemaRelazioni = async (session) => {
  const result = await session.run(`
    MATCH (a)-[:SIMILAR_TO_QUOTED]->(b)
    UNWIND labels(a) AS labelA
    UNWIND labels(b) AS labelB
    RETURN DISTINCT labelA AS fromNodeType, labelB AS toNodeType
  `);

  const nodesSet = new Set();
  const edgesSet = new Set();
  const edges = [];

  result.records.forEach((record) => {
    const from = record.get("fromNodeType");
    const to = record.get("toNodeType");

    nodesSet.add(from);
    nodesSet.add(to);

    const edgeKey = `${from}->${to}`;
    if (!edgesSet.has(edgeKey)) {
      edgesSet.add(edgeKey);
      edges.push({
        from: from,
        to: to
      });
    }
  });

  const nodes = Array.from(nodesSet).map((n) => ({
    id: n,
    label: n
  }));

  return { nodes, edges };
};