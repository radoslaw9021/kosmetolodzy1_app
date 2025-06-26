import React from "react";
import "./star-border.css";

export function StarBorder({ children, className = "" }) {
  return (
    <div className={`star-border-outer ${className}`}>
      <div className="star-border-inner">{children}</div>
      <div className="star-border-glow" />
    </div>
  );
} 