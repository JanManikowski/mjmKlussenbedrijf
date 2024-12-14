import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Import Firebase Auth instance
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Authenticate the user with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);

      // Login successful
      alert("Login successful!");
      localStorage.setItem("isAdmin", true); // Store admin status locally
      navigate("/"); // Redirect to the homepage or admin dashboard
    } catch (err) {
      console.error("Login Error:", err.message);
      setError("Invalid email or password.");
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A060D",
        color: "white",
        padding: "20px",
      }}
    >
      <h1 className="mb-4">Admin Login</h1>

      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#1b1b1b",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
        }}
      >
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: "15px" }}>
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          style={{
            padding: "10px",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminPage;
