import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <div className="navbar-brand">
          Neo4j Dashboard
        </div>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Database Overview</Link>
          <Link to="/test" className="nav-link">Test Grafici</Link>
          <Link to="/persone" className="nav-link">Persone</Link>
          <Link to="/Confronti" className="nav-link">Confronti</Link>
        </div>

      </div>

      <style>{`
        /* NAVBAR BASE */
        .navbar {
          width: 100%;
          background: white;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(8px);
        }

        /* INNER LAYOUT */
        .navbar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 5%;
          box-sizing: border-box;
        }

        /* BRAND */
        .navbar-brand {
          font-size: 18px;
          font-weight: 700;
          color: #222;
          letter-spacing: 0.5px;
        }

        /* LINKS WRAPPER */
        .navbar-links {
          display: flex;
          gap: 20px;
        }

        /* LINK STYLE */
        .nav-link {
          text-decoration: none;
          color: #555;
          font-size: 14px;
          font-weight: 500;
          padding: 6px 10px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        /* HOVER */
        .nav-link:hover {
          background: #f3f3f3;
          color: #000;
        }

        /* ACTIVE STYLE (se usi NavLink dopo) */
        .nav-link.active {
          background: #eaeaea;
          color: #000;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;