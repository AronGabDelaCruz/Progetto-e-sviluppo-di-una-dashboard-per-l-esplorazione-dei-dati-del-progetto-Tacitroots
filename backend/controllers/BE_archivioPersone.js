// Tabella che elenca le persone
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
// informazioni generali della persona selezionata
export const personDetail = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})
    RETURN 
      p.name AS name,
      p.birth AS birth,
      p.death AS death,
      p.notes AS notes,
      p.wikipedia AS wikipedia
    `,
    { name }
  );

  if (result.records.length === 0) return null;

  const r = result.records[0];

  return {
    name: r.get("name"),
    birth: r.get("birth")?.toNumber?.() ?? r.get("birth"),
    death: r.get("death")?.toNumber?.() ?? r.get("death"),
   notes: r.get("notes") || null,
    wikipedia: r.get("wikipedia") || null
  };
};

// Network in uscita
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
// Principali Field
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
// Mappa dei senders
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
// Timeline delle citazioni alla persona seleziona nel corso degli anni
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
// da chi è stato citato la persona selezionata
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

// strumnti proposti o citati dalla persona selezionata
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
// esperimenti inventati o proposti dalla persona citata
export const personExperimentPacking = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `

MATCH (p:Person {name: $name})

CALL {
    WITH p
    MATCH (p)-[:MAKER_OF]->(e:Experiment)
    OPTIONAL MATCH (e)-[:CITED_IN]->(d:Document)
    RETURN "invented" AS type, e, count(DISTINCT d) AS num_citations

    UNION

    WITH p
    MATCH (p)-[:PROPONENT_OF]->(e:Experiment)
    WHERE NOT (p)-[:MAKER_OF]->(e)
    OPTIONAL MATCH (e)-[:CITED_IN]->(d:Document)
    RETURN "proposed" AS type, e, count(DISTINCT d) AS num_citations
}

