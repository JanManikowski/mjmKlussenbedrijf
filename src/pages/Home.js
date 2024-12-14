import React from "react";
import AboutMeCard from "../components/AboutMeCard";
import backgroundImage from "../assets/main.jpg";

const Home = () => {
  return (
    <div>
      <div
        className="home-header d-flex flex-column justify-content-center align-items-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          color: "white",
        }}
      >
        <h1
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "4rem",
            fontWeight: "bold",
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.8)",
          }}
        >
          MJMklussenbedrijf
        </h1>
      </div>

      <div
        style={{
          backgroundColor: "#0A060D",
          padding: "50px 20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AboutMeCard />
      </div>
    </div>
  );
};

export default Home;
