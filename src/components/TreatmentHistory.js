// src/components/TreatmentHistory.js
import React, { useState } from "react";
import TreatmentDetailsModal from "./TreatmentDetailsModal";
import { getTreatmentColor } from '../utils/calendarUtils';
import { Eye } from 'lucide-react';

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
    return <p className="treatment-history-empty">Brak zapisanych zabiegów.</p>;
  }

  return (
    <div className="treatment-history-container">
      <div className="treatment-history-header">
        <h3>Historia zabiegów</h3>
      </div>
      <div className="treatment-history-row treatment-history-row-head">
        <div className="treatment-history-cell">Typ</div>
        <div className="treatment-history-cell">Data</div>
        <div className="treatment-history-cell">Notatka dla kosmetologa</div>
        <div className="treatment-history-cell">Akcje</div>
      </div>

      {treatments.map((t, idx) => (
        <div key={idx}>
          <div className="treatment-history-row">
            <div className="treatment-history-cell">
              <span className="treatment-history-dot" style={{ background: getTreatmentColor(t.type) }}></span>
              {t.type}
            </div>
            <div className="treatment-history-cell">{t.date}</div>
            <div className="treatment-history-cell">{t.notesInternal || "-"}</div>
            <div className="treatment-history-cell">
              <button
                onClick={() => setOpenIdx(idx)}
                className="treatment-history-btn treatment-history-btn-icononly"
                aria-label="Szczegóły"
              >
                <Eye size={20} className="treatment-history-btn-icon" />
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
