import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans p-6">
      <div className="max-w-md w-full">
        {/* Logo/Identity */}
        <div className="text-center mb-10">
          <div className="bg-[#1E3A8A] text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-100 font-black text-2xl">
            DS
          </div>
          <h2 className="text-[#1E3A8A] text-2xl font-black uppercase tracking-tighter">Masuk ke Portal</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Pelayanan Digital Desa Sukamaju</p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
          <form className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Induk Kependudukan (NIK)</label>
              <input 
                type="text" 
                placeholder="Masukkan 16 digit NIK"
                className="w-full mt-2 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A] transition-all outline-none placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kata Sandi</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full mt-2 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A] transition-all outline-none placeholder:text-slate-300"
              />
            </div>

            <button 
              type="button"
              onClick={() => navigate("/beranda")}
              className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              Masuk Sekarang ➔
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-xs font-medium">
              Belum punya akun? {" "}
              <Link to="/register" className="text-[#1E3A8A] font-black hover:underline uppercase tracking-tighter">Daftar Sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}