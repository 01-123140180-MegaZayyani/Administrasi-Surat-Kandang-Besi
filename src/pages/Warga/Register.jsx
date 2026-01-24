import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    nik: "",
    no_telp: "",
    password: "",
    confirmPassword: ""
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Konfirmasi kata sandi tidak cocok!");
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        nama_lengkap: formData.nama_lengkap,
        nik: formData.nik,
        no_telp: formData.no_telp,
        password: formData.password
      });
      alert("Pendaftaran Berhasil!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Pendaftaran Gagal. NIK sudah terdaftar atau server mati.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="text-center mb-6">
        <h1 className="text-[#1E3A8A] text-4xl font-black mb-1">SILADES</h1>
        <p className="text-slate-500 text-sm font-medium italic">Sistem Layanan Administrasi Desa</p>
      </div>

      <div className="max-w-md w-full bg-white p-2 rounded-xl">
        <form className="space-y-5" onSubmit={handleRegister}>
          <div>
            <label className="text-sm font-bold text-[#1E3A8A]">Nama Lengkap</label>
            <input required type="text" placeholder="Masukkan nama lengkap Anda" 
              className="w-full mt-2 bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})} />
          </div>

          <div>
            <label className="text-sm font-bold text-[#1E3A8A]">NIK (Nomor Induk Kependudukan)</label>
            <input required type="text" placeholder="Masukkan NIK Anda" 
              className="w-full mt-2 bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              onChange={(e) => setFormData({...formData, nik: e.target.value})} />
          </div>

          <div>
            <label className="text-sm font-bold text-[#1E3A8A]">Nomor Telepon</label>
            <input required type="text" placeholder="Masukkan nomor telepon" 
              className="w-full mt-2 bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              onChange={(e) => setFormData({...formData, no_telp: e.target.value})} />
          </div>

          <div>
            <label className="text-sm font-bold text-[#1E3A8A]">Kata Sandi</label>
            <input required type="password" placeholder="Masukkan kata sandi" 
              className="w-full mt-2 bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <div>
            <label className="text-sm font-bold text-[#1E3A8A]">Konfirmasi Kata Sandi</label>
            <input required type="password" placeholder="Masukkan ulang kata sandi" 
              className="w-full mt-2 bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
          </div>

          <button type="submit" className="w-full bg-[#1E3A8A] text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-100">
            Daftar Akun
          </button>
        </form>
        <p className="text-center text-sm mt-6">
          Sudah punya akun? <span onClick={() => navigate("/login")} className="text-[#1E3A8A] font-bold cursor-pointer underline">Masuk disini</span>
        </p>
      </div>
    </div>
  );
}