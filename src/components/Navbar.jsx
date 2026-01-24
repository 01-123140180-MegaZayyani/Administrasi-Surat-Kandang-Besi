import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [userName, setUserName] = useState("Tamu");

  useEffect(() => {
    const loadUser = () => {
      const saved = localStorage.getItem("user_profile");
      if (saved) {
        try {
          const userData = JSON.parse(saved);
          setUserName(userData.nama_lengkap || "User");
        } catch (error) {
          console.error("Error parsing user profile:", error);
        }
      } else {
        setUserName("Tamu");
      }
    };

    // Panggil saat pertama kali load
    loadUser();

    // Listener supaya kalau login di tab lain atau di halaman login sukses, navbar lgsg update
    window.addEventListener("storage", loadUser);
    
    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  return (
    <nav className="bg-[#1E3A8A] px-10 py-4 flex justify-between items-center shadow-lg sticky top-0 z-[9999]">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3">
        <div className="bg-white text-[#1E3A8A] p-2 rounded-lg font-black text-sm">DS</div>
        <div>
           <span className="text-white font-black block leading-none uppercase text-sm">DigitalDesa</span>
           <span className="text-white/70 text-[8px] uppercase tracking-widest font-bold">Pelayanan Publik</span>
        </div>
      </div>

      {/* Navigasi Utama */}
      <div className="flex items-center gap-8">
        <Link to="/beranda" className="text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all">
          Beranda
        </Link>
        <Link to="/layanan" className="text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all">
          Layanan Surat
        </Link>
        <Link to="/status" className="text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all">
          Status Surat
        </Link>

        {/* Profil yang BISA DIKLIK */}
        <Link to="/profil" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 transition-all cursor-pointer">
          <div className="w-7 h-7 bg-white text-[#1E3A8A] rounded-full flex items-center justify-center font-black text-xs uppercase shadow-sm">
            {userName.charAt(0)}
          </div>
          <span className="text-white text-[10px] font-black uppercase tracking-widest">
            {userName}
          </span>
        </Link>
      </div>
    </nav>
  );
}