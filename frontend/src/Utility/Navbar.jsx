import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/nuova">Nuova Pagina</Link> | <Link to="/test">Test Grafici</Link>
    </nav>
  );
}

export default Navbar;