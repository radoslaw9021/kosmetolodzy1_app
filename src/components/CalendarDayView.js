import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const visits = [
  { id: 1, description: "Brak opisu", time: "12:00 - 13:00" },
  { id: 2, description: "Brak opisu", time: "14:00 - 15:00" }
];

export default function CalendarDayView() {
  return (
    <div style={{
      display: "flex",
      gap: "2.5rem",
      justifyContent: "center",
      alignItems: "flex-start",
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 40%, #3b0764 0%, #181022 100%)",
      fontFamily: "'Poppins', sans-serif",
      padding: "2rem"
    }}>
      {/* Kalendarz */}
      <div style={{
        background: "#232136",
        borderRadius: "1.5rem",
        width: 600,
        minWidth: 400,
        padding: "2.5rem",
        boxShadow: "0 0 32px 0 #a855f7cc, 0 2px 8px #0004",
        color: "#eee"
      }}>
        <h2 style={{
          fontWeight: 700,
          fontSize: "2.1rem",
          marginBottom: "2rem",
          color: "#d8b4fe",
          textShadow: "0 0 10px #a855f7"
        }}>Kalendarz Spotkań</h2>
        {/* ... tutaj możesz dodać grid godzinowy lub inne elementy */}
      </div>
      {/* Panel boczny */}
      <div style={{
        background: "#232136",
        borderRadius: "1.5rem",
        boxShadow: "0 0 32px 0 #a855f7cc, 0 2px 8px #0004",
        padding: "2rem 2.5rem",
        color: "#eee",
        fontSize: "1.1rem",
        width: 350,
        minWidth: 300
      }}>
        <button style={{
          background: "linear-gradient(90deg, #a855f7, #38bdf8)",
          color: "#fff",
          borderRadius: "1.5rem",
          fontWeight: 700,
          fontSize: "1.08rem",
          padding: "0.7rem 1.7rem",
          marginBottom: "1.5rem",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 0 16px #a855f7"
        }}>
          Dodaj Nową Wizytę
        </button>
        <div>
          {visits.map(visit => (
            <div
              key={visit.id}
              style={{
                background: "#2a234a",
                borderRadius: "1.5rem",
                boxShadow: "0 0 12px #a855f7aa",
                padding: "1.2rem 1.5rem",
                marginBottom: "1.3rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                transition: "background 0.3s, box-shadow 0.3s, transform 0.2s",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#3b2d78";
                e.currentTarget.style.boxShadow = "0 0 24px #c084fc";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#2a234a";
                e.currentTarget.style.boxShadow = "0 0 12px #a855f7aa";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span style={{ fontSize: "1.7rem", filter: "drop-shadow(0 0 6px #a855f7)" }}>🧴</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#eee", fontWeight: 600, fontSize: "1.05rem" }}>{visit.description}</div>
                <div style={{ color: "#a855f7", fontWeight: 700, fontSize: "1.08rem" }}>{visit.time}</div>
              </div>
              <button style={{
                background: "none",
                border: "none",
                color: "#a855f7",
                fontSize: "1.3rem",
                marginRight: 8,
                cursor: "pointer",
                transition: "color 0.2s"
              }}
                title="Edytuj"
                onMouseEnter={e => e.currentTarget.style.color = "#38bdf8"}
                onMouseLeave={e => e.currentTarget.style.color = "#a855f7"}
              >
                <FaEdit />
              </button>
              <button style={{
                background: "none",
                border: "none",
                color: "#ef4444",
                fontSize: "1.3rem",
                cursor: "pointer",
                transition: "color 0.2s"
              }}
                title="Usuń"
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "#ef4444"}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 