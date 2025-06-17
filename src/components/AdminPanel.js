import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany i ma rolę admin
    const userData = JSON.parse(localStorage.getItem("isLoggedIn") || "null");
    if (!userData || userData.role !== "admin") {
      navigate("/login");
      return;
    }
    setCurrentUser(userData);
    
    // Pobierz użytkowników
    loadUsers();
  }, [navigate]);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
      const updatedUsers = users.filter(user => user.id !== userId);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      loadUsers();
    }
  };

  const handleToggleUserStatus = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    loadUsers();
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const handleUserFormClose = () => {
    setShowUserForm(false);
    setEditingUser(null);
    loadUsers();
  };

  const getRoleLabel = (role) => {
    return role === "admin" ? "Administrator" : "Kosmetolog";
  };

  const getStatusLabel = (isActive) => {
    return isActive ? "Aktywny" : "Nieaktywny";
  };

  const getStatusColor = (isActive) => {
    return isActive ? "#28a745" : "#dc3545";
  };

  if (!currentUser) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid #eee"
      }}>
        <div>
          <h1 style={{ margin: 0, color: "#333" }}>Panel Administracyjny</h1>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            Zalogowany jako: {currentUser.name} ({currentUser.email})
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => navigate("/clients")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Przejdź do klientów
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Wyloguj się
          </button>
        </div>
      </div>

      {/* Statystyki */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "1rem", 
        marginBottom: "2rem" 
      }}>
        <div style={{ 
          padding: "1.5rem", 
          backgroundColor: "#007bff", 
          color: "white", 
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: 0, fontSize: "2rem" }}>{users.length}</h3>
          <p style={{ margin: 0 }}>Wszystkich użytkowników</p>
        </div>
        <div style={{ 
          padding: "1.5rem", 
          backgroundColor: "#28a745", 
          color: "white", 
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: 0, fontSize: "2rem" }}>
            {users.filter(u => u.isActive).length}
          </h3>
          <p style={{ margin: 0 }}>Aktywnych użytkowników</p>
        </div>
        <div style={{ 
          padding: "1.5rem", 
          backgroundColor: "#ffc107", 
          color: "white", 
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: 0, fontSize: "2rem" }}>
            {users.filter(u => u.role === "kosmetolog").length}
          </h3>
          <p style={{ margin: 0 }}>Kosmetologów</p>
        </div>
        <div style={{ 
          padding: "1.5rem", 
          backgroundColor: "#17a2b8", 
          color: "white", 
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: 0, fontSize: "2rem" }}>
            {users.filter(u => u.role === "admin").length}
          </h3>
          <p style={{ margin: 0 }}>Administratorów</p>
        </div>
      </div>

      {/* Przycisk dodawania użytkownika */}
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={handleAddUser}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          + Dodaj nowego użytkownika
        </button>
      </div>

      {/* Lista użytkowników */}
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: "8px", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        <div style={{ 
          padding: "1rem", 
          backgroundColor: "#f8f9fa", 
          borderBottom: "1px solid #dee2e6",
          fontWeight: "bold"
        }}>
          Lista użytkowników
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>
                  Nazwa
                </th>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>
                  E-mail
                </th>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>
                  Rola
                </th>
                <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>
                  Status
                </th>
                <th style={{ padding: "1rem", textAlign: "center", borderBottom: "1px solid #dee2e6" }}>
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={{ padding: "1rem" }}>{user.name}</td>
                  <td style={{ padding: "1rem" }}>{user.email}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{
                      padding: "0.25rem 0.5rem",
                      backgroundColor: user.role === "admin" ? "#dc3545" : "#007bff",
                      color: "white",
                      borderRadius: "4px",
                      fontSize: "0.875rem"
                    }}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{
                      padding: "0.25rem 0.5rem",
                      backgroundColor: getStatusColor(user.isActive),
                      color: "white",
                      borderRadius: "4px",
                      fontSize: "0.875rem"
                    }}>
                      {getStatusLabel(user.isActive)}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button
                        onClick={() => handleEditUser(user)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "#ffc107",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem"
                        }}
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user.id)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          backgroundColor: user.isActive ? "#6c757d" : "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem"
                        }}
                      >
                        {user.isActive ? "Dezaktywuj" : "Aktywuj"}
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={{
                            padding: "0.25rem 0.5rem",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.875rem"
                          }}
                        >
                          Usuń
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal z formularzem użytkownika */}
      {showUserForm && (
        <UserForm
          user={editingUser}
          onClose={handleUserFormClose}
        />
      )}
    </div>
  );
} 