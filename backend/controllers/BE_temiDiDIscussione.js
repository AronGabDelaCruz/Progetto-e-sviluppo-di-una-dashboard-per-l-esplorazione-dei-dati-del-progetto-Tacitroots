// queries/topicsStats.js

export const topicsStats = async (session) => {
  const result = await session.run(`
  MATCH (d:Document)-[:TAGGED_WITH]->(f:Field)
  where d.year is not null
  OPTIONAL MATCH (root)<-[:SUBFIELD_OF*]-(f)
  WHERE NOT EXISTS {
      MATCH (root)-[:SUBFIELD_OF]->()
  }

  WITH d, CASE WHEN root IS NOT NULL THEN root ELSE f END AS parent

  RETURN
      parent.name AS field,
      count(DISTINCT d) AS num_documents
  ORDER BY num_documents DESC
  `);

  return result.records.map((record) => ({
    field: record.get("field"),
    num_documents: record.get("num_documents").toNumber(),
  }));
};



export const topicTimelineWithCitations = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (root:Field {name: $name})

    OPTIONAL MATCH (child:Field)-[:SUBFIELD_OF*]->(root)

    WITH root, collect(DISTINCT child) AS children
    WITH children + root AS fields

    // documenti che discutono il field
    MATCH (d:Document)-[:TAGGED_WITH]->(f:Field)
    WHERE f IN fields
      AND d.year IS NOT NULL

    WITH d, fields, toInteger(d.year) AS year

    // libri citati nei documenti
    OPTIONAL MATCH (b:Book)-[:CITED_IN]->(d)
    OPTIONAL MATCH (b)-[:TAGGED_WITH]->(bf:Field)
    WHERE bf IN fields

    RETURN
        year,
        count(DISTINCT d) AS field_discussions,
        count(DISTINCT b) AS book_citations
    ORDER BY year ASC
    `,
    { name }
  );

  return result.records.map(r => ({
    year: r.get("year").toNumber(),
    field_discussions: r.get("field_discussions").toNumber(),
    book_citations: r.get("book_citations").toNumber()
  }));
};


export const topicPeopleSent = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (root:Field {name: $name})

    OPTIONAL MATCH (child:Field)-[:SUBFIELD_OF*0..]->(root)

    WITH collect(DISTINCT child) AS fields

    MATCH (d:Document)-[:TAGGED_WITH]->(f:Field)
    WHERE f IN fields

    MATCH (d)-[:WRITTEN_BY]->(p:Person)

    RETURN 
        p.name AS person,
        count(DISTINCT d) AS num_documents
    ORDER BY num_documents DESC
    `,
    { name }
  );

  return result.records.map((r) => ({
    person: r.get("person"),
    count: r.get("num_documents").toNumber(),
  }));
};

// queries/topicPeopleReceived.js

export const topicPeopleReceived = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (root:Field {name: $name})

    OPTIONAL MATCH (child:Field)-[:SUBFIELD_OF*0..]->(root)

    WITH collect(DISTINCT child) AS fields

    MATCH (d:Document)-[:TAGGED_WITH]->(f:Field)
    WHERE f IN fields

    MATCH (d)-[:RECEIVED_BY]->(p:Person)

    RETURN 
        p.name AS person,
        count(DISTINCT d) AS num_documents
    ORDER BY num_documents DESC
    `,
    { name }
  );

  return result.records.map((r) => ({
    person: r.get("person"),
    count: r.get("num_documents").toNumber(),
  }));
};



export const topicExperiments = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
      MATCH (root:Field {name: $name})

      OPTIONAL MATCH (child:Field)-[:SUBFIELD_OF*0..]->(root)

      WITH collect(DISTINCT child) AS fields

      MATCH (d:Document)-[:TAGGED_WITH]->(f:Field)
      WHERE f IN fields

      MATCH (e:Experiment)-[:CITED_IN]->(d)

      RETURN 
          e.name AS experiment,
          count(DISTINCT d) AS num_documents
      ORDER BY num_documents DESC
    `,
    { name }
  );

  return result.records.map((r) => ({
    entity: r.get("experiment"),
    count: r.get("num_documents").toNumber(),
  }));
};



