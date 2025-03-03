import React from "react";
import meImage from "../assets/me.jpeg"; // Import the image

const AboutMeCard = () => {
  return (
    
    <div
      className="d-flex flex-column flex-md-row align-items-center justify-content-center"
      style={{
        maxWidth: "1200px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#1b1b1b",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
        color: "white",
      }}
    >
      
      {/* Image Section */}
      <div
        style={{
          flex: "1",
          minWidth: "300px",
          height: "350px",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <img
          src={meImage}
          alt="Marek Manikowski"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Text Section */}
      <div
        style={{
          flex: "2",
          padding: "20px 30px",
        }}
      >
        <h1
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: "bold",
            fontSize: "2rem",
            marginBottom: "15px",
          }}
        >
          Marek Manikowski
        </h1>
        <h4
          style={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: "normal",
            fontSize: "1.2rem",
            color: "#bbbbbb",
            marginBottom: "20px",
          }}
        >
          Triple Glass Installation Specialist with 16 Years of Experience
        </h4>
        <p
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "1rem",
            lineHeight: "1.6",
            color: "#cccccc",
          }}
        >
          I specialize in high-quality triple glass installations and expert home
          renovations. Over 16 years, I've helped clients improve the energy efficiency,
          comfort, and aesthetics of their homes. My dedication to craftsmanship and
          customer satisfaction drives my work every day.
        </p>
        <div
          style={{
            marginTop: "20px",
            fontSize: "0.9rem",
            color: "#888888",
          }}
        >
          <p>
            <strong>Work:</strong> MJMklussenbedrijf
          </p>
          <p>
            <strong>Location:</strong> Amsterdam, Netherlands
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMeCard;
