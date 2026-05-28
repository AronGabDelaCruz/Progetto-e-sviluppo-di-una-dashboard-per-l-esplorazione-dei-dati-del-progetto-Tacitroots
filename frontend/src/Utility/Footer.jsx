import React, { useState } from "react";
import "../Styles/footerStyle.css";
import logo from "../img/ISLab_logo.png";

function Footer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="footer">

      <div className="footer-center">
        <button
          className="footer-info-button"
          onClick={() => setShowModal(true)}
        >
          Credits
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>

          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            <h2>Credits</h2>

            <p>
              The Tacitroots Dataset Analysis is a project supported by ISLab
            </p>

            <p>
              Dev team: Aron Gabriel Dela Cruz
            </p>

            {/* LOGO + CLOSE IN BLOCK VERTICALE */}
            <div className="modal-logo-section">
              <a
                href="https://islab.di.unimi.it/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={logo}
                  alt="ISLab Logo"
                  className="modal-logo"
                />
              </a>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>

          </div>

        </div>
      )}

    </footer>
  );
}

export default Footer;