RETURN 
    type,
    e.name AS experiment,
    num_citations
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
// le persone cha ha citato la persona selezionata
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
// Mappa dei recever
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
// network in entrata
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
// similarità per field
export const personSharedFields = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})-[:SIMILAR_TO]->(other:Person)
    WHERE other <> p

    MATCH (p)-[:CITED_FIELD|TAGGED_WITH]->(f:Field)
    MATCH (other)-[:CITED_FIELD|TAGGED_WITH]->(f)

    RETURN 
        other.name AS person,
        count(DISTINCT f) AS count
    ORDER BY count DESC
    `,
    { name }
  );

  return result.records.map(r => ({
    person: r.get("person"),
    count: r.get("count").toNumber()
  }));
};
// similarità per quotazione
export const personQuotedSimilarity = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})-[:SIMILAR_TO_QUOTED]->(other:Person)

    MATCH (p)-[:QUOTED_IN]->(d:Document)
    MATCH (other)-[:QUOTED_IN]->(d)

    RETURN 
        other.name AS person,
        count(DISTINCT d) AS count
    ORDER BY count DESC
    `,
    { name }
  );

  return result.records.map(r => ({
    person: r.get("person"),
    count: r.get("count").toNumber()
  }));
};
// similarità per citazioni a diverse entità
export const personSharedCitedEntities = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})-[:SIMILAR_TO_CITED]->(other:Person)

    MATCH (p)<-[:WRITTEN_BY]-(d1:Document)
    MATCH (other)<-[:WRITTEN_BY]-(d2:Document)

    MATCH (entity)-[:CITED_IN]->(d1)
    MATCH (entity)-[:CITED_IN]->(d2)

    WHERE entity:Book 
       OR entity:Experiment 
       OR entity:Instrument

    RETURN 
        other.name AS person,
        count(DISTINCT entity) AS count
    ORDER BY count DESC
    `,
    { name }
  );

  return result.records.map(r => ({
    person: r.get("person"),
    count: r.get("count").toNumber()
  }));
};

// dato una persona restituisce i libri che ha citato
export const personBooksBar = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})<-[:WRITTEN_BY|RECEIVED_BY]-(d:Document)
    MATCH (d)<-[:CITED_IN]-(b:Book)
    WHERE b.title IS NOT NULL

    RETURN 
        b.title AS book,
        count(DISTINCT d) AS num_citations
    ORDER BY num_citations DESC
    `,
    { name }
  );

  return result.records.map((r) => ({
    book: r.get("book"),
    count: r.get("num_citations").toNumber()
  }));
};
// themes citati
export const personTagsBar = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (p:Person {name: $name})<-[:WRITTEN_BY|RECEIVED_BY]-(d:Document)
    MATCH (d)-[:TAGGED_WITH]->(t:Tag)

    RETURN 
        t.name AS tag,
        count(DISTINCT d) AS num_documents
    ORDER BY num_documents DESC
    `,
    { name }
  );

  return result.records.map((r) => ({
    tag: r.get("tag"),
    count: r.get("num_documents").toNumber()
  }));
};

// sankey diagram
export const getPersonSankey = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (sender:Person {name: $name})<-[:WRITTEN_BY]-(d:Document)

// --------------------
// FIELD NORMALIZATION
// --------------------
MATCH (d)-[:TAGGED_WITH]->(f:Field)
OPTIONAL MATCH (f)-[:SUBFIELD_OF*0..]->(root)

WITH sender, d, COALESCE(root, f) AS field
WHERE field.name IS NOT NULL

// --------------------
// TOP 10 FIELDS
// --------------------
WITH sender, field, collect(DISTINCT d) AS field_docs
WITH sender, field, field_docs, size(field_docs) AS field_doc_count
ORDER BY field_doc_count DESC
WITH sender, field, field_docs
LIMIT 10

// ============================
// TOP 15 RECEIVERS (GLOBAL)
// ============================
CALL {
    WITH sender
    MATCH (sender)<-[:WRITTEN_BY]-(d:Document)
    MATCH (d)-[:RECEIVED_BY]->(r:Person)
    WITH r, count(DISTINCT d) AS cnt
    ORDER BY cnt DESC
    LIMIT 15
    RETURN collect(r) AS top_receivers
}

// --------------------
// FINAL COMPUTATION
// --------------------
UNWIND field_docs AS d
MATCH (d)-[:RECEIVED_BY]->(receiver:Person)

WITH sender, field, receiver, top_receivers, count(DISTINCT d) AS value
WHERE receiver IN top_receivers

RETURN 
    sender.name AS sender,
    field.name AS field,
    receiver.name AS receiver,
    value
ORDER BY field, value DESC;
    `,
    { name }
  );

  const rows = result.records.map(r => ({
    sender: r.get("sender"),
    field: r.get("field"),
    receiver: r.get("receiver"),
    value: r.get("value").toNumber()
  }));

  // -----------------------------
  // 🔥 BUILD SANKEY STRUCTURE
  // -----------------------------
  const nodeMap = new Map();
  const getIndex = (name) => {
    if (!nodeMap.has(name)) nodeMap.set(name, nodeMap.size);
    return nodeMap.get(name);
  };

  const links = [];

  rows.forEach(r => {
    const s = getIndex(r.sender);
    const f = getIndex(r.field);
    const t = getIndex(r.receiver);

    // sender → field
    links.push({
      source: s,
      target: f,
      value: r.value
    });

    // field → receiver
    links.push({
      source: f,
      target: t,
      value: r.value
    });
  });


  // sankey sender->selceted
  const nodes = Array.from(nodeMap.keys()).map(name => {
  const isSender = name === rows[0]?.sender;
  const isReceiver = rows.some(r => r.receiver === name);
  const isField = !isSender && !isReceiver;

  return {
    name,
    group: isSender
      ? "sender"
      : isField
      ? "field"
      : "receiver"
  };
});

  return { nodes, links };
};




export const personReceiverSenderFieldSankey = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
MATCH (receiver:Person {name: $name})<-[:RECEIVED_BY]-(d0:Document)

// ============================
// TOP 15 SENDERS
// ============================
MATCH (d0)-[:WRITTEN_BY]->(s:Person)

WITH receiver, s, count(DISTINCT d0) AS total_sent
ORDER BY total_sent DESC
LIMIT 15

WITH receiver,
     collect(s) AS top_sender_list

// ============================
// SOLO DOCUMENTI DEI TOP 15 SENDERS
// ============================
MATCH (sender:Person)<-[:WRITTEN_BY]-(doc:Document)-[:RECEIVED_BY]->(receiver)
WHERE sender IN top_sender_list

// ============================
// FIELD NORMALIZATION
// ============================
MATCH (doc)-[:TAGGED_WITH]->(f:Field)
OPTIONAL MATCH (f)-[:SUBFIELD_OF*0..]->(root)

WITH receiver,
     sender,
     doc,
     COALESCE(root, f) AS field

WHERE field.name IS NOT NULL

