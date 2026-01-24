import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- IMPORT COMPONENT LAYOUT ---
import AdminLayout from "./components/AdminLayout";

// --- IMPORT HALAMAN WARGA ---
import Login from "./pages/Warga/Login";
import Register from "./pages/Warga/Register";
import Dashboard from "./pages/Warga/Dashboard";
import BuatSurat from "./pages/Warga/BuatSurat";
import Profil from "./pages/Warga/Profil"; 
import FormulirSurat from "./pages/Warga/FormulirSurat";
import StatusSurat from "./pages/Warga/StatusSurat";

// --- IMPORT HALAMAN ADMIN ---
import AdminDashboard from "./pages/Admin/AdminDashboard"; 
import AdminPengajuan from "./pages/Admin/AdminPengajuan";
import AdminTemplate from "./pages/Admin/AdminTemplate";

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. HALAMAN UTAMA KE LOGIN */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 2. RUTE WARGA */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/beranda" element={<Dashboard />} />
        <Route path="/layanan" element={<BuatSurat />} />
        <Route path="/status" element={<StatusSurat />} />
        <Route path="/formulir-surat" element={<FormulirSurat />} />
        <Route path="/profil" element={<Profil />} />

        {/* 3. RUTE ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pengajuan" element={<AdminPengajuan />} />
          <Route path="template" element={<AdminTemplate />} />
        </Route>

        {/* 4. FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
// --- JANGAN TULIS APAPUN DI BAWAH INI! ---