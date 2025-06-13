import React, { useRef, useState } from "react";

// imageBefore, imageAfter: obiekty { url, label }
export default function BeforeAfterSlider({ imageBefore, imageAfter }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef();

  if (!imageBefore || !imageAfter) return null;

  const handleDrag = (e) => {
    const bounds = containerRef.current.getBoundingClientRect();
    let x = (e.touches ? e.touches[0].clientX : e.clientX) - bounds.left;
    let percent = Math.max(0, Math.min(1, x / bounds.width));
    setPos(percent * 100);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: 360,
        height: 240,
        margin: "auto",
        boxShadow: "0 2px 12px #0002",
        borderRadius: 12,
        overflow: "hidden",
        background: "#eee",
        userSelect: "none",
      }}
      onMouseDown={(e) => {
        window.onmousemove = handleDrag;
        window.onmouseup = () => (window.onmousemove = null);
        handleDrag(e);
      }}
      onTouchStart={(e) => {
        window.ontouchmove = handleDrag;
        window.ontouchend = () => (window.ontouchmove = null);
        handleDrag(e);
      }}
    >
      <img
        src={imageAfter.url}
        alt={imageAfter.label}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          left: 0,
          top: 0,
        }}
      />
      <img
        src={imageBefore.url}
        alt={imageBefore.label}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          left: 0,
          top: 0,
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          transition: "clip-path 0.07s",
        }}
      />
      {/* Suwak */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${pos}%`,
          width: 4,
          height: "100%",
          background: "#C8373B",
          cursor: "ew-resize",
          zIndex: 2,
          boxShadow: "0 0 8px #0002",
        }}
      />
      {/* Opisy */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: 16,
          color: "#fff",
          background: "#222a",
          padding: "2px 12px",
          borderRadius: 7,
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {imageBefore.label || "Przed"}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 16,
          color: "#fff",
          background: "#222a",
          padding: "2px 12px",
          borderRadius: 7,
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {imageAfter.label || "Po"}
      </div>
    </div>
  );
}
