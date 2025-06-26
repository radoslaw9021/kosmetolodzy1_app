// src/components/Header.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { isAdmin } from "../services/userService";

export default function Header({ currentUser, onLogout, theme, setTheme }) {
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
    <header className="main-navbar">
      <div className="navbar-left">
        {logoUrl ? (
          <NavLink to="/dashboard">
            <img src={logoUrl} alt="Logo" className="navbar-logo" />
          </NavLink>
        ) : (
          <label className="navbar-logo-upload">
            Wgraj logo/zdjęcie
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          </label>
        )}
      </div>
      <nav className="navbar-menu">
        <NavLink to="/dashboard" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Dashboard</NavLink>
        <NavLink to="/clients" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Klienci</NavLink>
        <NavLink to="/calendar" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Kalendarz</NavLink>
        <NavLink to="/newsletter" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Newsletter</NavLink>
        {isAdmin(currentUser) && (
          <NavLink to="/admin" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Panel Admin</NavLink>
        )}
      </nav>
      <div className="navbar-right">
        <button
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
        {currentUser && (
          <span className="user-info">
            👤
            {currentUser.name} <span className="user-role">{isAdmin(currentUser) ? "Administrator" : "Kosmetolog"}</span>
          </span>
        )}
        <button className="btn-primary" onClick={onLogout}>Wyloguj się</button>
      </div>
    </header>
  );
}
