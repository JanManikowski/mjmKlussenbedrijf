import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import AboutMe from "./pages/AboutMe";
import Admin from "./pages/Admin";
import Pictures from "./pages/Pictures";
import CategoryPage from "./pages/CategoryPage";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS globally
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './styles/global.css'
import './styles/responsive.css';

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/aboutMe" element={<AboutMe />} />
        <Route path="/pictures" element={<Pictures />} />
        <Route path="/pictures/:categoryId" element={<CategoryPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
