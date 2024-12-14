import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const NavBar = () => {
  const [navbarStyle, setNavbarStyle] = useState({
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderBottom: '2px solid #ffffff',
    transition: 'background-color 0.5s ease, border-color 0.5s ease',
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateNavbarStyle = () => {
      const isHomePage = location.pathname === '/';

      if (!isHomePage) {
        setNavbarStyle({
          backgroundColor: 'rgba(0, 0, 0, 1)',
          borderBottom: '2px solid #ffffff',
          transition: 'background-color 0.5s ease, border-color 0.5s ease',
        });
      } else {
        const header = document.querySelector('.home-header');
        if (header) {
          const headerBottom = header.getBoundingClientRect().bottom;

          setNavbarStyle({
            backgroundColor: headerBottom <= 0 ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0)',
            borderBottom: headerBottom <= 0 ? '2px solid #ffffff' : '2px solid transparent',
            transition: 'background-color 0.5s ease, border-color 0.5s ease',
          });
        }
      }
    };

    updateNavbarStyle();
    window.addEventListener('scroll', updateNavbarStyle);

    return () => {
      window.removeEventListener('scroll', updateNavbarStyle);
    };
  }, [location.pathname]);

  useEffect(() => {
    // Close the menu on route changes
    setMenuOpen(false);
  }, [location.pathname]);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinkClick = () => {
    setMenuOpen(false); // Close the menu explicitly
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 998,
          visibility: menuOpen ? 'visible' : 'hidden',
          opacity: menuOpen ? 1 : 0,
          backdropFilter: menuOpen ? 'blur(4px)' : 'none',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
        }}
        onClick={handleLinkClick}
      ></div>

      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top custom-navbar"
        style={navbarStyle}
      >
        <div className="container-fluid d-flex align-items-center">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={handleMenuClick}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav mx-auto text-center custom-navbar-links">
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link text-white custom-nav-link"
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/aboutMe"
                  className="nav-link text-white custom-nav-link"
                  onClick={handleLinkClick}
                >
                  About Me
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact"
                  className="nav-link text-white custom-nav-link"
                  onClick={handleLinkClick}
                >
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/pictures"
                  className="nav-link text-white custom-nav-link"
                  onClick={handleLinkClick}
                >
                  Pictures
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin"
                  className="nav-link text-white custom-nav-link"
                  onClick={handleLinkClick}
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
