import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoTacitroots from "../img/TacitRoots_logo.jpg";
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">

      <div className="navbar-inner">

        <a
          href="https://sites.unimi.it/tacitroots/"
          className="navbar-brand"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={logoTacitroots}
            className="navbar-brand-logo"
            alt="Tacit Roots logo"
          />

          <span>
            The Tacitroots Dataset Analysis
          </span>
        </a>

     
        <div className="hamburger" onClick={() => setOpen(!open)}>
          ☰
        </div>

    
        <div className="navbar-links">
          <Link to="/Database" className="nav-link">Database Overview</Link>
          <Link to="/" className="nav-link">Authors</Link>
          <Link to="/Confronti" className="nav-link">Exchanges</Link>
          <Link to="/Esperimenti" className="nav-link">Experiments</Link>
          <Link to="/Temi" className="nav-link">Topics</Link>
          <Link to="/Strumenti" className="nav-link">Instruments</Link>
          <a href="https://sites.unimi.it/tacitroots/" className="nav-link">Tacitroots</a>
        </div>

      </div>

   
      {open && (
        <div className="mobile-menu">
          <Link to="/Database" className="mobile-link" onClick={() => setOpen(false)}>Database Overview</Link>
          <Link to="/" className="mobile-link" onClick={() => setOpen(false)}>Authors</Link>
          <Link to="/Confronti" className="mobile-link" onClick={() => setOpen(false)}>Exchanges</Link>
          <Link to="/Esperimenti" className="mobile-link" onClick={() => setOpen(false)}>Esperiments</Link>
          <Link to="/Temi" className="mobile-link" onClick={() => setOpen(false)}>Topics</Link>
          <Link to="/Strumenti" className="mobile-link" onClick={() => setOpen(false)}>Instruments</Link>
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
        display: flex;
        align-items: center;
        gap: 10px;

        font-size: 18px;
        font-weight: 700;

        text-decoration: none;
        color: inherit;
        cursor: pointer;
      }
        .navbar-brand-logo {
          width: 32px;
          height: 32px;
          object-fit: contain;
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

        .hamburger {
          display: none;
          font-size: 26px;
          cursor: pointer;
        }

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