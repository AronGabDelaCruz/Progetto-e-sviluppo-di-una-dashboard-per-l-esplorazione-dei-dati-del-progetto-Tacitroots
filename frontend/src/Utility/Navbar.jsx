import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/nuova">Database Overview</Link> | <Link to="/test">Test Grafici</Link> | <Link to="/persone">Persone</Link>
    </nav>
  );
}

export default Navbar;