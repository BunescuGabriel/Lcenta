import { Navigate } from "react-router-dom";
import React from "react";

function ProtectedRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('accessToken') !== null;
  const isSuperuser = true;
  if (isAuthenticated && isSuperuser) {
    return children;
  }
  return <Navigate to="/login" />;
}

export default ProtectedRoute;