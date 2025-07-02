import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RodoModal from "./RodoModal";
import '../styles/theme.css';

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
    <div className="client-form-container">
      <button
        onClick={() => navigate("/clients")}
        className="client-form-back-btn"
      >
        ← Powrót do panelu
      </button>
      <h2
        className="client-form-title"
      >
        Karta klientki – dane wstępne
      </h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Sekcja A */}
        <div className="client-form-section">
          <div className="client-form-section-title">A. Dane osobowe i kontaktowe</div>
          <div className="client-form-label">Imię</div>
          <input
            className="client-form-input"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Imię"
            onFocus={() => setFocusField("firstName")}
            onBlur={() => setFocusField("")}
          />
          <div className="client-form-label">Nazwisko</div>
          <input
            className="client-form-input"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Nazwisko"
            onFocus={() => setFocusField("lastName")}
            onBlur={() => setFocusField("")}
          />
          <div className="client-form-label">Email</div>
          <input
            className="client-form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            onFocus={() => setFocusField("email")}
            onBlur={() => setFocusField("")}
          />
          <div className="client-form-label">Telefon</div>
          <input
            className="client-form-input"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telefon"
            onFocus={() => setFocusField("phone")}
            onBlur={() => setFocusField("")}
          />
          <div className="client-form-label">Data urodzenia</div>
          <input
            className="client-form-input"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            onFocus={() => setFocusField("birthDate")}
            onBlur={() => setFocusField("")}
          />
          <div className="client-form-label">Płeć</div>
          <div className="client-form-radio-group">
            <label className="client-form-radio-label">
              <input
                className="client-form-radio"
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleRadio}
              />
              Kobieta
            </label>
            <label className="client-form-radio-label">
              <input
                className="client-form-radio"
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleRadio}
              />
              Mężczyzna
            </label>
          </div>
        </div>
        {/* Sekcja B */}
        <div className="client-form-section">
          <div className="client-form-section-title">B. Informacje medyczne i przeciwwskazania</div>
          <div className="client-form-label">Choroby przewlekłe</div>
          <textarea
            className="client-form-textarea"
            name="chronicDiseases"
            rows="2"
            value={formData.chronicDiseases}
            onChange={handleChange}
            placeholder="Choroby przewlekłe"
            onFocus={() => setFocusField("chronicDiseases")}
            onBlur={() => setFocusField("")}
          />
          <div className="client-form-label">Przeciwwskazania</div>
          <div className="client-form-checkbox-group">
            {Object.entries(contraindicationLabels).map(([key, label]) => (
              <label key={key} className="client-form-checkbox-label">
                <input
                  className="client-form-checkbox"
                  type="checkbox"
                  name={key}
                  checked={formData.contraindications[key]}
                  onChange={e => handleCheckboxGroup(e, "contraindications")}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="client-form-label">Uwagi</div>
          <textarea
            className="client-form-textarea"
            name="additionalNotes"
            rows="2"
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="Uwagi"
            onFocus={() => setFocusField("additionalNotes")}
            onBlur={() => setFocusField("")}
          />
        </div>
        {/* Sekcja C */}
        <div className="client-form-section">
          <div className="client-form-section-title">C. Styl życia i zwyczaje</div>
          <div className="client-form-checkbox-group">
            {Object.entries(lifestyleLabels).map(([key, label]) => (
              <label key={key} className="client-form-checkbox-label">
                <input
                  className="client-form-checkbox"
                  type="checkbox"
                  name={key}
                  checked={formData[key]}
                  onChange={handleSingleCheckbox}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="client-form-label">Leki</div>
          <textarea
            className="client-form-textarea"
            name="medications"
            rows="2"
            value={formData.medications}
            onChange={handleChange}
            placeholder="Przyjmowane leki"
            onFocus={() => setFocusField("medications")}
            onBlur={() => setFocusField("")}
          />
          <div className="client-form-label">Suplementy</div>
          <textarea
            className="client-form-textarea"
            name="supplements"
            rows="2"
            value={formData.supplements}
            onChange={handleChange}
            placeholder="Suplementy diety"
            onFocus={() => setFocusField("supplements")}
            onBlur={() => setFocusField("")}
          />
          <div className="client-form-label">Alergie</div>
          <textarea
            className="client-form-textarea"
            name="allergies"
            rows="2"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Znane alergie"
            onFocus={() => setFocusField("allergies")}
            onBlur={() => setFocusField("")}
          />
        </div>
        {/* Sekcja D */}
        <div className="client-form-section">
          <div className="client-form-section-title">D. Problemy skórne</div>
          <div className="client-form-label">Zaznacz wszystkie</div>
          <div className="client-form-checkbox-group">
            {Object.entries(skinIssueLabels).map(([key, label]) => (
              <label key={key} className="client-form-checkbox-label">
                <input
                  className="client-form-checkbox"
                  type="checkbox"
                  name={key}
                  checked={formData.skinIssues[key]}
                  onChange={e => handleCheckboxGroup(e, "skinIssues")}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="client-form-label">Inne problemy skórne</div>
          <textarea
            className="client-form-textarea"
            name="otherSkinIssue"
            rows="3"
            value={formData.otherSkinIssue}
            onChange={handleChange}
            placeholder="Inne zauważone zmiany"
            onFocus={() => setFocusField("otherSkinIssue")}
            onBlur={() => setFocusField("")}
          />
        </div>
        {/* Sekcja F */}
        <div className="client-form-section">
          <div className="client-form-section-title">F. Zgody i newsletter</div>
          <label className="client-form-checkbox-label">
            <input
              className="client-form-checkbox"
              type="checkbox"
              name="rodoConsent"
              checked={formData.rodoConsent}
              onChange={handleSingleCheckbox}
              required
            />
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
          <div className="client-form-error">
            {errors.rodoConsent}
          </div>
          <label className="client-form-checkbox-label">
            <input
              className="client-form-checkbox"
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleSingleCheckbox}
            />
            Zgoda na newsletter
          </label>
          <label className="client-form-checkbox-label">
            <input
              className="client-form-checkbox"
              type="checkbox"
              name="unsubscribed"
              checked={formData.unsubscribed}
              onChange={handleSingleCheckbox}
            />
            Rezygnuję z newslettera
          </label>
        </div>
        <RodoModal
          open={showRODO}
          onClose={() => setShowRODO(false)}
          companyName={companyName}
        />
        <button
          type="submit"
          className="client-form-submit-btn"
        >
          Wyślij
        </button>
      </form>
    </div>
  );
}
