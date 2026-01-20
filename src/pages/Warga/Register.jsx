import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans p-6 py-12">
      <div className="max-w-lg w-full">
        {/* Logo/Identity */}
        <div className="text-center mb-10">
          <h2 className="text-[#1E3A8A] text-2xl font-black uppercase tracking-tighter text-center">Buat Akun Warga</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Daftarkan diri Anda untuk akses layanan</p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-10 md:p-12 rounded-[50px] shadow-sm border border-slate-100">
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Nama Lengkap */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">Nama Lengkap (Sesuai KTP)</label>
                <input type="text" className="w-full mt-2 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A] outline-none" />
              </div>
              
              {/* NIK */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">NIK</label>
                <input type="text" className="w-full mt-2 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A] outline-none" />
              </div>

              {/* No Telepon */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">No. Telepon</label>
                <input type="text" className="w-full mt-2 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A] outline-none" />
              </div>

              {/* Kata Sandi Utama */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left block">Kata Sandi</label>
                <input 
                  type="password" 
                  placeholder="Buat sandi yang aman" 
                  className="w-full mt-2 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A] outline-none" 
                />
              </div>

              {/* KONFIRMASI KATA SANDI (KOLOM BARU) */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-[#1E3A8A] uppercase tracking-widest ml-1 text-left block">Konfirmasi Kata Sandi</label>
                <input 
                  type="password" 
                  placeholder="Ulangi kata sandi Anda" 
                  className="w-full mt-2 bg-slate-50 border-2 border-blue-50 rounded-2xl px-6 py-4 text-sm font-bold text-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A] outline-none" 
                />
              </div>
            </div>

            <button 
              type="button"
              className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 transition-all mt-6 active:scale-95"
            >
              Konfirmasi Pendaftaran
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-50 pt-8">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-tighter">
              Sudah punya akun? {" "}
              <Link to="/login" className="text-[#1E3A8A] font-black hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}