import React from "react";
import { Navigate } from "react-router-dom";

// Wrapper, który na podstawie isLoggedIn pokazuje dzieci lub przekierowuje na /login
export default function PrivateRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
