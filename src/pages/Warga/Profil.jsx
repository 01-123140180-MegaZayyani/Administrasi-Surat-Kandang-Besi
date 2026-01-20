import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Profil() {
  const userData = {
    nama: "BUDI SANTOSO",
    peran: "WARGA DESA SUKAMAJU",
    nik: "1801234567890001",
    alamat: "Jl. Balai Desa No. 45, Desa Sukamaju",
    telepon: "0812-3456-7890",
    email: "budi.santoso@email.com"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[45px] shadow-sm border border-slate-100 overflow-hidden relative">
          
          {/* HEADER PROFIL - Navy Blue */}
          <div className="bg-[#1E3A8A] pt-16 pb-20 px-12 text-center relative">
            <div className="w-28 h-28 bg-white text-[#1E3A8A] rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white/20 shadow-xl font-black text-4xl">
              B
            </div>
            <h2 className="text-white text-3xl font-black tracking-tighter uppercase">{userData.nama}</h2>
            <p className="text-blue-200 text-[10px] font-black tracking-[0.3em] uppercase mt-2">{userData.peran}</p>
          </div>

          {/* DATA DIRI SECTION */}
          <div className="p-10 md:p-14 -mt-8 bg-white rounded-t-[50px] relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor Induk Kependudukan (NIK)</label>
                <p className="text-[#1E3A8A] font-black text-xl tracking-tight">{userData.nik}</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat Sesuai KTP</label>
                <p className="text-slate-600 font-bold text-sm leading-relaxed">{userData.alamat}</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor Telepon aktif</label>
                <p className="text-slate-600 font-bold text-sm">{userData.telepon}</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat Email Terdaftar</label>
                <p className="text-slate-600 font-bold text-sm">{userData.email}</p>
              </div>

            </div>

            {/* ACTION BUTTONS - DIDESAIN ULANG */}
            <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Tombol Edit Utama */}
              <button className="w-full md:w-auto bg-[#1E3A8A] hover:bg-blue-900 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 transition-all active:scale-95">
                Update Profil Saya
              </button>

              {/* Tombol Logout - Dibuat Minimalis sebagai Link */}
              <button className="flex items-center gap-2 text-red-500 hover:text-red-700 font-black text-[10px] uppercase tracking-[0.2em] transition-all group">
                <span className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
                Keluar Dari Akun
              </button>

            </div>
          </div>
        </div>

        {/* INFO TAMBAHAN BAWAH */}
        <p className="text-center mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          Data diatas disinkronkan langsung dengan sistem kependudukan desa.
        </p>
      </main>

      <Footer />
    </div>
  );
}