import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser, setCurrentUser, getUsers, resetUsersToDefault } from "../../services/userService";

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const user = authenticateUser(email, password);
    
    if (user) {
      setCurrentUser(user);
      onLoginSuccess(user);
      navigate("/clients");
    } else {
      setError("Niepoprawny e-mail lub hasło");
    }
  };

  const handleDebug = () => {
    const users = getUsers();
    setDebugInfo(JSON.stringify(users, null, 2));
  };

  const handleReset = () => {
    resetUsersToDefault();
    setDebugInfo("Użytkownicy zresetowani do domyślnych!");
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
        Logowanie do systemu
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
            marginBottom: "1rem"
          }}
        >
          Zaloguj się
        </button>
      </form>
      
      <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
        <p><strong>Dane testowe:</strong></p>
        <p>Admin: admin@salon.pl / Haslo123!</p>
        <p>Kosmetolog: anna@salon.pl / Haslo123!</p>
        <p>Kosmetolog: joanna@salon.pl / Haslo123!</p>
      </div>

      <div style={{ marginTop: "1rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button
            type="button"
            onClick={handleDebug}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.8rem"
            }}
          >
            Debug - Pokaż użytkowników
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.8rem"
            }}
          >
            Resetuj użytkowników
          </button>
        </div>
        {debugInfo && (
          <div style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "0.5rem", 
            borderRadius: "4px", 
            fontSize: "0.8rem",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            maxHeight: "200px",
            overflow: "auto"
          }}>
            {debugInfo}
          </div>
        )}
      </div>
    </div>
  );
}
