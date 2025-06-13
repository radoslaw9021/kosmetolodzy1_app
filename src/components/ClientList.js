import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { sendNewsletterEmail } from "../services/emailService";

// Style premium – KOLORY ZMIENIONE!
const style = {
  container: {
    maxWidth: "950px",
    margin: "3rem auto",
    background: "#fff",
    borderRadius: "2rem",
    boxShadow:
      "0 8px 40px 0 rgba(80,80,80,0.07), 0 1.5px 7px 0 rgba(80,80,80,0.06)",
    padding: "2.3rem 2rem 2.7rem 2rem",
    fontFamily: "'Inter', 'Montserrat', Arial, sans-serif",
    color: "#232323",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.8rem",
  },
  h2: {
    fontSize: "2.1rem",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    margin: 0,
  },
  btn: {
    padding: "0.5rem 1.2rem",
    border: "none",
    borderRadius: "1.3rem",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 1px 4px 0 rgba(80,120,230,0.09)",
    transition: "background .16s",
    marginLeft: "0.6rem",
  },
  addBtn: {
    background: "#fff",
    color: "#333",
    border: "1.5px solid #e0e0e0",
    fontWeight: 700,
    borderRadius: "1.3rem",
    padding: "0.5rem 1.2rem",
    fontSize: "1rem",
    boxShadow: "0 1px 4px 0 rgba(220, 80, 120, 0.06)",
    transition: "background .15s, color .15s, border .15s",
    marginLeft: "0.6rem",
  },
  inviteBtn: {
    background: "#151516",
    color: "#fff",
    border: "none",
    fontWeight: 700,
    borderRadius: "1.3rem",
    padding: "0.5rem 1.2rem",
    fontSize: "1rem",
    boxShadow: "0 1px 4px 0 rgba(30,30,40,0.09)",
    transition: "background .15s, color .15s, border .15s",
    marginLeft: "0.6rem",
  },
  viewBtn: {
    padding: "0.37rem 1.1rem",
    background: "#151516",
    color: "#fff",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "0.97rem",
    borderRadius: "1rem",
    boxShadow: "0 1px 6px 0 rgba(30,30,40,0.10)",
    transition: "background .15s, color .15s, border .15s",
  },
  inviteForm: {
    // **nowy kontener** dla obu przycisków
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    margin: "1.2rem 0",
  },
  inviteInput: {
    flex: 1,
    padding: "0.6rem",
    border: "1px solid #e0e0e0",
    borderRadius: "0.8rem",
    fontSize: "1rem",
    outline: "none",
    background: "#fafbfc",
  },
  searchBox: {
    margin: "1.2rem 0 1.5rem 0",
    display: "flex",
    gap: "1rem",
  },
  searchInput: {
    width: "100%",
    padding: "0.6rem",
    border: "1px solid #e5e7eb",
    borderRadius: "1.1rem",
    fontSize: "1.05rem",
    background: "#f8f9fb",
    outline: "none",
    fontFamily: "inherit",
  },
  tableWrapper: {
    borderRadius: "1.5rem",
    boxShadow: "0 1px 8px 0 rgba(0,0,0,0.02)",
    background: "#f7f7fb",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    background: "transparent",
    borderRadius: "1.5rem",
    overflow: "hidden",
  },
  th: {
    background: "#f6f8fa",
    color: "#7a8290",
    fontWeight: 600,
    fontSize: "1rem",
    padding: "0.9rem 0.8rem",
    borderBottom: "2px solid #e4e7ec",
    textAlign: "left",
    letterSpacing: "0.01em",
  },
  td: {
    padding: "0.7rem 0.8rem",
    background: "#fff",
    borderBottom: "1.5px solid #f1f3f6",
    fontSize: "1.07rem",
  },
  statusMsg: (success) => ({
    marginLeft: "1rem",
    fontWeight: 600,
    color: success ? "#22bb66" : "#dc3545",
    fontSize: "1rem",
    letterSpacing: "0.01em",
  }),
  empty: {
    textAlign: "center",
    color: "#8a97a9",
    margin: "2.7rem 0",
    fontSize: "1.22rem",
  },
};

