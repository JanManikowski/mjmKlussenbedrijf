import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/responsive.css";


const NavBar = () => {
  const [navbarStyle, setNavbarStyle] = useState({
    backgroundColor: "rgba(0, 0, 0, 1)",
    borderBottom: "2px solid #ffffff",
    transition: "background-color 0.5s ease, border-color 0.5s ease",
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateNavbarStyle = () => {
      const isHomePage = location.pathname === "/";

      if (!isHomePage) {
        setNavbarStyle({
          backgroundColor: "rgba(0, 0, 0, 1)",
          borderBottom: "2px solid #ffffff",
          transition: "background-color 0.5s ease, border-color 0.5s ease",
        });
      } else {
        const header = document.querySelector(".home-header");
        if (header) {
          const headerBottom = header.getBoundingClientRect().bottom;

          setNavbarStyle({
            backgroundColor:
              headerBottom <= 0 ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0)",
            borderBottom:
              headerBottom <= 0
                ? "2px solid #ffffff"
                : "2px solid transparent",
            transition: "background-color 0.5s ease, border-color 0.5s ease",
          });
        }
      }
    };

    updateNavbarStyle();
    window.addEventListener("scroll", updateNavbarStyle);
    return () => {
      window.removeEventListener("scroll", updateNavbarStyle);
    };
  }, [location.pathname]);

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  const handleMenuClick = () => {
    setMenuOpen((prev) => !prev);
    document.body.classList.toggle("menu-open", !menuOpen); // Helps prevent flicker
  };
  

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    window.location.reload();
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      style={{
        ...navbarStyle,
        height: "80px",
        display: "flex",
        alignItems: "center",
      }}
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
  <span className={`navbar-toggler-icon ${menuOpen ? "close-icon" : ""}`} />
</button>



        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarNav">


  <ul
    className="navbar-nav mx-auto text-center"
    style={{ listStyle: "none", padding: 0, margin: 0 }}
  >
    <li className="nav-item">
      <Link to="/" className="nav-link text-white" style={{ fontSize: "18px", padding: "0 15px" }} onClick={handleLinkClick}>
        Home
      </Link>
    </li>
    <li className="nav-item">
      <Link to="/aboutMe" className="nav-link text-white" style={{ fontSize: "18px", padding: "0 15px" }} onClick={handleLinkClick}>
        About Me
      </Link>
    </li>
    <li className="nav-item">
      <Link to="/contact" className="nav-link text-white" style={{ fontSize: "18px", padding: "0 15px" }} onClick={handleLinkClick}>
        Contact
      </Link>
    </li>
    <li className="nav-item">
      <Link to="/pictures" className="nav-link text-white" style={{ fontSize: "18px", padding: "0 15px" }} onClick={handleLinkClick}>
        Pictures
      </Link>
    </li>
    {isAdmin && (
      <li className="nav-item">
        <span className="nav-link" style={{ cursor: "pointer", color: "red", fontSize: "18px", padding: "0 15px" }} onClick={handleLogout}>
          Logout
        </span>
      </li>
    )}
  </ul>
</div>

      </div>
    </nav>
  );
};

export default NavBar;
