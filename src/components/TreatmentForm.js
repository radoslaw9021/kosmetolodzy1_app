import React, { useState } from "react";

// Pełna lista zabiegów z Beauty Room by Joanna Wójcik:
const treatmentTypes = [
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
    images: [], // ← Nowa galeria
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
      recommendations, // ← tablica zaleceń
      images: formState.images, // ← wszystkie zdjęcia
    };

    onAddTreatment(treatmentObject);
  };

  return (
    <div style={style.container}>
      <h3>Dodaj nowy zabieg</h3>

      {/* Typ zabiegu */}
      <div style={style.formGroup}>
        <label style={style.label}>
          Typ zabiegu <span style={{ color: "#C8373B" }}>*</span>
        </label>
        <select
          name="type"
          value={formState.type}
          onChange={handleChange}
          style={style.select}
        >
          {treatmentTypes.map((tt, idx) => (
            <option key={idx} value={tt === "-- wybierz --" ? "" : tt}>
              {tt}
            </option>
          ))}
        </select>
        {errors.type && <div style={style.errorText}>{errors.type}</div>}
      </div>

      {/* Data zabiegu */}
      <div style={style.formGroup}>
        <label style={style.label}>
          Data zabiegu <span style={{ color: "#C8373B" }}>*</span>
        </label>
        <input
          type="date"
          name="date"
          value={formState.date}
          onChange={handleChange}
          style={style.dateInput}
        />
        {errors.date && <div style={style.errorText}>{errors.date}</div>}
      </div>

      {/* Upload zdjęć (wielu) */}
      <div style={style.formGroup}>
        <label style={style.label}>Zdjęcia do zabiegu:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesUpload}
          style={style.fileInput}
        />
        <div style={style.imagePreviewContainer}>
          {formState.images.map((img, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <img
                src={img.url}
                alt={img.label || `Zdjęcie ${idx + 1}`}
                style={style.previewImage}
              />
              <input
                placeholder="Podpis (np. Przed)"
                value={img.label}
                onChange={(e) => handleImageLabel(idx, e.target.value)}
                style={{
                  width: "92px",
                  fontSize: 13,
                  padding: "2px 5px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginTop: 2,
                  marginRight: 4,
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  background: "#fff",
                  border: "none",
                  color: "#C8373B",
                  fontWeight: 700,
                  fontSize: 17,
                  borderRadius: "50%",
                  width: 19,
                  height: 19,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notatka wewnętrzna */}
      <div style={style.formGroup}>
        <label style={style.label}>Notatka wewnętrzna:</label>
        <textarea
          name="notesInternal"
          rows="3"
          value={formState.notesInternal}
          onChange={handleChange}
          style={style.textarea}
          placeholder="Notatka dla kosmetologa"
        />
      </div>

      {/* Notatka dla klientki */}
      <div style={style.formGroup}>
        <label style={style.label}>Notatka dla klientki:</label>
        <textarea
          name="notesForClient"
          rows="3"
          value={formState.notesForClient}
          onChange={handleChange}
          style={style.textarea}
          placeholder="Notatka, którą otrzyma klientka"
        />
      </div>

      {/* Zalecenia pozabiegowe */}
      <div style={style.formGroup}>
        <label style={style.label}>Zalecenia pozabiegowe:</label>
        <textarea
          name="recommendationsText"
          rows="6"
          value={formState.recommendationsText}
          onChange={handleChange}
          style={style.textarea}
        />
      </div>

      {/* Przyciski */}
      <div style={style.buttonGroup}>
        <button type="button" onClick={onCancel} style={style.cancelButton}>
          Anuluj
        </button>
        <button type="button" onClick={handleSubmit} style={style.saveButton}>
          Zapisz zabieg
        </button>
      </div>
    </div>
  );
}
