import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, FileCode, LogOut } from "lucide-react";

export default function AdminHeader() {
  const location = useLocation();
  
  // Fungsi styling untuk menu aktif
  const isActive = (path) => 
    location.pathname === path 
      ? "text-white border-b-2 border-white" 
      : "text-blue-200 hover:text-white transition-all";

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminData');
    localStorage.removeItem('isAdmin');
    navigate('/admin/login'); // BUKAN /login
  };

  return (
    <nav className="bg-[#1E3A8A] px-10 py-5 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* 1. SISI KIRI: BRANDING (Pekon Kandang Besi) */}
        <div className="flex flex-col w-1/4">
          <span className="text-white font-black text-xl tracking-tighter leading-none">ADMINPORTAL</span>
          <span className="text-[8px] text-blue-300 font-bold uppercase tracking-[0.3em] mt-1">
            Pekon Kandang Besi
          </span>
        </div>

        {/* 2. SISI TENGAH: NAVIGASI UTAMA (Centering) */}
        <div className="flex gap-10 items-center justify-center flex-1">
          <Link to="/admin/dashboard" className={`flex items-center gap-2 pb-1 text-[11px] font-black uppercase tracking-[0.2em] ${isActive('/admin/dashboard')}`}>
            <LayoutDashboard size={16} strokeWidth={3} /> DASHBOARD
          </Link>
          
          <Link to="/admin/pengajuan" className={`flex items-center gap-2 pb-1 text-[11px] font-black uppercase tracking-[0.2em] ${isActive('/admin/pengajuan')}`}>
            <FileText size={16} strokeWidth={3} /> PENGAJUAN
          </Link>
          
          <Link to="/admin/template" className={`flex items-center gap-2 pb-1 text-[11px] font-black uppercase tracking-[0.2em] ${isActive('/admin/template')}`}>
            <FileCode size={16} strokeWidth={3} /> TEMPLATE SURAT
          </Link>
        </div>

        {/* 3. SISI KANAN: LOGOUT */}
        <div className="flex justify-end w-1/4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-600 text-red-100 hover:text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20">
            <LogOut size={14} /> KELUAR SISTEM
          </button>
        </div>

      </div>
    </nav>
  );
}