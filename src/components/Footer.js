import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="text-center text-white py-4"
      style={{
        backgroundColor: "#0A060D",
        borderTop: "1px solid #ffffff",
      }}
    >
      <div className="container">
        <div className="row">
          {/* Navigation Links */}
          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-white text-decoration-none">
                  About Me
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white text-decoration-none">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/pictures" className="text-white text-decoration-none">
                  Pictures
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase mb-3">Follow Us</h5>
            <div className="d-flex justify-content-center gap-3">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <i className="bi bi-instagram fs-4"></i>
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <i className="bi bi-facebook fs-4"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <i className="bi bi-twitter fs-4"></i>
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-md-4">
            <h5 className="text-uppercase mb-3">Contact Info</h5>
            <p className="mb-1">MJMklussenbedrijf</p>
            <p className="mb-1">1234 AB, Amsterdam</p>
            <p className="mb-1">+31 6 12345678</p>
            <p>Email: info@mjmklussenbedrijf.nl</p>
          </div>
        </div>

        <div
          className="mt-3"
          style={{
            fontSize: "0.9rem",
            color: "#aaaaaa",
          }}
        >
          &copy; {new Date().getFullYear()} MJMklussenbedrijf. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
