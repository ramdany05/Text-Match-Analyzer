import { Navigate } from "react-router";

export function NotFoundRedirect() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/login" replace />;
}
