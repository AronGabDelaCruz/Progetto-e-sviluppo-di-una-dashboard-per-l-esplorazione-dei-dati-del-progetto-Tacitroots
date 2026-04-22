import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">

      <div className="navbar-inner">

        <div className="navbar-brand">
          Neo4j Dashboard
        </div>

     
        <div className="hamburger" onClick={() => setOpen(!open)}>
          ☰
        </div>

    
        <div className="navbar-links">
          <Link to="/" className="nav-link">Database Overview</Link>
          <Link to="/test" className="nav-link">Test Grafici</Link>
          <Link to="/persone" className="nav-link">Persone</Link>
          <Link to="/Confronti" className="nav-link">Confronti</Link>
        </div>

      </div>

   
      {open && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setOpen(false)}>Database Overview</Link>
          <Link to="/test" className="mobile-link" onClick={() => setOpen(false)}>Test Grafici</Link>
          <Link to="/persone" className="mobile-link" onClick={() => setOpen(false)}>Persone</Link>
          <Link to="/Confronti" className="mobile-link" onClick={() => setOpen(false)}>Confronti</Link>
        </div>
      )}

      <style>{`
        .navbar {
          width: 100%;
          background: white;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 5%;
        }

        .navbar-brand {
          font-size: 18px;
          font-weight: 700;
        }

        .navbar-links {
          display: flex;
          gap: 20px;
        }

        .nav-link {
          text-decoration: none;
          color: #555;
          font-size: 14px;
          padding: 6px 10px;
          border-radius: 6px;
        }

        .nav-link:hover {
          background: #f3f3f3;
          color: #000;
        }

        /* HAMBURGER (desktop hidden) */
        .hamburger {
          display: none;
          font-size: 26px;
          cursor: pointer;
        }

        /* MOBILE MENU */
        .mobile-menu {
          display: flex;
          flex-direction: column;
          padding: 10px 5%;
          border-top: 1px solid #eee;
          background: white;
        }

        .mobile-link {
          padding: 10px 0;
          text-decoration: none;
          color: #333;
          border-bottom: 1px solid #f0f0f0;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .navbar-links {
            display: none;
          }

          .hamburger {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;