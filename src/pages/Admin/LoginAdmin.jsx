import { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, User } from "lucide-react";

export default function LoginAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("https://backend-administrasi-surat-kandang-two.vercel.app/api/admin/login", {
        username,
        password,
      });
      
      if (res.data.isAdmin) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminData", JSON.stringify(res.data));
        alert("Akses Diterima! Selamat bekerja, Admin.");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Username atau Password salah! Hanya staf yang bisa masuk.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Portal Admin</h1>
          <p className="text-slate-400 text-sm mt-2">Sistem Informasi Layanan Desa</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Username Staf</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                placeholder="Masukkan username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="password"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E3A8A] text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
          >
            Masuk ke Dashboard
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    </div>
  );
}