export const topicInstruments = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (root:Field {name: $name})

    OPTIONAL MATCH (child:Field)-[:SUBFIELD_OF*0..]->(root)

    WITH collect(DISTINCT child) AS fields

    MATCH (d:Document)-[:TAGGED_WITH]->(f:Field)
    WHERE f IN fields

    MATCH (i:Instrument)-[:CITED_IN]->(d)

    RETURN 
        i.name AS instrument,
        count(DISTINCT d) AS num_documents
    ORDER BY num_documents DESC
    `,
    { name }
  );

  return result.records.map((r) => ({
    entity: r.get("instrument"),
    count: r.get("num_documents").toNumber(),
  }));
};

export const topicSenderLocations = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (root:Field {name: $name})

    OPTIONAL MATCH (child:Field)-[:SUBFIELD_OF*0..]->(root)

    WITH collect(DISTINCT child) AS fields

    MATCH (d:Document)-[:TAGGED_WITH]->(f:Field)
    WHERE f IN fields

    MATCH (d)-[:WRITTEN_FROM]->(l:Location)

    RETURN 
        l.name AS location,
        l.point AS coordinates,
        count(DISTINCT d) AS num_documents
    ORDER BY num_documents DESC
    `,
    { name }
  );

  return result.records.map((r) => {
    const coords = r.get("coordinates");

    return {
      location: r.get("location"),
      count: r.get("num_documents").toNumber(),
      lat: coords?.y ?? coords?.latitude ?? null,
      lng: coords?.x ?? coords?.longitude ?? null
    };
  });
};

export const topicReceiverLocations = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
MATCH (root:Field {name: $name})

OPTIONAL MATCH (child:Field)-[:SUBFIELD_OF*0..]->(root)

WITH collect(DISTINCT child) AS fields

MATCH (d:Document)-[:TAGGED_WITH]->(f:Field)
WHERE f IN fields

MATCH (d)-[:RECEIVED_IN]->(l:Location)

RETURN 
    l.name AS location,
    l.point AS coordinates,
    count(DISTINCT d) AS num_documents
ORDER BY num_documents DESC
    `,
    { name }
  );

  return result.records.map((r) => {
    const coords = r.get("coordinates");

    return {
      location: r.get("location"),
      count: r.get("num_documents").toNumber(),
      lat: coords?.y ?? coords?.latitude ?? null,
      lng: coords?.x ?? coords?.longitude ?? null
    };
  });
};

export const topicBooks = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (root:Field {name: $name})

    OPTIONAL MATCH (child:Field)-[:SUBFIELD_OF*0..]->(root)

    WITH collect(DISTINCT child) AS fields

    MATCH (d:Document)-[:TAGGED_WITH]->(f:Field)
    WHERE f IN fields

    MATCH (d)<-[:CITED_IN]-(b:Book)
    WHERE b.title IS NOT NULL

    RETURN 
        b.title AS book,
        b.authorName AS author_name,
        b.authorSurname AS author_surname,
        count(DISTINCT d) AS num_citations
    ORDER BY num_citations DESC
    `,
    { name }
  );

  return result.records.map((r) => ({
    book: r.get("book") ?? "Unknown title",
    authorName: r.get("author_name") ?? "Unknown",
    authorSurname: r.get("author_surname") ?? "",
    count: r.get("num_citations").toNumber(),
  }));
};

// tags citati nei documenti
export const fieldTags = async (session, req) => {
  const { field } = req.params;

  const result = await session.run(
    `
    MATCH (root:Field {name: $field})

    OPTIONAL MATCH (child:Field)-[:SUBFIELD_OF*0..]->(root)

    WITH collect(DISTINCT child) AS fields

    MATCH (d:Document)-[:CITED_FIELD|TAGGED_WITH]->(f:Field)
    WHERE f IN fields

    MATCH (d)-[:TAGGED_WITH]->(t:Tag)

    RETURN 
        t.name AS tag,
        count(DISTINCT d) AS num_documents
    ORDER BY num_documents DESC
    `,
    { field }
  );

  return result.records.map((r) => ({
    tag: r.get("tag"),
    count: r.get("num_documents").toNumber()
  }));
};