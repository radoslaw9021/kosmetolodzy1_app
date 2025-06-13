import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RodoModal from "./RodoModal";

const style = {
  container: {
    maxWidth: 660,
    margin: "2.5rem auto",
    padding: "2.5rem 2rem",
    background: "#fff",
    borderRadius: 28,
    boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
    transition: "box-shadow 0.25s",
  },
  section: { marginBottom: "2.4rem" },
  sectionTitle: {
    fontSize: "1.22rem",
    fontWeight: 700,
    marginBottom: "0.75rem",
    borderBottom: "1.5px solid #efefef",
    paddingBottom: "0.5rem",
    letterSpacing: "0.03em",
    color: "#C8373B",
  },
  formGroup: { marginBottom: "1.3rem" },
  label: {
    display: "block",
    fontWeight: 500,
    marginBottom: "0.45rem",
    color: "#1a1a1a",
  },
  input: {
    width: "100%",
    padding: "11px 16px",
    border: "1.2px solid #ececec",
    borderRadius: 13,
    background: "#faf9f8",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.22s, box-shadow 0.22s",
  },
  textarea: {
    width: "100%",
    padding: "11px 16px",
    border: "1.2px solid #ececec",
    borderRadius: 13,
    background: "#faf9f8",
    fontSize: 16,
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.22s, box-shadow 0.22s",
  },
  checkboxGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "0.5rem",
    marginTop: 7,
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
    fontSize: 15,
    background: "#faf9f8",
    borderRadius: 8,
    padding: "5px 11px",
    cursor: "pointer",
    transition: "background 0.18s",
  },
  radioGroup: { display: "flex", gap: "2rem", marginTop: "0.45rem" },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    fontSize: 15,
  },
  errorText: {
    color: "#C8373B",
    fontSize: "0.98rem",
    minHeight: 18,
    marginTop: "0.22rem",
    opacity: 1,
    transition: "opacity 0.22s",
  },
  submitButton: {
    width: "100%",
    padding: "1rem",
    background: "#C8373B",
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: 700,
    border: "none",
    borderRadius: 11,
    cursor: "pointer",
    marginTop: 12,
    boxShadow: "0 2px 12px rgba(200,55,59,0.09)",
    transition: "background 0.18s, box-shadow 0.18s, transform 0.13s",
  },
  backButton: {
    padding: "0.6rem 1.2rem",
    background: "#fff",
    color: "#C8373B",
    border: "1.5px solid #C8373B",
    borderRadius: 11,
    cursor: "pointer",
    marginBottom: "2rem",
    fontWeight: 600,
    fontSize: "1rem",
    boxShadow: "0 1px 4px rgba(200,55,59,0.07)",
    transition: "background 0.16s, color 0.16s, border 0.16s",
  },
};

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
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
    scars: false,
    dryness: false,
    overSebum: false,
  },
  otherSkinIssue: "",
  rodoConsent: false,
  marketingConsent: false,
  unsubscribed: false,
};

