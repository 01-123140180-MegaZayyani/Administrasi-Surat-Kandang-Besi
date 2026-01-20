import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path ? "text-white opacity-100" : "text-white/70 hover:text-white";

  return (
    <nav className="bg-[#1E3A8A] px-6 py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/beranda" className="flex items-center gap-3">
          <div className="bg-white text-[#1E3A8A] font-black px-3 py-1 rounded-lg">DS</div>
          <div className="text-white">
            <h1 className="font-black text-sm uppercase tracking-tighter">DigitalDesa</h1>
            <p className="text-[8px] font-bold uppercase tracking-widest opacity-70">Pelayanan Publik</p>
          </div>
        </Link>

        {/* MENU TENGAH */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/beranda" className={`text-[11px] font-black uppercase tracking-widest ${isActive('/beranda')}`}>Beranda</Link>
          <Link to="/buat-surat" className={`text-[11px] font-black uppercase tracking-widest ${isActive('/buat-surat')}`}>Layanan Surat</Link>
          <Link to="/status-surat" className={`text-[11px] font-black uppercase tracking-widest ${isActive('/status-surat')}`}>Status Surat</Link>
        </div>

        {/* USER PROFILE (DIPERBAIKI JADI LINK) */}
        <Link to="/profil" className="flex items-center gap-4">
          <div className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full flex items-center gap-3 border border-white/20 transition-all cursor-pointer">
            <div className="w-7 h-7 bg-white text-[#1E3A8A] rounded-full flex items-center justify-center font-black text-[10px]">
              B
            </div>
            <span className="text-white text-[11px] font-bold tracking-wide">Budi Santoso</span>
          </div>
        </Link>

      </div>
    </nav>
  );
}