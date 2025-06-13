// src/components/TreatmentHistory.js
import React, { useState } from "react";
import TreatmentDetailsModal from "./TreatmentDetailsModal";

const style = {
  container: {
    marginTop: "2rem",
    maxWidth: "700px",
    margin: "2rem auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    padding: "1rem",
  },
  header: {
    borderBottom: "1px solid #ddd",
    paddingBottom: "0.5rem",
    marginBottom: "1rem",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 3fr 1fr",
    padding: "0.5rem 0",
    borderBottom: "1px solid #eee",
    alignItems: "center",
  },
  cell: {
    padding: "0 0.5rem",
    wordBreak: "break-word",
  },
  toggleButton: {
    padding: "0.25rem 0.5rem",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  noData: {
    textAlign: "center",
    padding: "1rem",
    color: "#666",
  },
};

export default function TreatmentHistory({
  clientId,
  treatments,
  onUpdateTreatment,
}) {
  const [openIdx, setOpenIdx] = useState(null);

  if (!treatments || treatments.length === 0) {
    return <p style={style.noData}>Brak zapisanych zabiegów.</p>;
  }

  return (
    <div style={style.container}>
      <div style={style.header}>
        <h3>Historia zabiegów</h3>
      </div>
      <div style={{ ...style.row, fontWeight: "500", color: "#333" }}>
        <div style={style.cell}>Typ</div>
        <div style={style.cell}>Data</div>
        <div style={style.cell}>Notatka dla kosmetologa</div>
        <div style={style.cell}>Akcje</div>
      </div>

      {treatments.map((t, idx) => (
        <div key={idx}>
          <div style={style.row}>
            <div style={style.cell}>{t.type}</div>
            <div style={style.cell}>{t.date}</div>
            <div style={style.cell}>{t.notesInternal || "-"}</div>
            <div style={style.cell}>
              <button
                onClick={() => setOpenIdx(idx)}
                style={style.toggleButton}
              >
                Pokaż szczegóły
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* MODAL Z SZCZEGÓŁAMI */}
      <TreatmentDetailsModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        treatment={openIdx !== null ? treatments[openIdx] : null}
        onUpdateTreatment={(updatedTreatment) => {
          // Przekaż clientId i idx do App.js!
          onUpdateTreatment(clientId, updatedTreatment, openIdx);
        }}
      />
    </div>
  );
}