export default function ClientForm({ onAddClient }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [focusField, setFocusField] = useState("");
  const [showRODO, setShowRODO] = useState(false);
  const navigate = useNavigate();

  // Dynamiczna nazwa firmy
  const companyName =
    localStorage.getItem("brandingCompanyName") ||
    "Beauty Room By Joanna Wójcik";

  // Labelki
  const contraindicationLabels = {
    pregnancy: "Ciąża / okres karmienia",
    diabetes: "Cukrzyca",
    syncope: "Tendencja do omdleń",
    varicoseVeins: "Żylaki",
    thyroidDiseases: "Choroby tarczycy",
    anemia: "Anemia",
    ulcers: "Choroba wrzodowa żołądka / dwunastnicy",
    kidneyFailure: "Niewydolność nerek",
    pacemaker: "Rozrusznik serca",
    substanceAbuse: "Nadużywanie alkoholu/narkotyków",
    cancer5Years: "Nowotwór w ciągu ostatnich 5 lat",
    epilepsy: "Epilepsja",
    claustrophobia: "Klaustrofobia",
    activeInfection: "Aktywne infekcje",
    seriousIllness: "Poważne schorzenia",
    cardioDisease: "Choroby układu sercowo-naczyniowego",
  };
  const lifestyleLabels = {
    sports: "Uprawiam sport",
    plannedPregnancy: "Planuję ciążę",
    healthyNutrition: "Regularne odżywianie",
    metalImplants: "Metalowe implanty",
    pacemakerImplant: "Posiadam rozrusznik serca",
    contactLenses: "Noszę soczewki",
    claustrophobiaC: "Mam klaustrofobię",
    vacationWarmCountries: "Wakacje w ciepłych krajach",
  };
  const skinIssueLabels = {
    acne: "Trądzik",
    pigmentation: "Przebarwienia",
    blackheads: "Wągry",
    comedones: "Zaskórniaki",
    scars: "Blizny",
    dryness: "Suchość",
    overSebum: "Nadprodukcja sebum",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckboxGroup = (e, group) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [group]: { ...prev[group], [name]: checked },
    }));
  };
  const handleSingleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  const handleRadio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getInputStyle = (field, error) => ({
    ...style.input,
    borderColor:
      focusField === field ? "#C8373B" : error ? "#C8373B" : "#ececec",
    boxShadow:
      focusField === field
        ? "0 0 0 3px #ffe5e6"
        : error
        ? "0 0 0 2px #ffe5e6"
        : "none",
  });
  const getTextareaStyle = (field, error) => ({
    ...style.textarea,
    borderColor:
      focusField === field ? "#C8373B" : error ? "#C8373B" : "#ececec",
    boxShadow:
      focusField === field
        ? "0 0 0 3px #ffe5e6"
        : error
        ? "0 0 0 2px #ffe5e6"
        : "none",
  });

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "Imię jest wymagane";
    if (!formData.lastName.trim()) errs.lastName = "Nazwisko jest wymagane";
    if (!formData.email.trim()) errs.email = "E-mail jest wymagany";
    if (!formData.phone.trim()) errs.phone = "Telefon jest wymagany";
    if (!formData.gender) errs.gender = "Wybierz płeć";
    if (!formData.rodoConsent) errs.rodoConsent = "Musisz wyrazić zgodę RODO";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (typeof onAddClient === "function") {
      onAddClient({
        ...formData,
        id: Date.now().toString(),
        treatments: [],
      });
    }
    navigate("/clients");
  };

  return (
    <div style={style.container}>
      <button
        onClick={() => navigate("/clients")}
        style={style.backButton}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#C8373B";
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.border = "1.5px solid #C8373B";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.color = "#C8373B";
          e.currentTarget.style.border = "1.5px solid #C8373B";
        }}
      >
        ← Powrót do panelu
      </button>
      <h2
        style={{
          textAlign: "center",
          marginBottom: 32,
          fontWeight: 800,
          letterSpacing: ".03em",
        }}
      >
        Karta klientki – dane wstępne
      </h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Sekcja A */}
        <div style={style.section}>
          <div style={style.sectionTitle}>A. Dane osobowe i kontaktowe</div>
          {["firstName", "lastName", "email", "phone"].map((field) => (
            <div key={field} style={style.formGroup}>
              <label style={style.label}>
                {field === "firstName" && "Imię"}
                {field === "lastName" && "Nazwisko"}
                {field === "email" && "E-mail"}
                {field === "phone" && "Telefon"}{" "}
                <span style={{ color: "#C8373B" }}>*</span>
              </label>
              <input
                type={
                  field === "email"
                    ? "email"
                    : field === "phone"
                    ? "tel"
                    : "text"
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
                onFocus={() => setFocusField(field)}
                onBlur={() => setFocusField("")}
                style={getInputStyle(field, errors[field])}
                placeholder={
                  field === "email"
                    ? "np. jan.kowalski@email.com"
                    : field === "phone"
                    ? "np. 500600700"
                    : undefined
                }
              />
              <div
                style={{ ...style.errorText, opacity: errors[field] ? 1 : 0 }}
              >
                {errors[field]}
              </div>
            </div>
          ))}
          <div style={style.formGroup}>
            <label style={style.label}>Data urodzenia</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              onFocus={() => setFocusField("birthDate")}
              onBlur={() => setFocusField("")}
              style={getInputStyle("birthDate")}
            />
          </div>
          <div style={style.formGroup}>
            <label style={style.label}>
              Płeć <span style={{ color: "#C8373B" }}>*</span>
            </label>
            <div style={style.radioGroup}>
              <label style={style.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleRadio}
                />{" "}
                Kobieta
              </label>
              <label style={style.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleRadio}
                />{" "}
                Mężczyzna
              </label>
            </div>
            <div style={{ ...style.errorText, opacity: errors.gender ? 1 : 0 }}>
              {errors.gender}
            </div>
          </div>
        </div>

        {/* Sekcja B */}
        <div style={style.section}>
          <div style={style.sectionTitle}>
            B. Informacje medyczne i przeciwwskazania
          </div>
          <div style={style.formGroup}>
            <label style={style.label}>Choroby przewlekłe</label>
            <textarea
              name="chronicDiseases"
              rows="2"
              value={formData.chronicDiseases}
              onChange={handleChange}
              onFocus={() => setFocusField("chronicDiseases")}
              onBlur={() => setFocusField("")}
              style={getTextareaStyle("chronicDiseases")}
              placeholder="np. nadciśnienie, cukrzyca..."
            />
          </div>
          <div style={{ marginBottom: "0.5rem", fontWeight: 500 }}>
            Przeciwwskazania:
          </div>
          <div style={style.checkboxGroup}>
            {Object.entries(contraindicationLabels).map(([key, label]) => (
              <label
                key={key}
                style={style.checkboxLabel}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f5e9ea")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#faf9f8")
                }
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={formData.contraindications[key]}
                  onChange={(e) => handleCheckboxGroup(e, "contraindications")}
                />{" "}
                {label}
              </label>
            ))}
          </div>
          <div style={style.formGroup}>
            <label style={style.label}>Uwagi dodatkowe</label>
            <textarea
              name="additionalNotes"
              rows="2"
              value={formData.additionalNotes}
              onChange={handleChange}
              onFocus={() => setFocusField("additionalNotes")}
              onBlur={() => setFocusField("")}
              style={getTextareaStyle("additionalNotes")}
              placeholder="Inne istotne informacje..."
            />
          </div>
        </div>

        {/* Sekcja C */}
        <div style={style.section}>
          <div style={style.sectionTitle}>C. Styl życia i zwyczaje</div>
          <div style={{ marginBottom: "0.5rem", fontWeight: 500 }}>
            Zaznacz wszystkie:
          </div>
          <div style={style.checkboxGroup}>
            {Object.entries(lifestyleLabels).map(([key, label]) => (
              <label
                key={key}
                style={style.checkboxLabel}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f5e9ea")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#faf9f8")
                }
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={formData[key]}
                  onChange={handleSingleCheckbox}
                />{" "}
                {label}
              </label>
            ))}
          </div>
          <div style={style.formGroup}>
            <label style={style.label}>Leki</label>
            <textarea
              name="medications"
              rows="2"
              value={formData.medications}
              onChange={handleChange}
              onFocus={() => setFocusField("medications")}
              onBlur={() => setFocusField("")}
              style={getTextareaStyle("medications")}
              placeholder="Przyjmowane leki"
            />
          </div>
          <div style={style.formGroup}>
            <label style={style.label}>Suplementy</label>
            <textarea
              name="supplements"
              rows="2"
              value={formData.supplements}
              onChange={handleChange}
              onFocus={() => setFocusField("supplements")}
              onBlur={() => setFocusField("")}
              style={getTextareaStyle("supplements")}
              placeholder="Suplementy diety"
            />
          </div>
          <div style={style.formGroup}>
            <label style={style.label}>Alergie</label>
            <textarea
              name="allergies"
              rows="2"
              value={formData.allergies}
              onChange={handleChange}
              onFocus={() => setFocusField("allergies")}
              onBlur={() => setFocusField("")}
              style={getTextareaStyle("allergies")}
              placeholder="Znane alergie"
            />
          </div>
        </div>

        {/* Sekcja D */}
        <div style={style.section}>
          <div style={style.sectionTitle}>D. Problemy skórne</div>
          <div style={{ marginBottom: "0.5rem", fontWeight: 500 }}>
            Zaznacz wszystkie:
          </div>
          <div style={style.checkboxGroup}>
            {Object.entries(skinIssueLabels).map(([key, label]) => (
              <label
                key={key}
                style={style.checkboxLabel}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f5e9ea")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#faf9f8")
                }
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={formData.skinIssues[key]}
                  onChange={(e) => handleCheckboxGroup(e, "skinIssues")}
                />{" "}
                {label}
              </label>
            ))}
          </div>
          <div style={{ ...style.formGroup, marginTop: "1.5rem" }}>
            <label style={style.label}>Inne problemy skórne</label>
            <textarea
              name="otherSkinIssue"
              rows="5"
              value={formData.otherSkinIssue}
              onChange={handleChange}
              onFocus={() => setFocusField("otherSkinIssue")}
              onBlur={() => setFocusField("")}
              style={getTextareaStyle("otherSkinIssue")}
              placeholder="Inne zauważone zmiany"
            />
          </div>
        </div>

        {/* Sekcja F */}
        <div style={style.section}>
          <div style={style.sectionTitle}>F. Zgody i newsletter</div>
          <div style={style.formGroup}>
            <label style={style.checkboxLabel}>
              <input
                type="checkbox"
                name="rodoConsent"
                checked={formData.rodoConsent}
                onChange={handleSingleCheckbox}
                required
              />{" "}
              Zgoda RODO
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
              <span style={{ color: "#C8373B", marginLeft: 2 }}>*</span>
            </label>
            <div
              style={{
                ...style.errorText,
                opacity: errors.rodoConsent ? 1 : 0,
              }}
            >
              {errors.rodoConsent}
            </div>
          </div>
          <div style={style.formGroup}>
            <label style={style.checkboxLabel}>
              <input
                type="checkbox"
                name="marketingConsent"
                checked={formData.marketingConsent}
                onChange={handleSingleCheckbox}
              />{" "}
              Zgoda na newsletter
            </label>
          </div>
          <div style={style.formGroup}>
            <label style={style.checkboxLabel}>
              <input
                type="checkbox"
                name="unsubscribed"
                checked={formData.unsubscribed}
                onChange={handleSingleCheckbox}
              />{" "}
              Rezygnuję z newslettera
            </label>
          </div>
        </div>

        <RodoModal
          open={showRODO}
          onClose={() => setShowRODO(false)}
          companyName={companyName}
        />

        <button
          type="submit"
          style={style.submitButton}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#b22c2f";
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(200,55,59,0.13)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#C8373B";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(200,55,59,0.09)";
          }}
        >
          Wyślij
        </button>
      </form>
    </div>
  );
}
