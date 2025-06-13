import React from "react";

// images: [{ url, label, date }]
export default function GalleryThumbnails({ images = [], onClick, onRemove }) {
  if (!images.length) return <div style={{ color: "#aaa" }}>Brak zdjęć</div>;

  return (
    <div style={{ display: "flex", gap: 13, flexWrap: "wrap" }}>
      {images.map((img, i) => (
        <div
          key={i}
          style={{
            width: 76,
            height: 76,
            borderRadius: 11,
            overflow: "hidden",
            boxShadow: "0 2px 9px rgba(40,40,40,0.11)",
            background: "#faf9f8",
            cursor: "pointer",
            position: "relative",
            border: "2px solid #f2f2f2",
          }}
          onClick={() => onClick && onClick(i)}
          title={img.label ? img.label : `Zdjęcie ${i + 1}`}
        >
          <img
            src={img.url}
            alt={img.label || `Zdjęcie ${i + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {img.label && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.35)",
                color: "#fff",
                fontSize: 12,
                textAlign: "center",
                padding: "0 0 2px 0",
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              {img.label}
            </div>
          )}
          {onRemove && (
            <button
              type="button"
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
                width: 21,
                height: 21,
                cursor: "pointer",
                zIndex: 2,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(i);
              }}
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
