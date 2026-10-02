import { Routes, Route } from "react-router";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import { ProtectedRoute } from "@/components/protected-route";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Semua route di dalam sini akan diproteksi */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
