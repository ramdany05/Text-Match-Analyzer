import { Navigate, Outlet } from "react-router";

/**
 * Memeriksa apakah user sudah login (memiliki token).
 * Jika ya, render halaman tujuan (Outlet).
 * Jika tidak, redirect ke halaman login.
 */
export function ProtectedRoute() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
