import React from "react";
import "../Styles/footerStyle.css";
import logo from "../img/ISLab_logo.png";
function Footer() {
  return (
    <footer className="footer">

      <div className="footer-left">
        <img
          src={logo}
          alt="Logo"
          className="footer-logo"
        />
      </div>

      <div className="footer-right">

        <div className="footer-title">
          TacitRoots Dashboard
        </div>

        <div className="footer-text">
          Aron Gabriel Dela Cruz
        </div>

        <div className="footer-links">
          <span>About</span>
          <span>Docs</span>
          <span>GitHub</span>
        </div>


      </div>

    </footer>
  );
}

export default Footer;