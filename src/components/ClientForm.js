import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RodoModal from "./RodoModal";
import SignatureCanvas from "./SignatureCanvas";
import '../styles/theme.css';

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
  address: "",
  
  // Informacje medyczne
  medical: {
    chronicDiseases: "",
    medications: "",
    supplements: "",
    allergies: "",
    additionalNotes: ""
  },
  
  // Przeciwwskazania
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
  
  // Styl życia
  lifestyle: {
    sports: false,
    plannedPregnancy: false,
    healthyNutrition: false,
    metalImplants: false,
    pacemakerImplant: false,
    contactLenses: false,
    claustrophobiaC: false,
    vacationWarmCountries: false
  },
  
  // Problemy skórne
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
  
  // Zgody
  consents: {
    rodo: false,
    marketing: false,
    newsletter: false,
    unsubscribed: false
  },
  
  notes: ""
};

export default function ClientForm({ onAddClient }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [focusField, setFocusField] = useState("");
  const [showRODO, setShowRODO] = useState(false);
  const [showSignatureCanvas, setShowSignatureCanvas] = useState(false);
  const [signatureType, setSignatureType] = useState('');
  const [signedConsents, setSignedConsents] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
    
    // Sprawdź czy pole należy do zagnieżdżonego obiektu
    if (name.includes('.')) {
      const [group, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [group]: { ...prev[group], [field]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
    
    // Sprawdź czy zgoda jest już podpisana
    if (signedConsents[name.replace('Consent', '')]) {
      alert('Nie można zmienić zgody, która została już podpisana elektronicznie.');
      return;
    }
    
    // Sprawdź czy pole należy do zagnieżdżonego obiektu
    if (name.includes('.')) {
      const [group, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [group]: { ...prev[group], [field]: checked }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    }
  };
  const handleRadio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignatureRequest = async (consentType) => {
    // Sprawdź czy klientka ma już ID (jest zapisana)
    if (!formData.id || formData.id === 'new') {
      // Najpierw zapisz klientkę
      if (typeof onAddClient === "function") {
        try {
          setIsLoading(true);
          setSubmitError("");
          
          // Utwórz tymczasowe ID
          const tempId = Date.now().toString();
          const clientData = {
            ...formData,
            id: tempId,
            treatments: [],
          };
          
          // Zapisz klientkę
          await onAddClient(clientData);
          
          // Zaktualizuj formData z nowym ID
          setFormData(prev => ({ ...prev, id: tempId }));
          
          // Teraz możesz podpisać
          setSignatureType(consentType);
          setShowSignatureCanvas(true);
        } catch (error) {
          console.error('Error saving client:', error);
          setSubmitError('Błąd podczas zapisywania klientki. Sprawdź połączenie z internetem i spróbuj ponownie.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setSubmitError('Nie można podpisać zgody przed zapisaniem klientki.');
      }
    } else {
      // Klientka już ma ID, możesz podpisać
      setSignatureType(consentType);
      setShowSignatureCanvas(true);
    }
  };

  const handleSignatureSave = (signatureData) => {
    setSignedConsents(prev => ({
      ...prev,
      [signatureType]: signatureData
    }));
    setFormData(prev => ({
      ...prev,
      [`${signatureType}Consent`]: true
    }));
    setShowSignatureCanvas(false);
  };

  const handleSignatureCancel = () => {
    setShowSignatureCanvas(false);
    setSignatureType('');
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
    if (!formData.consents?.rodo) errs.rodoConsent = "Musisz wyrazić zgodę RODO";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    
    if (typeof onAddClient === "function") {
      try {
        setIsLoading(true);
        setSubmitError("");
        setSubmitSuccess(false);
        
        await onAddClient({
          ...formData,
          id: Date.now().toString(),
          treatments: [],
        });
        
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate("/clients");
        }, 1500);
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitError('Błąd podczas zapisywania klientki. Sprawdź połączenie z internetem i spróbuj ponownie.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="client-form-container">
      <button
        onClick={() => navigate("/clients")}
        className="client-form-back-btn"
        disabled={isLoading}
      >
        ← Powrót do panelu
      </button>
      <h2
        className="client-form-title"
      >
        Karta klientki – dane wstępne
      </h2>
      
      {/* Komunikat o błędzie */}
      {submitError && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          {submitError}
          <button
            onClick={() => setSubmitError("")}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              marginLeft: 'auto',
              fontSize: '1.2rem'
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Komunikat o sukcesie */}
      {submitSuccess && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #bbf7d0',
          color: '#16a34a',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.2rem' }}>✅</span>
          Klientka została zapisana pomyślnie! Przekierowywanie...
        </div>
      )}
      
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
            disabled={isLoading}
          />
          {errors.firstName && (
            <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.firstName}
            </div>
          )}
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
            disabled={isLoading}
          />
          {errors.lastName && (
            <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.lastName}
            </div>
          )}
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
            disabled={isLoading}
          />
          {errors.email && (
            <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.email}
            </div>
          )}
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
            disabled={isLoading}
          />
          {errors.phone && (
            <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.phone}
            </div>
          )}
          <div className="client-form-label">Data urodzenia</div>
          <input
            className="client-form-input"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            onFocus={() => setFocusField("birthDate")}
            onBlur={() => setFocusField("")}
            disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
              Mężczyzna
            </label>
          </div>
          {errors.gender && (
            <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.gender}
            </div>
          )}
        </div>
        {/* Sekcja B */}
        <div className="client-form-section">
          <div className="client-form-section-title">B. Informacje medyczne i przeciwwskazania</div>
          <div className="client-form-label">Choroby przewlekłe</div>
          <textarea
            className="client-form-textarea"
            name="medical.chronicDiseases"
            rows="2"
            value={formData.medical?.chronicDiseases || ""}
            onChange={handleChange}
            placeholder="Choroby przewlekłe"
            onFocus={() => setFocusField("medical.chronicDiseases")}
            onBlur={() => setFocusField("")}
            disabled={isLoading}
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
                  disabled={isLoading}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="client-form-label">Uwagi</div>
          <textarea
            className="client-form-textarea"
            name="medical.additionalNotes"
            rows="2"
            value={formData.medical?.additionalNotes || ""}
            onChange={handleChange}
            placeholder="Uwagi"
            onFocus={() => setFocusField("medical.additionalNotes")}
            onBlur={() => setFocusField("")}
            disabled={isLoading}
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
                  name={`lifestyle.${key}`}
                  checked={formData.lifestyle?.[key] || false}
                  onChange={handleSingleCheckbox}
                  disabled={isLoading}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="client-form-label">Leki</div>
          <textarea
            className="client-form-textarea"
            name="medical.medications"
            rows="2"
            value={formData.medical?.medications || ""}
            onChange={handleChange}
            placeholder="Przyjmowane leki"
            onFocus={() => setFocusField("medical.medications")}
            onBlur={() => setFocusField("")}
            disabled={isLoading}
          />
          <div className="client-form-label">Suplementy</div>
          <textarea
            className="client-form-textarea"
            name="medical.supplements"
            rows="2"
            value={formData.medical?.supplements || ""}
            onChange={handleChange}
            placeholder="Suplementy diety"
            onFocus={() => setFocusField("medical.supplements")}
            onBlur={() => setFocusField("")}
            disabled={isLoading}
          />
          <div className="client-form-label">Alergie</div>
          <textarea
            className="client-form-textarea"
            name="medical.allergies"
            rows="2"
            value={formData.medical?.allergies || ""}
            onChange={handleChange}
            placeholder="Znane alergie"
            onFocus={() => setFocusField("medical.allergies")}
            onBlur={() => setFocusField("")}
            disabled={isLoading}
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
                  disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        {/* Sekcja F */}
        <div className="client-form-section">
          <div className="client-form-section-title">F. Zgody i newsletter</div>
          
          {/* Zgoda RODO */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="client-form-checkbox-label" style={{
              opacity: signedConsents.rodo ? 0.6 : 1,
              cursor: signedConsents.rodo ? 'not-allowed' : 'default'
            }}>
              <input
                className="client-form-checkbox"
                type="checkbox"
                name="consents.rodo"
                checked={formData.consents?.rodo || false}
                onChange={handleSingleCheckbox}
                required
                disabled={signedConsents.rodo || isLoading}
              />
              Zgoda RODO
              {signedConsents.rodo && <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>✓ Podpisano</span>}
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
                disabled={isLoading}
              >
                Zobacz treść zgody
              </button>
              <span style={{ color: "#C8373B", marginLeft: 2 }}>*</span>
            </label>
            {errors.rodoConsent && (
              <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.rodoConsent}
              </div>
            )}
            
            {/* Przycisk podpisu elektronicznego RODO */}
            <button
              type="button"
              onClick={() => handleSignatureRequest('rodo')}
              disabled={isLoading}
              style={{
                background: signedConsents.rodo ? '#10b981' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {signedConsents.rodo ? '✓ Podpisano' : '✍ Podpisz elektronicznie'}
            </button>
          </div>

          {/* Zgoda na newsletter */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="client-form-checkbox-label" style={{
              opacity: signedConsents.newsletter ? 0.6 : 1,
              cursor: signedConsents.newsletter ? 'not-allowed' : 'default'
            }}>
              <input
                className="client-form-checkbox"
                type="checkbox"
                name="consents.newsletter"
                checked={formData.consents?.newsletter || false}
                onChange={handleSingleCheckbox}
                disabled={signedConsents.newsletter || isLoading}
              />
              Zgoda na newsletter
              {signedConsents.newsletter && <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>✓ Podpisano</span>}
            </label>
            
            {/* Przycisk podpisu elektronicznego newsletter */}
            <button
              type="button"
              onClick={() => handleSignatureRequest('newsletter')}
              disabled={isLoading}
              style={{
                background: signedConsents.newsletter ? '#10b981' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {signedConsents.newsletter ? '✓ Podpisano' : '✍ Podpisz elektronicznie'}
            </button>
          </div>

          <label className="client-form-checkbox-label">
            <input
              className="client-form-checkbox"
              type="checkbox"
              name="consents.unsubscribed"
              checked={formData.consents?.unsubscribed || false}
              onChange={handleSingleCheckbox}
              disabled={isLoading}
            />
            Rezygnuję z newslettera
          </label>
        </div>
        
        {/* Modal z treścią zgody RODO */}
        <RodoModal
          open={showRODO}
          onClose={() => setShowRODO(false)}
          companyName={companyName}
        />

        {/* Modal z podpisem elektronicznym */}
        {showSignatureCanvas && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <SignatureCanvas
              clientId={formData.id || 'new'}
              consentType={signatureType}
              consentText={`Zgoda ${signatureType.toUpperCase()} - ${companyName}`}
              onSave={handleSignatureSave}
              onCancel={handleSignatureCancel}
            />
          </div>
        )}

        <button
          type="submit"
          className="client-form-submit-btn"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            position: 'relative'
          }}
        >
          {isLoading ? (
            <>
              <div style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '0.5rem'
              }}></div>
              Zapisywanie...
            </>
          ) : (
            'Wyślij'
          )}
        </button>
      </form>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
