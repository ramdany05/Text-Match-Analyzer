import { Routes, Route } from "react-router";
import HomePage from "@/pages/home";
import HistoryPage from "@/pages/history";
import LoginPage from "@/pages/login";
import { ProtectedRoute } from "@/components/protected-route";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Semua route di dalam sini akan diproteksi */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
