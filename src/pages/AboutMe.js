import React from "react";
import AboutMeCard from "../components/AboutMeCard";

const AboutMe = () => {
  return (
    <div
      style={{
        backgroundColor: "#0A060D",
        minHeight: "100vh",
        padding: "50px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AboutMeCard />
    </div>
  );
};

export default AboutMe;
