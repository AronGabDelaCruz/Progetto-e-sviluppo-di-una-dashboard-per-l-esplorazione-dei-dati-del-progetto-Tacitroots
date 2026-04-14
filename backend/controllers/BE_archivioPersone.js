export const peopleStats = async (session) => {
  const result = await session.run(`
    MATCH (p:Person)

    OPTIONAL MATCH (p)<-[:WRITTEN_BY]-(d1:Document)
    WITH p, COUNT(DISTINCT d1) AS sent

    OPTIONAL MATCH (p)<-[:RECEIVED_BY]-(d2:Document)
    WITH p, sent, COUNT(DISTINCT d2) AS received

    RETURN 
      p.name AS name,
      sent,
      received,
      sent + received AS totalLetters
    ORDER BY totalLetters DESC
  `);

  return result.records.map(r => ({
    name: r.get("name"),
    sent: r.get("sent").toNumber(),
    received: r.get("received").toNumber(),
    totalLetters: r.get("totalLetters").toNumber()
  }));
};

export const personDetail = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(`
    MATCH (p:Person {name: $name})
    RETURN p.name AS name, p.birth AS birth, p.death AS death
  `, { name });

  if (result.records.length === 0) return null;

  const r = result.records[0];

  return {
    name: r.get("name"),
    birth: r.get("birth")?.toNumber?.() ?? r.get("birth"),
    death: r.get("death")?.toNumber?.() ?? r.get("death")
  };
};


export const personGraph = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(`
    MATCH (p:Person {name: $name})<-[:WRITTEN_BY]-(d:Document)-[:RECEIVED_BY]->(other:Person)
    WHERE p <> other
    RETURN p, other, COUNT(DISTINCT d) AS letters
  `, { name });

  const nodesMap = new Map();
  const edges = [];

  result.records.forEach(record => {
    const p = record.get("p");
    const other = record.get("other");
    const letters = record.get("letters").toNumber();

    const pId = p.identity.toString();
    const oId = other.identity.toString();

    // nodo sorgente (persona selezionata)
    if (!nodesMap.has(pId)) {
      nodesMap.set(pId, {
        id: pId,
        label: p.properties.name,
        group: "Person"
      });
    }

   
    if (!nodesMap.has(oId)) {
      nodesMap.set(oId, {
        id: oId,
        label: other.properties.name,
        group: "Person"
      });
    }

 
    edges.push({
      from: pId,
      to: oId,
      rels: [`LETTERS: ${letters}`]
    });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges
  };
};

export const personFieldPie = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})<-[:WRITTEN_BY]-(d:Document)
    MATCH (d)-[:TAGGED_WITH]->(f:Field)
    RETURN f.name AS field, COUNT(DISTINCT d) AS count
    ORDER BY count DESC
    LIMIT 8
    `,
    { name }
  );

  return result.records.map(r => ({
    field: r.get("field"),
    count: r.get("count").toNumber()
  }));
};

export const personWritingMap = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})<-[:WRITTEN_BY]-(d:Document)
    MATCH (d)-[:WRITTEN_FROM]->(l:Location)
    RETURN 
      l.name AS location,
      l.point AS coordinates,
      COUNT(DISTINCT d) AS num_documents
    ORDER BY num_documents DESC
    `,
    { name }
  );

  return result.records.map(r => {
    const coords = r.get("coordinates");

    const lat = coords?.y ?? coords?.latitude ?? null;
    const lng = coords?.x ?? coords?.longitude ?? null;

    return {
      location: r.get("location"),
      count: r.get("num_documents").toNumber(),
      lat,
      lng
    };
  });
};