export default function ClientList({ clients }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // stan dla panelu wysyłki formularza
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");

  // filtrowanie klientów
  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter(
      (c) =>
        c.firstName.toLowerCase().includes(term) ||
        c.lastName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term)
    );
  }, [searchTerm, clients]);

  // helper: data ostatniego zabiegu
  const getLastTreatmentDate = (treatments = []) => {
    if (!treatments.length) return "-";
    const dates = treatments.map((t) => t.date).filter(Boolean);
    return dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : "-";
  };

  // wyślij link do formularza klientce
  const handleSendInvite = () => {
    if (!inviteEmail.trim()) {
      setInviteStatus("Podaj adres e-mail ❌");
      return;
    }
    // <-- tutaj zmieniony endpoint
    const link = `${window.location.origin}/client/add?ref=${Date.now()}`;
    const message =
      `Dzień dobry,\n\n` +
      `Proszę o wypełnienie karty klientki online:\n${link}\n\n` +
      `Pozdrawiam,\nBeauty Room by Joanna Wójcik`;

    sendNewsletterEmail({
      to_name: "",
      to_email: inviteEmail.trim(),
      subject: "Prośba o wypełnienie karty klientki",
      message,
    })
      .then(() => setInviteStatus("Link został wysłany ✅"))
      .catch(() => setInviteStatus("Błąd wysyłki linku ❌"));
  };

  // kopiuj link do schowka
  const handleCopyInviteLink = () => {
    if (!inviteEmail.trim()) {
      setInviteStatus("Podaj adres e-mail ❌");
      return;
    }
    // <-- i tutaj endpoint do skopiowania
    const link = `${window.location.origin}/client/add?ref=${Date.now()}`;
    navigator.clipboard
      .writeText(link)
      .then(() => setInviteStatus("Link skopiowany ✅"))
      .catch(() => setInviteStatus("Błąd kopiowania ❌"));
  };

  return (
    <div style={style.container}>
      {/* Nagłówek */}
      <div style={style.header}>
        <h2 style={style.h2}>Lista klientek</h2>
        <div>
          <button
            onClick={() => navigate("/client/add")}
            style={{ ...style.btn, ...style.addBtn }}
          >
            + Dodaj klientkę
          </button>
          <button
            onClick={() => {
              setShowInviteForm((v) => !v);
              setInviteStatus("");
            }}
            style={{ ...style.btn, ...style.inviteBtn }}
          >
            {showInviteForm ? "Anuluj wysyłkę" : "Wyślij formularz"}
          </button>
        </div>
      </div>

      {/* Formularz wysyłki */}
      {showInviteForm && (
        <div style={style.inviteForm}>
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="np. klientka@przyklad.pl"
            style={style.inviteInput}
          />
          <button
            onClick={handleCopyInviteLink}
            style={{ ...style.btn, ...style.inviteBtn }}
          >
            Pobierz link
          </button>
          <button
            onClick={handleSendInvite}
            style={{ ...style.btn, ...style.inviteBtn }}
          >
            Wyślij
          </button>
          {inviteStatus && (
            <span style={style.statusMsg(inviteStatus.includes("✅"))}>
              {inviteStatus}
            </span>
          )}
        </div>
      )}

      {/* Wyszukiwarka */}
      <div style={style.searchBox}>
        <input
          type="text"
          placeholder="Wyszukaj po imieniu, nazwisku, e-mailu lub numerze telefonu"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={style.searchInput}
        />
      </div>

      {/* Tabela */}
      <div style={style.tableWrapper}>
        {filteredClients.length === 0 ? (
          <div style={style.empty}>Brak zarejestrowanych klientek.</div>
        ) : (
          <table style={style.table}>
            <thead>
              <tr>
                <th style={style.th}>Imię</th>
                <th style={style.th}>Nazwisko</th>
                <th style={style.th}>E-mail</th>
                <th style={style.th}>Telefon</th>
                <th style={style.th}>Ilość zabiegów</th>
                <th style={style.th}>Ostatni zabieg</th>
                <th style={style.th}>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((c) => {
                const count = (c.treatments || []).length;
                const lastDate = getLastTreatmentDate(c.treatments);
                return (
                  <tr key={c.id}>
                    <td style={style.td}>{c.firstName}</td>
                    <td style={style.td}>{c.lastName}</td>
                    <td style={style.td}>{c.email}</td>
                    <td style={style.td}>{c.phone}</td>
                    <td style={{ ...style.td, textAlign: "center" }}>
                      {count}
                    </td>
                    <td style={style.td}>{lastDate}</td>
                    <td style={{ ...style.td, textAlign: "center" }}>
                      <button
                        onClick={() => navigate(`/client/${c.id}`)}
                        style={style.viewBtn}
                      >
                        Zobacz
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
