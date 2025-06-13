import React, { useState } from "react";
import GalleryThumbnails from "./GalleryThumbnails";
import ImageGalleryModal from "./ImageGalleryModal";
import BeforeAfterSlider from "./BeforeAfterSlider";

export default function TreatmentDetailsModal({
  open,
  onClose,
  treatment,
  onUpdateTreatment,
}) {
  if (!open || !treatment) return null;

  const [editNote, setEditNote] = useState(false);
  const [note, setNote] = useState(treatment.notesInternal || "");
  const [showGallery, setShowGallery] = useState({
    images: [],
    openIndex: null,
  });

  // Znajdź zdjęcia „przed” i „po” jeśli są
  const before = treatment.images?.find((img) =>
    img.label?.toLowerCase().includes("przed")
  );
  const after = treatment.images?.find((img) =>
    img.label?.toLowerCase().includes("po")
  );

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newImages = [
        ...(treatment.images || []),
        {
          url: reader.result,
          label: "",
          date: new Date().toISOString().slice(0, 10),
        },
      ];
      onUpdateTreatment({ ...treatment, images: newImages });
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const saveNote = () => {
    onUpdateTreatment({ ...treatment, notesInternal: note });
    setEditNote(false);
  };

  // Pobieranie zdjęcia
  const downloadImage = (img) => {
    const a = document.createElement("a");
    a.href = img.url;
    a.download = img.label || "zdjecie.jpg";
    a.click();
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.30)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          maxWidth: "690px",
          width: "96vw",
          maxHeight: "93vh",
          overflowY: "auto",
          padding: "2.2rem 2rem 1.5rem 2rem",
          boxShadow: "0 6px 36px 0 rgba(80,80,80,0.15)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            position: "absolute",
            right: 22,
            top: 18,
            background: "none",
            border: "none",
            fontSize: 28,
            cursor: "pointer",
            color: "#888",
          }}
          onClick={onClose}
        >
          ✕
        </button>

        <h2 style={{ margin: 0, marginBottom: 10 }}>{treatment.type}</h2>
        <div style={{ color: "#888", fontSize: "1rem", marginBottom: 15 }}>
          Data: {treatment.date}
        </div>

        {/* Suwak przed-po jeśli są oba zdjęcia */}
        {before && after && (
          <div style={{ marginBottom: 28 }}>
            <BeforeAfterSlider imageBefore={before} imageAfter={after} />
          </div>
        )}

        {/* Większe miniatury + przycisk „Pobierz” */}
        {treatment.images && treatment.images.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 500, marginBottom: 7 }}>Zdjęcia:</div>
            <div
              style={{
                display: "flex",
                gap: 18,
                flexWrap: "wrap",
              }}
            >
              {treatment.images.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.label || `Zdjęcie ${idx + 1}`}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 9,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
                      marginBottom: 4,
                      cursor: "pointer",
                      border: "2px solid #e9e9e9",
                    }}
                    onClick={() =>
                      setShowGallery({
                        images: treatment.images,
                        openIndex: idx,
                      })
                    }
                  />
                  <button
                    onClick={() => downloadImage(img)}
                    style={{
                      marginTop: 4,
                      background: "#232323",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "2px 11px",
                      fontSize: "0.93em",
                      cursor: "pointer",
                    }}
                  >
                    Pobierz
                  </button>
                  <span
                    style={{
                      fontSize: 13,
                      color: "#888",
                      marginTop: 2,
                      textAlign: "center",
                    }}
                  >
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
            {/* Możliwość dodania zdjęcia */}
            <input
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              style={{ margin: "18px 0 7px 0" }}
            />
          </div>
        )}

        {/* Notatka dla kosmetologa */}
        <div style={{ marginTop: 16, marginBottom: 15 }}>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>Notatka:</div>
          {editNote ? (
            <>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  borderRadius: 7,
                  border: "1px solid #ccc",
                  padding: 8,
                  marginBottom: 7,
                }}
              />
              <button
                style={{
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 18px",
                  marginRight: 6,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={saveNote}
              >
                Zapisz
              </button>
              <button
                style={{
                  background: "#ccc",
                  color: "#232323",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 16px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => setEditNote(false)}
              >
                Anuluj
              </button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 5 }}>
                {treatment.notesInternal || "Brak notatki"}
              </div>
              <button
                style={{
                  background: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "5px 13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => setEditNote(true)}
              >
                Edytuj notatkę
              </button>
            </>
          )}
        </div>

        {/* Przycisk pokaż zalecenia */}
        <div style={{ marginBottom: 13 }}>
          <button
            style={{
              background: "#eee",
              color: "#232323",
              border: "1px solid #bbb",
              borderRadius: 6,
              padding: "6px 13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() =>
              alert(
                Array.isArray(treatment.recommendations)
                  ? treatment.recommendations.join("\n")
                  : treatment.recommendationsText || "Brak zaleceń"
              )
            }
          >
            Pokaż wysłane zalecenia
          </button>
        </div>

        {/* Galeria modal (pełny ekran) */}
        <ImageGalleryModal
          images={showGallery.images}
          openIndex={showGallery.openIndex}
          onClose={() => setShowGallery({ images: [], openIndex: null })}
        />
      </div>
    </div>
  );
}
