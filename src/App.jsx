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

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. REDIRECT OTOMATIS SAAT BUKA WEB */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 2. RUTE UNTUK WARGA (Tanpa Sidebar Admin) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/beranda" element={<Dashboard />} />
        <Route path="/buat-surat" element={<BuatSurat />} />
        <Route path="/formulir-surat" element={<FormulirSurat />} />
        <Route path="/status-surat" element={<StatusSurat />} />
        <Route path="/profil" element={<Profil />} />

        {/* 3. RUTE UNTUK ADMIN (Dibungkus AdminLayout yang ada Sidebar-nya) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Akses via: /admin/dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Akses via: /admin/pengajuan */}
          <Route path="pengajuan" element={<AdminPengajuan />} />
        </Route>

        {/* 4. FALLBACK (Jika URL ngawur, balik ke login) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;