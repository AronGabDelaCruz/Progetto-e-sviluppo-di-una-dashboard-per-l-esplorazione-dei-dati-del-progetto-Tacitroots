import React, { useState } from "react";
import "../Styles/footerStyle.css";
import logo from "../img/ISLab_logo.png";

function Footer() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <footer className="footer">

      <div className="footer-content">

        <img
          src={logo}
          alt="Logo"
          className="footer-logo"
        />

        <div className="footer-texts">

          <div className="footer-title">
            TacitRoots Dashboard
          </div>

          <div className="footer-subtitle">
            Historical correspondence analysis
          </div>

          <div className="footer-info-container">

            <button
              className="footer-info-button"
              onClick={() => setShowPopup(!showPopup)}
            >
              Credits
            </button>

            {showPopup && (
              <div className="footer-popup">
                Credits
                <br />
                Name: Aron Gabriel Dela Cruz
                <br />
                Matricola: 26035A
              </div>
            )}

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;