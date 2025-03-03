import React from "react";
import AboutMeCard from "../components/AboutMeCard";
import backgroundImage from "../assets/main.jpg";
import CategoryGallery from "../components/CategoryGallery";

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
        <h1 className="home-title">MJMklussenbedrijf</h1>

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

      <div
        style={{
          backgroundColor: "#0A060D",
          padding: "50px 20px",
        }}
      >
        <h2
          className="text-center"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "2.5rem",
            color: "white",
            marginBottom: "30px",
          }}
        >
          Featured Images
        </h2>
        <CategoryGallery />
      </div>
    </div>
  );
};

export default Home;