// ============================
// COUNT GLOBAL PER FIELD (IMPORTANTE)
// ============================
WITH receiver,
     sender,
     field,
     count(DISTINCT doc) AS field_docs

// ============================
// TOP 10 FIELD GLOBALI (QUI È LA CHIAVE)
// ============================
WITH receiver,
     field,
     sum(field_docs) AS total_field_docs,
     collect({sender: sender, docs: field_docs}) AS breakdown

ORDER BY total_field_docs DESC
LIMIT 10

// ============================
// OUTPUT
// ============================
UNWIND breakdown AS b

RETURN
    receiver.name AS receiver,
    b.sender.name AS sender,
    field.name AS field,
    b.docs AS field_documents,
    total_field_docs

ORDER BY total_field_docs DESC, field_documents DESC
    `,
    { name }
  );

  // =========================================================
  // 🔥 1. ROWS NORMALIZATION (come getPersonSankey)
  // =========================================================
  const rows = result.records.map(r => ({
    receiver: r.get("receiver"),
    sender: r.get("sender"),
    field: r.get("field"),
    value: r.get("field_documents").toNumber()
  }));

  // =========================================================
  // 🔥 2. NODE INDEXING
  // =========================================================
  const nodeMap = new Map();
  const getIndex = (name) => {
    if (!nodeMap.has(name)) {
      nodeMap.set(name, nodeMap.size);
    }
    return nodeMap.get(name);
  };

  const links = [];

  rows.forEach(r => {
    const s = getIndex(r.sender);
    const f = getIndex(r.field);
    const t = getIndex(r.receiver);

    // sender → field
    links.push({
      source: s,
      target: f,
      value: r.value
    });

    // field → receiver
    links.push({
      source: f,
      target: t,
      value: r.value
    });
  });

  // =========================================================
  // 🔥 3. NODE BUILDING WITH GROUP LOGIC
  // =========================================================
  const nodes = Array.from(nodeMap.keys()).map((name) => {
    const isSender = rows.some(r => r.sender === name);
    const isReceiver = rows.some(r => r.receiver === name);
    const isField = !isSender && !isReceiver;

    return {
      name,
      group: isSender && !isField
        ? "sender"
        : isReceiver && !isSender
        ? "receiver"
        : "field"
    };
  });

  return {
    nodes,
    links
  };
};

// sankey TAG: selected -> recever

export const getPersonTagSankey = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
    MATCH (sender:Person {name: $name})<-[:WRITTEN_BY]-(d:Document)

    // --------------------
    // TAG NORMALIZATION
    // --------------------
    MATCH (d)-[:TAGGED_WITH]->(tag:Tag)

    WITH sender, d, tag
    WHERE tag.name IS NOT NULL

    // --------------------
    // TOP 10 TAGS
    // --------------------
    WITH sender, tag, collect(DISTINCT d) AS tag_docs
    WITH sender, tag, tag_docs, size(tag_docs) AS tag_doc_count
    ORDER BY tag_doc_count DESC

    WITH sender, tag, tag_docs
    LIMIT 10

    // ============================
    // TOP 15 RECEIVERS (GLOBAL)
    // ============================
    CALL {
        WITH sender

        MATCH (sender)<-[:WRITTEN_BY]-(d:Document)
        MATCH (d)-[:RECEIVED_BY]->(r:Person)

        WITH r, count(DISTINCT d) AS cnt
        ORDER BY cnt DESC
        LIMIT 15

        RETURN collect(r) AS top_receivers
    }

    // --------------------
    // FINAL COMPUTATION
    // --------------------
    UNWIND tag_docs AS d

    MATCH (d)-[:RECEIVED_BY]->(receiver:Person)

    WITH sender,
         tag,
         receiver,
         top_receivers,
         count(DISTINCT d) AS value

    WHERE receiver IN top_receivers

    RETURN 
        sender.name AS sender,
        tag.name AS tag,
        receiver.name AS receiver,
        value

    ORDER BY tag, value DESC
    `,
    { name }
  );

  const rows = result.records.map(r => ({
    sender: r.get("sender"),
    tag: r.get("tag"),
    receiver: r.get("receiver"),
    value: r.get("value").toNumber()
  }));

  // -----------------------------
  // 🔥 BUILD SANKEY STRUCTURE
  // -----------------------------
  const nodeMap = new Map();

  const getIndex = (name) => {
    if (!nodeMap.has(name)) {
      nodeMap.set(name, nodeMap.size);
    }
    return nodeMap.get(name);
  };

  // uso una map per evitare link duplicati
  const linkMap = new Map();

  const addLink = (source, target, value) => {
    const key = `${source}->${target}`;

    if (linkMap.has(key)) {
      linkMap.get(key).value += value;
    } else {
      linkMap.set(key, {
        source,
        target,
        value
      });
    }
  };

  rows.forEach(r => {
    const s = getIndex(r.sender);
    const t = getIndex(r.tag);
    const rcv = getIndex(r.receiver);

    // sender -> tag
    addLink(s, t, r.value);

    // tag -> receiver
    addLink(t, rcv, r.value);
  });

  // nodes array
  const nodes = Array.from(nodeMap.keys()).map(name => ({
    name
  }));

  // links array
  const links = Array.from(linkMap.values());

  return {
    nodes,
    links
  };
};

