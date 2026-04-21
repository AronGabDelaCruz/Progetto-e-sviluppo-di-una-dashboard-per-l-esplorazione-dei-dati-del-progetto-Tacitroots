export const personsExchangeTimeline = async (session, req) => {
  const { name1, name2 } = req.params;

  const result = await session.run(
    `
MATCH (p1:Person {name: $name1})
MATCH (p2:Person {name: $name2})

MATCH (d:Document)
WHERE 
  (
    (p1)<-[:WRITTEN_BY]-(d)-[:RECEIVED_BY]->(p2)
    OR
    (p2)<-[:WRITTEN_BY]-(d)-[:RECEIVED_BY]->(p1)
  )
  AND d.date IS NOT NULL

WITH toInteger(split(d.date, "-")[0]) AS year
WHERE year IS NOT NULL

RETURN year, COUNT(*) AS count
ORDER BY year
    `,
    { name1, name2 }
  );

  return result.records.map(r => ({
    year: r.get("year")?.toNumber?.() ?? r.get("year"),
    count: r.get("count").toNumber()
  }));
};


export const personFieldPacking = async (session, req) => {
  const { name1, name2 } = req.params;

  const result = await session.run(
    `
MATCH (p1:Person {name: $name1})
MATCH (p2:Person {name: $name2})

MATCH (d:Document)-[:WRITTEN_BY]->(sender:Person)
MATCH (d)-[:RECEIVED_BY]->(receiver:Person)

WHERE 
  (sender = p1 AND receiver = p2)
  OR
  (sender = p2 AND receiver = p1)

OPTIONAL MATCH (d)-[:TAGGED_WITH]->(f:Field)

RETURN 
  f.name AS field,
  COUNT(DISTINCT d) AS count
ORDER BY count DESC
    `,
    { name1, name2 }
  );

  return result.records.map(r => ({
    field: r.get("field"),
    count: r.get("count").toNumber()
  }));
};

export const personCitedBetween = async (session, req) => {
  const { name1, name2 } = req.params;

  const result = await session.run(
    `
    MATCH (p1:Person {name: $name1})
    MATCH (p2:Person {name: $name2})

    MATCH (d:Document)
    MATCH (d)-[:WRITTEN_BY]->(sender:Person)
    MATCH (d)-[:RECEIVED_BY]->(receiver:Person)

    WHERE 
      (sender = p1 AND receiver = p2)
      OR
      (sender = p2 AND receiver = p1)

    MATCH (other:Person)-[:QUOTED_IN]->(d)
    WHERE other <> sender AND other <> receiver

    RETURN 
      other.name AS person,
      COUNT(DISTINCT d) AS count
    ORDER BY count DESC;
    `,
    {
      name1: name1,
      name2: name2
    }
  );

  return result.records.map(r => ({
    person: r.get("person"),
    count: r.get("count").toNumber()
  }));
};

export const personExperimentHistogram = async (session, req) => {
  const { name1, name2 } = req.params;

  const result = await session.run(
    `
MATCH (p1:Person {name: $name1})
MATCH (p2:Person {name: $name2})

MATCH (d:Document)
WHERE 
  (p1)<-[:WRITTEN_BY]-(d)-[:RECEIVED_BY]->(p2)
  OR
  (p2)<-[:WRITTEN_BY]-(d)-[:RECEIVED_BY]->(p1)

MATCH (e:Experiment)-[:CITED_IN]->(d)

RETURN 
  e.name AS experiment,
  COUNT(DISTINCT d) AS count
ORDER BY count DESC
    `,
    { name1, name2 }
  );

  return result.records.map(r => ({
    experiment: r.get("experiment"),
    count: r.get("count").toNumber()
  }));
};