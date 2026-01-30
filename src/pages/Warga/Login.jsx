import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { 
        nik: nik, 
        password: password 
      });
      
      localStorage.setItem("user_profile", JSON.stringify(res.data.user)); 
      localStorage.setItem("token", res.data.token);
      
      if (res.data.user.role === "admin") {
        alert("Login Admin Berhasil!");
        navigate("/admin/dashboard");
      } else {
        alert("Selamat Datang di SILADES!");
        navigate("/beranda");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Gagal masuk. Cek NIK dan kata sandi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="text-center mb-10">
        <h1 className="text-[#1E3A8A] text-5xl font-black mb-2">SILADES</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Sistem Layanan Administrasi Desa</p>
      </div>

      <div className="max-w-md w-full bg-white p-4">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="text-xs font-bold text-[#1E3A8A] uppercase">NIK</label>
            <input required type="text" placeholder="Masukkan NIK" value={nik} 
              onChange={(e) => setNik(e.target.value)}
              className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]"/>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1E3A8A] uppercase">Kata Sandi</label>
            <input required type="password" placeholder="Masukkan kata sandi" value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]"/>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl">
            {loading ? "Mengecek Data..." : "Masuk Sistem ➔"}
          </button>
        </form>
        <p className="text-center text-xs mt-10 text-slate-400">
          Warga baru? <span onClick={() => navigate("/register")} className="text-[#1E3A8A] font-bold cursor-pointer underline">Daftar Akun</span>
        </p>
      </div>
    </div>
  );
}