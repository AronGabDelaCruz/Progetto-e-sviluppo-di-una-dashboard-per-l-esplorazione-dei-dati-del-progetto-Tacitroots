export const dbOverview = async (session) => {
  const result = await session.run(`
    CALL {
      MATCH (n) RETURN count(n) AS totalNodes
    }
    CALL {
      MATCH ()-[r]->() RETURN count(r) AS totalRelationships
    }
    CALL {
      CALL db.labels() YIELD label
      RETURN count(label) AS totalNodeTypes
    }
    CALL {
      CALL db.relationshipTypes() YIELD relationshipType
      RETURN count(relationshipType) AS totalRelationshipTypes
    }
    RETURN totalNodes, totalRelationships, totalNodeTypes, totalRelationshipTypes
  `);

  const record = result.records[0];

  return {
    totalNodes: record.get("totalNodes").toNumber(),
    totalRelationships: record.get("totalRelationships").toNumber(),
    totalNodeTypes: record.get("totalNodeTypes").toNumber(),
    totalRelationshipTypes: record.get("totalRelationshipTypes").toNumber()
  };
};


export const nodesByLabel = async (session) => {
  const result = await session.run(`
    MATCH (n)
    UNWIND labels(n) AS label
    RETURN label, count(*) AS count
    ORDER BY count DESC
  `);

  return result.records.map(r => ({
    label: r.get("label"),
    count: r.get("count").toNumber()
  }));
};


export const graphByNodeLabels = async (session, req) => {
  const label = req.params.label;

  const result = await session.run(`
    MATCH (a)-[r]->(b)
    WHERE $label IN labels(a) OR $label IN labels(b)

    WITH 
      head(labels(a)) AS from,
      head(labels(b)) AS to,
      type(r) AS rel

    RETURN 
      from,
      to,
      collect(DISTINCT rel) AS rels
    ORDER BY from, to
  `, { label });

  const nodes = new Set();
  const edges = [];

  result.records.forEach(record => {
    const from = record.get("from");
    const to = record.get("to");
    const rels = record.get("rels");

    nodes.add(from);
    nodes.add(to);

    edges.push({
      from,
      to,
      rels,                 // 🔥 array vero
      label: rels.join(", ") // opzionale per debug o tooltip
    });
  });

  return {
    nodes: Array.from(nodes).map(n => ({
      id: n,
      label: n
    })),
    edges
  };
};

export const relationTypes = async (session) => {
  const result = await session.run(`
    MATCH ()-[r]->()
    RETURN type(r) AS relation, COUNT(r) AS count
    ORDER BY count DESC
  `);

  return result.records.map(r => ({
    relation: r.get("relation"),
    count: r.get("count").toNumber()
  }));
};

export const graphByRelationType = async (session, req) => {
  const relation = req.params.relation;

  const result = await session.run(`
    MATCH (a)-[r]->(b)
    WHERE type(r) = $relation

    RETURN DISTINCT
      labels(a)[0] AS from,
      labels(b)[0] AS to
  `, { relation });

  const nodesSet = new Set();
  const edges = [];

  result.records.forEach(record => {
    const from = record.get("from");
    const to = record.get("to");

    nodesSet.add(from);
    nodesSet.add(to);

    edges.push({
      from,
      to,
      label: relation
    });
  });

  const nodes = Array.from(nodesSet).map(n => ({
    id: n,
    label: n
  }));

  return { nodes, edges };
};