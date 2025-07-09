import React from "react";

// images: [{ url, label, date }]
export default function ImageGalleryModal({ images, openIndex, onClose }) {
  const [idx, setIdx] = React.useState(openIndex ?? 0);

  React.useEffect(() => {
    setIdx(openIndex ?? 0);
  }, [openIndex]);

  if (!images || images.length === 0 || openIndex === null) return null;

  const prevImg = () => setIdx((i) => (i > 0 ? i - 1 : i));
  const nextImg = () => setIdx((i) => (i < images.length - 1 ? i + 1 : i));
  const img = images[idx];

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.83)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "94vw",
          maxHeight: "92vh",
          paddingBottom: 36,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.url}
          alt={img.label || `Zdjęcie ${idx + 1}`}
          style={{
            maxWidth: "94vw",
            maxHeight: "76vh",
            borderRadius: "12px",
            boxShadow: "0 2px 14px rgba(0,0,0,0.2)",
            background: "#fff",
            display: "block",
          }}
        />

        {/* Podpis, data, numeracja */}
        <div
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            marginTop: 18,
            lineHeight: 1.5,
            textShadow: "0 2px 8px #0007",
          }}
        >
          {img.label && <b>{img.label}</b>}{" "}
          {img.date && (
            <span style={{ fontWeight: 400, fontSize: 15, marginLeft: 12 }}>
              {img.date}
            </span>
          )}
          <div style={{ fontWeight: 400, fontSize: 14, opacity: 0.86 }}>
            Zdjęcie {idx + 1} z {images.length}
          </div>
        </div>

        <button
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 34,
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          ✕
        </button>
        {idx > 0 && (
          <button
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(30,30,30,0.5)",
              border: "none",
              color: "#fff",
              fontSize: 42,
              borderRadius: "50%",
              width: 46,
              height: 46,
              cursor: "pointer",
            }}
            onClick={prevImg}
          >
            &#8592;
          </button>
        )}
        {idx < images.length - 1 && (
          <button
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(30,30,30,0.5)",
              border: "none",
              color: "#fff",
              fontSize: 42,
              borderRadius: "50%",
              width: 46,
              height: 46,
              cursor: "pointer",
            }}
            onClick={nextImg}
          >
            &#8594;
          </button>
        )}
      </div>
    </div>
  );
}
