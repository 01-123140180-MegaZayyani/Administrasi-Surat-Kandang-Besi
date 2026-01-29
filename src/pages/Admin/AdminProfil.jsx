import React, { useState, useEffect } from "react";
import api from "../../utils/api"
import NavbarAdmin from "../../components/NavbarAdmin";

export default function AdminProfil() {
  const [adminData, setAdminData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  useEffect(() => {
    const saved = localStorage.getItem("profil");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.role !== 'admin') return window.location.href = "/login";
      setAdminData(data);
      setFormData({ username: data.username, password: "" });
    }
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await api.put("/api/admin/update-profil", { ...formData, id: adminData.id });
      localStorage.setItem("profil", JSON.stringify(res.data.profil));
      setAdminData(res.data.profil);
      setIsEditing(false);
      alert("Berhasil Diupdate!");
    } catch (err) { alert("Gagal!"); }
  };

  if (!adminData) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarAdmin />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">A</div>
            <div>
              <h1 className="text-xl font-bold">Profil Administrator</h1>
              <p className="text-slate-400 text-sm">Kelola akun akses desa</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Username</label>
              {isEditing ? (
                <input className="w-full p-3 bg-slate-50 rounded-lg mt-1 border" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
              ) : ( <p className="text-lg font-semibold p-3 bg-slate-50 rounded-lg mt-1">{adminData.username}</p> )}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
              {isEditing ? (
                <input type="password" placeholder="Isi untuk ganti" className="w-full p-3 bg-slate-50 rounded-lg mt-1 border" onChange={(e) => setFormData({...formData, password: e.target.value})} />
              ) : ( <p className="p-3 bg-slate-50 rounded-lg mt-1 text-slate-300">••••••••</p> )}
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            {isEditing ? (
              <><button onClick={handleUpdate} className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold">Simpan</button>
              <button onClick={() => setIsEditing(false)} className="bg-slate-100 px-6 py-2 rounded-lg">Batal</button></>
            ) : ( <button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white px-6 py-2 rounded-lg">Edit Profil</button> )}
          </div>
        </div>
      </div>
    </div>
  );
}