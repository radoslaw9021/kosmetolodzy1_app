import React, { useState } from "react";

// Pełna lista zabiegów z Beauty Room by Joanna Wójcik:
export const treatmentTypes = [
  "-- wybierz --",
  "Peeling chemiczny",
  "Mezoterapia igłowa",
  "Mezoterapia bezigłowa",
  "Oxybrazja",
  "Mikrodermabrazja",
  "Peeling kawitacyjny",
  "Peeling enzymatyczny",
  "Laserowe usuwanie owłosienia",
  "Fotoodmładzanie",
  "Radiofrekwencja mikroigłowa (Dermapen)",
  "Karboksyterapia",
  "Osocze bogatopłytkowe (PRP)",
  "Infuzja tlenowa",
  "Kwas hialuronowy (wypełniacze)",
  "Botoks",
  "Nici PDO (lifting nićmi)",
  "Modelowanie ust",
  "Lipoliza iniekcyjna",
  "Endermologia",
  "Elekrostymulacja mięśni twarzy",
  "Kriolipoliza (CoolSculpting)",
];

// Gotowe zalecenia pozabiegowe
const defaultRecommendationsText = `Zmiana ręcznika
Zmiana poszewki
Nie dotykać twarzy do 24 godzin
Nie dotykać zwierząt do 24 godzin
Nie nakładać makijażu do 24 godzin
Nie używać produktów z kwasami chemicznymi
Nie uczęszczać na solarium przez min. 2 tygodnie
Przy kuracji kwasami chemicznymi w ogóle nie uczęszczać na solarium
Nie zażywać sauny ani basenu minimum tydzień
Zrobić przerwę od ćwiczeń min. 48 godzin
Po powiększeniu ust nie masujemy ich, nie dotykamy, nie całujemy się przez tydzień
Po zabiegu BTX nie schylamy się, nie kładziemy się przez 4 godziny
Krem SPF 50 codziennie, niezależnie od pory roku
Nie opalamy twarzy`;

const style = {
  container: {
    maxWidth: "600px",
    margin: "1rem auto",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  formGroup: { marginBottom: "1rem" },
  label: { display: "block", fontWeight: 500, marginBottom: "0.25rem" },
  select: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
  dateInput: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  textarea: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    resize: "vertical",
  },
  fileInput: {
    marginTop: "0.25rem",
  },
  previewImage: {
    maxWidth: "100px",
    maxHeight: "100px",
    marginRight: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  imagePreviewContainer: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
    flexWrap: "wrap",
  },
  buttonGroup: { display: "flex", justifyContent: "flex-end", gap: "0.5rem" },
  cancelButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  errorText: { color: "red", fontSize: "0.9rem", marginTop: "0.25rem" },
};

export default function TreatmentForm({ onAddTreatment, onCancel }) {
  const today = new Date().toISOString().split("T")[0];

  const [formState, setFormState] = useState({
    type: "",
    date: today,
    notesInternal: "",
    notesForClient: "",
    recommendationsText: defaultRecommendationsText,
    images: [],
  });

  const [errors, setErrors] = useState({});

  // Zamiana pliku na Base64
  const fileToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  // Obsługa uploadu wielu zdjęć
  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      fileToBase64(file, (base64) => {
        setFormState((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              url: base64,
              label: "",
              date: new Date().toISOString().slice(0, 10),
            },
          ],
        }));
      });
    });
    e.target.value = null;
  };

  const handleImageLabel = (idx, value) => {
    setFormState((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === idx ? { ...img, label: value } : img
      ),
    }));
  };

  const handleRemoveImage = (idx) => {
    setFormState((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formState.type.trim()) newErrors.type = "Wybierz typ zabiegu";
    if (!formState.date.trim()) newErrors.date = "Wybierz datę zabiegu";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const recommendations = formState.recommendationsText
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r);

    const treatmentObject = {
      type: formState.type,
      date: formState.date,
      notesInternal: formState.notesInternal,
      notesForClient: formState.notesForClient,
      recommendations,
      images: formState.images,
    };
    onAddTreatment(treatmentObject);
  };

  return (
    <div className="treatment-form-container">
      <div className="treatment-form-title">Dodaj nowy zabieg</div>
      <div className="treatment-form-group">
        <label className="treatment-form-label" htmlFor="type">Typ zabiegu <span style={{ color: '#f472b6' }}>*</span></label>
        <select
          id="type"
          name="type"
          className="treatment-form-input"
          value={formState.type}
          onChange={handleChange}
        >
          {treatmentTypes.map((type, idx) => (
            <option key={idx} value={type === "-- wybierz --" ? "" : type}>{type}</option>
          ))}
        </select>
        {errors.type && <div className="treatment-form-error">{errors.type}</div>}
      </div>
      <div className="treatment-form-group">
        <label className="treatment-form-label" htmlFor="date">Data zabiegu <span style={{ color: '#f472b6' }}>*</span></label>
        <input
          id="date"
          name="date"
          type="date"
          className="treatment-form-input"
          value={formState.date}
          onChange={handleChange}
        />
        {errors.date && <div className="treatment-form-error">{errors.date}</div>}
      </div>
      <div className="treatment-form-group">
        <label className="treatment-form-label">Zdjęcia do zabiegu:</label>
        <input
          type="file"
          multiple
          className="treatment-form-input"
          onChange={handleImagesUpload}
        />
        {formState.images.length > 0 && (
          <div className="treatment-form-image-preview">
            {formState.images.map((img, idx) => (
              <div key={idx} className="treatment-form-image-thumb">
                <img src={img.url} alt="Podgląd" />
                <input
                  type="text"
                  className="treatment-form-input treatment-form-image-label"
                  placeholder="Opis zdjęcia"
                  value={img.label}
                  onChange={e => handleImageLabel(idx, e.target.value)}
                />
                <button
                  type="button"
                  className="treatment-form-btn treatment-form-btn-cancel treatment-form-image-remove"
                  onClick={() => handleRemoveImage(idx)}
                  aria-label="Usuń zdjęcie"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="treatment-form-group">
        <label className="treatment-form-label" htmlFor="notesInternal">Notatka wewnętrzna:</label>
        <textarea
          id="notesInternal"
          name="notesInternal"
          className="treatment-form-input"
          value={formState.notesInternal}
          onChange={handleChange}
          placeholder="Notatka dla kosmetologa"
        />
      </div>
      <div className="treatment-form-group">
        <label className="treatment-form-label" htmlFor="notesForClient">Notatka dla klientki:</label>
        <textarea
          id="notesForClient"
          name="notesForClient"
          className="treatment-form-input"
          value={formState.notesForClient}
          onChange={handleChange}
          placeholder="Notatka, którą otrzyma klientka"
        />
      </div>
      <div className="treatment-form-group">
        <label className="treatment-form-label" htmlFor="recommendationsText">Zalecenia pozabiegowe:</label>
        <textarea
          id="recommendationsText"
          name="recommendationsText"
          className="treatment-form-input"
          value={formState.recommendationsText}
          onChange={handleChange}
          rows={6}
        />
      </div>
      <div className="treatment-form-btn-group">
        <button type="button" className="treatment-form-btn treatment-form-btn-cancel" onClick={onCancel}>Anuluj</button>
        <button type="button" className="treatment-form-btn treatment-form-btn-save" onClick={handleSubmit}>Zapisz zabieg</button>
      </div>
    </div>
  );
}
