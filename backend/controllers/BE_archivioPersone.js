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