export const personReceiverSenderTagSankey = async (session, req) => {
  const { name } = req.params;

  const result = await session.run(
    `
MATCH (receiver:Person {name: $name})<-[:RECEIVED_BY]-(d0:Document)

// ============================
// TOP 15 SENDERS
// ============================
MATCH (d0)-[:WRITTEN_BY]->(s:Person)

WITH receiver, s, count(DISTINCT d0) AS total_sent
ORDER BY total_sent DESC
LIMIT 15

WITH receiver,
     collect(s) AS top_sender_list

// ============================
// SOLO DOCUMENTI DEI TOP 15 SENDERS
// ============================
MATCH (sender:Person)<-[:WRITTEN_BY]-(doc:Document)-[:RECEIVED_BY]->(receiver)
WHERE sender IN top_sender_list

// ============================
// TAG NORMALIZATION
// ============================
MATCH (doc)-[:TAGGED_WITH]->(tag:Tag)

WITH receiver,
     sender,
     doc,
     tag

WHERE tag.name IS NOT NULL

// ============================
// COUNT GLOBAL PER TAG
// ============================
WITH receiver,
     sender,
     tag,
     count(DISTINCT doc) AS tag_docs

// ============================
// TOP 10 TAG GLOBALI
// ============================
WITH receiver,
     tag,
     sum(tag_docs) AS total_tag_docs,
     collect({
        sender: sender,
        docs: tag_docs
     }) AS breakdown

ORDER BY total_tag_docs DESC
LIMIT 10

// ============================
// OUTPUT
// ============================
UNWIND breakdown AS b

RETURN
    receiver.name AS receiver,
    b.sender.name AS sender,
    tag.name AS tag,
    b.docs AS tag_documents,
    total_tag_docs

ORDER BY
    total_tag_docs DESC,
    tag_documents DESC
    `,
    { name }
  );

  // =========================================================
  // 🔥 1. ROWS NORMALIZATION
  // =========================================================
  const rows = result.records.map(r => ({
    receiver: r.get("receiver"),
    sender: r.get("sender"),
    tag: r.get("tag"),
    value: r.get("tag_documents").toNumber()
  }));

  // =========================================================
  // 🔥 2. NODE INDEXING
  // =========================================================
  const nodeMap = new Map();

  const getIndex = (name) => {
    if (!nodeMap.has(name)) {
      nodeMap.set(name, nodeMap.size);
    }

    return nodeMap.get(name);
  };

  // uso map per evitare duplicati
  const linkMap = new Map();

  const addLink = (source, target, value) => {
    const key = `${source}->${target}`;

    if (linkMap.has(key)) {
      linkMap.get(key).value += value;
    } else {
      linkMap.set(key, {
        source,
        target,
        value
      });
    }
  };

  rows.forEach(r => {
    const s = getIndex(r.sender);
    const t = getIndex(r.tag);
    const rcv = getIndex(r.receiver);

    // sender -> tag
    addLink(s, t, r.value);

    // tag -> receiver
    addLink(t, rcv, r.value);
  });

  // =========================================================
  // 🔥 3. NODE BUILDING WITH GROUP LOGIC
  // =========================================================
  const nodes = Array.from(nodeMap.keys()).map((name) => {

    const isSender = rows.some(r => r.sender === name);
    const isReceiver = rows.some(r => r.receiver === name);
    const isTag = rows.some(r => r.tag === name);

    return {
      name,
      group:
        isSender && !isTag
          ? "sender"
          : isReceiver && !isTag
          ? "receiver"
          : "tag"
    };
  });

  return {
    nodes,
    links: Array.from(linkMap.values())
  };
};