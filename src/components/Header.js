// src/components/Header.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Header({ isLoggedIn, onLogout }) {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("brandingLogo");
    if (stored) setLogoUrl(stored);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogoUrl(reader.result);
      localStorage.setItem("brandingLogo", reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        height: 136, // 120 + padding
        minHeight: 136,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            style={{
              height: 120,
              width: 120,
              objectFit: "contain",
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
              padding: 8,
              display: "block",
              transition: "box-shadow 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.14)")
            }
          />
        ) : (
          <label
            style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              border: "1px dashed #aaa",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: "0.9rem",
              color: "#555",
            }}
          >
            Wgraj logo/zdjęcie
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        )}
      </div>

      <nav style={{ display: "flex", gap: "1.5rem", fontWeight: 500 }}>
        <NavLink
          to="/clients"
          style={({ isActive }) => ({
            color: isActive ? "#fff" : "#333",
            backgroundColor: isActive ? "#C8373B" : "transparent",
            padding: "0.5rem 1rem",
            borderRadius: 4,
            textDecoration: "none",
          })}
        >
          Klienci
        </NavLink>
        <NavLink
          to="/newsletter"
          style={({ isActive }) => ({
            color: isActive ? "#fff" : "#333",
            backgroundColor: isActive ? "#C8373B" : "transparent",
            padding: "0.5rem 1rem",
            borderRadius: 4,
            textDecoration: "none",
          })}
        >
          Newsletter
        </NavLink>
      </nav>

      {isLoggedIn && (
        <button
          onClick={onLogout}
          style={{
            backgroundColor: "#C8373B",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Wyloguj się
        </button>
      )}
    </header>
  );
}
