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

export const personCitationTimeline = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})-[:QUOTED_IN]->(d:Document)
    WHERE d.date IS NOT NULL
    WITH toInteger(split(d.date, "-")[0]) AS anno, COUNT(d) AS n_doc
    WHERE anno > 1400 AND anno < 1700
    RETURN anno AS year, n_doc AS count
    ORDER BY year
    `,
    { name }
  );

  return result.records.map(r => ({
    year: r.get("year").toNumber(),   
    count: r.get("count").toNumber()
  }));
};

export const personCitedBy = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})-[:QUOTED_IN]->(d:Document)
    MATCH (d)-[:WRITTEN_BY]->(author:Person)
    WHERE author <> p
    RETURN 
      author.name AS citing_person,
      COUNT(d) AS num_citations
    ORDER BY num_citations DESC
    `,
    { name }
  );

  return result.records.map(r => ({
    person: r.get("citing_person"),
    count: r.get("num_citations").toNumber() 
  }));
};


export const personInstrumentPacking = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})

    CALL {
      WITH p
      MATCH (p)-[:MAKER_OF]->(i:Instrument)
      OPTIONAL MATCH (i)-[:CITED_IN]->(d:Document)
      RETURN "invented" AS type, i.name AS instrument, COUNT(DISTINCT d) AS num_citations

      UNION

      WITH p
      MATCH (p)-[:PROPONENT_OF]->(i:Instrument)
      OPTIONAL MATCH (i)-[:CITED_IN]->(d:Document)
      RETURN "proposed" AS type, i.name AS instrument, COUNT(DISTINCT d) AS num_citations
    }

    RETURN type, instrument, num_citations
    ORDER BY num_citations DESC
    `,
    { name }
  );

  return result.records.map(r => ({
    type: r.get("type"),
    instrument: r.get("instrument"),
    count: r.get("num_citations").toNumber()  
  }));
};

export const personExperimentPacking = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})

    CALL {
      WITH p
      MATCH (p)-[:MAKER_OF]->(e:Experiment)
      OPTIONAL MATCH (e)-[:CITED_IN]->(d:Document)
      RETURN "invented" AS type, e.name AS experiment, COUNT(DISTINCT d) AS num_citations

      UNION

      WITH p
      MATCH (p)-[:PROPONENT_OF]->(e:Experiment)
      OPTIONAL MATCH (e)-[:CITED_IN]->(d:Document)
      RETURN "proposed" AS type, e.name AS experiment, COUNT(DISTINCT d) AS num_citations
    }

    RETURN type, experiment, num_citations
    ORDER BY num_citations DESC
    `,
    { name }
  );

  return result.records.map(r => ({
    type: r.get("type"),
    experiment: r.get("experiment"),
    count: r.get("num_citations").toNumber()
  }));
};

export const personCited = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})
    <-[:WRITTEN_BY]-(d:Document)

    MATCH (other:Person)-[:QUOTED_IN]->(d)
    WHERE other <> p

    RETURN 
      other.name AS cited_person,
      COUNT(DISTINCT d) AS num_citations
    ORDER BY num_citations DESC
    `,
    { name }
  );

  return result.records.map(r => ({
    person: r.get("cited_person"),
    count: r.get("num_citations").toNumber()
  }));
};

export const personReceiverMap = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})
          <-[:RECEIVED_BY]-(d:Document)
    MATCH (d)-[:WRITTEN_FROM]->(l:Location)
    RETURN 
      l.name AS location,
      l.point AS coordinates,
      COUNT(DISTINCT d) AS num_letters
    ORDER BY num_letters DESC;
    `,
    { name }
  );

  return result.records.map(r => {
    const coords = r.get("coordinates");

    const lat = coords?.y ?? coords?.latitude ?? null;
    const lng = coords?.x ?? coords?.longitude ?? null;

    return {
      location: r.get("location"),
      count: r.get("num_letters").toNumber(), 
      lat,
      lng
    };
  });
};

export const personGraphIn = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})<-[:RECEIVED_BY]-(d:Document)-[:WRITTEN_BY]->(other:Person)
    WHERE p <> other
    RETURN 
      other AS sender,
      p AS target,
      COUNT(DISTINCT d) AS letters
    ORDER BY letters DESC;
    `,
    { name }
  );

  const nodesMap = new Map();
  const edges = [];

  result.records.forEach(record => {
    const sender = record.get("sender");
    const target = record.get("target");
    const letters = record.get("letters").toNumber();

    const sId = sender.identity.toString();
    const tId = target.identity.toString();

  
    if (!nodesMap.has(sId)) {
      nodesMap.set(sId, {
        id: sId,
        label: sender.properties.name,
        group: "Person"
      });
    }

  
    if (!nodesMap.has(tId)) {
      nodesMap.set(tId, {
        id: tId,
        label: target.properties.name,
        group: "Person"
      });
    }

    edges.push({
      from: sId,
      to: tId,
      rels: [`LETTERS: ${letters}`]
    });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges
  };
};