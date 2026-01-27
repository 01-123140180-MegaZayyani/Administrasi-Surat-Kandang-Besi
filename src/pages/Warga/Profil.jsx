import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function Profil() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Ambil data saat pertama kali buka halaman
  useEffect(() => {
    const savedData = localStorage.getItem("profil"); // Sesuaikan key localStorage Anda
    if (savedData) {
      const data = JSON.parse(savedData);
      setUserData(data);
      setFormData(data);
    }
  }, []);

  const handleUpdate = async () => {
    try {
      // Kirim formData lengkap termasuk ID ke backend
      const res = await axios.put("http://localhost:5000/api/auth/update-profil", {
        ...formData,
        id: userData.id 
      });

      // Update State dan LocalStorage dengan data terbaru dari server
      const updatedUser = { ...userData, ...res.data.profil };
      setUserData(updatedUser);
      localStorage.setItem("profil", JSON.stringify(updatedUser));
      
      setIsEditing(false);
      alert("Profil Berhasil Diperbarui!");
      
      // Trigger update navbar jika perlu
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Gagal memperbarui profil");
    }
  };

  if (!userData) return <div className="p-10 text-center font-black">Memuat Profil...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-[#1E3A8A] rounded-[50px] overflow-hidden shadow-2xl">
          {/* Header Profil */}
          <div className="pt-20 pb-24 text-center text-white">
            <div className="w-32 h-32 bg-white text-[#1E3A8A] rounded-full flex items-center justify-center mx-auto mb-6 font-black text-5xl">
              {userData.nama_lengkap?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">{userData.nama_lengkap}</h2>
            <p className="text-blue-200 text-[10px] font-black tracking-[0.4em] uppercase">WARGA</p>
          </div>

          {/* Form Detail */}
          <div className="bg-white mx-4 mb-4 rounded-[45px] p-12 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIK</label>
                <p className="text-[#1E3A8A] font-black text-xl">{userData.nik}</p>
              </div>

              {[
                { label: "Nama Lengkap", name: "nama_lengkap", type: "text" },
                { label: "Pekerjaan", name: "pekerjaan", type: "text" },
                { label: "Agama", name: "agama", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Nomor Telepon", name: "no_hp", type: "text" },
                { label: "Alamat Lengkap", name: "alamat", type: "text" },
              ].map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                  {isEditing ? (
                    <input 
                      type={field.type}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold text-[#1E3A8A] outline-none focus:border-blue-500" 
                      value={formData[field.name] || ""} 
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} 
                    />
                  ) : (
                    <p className="text-slate-600 font-bold text-sm bg-slate-50 p-3 rounded-xl">
                      {field.name === "password" ? "********" : (userData[field.name] || "-")}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Tombol Aksi */}
            <div className="mt-12 flex gap-4 border-t pt-8 items-center justify-between">
              {isEditing ? (
                <div className="flex gap-4">
                  <button onClick={handleUpdate} className="bg-green-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Simpan</button>
                  <button onClick={() => { setIsEditing(false); setFormData(userData); }} className="bg-slate-100 text-slate-400 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Batal</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="bg-[#1E3A8A] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Edit Profil</button>
              )}
              <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="text-red-500 font-black text-[10px] uppercase tracking-widest hover:underline">Keluar Akun</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}