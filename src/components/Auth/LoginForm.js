import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prosty check na sztywne dane:
    if (email === "admin@salon.pl" && password === "Haslo123!") {
      onLoginSuccess();
      navigate("/clients");
    } else {
      setError("Niepoprawny e-mail lub hasło");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "4rem auto",
        padding: "2rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Logowanie kosmetologa
      </h2>
      {error && (
        <div style={{ color: "#C8373B", marginBottom: "1rem" }}>{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Hasło
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#007BFF",
            color: "#fff",
            fontSize: "1rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Zaloguj się
        </button>
      </form>
    </div>
  );
}
