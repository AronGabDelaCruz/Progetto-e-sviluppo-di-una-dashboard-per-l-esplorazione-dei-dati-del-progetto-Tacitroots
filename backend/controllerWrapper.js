export const handleRoute = (driver, fn) => async (req, res) => {
  const session = driver.session({
    database: process.env.NEO4J_DATABASE
  });

  try {
    const data = await fn(session, req);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Errore server");
  } finally {
    await session.close();
  }
};