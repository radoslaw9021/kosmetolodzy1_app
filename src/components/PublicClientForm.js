// src/components/PublicClientForm.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RodoModal from "./RodoModal";

const style = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  formGroup: { marginBottom: "1rem" },
  label: { display: "block", fontWeight: "500", marginBottom: "0.25rem" },
  input: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  errorText: { color: "#C8373B", fontSize: "0.9rem", marginTop: "0.25rem" },
  submitButton: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#232323",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "500",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  birthDate: "",
  chronicDiseases: "",
  contraindications: {
    pregnancy: false,
    diabetes: false,
    syncope: false,
    varicoseVeins: false,
    thyroidDiseases: false,
    anemia: false,
    ulcers: false,
    kidneyFailure: false,
    pacemaker: false,
    substanceAbuse: false,
    cancer5Years: false,
    epilepsy: false,
    claustrophobia: false,
    activeInfection: false,
    seriousIllness: false,
    cardioDisease: false,
  },
  additionalNotes: "",
  sports: false,
  plannedPregnancy: false,
  healthyNutrition: false,
  metalImplants: false,
  pacemakerImplant: false,
  contactLenses: false,
  claustrophobiaC: false,
  vacationWarmCountries: false,
  medications: "",
  supplements: "",
  allergies: "",
  skinIssues: {
    acne: false,
    pigmentation: false,
    blackheads: false,
    comedones: false,
    granulomas: false,
    milia: false,
    scars: false,
    wrinkles: false,
    erythema: false,
    lossOfFirmness: false,
    dryness: false,
    overSebum: false,
    psoriasis: false,
    eczema: false,
    seborrheicDermatitis: false,
    openComedones: false,
    melasma: false,
    solarLentigo: false,
    telangiectasia: false,
    keratosisPilaris: false,
    postInflammatoryHyperpigmentation: false,
    reactiveSkin: false,
    contactDermatitis: false,
  },
  otherSkinIssue: "",
  rodoConsent: false,
  marketingConsent: false,
  unsubscribed: false,
};

export default function PublicClientForm({ clientsList = [], onSubmit }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { search } = useLocation();
  const navigate = useNavigate();

  const companyName =
    localStorage.getItem("brandingCompanyName") || "Twoja Firma";
  const [showRODO, setShowRODO] = useState(false);

  // pre-fill jeśli ?ref=<id>
  useEffect(() => {
    const ref = new URLSearchParams(search).get("ref");
    if (!ref) return;
    const existing = clientsList.find((c) => c.id === ref);
    if (!existing) return;
    setFormData(existing);
    setIsEditing(true);
    setEditId(ref);
  }, [search, clientsList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };
  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData((f) => ({ ...f, [name]: checked }));
  };
  const handleGroupCheckbox = (e, group) => {
    const { name, checked } = e.target;
    setFormData((f) => ({
      ...f,
      [group]: { ...f[group], [name]: checked },
    }));
  };
  const handleRadio = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "Imię jest wymagane";
    if (!formData.lastName.trim()) errs.lastName = "Nazwisko jest wymagane";
    if (!formData.email.trim()) errs.email = "E-mail jest wymagany";
    if (!formData.phone.trim()) errs.phone = "Telefon jest wymagany";
    if (!formData.gender) errs.gender = "Wybierz płeć";
    if (!formData.rodoConsent) errs.rodoConsent = "Zgoda RODO jest wymagana";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const payload = {
      ...formData,
      id: isEditing ? editId : Date.now().toString(),
      treatments: isEditing
        ? clientsList.find((c) => c.id === editId)?.treatments || []
        : [],
    };

    // 1) najpierw dotychczasowa logika
    onSubmit?.(payload, isEditing);

    // 2) dodatkowo aktualizacja localStorage
    const stored = JSON.parse(localStorage.getItem("clients")) || [];
    if (isEditing) {
      const updated = stored.map((c) => (c.id === payload.id ? payload : c));
      localStorage.setItem("clients", JSON.stringify(updated));
    } else {
      localStorage.setItem("clients", JSON.stringify([...stored, payload]));
    }

    // 3) potwierdzenie i nawigacja
    setSubmitted(true);
    setTimeout(() => navigate("/clients"), 1200);
  };

  if (submitted) {
    return (
      <div style={style.container}>
        <h2 style={{ textAlign: "center" }}>
          Dziękujemy za przesłanie danych!
        </h2>
        <p style={{ textAlign: "center" }}>
          Twoja karta została przekazana do {companyName}.
        </p>
      </div>
    );
  }

  return (
    <div style={style.container}>
      <h2 style={{ textAlign: "center" }}>
        Karta klientki – dane {isEditing ? "do uzupełnienia" : "wstępne"}
      </h2>
      <p style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Wypełnij pola oznaczone * – są wymagane.
      </p>

      <form onSubmit={handleSubmit}>
        {/* …Twoje pola A–F bez zmian… */}

        <div style={style.formGroup}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              name="rodoConsent"
              checked={formData.rodoConsent}
              onChange={handleCheckbox}
              required
            />
            Wyrażam zgodę RODO
            <button
              type="button"
              style={{
                background: "none",
                color: "#1c89fa",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "1em",
                marginLeft: 6,
                padding: 0,
              }}
              onClick={() => setShowRODO(true)}
            >
              Zobacz treść zgody
            </button>
          </label>
          {errors.rodoConsent && (
            <div style={style.errorText}>{errors.rodoConsent}</div>
          )}
        </div>

        <RodoModal
          open={showRODO}
          onClose={() => setShowRODO(false)}
          companyName={companyName}
        />

        <button type="submit" style={style.submitButton}>
          {isEditing ? "Zaktualizuj" : "Wyślij"}
        </button>
      </form>
    </div>
  );
}
