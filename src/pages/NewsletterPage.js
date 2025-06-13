import React, { useState, useMemo } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

const SERVICE_ID = "service_99ze4ld";
const TEMPLATE_ID = "template_won8k6h";
const USER_ID = "5jB6ZtTBlhFYjZEX6";

export default function NewsletterPage({ clients }) {
  const [subject, setSubject] = useState("Promocja Beauty Room!");
  const [message, setMessage] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [genderFilter, setGenderFilter] = useState("Wszyscy");
  console.log(
    "▶️ wszyscy gender z klientów:",
    clients.map((c) => c.gender)
  );
  console.log("▶️ bieżący genderFilter:", genderFilter);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (genderFilter === "Wszyscy") return true;
      return c.gender === genderFilter;
    });
  }, [clients, genderFilter]);

  const toggle = (id) => {
    setSelectedIds((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const send = async (toList) => {
    setIsSending(true);
    setSendSuccess(false);

    let success = 0;
    let fail = 0;

    await Promise.all(
      toList.map((c) =>
        emailjs
          .send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
              subject,
              message,
              name: c.firstName,
              email: c.email,
            },
            USER_ID
          )
          .then(() => success++)
          .catch((err) => {
            console.error("Błąd wysyłki do:", c.email, err);
            fail++;
          })
      )
    );

    if (success > 0) toast.success(`Wysłano ${success} e-maili ✅`);
    if (fail > 0) toast.error(`Błąd przy wysyłce ${fail} e-maili ❌`);

    setIsSending(false);
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2>Panel Newslettera</h2>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Temat:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
          Treść wiadomości:
        </label>
        <textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="email"
          placeholder="Wyślij test do..."
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button
          onClick={() => {
            if (!testEmail) return toast.error("Podaj adres testowy");
            send([{ firstName: "Test", email: testEmail }]);
          }}
          style={{
            backgroundColor: "#C8373B",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Wyślij testowy
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>Pokaż: </label>
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="Wszyscy">Wszyscy</option>
          <option value="female">Tylko Panie</option>
          <option value="male">Tylko Panowie</option>
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th></th>
            <th>Imię</th>
            <th>E-mail</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id}>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(c.id)}
                  onChange={() => toggle(c.id)}
                />
              </td>
              <td>{c.firstName}</td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginTop: 16 }}>
        <button
          onClick={() => {
            const toSend = filtered.filter((c) => selectedIds.has(c.id));
            if (toSend.length === 0) {
              toast.error("Zaznacz przynajmniej jedną klientkę");
              return;
            }
            send(toSend);
          }}
          disabled={isSending}
          style={{
            backgroundColor: "#C8373B",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: isSending ? "default" : "pointer",
            opacity: isSending ? 0.7 : 1,
          }}
        >
          {isSending
            ? "Wysyłanie..."
            : sendSuccess
            ? "Wysłano ✅"
            : "Wyślij do zaznaczonych"}
        </button>
      </div>
    </div>
  );
}
