import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, X, Clock, Search } from "lucide-react";

export default function AdminPengajuan() {
  const [pengajuan, setPengajuan] = useState([]);

  // 1. Ambil data dari database
  const fetchPengajuan = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pengajuan");
      setPengajuan(res.data);
    } catch (err) {
      console.error("Gagal mengambil data");
    }
  };

  useEffect(() => {
    fetchPengajuan();
  }, []);

  // 2. Fungsi Update Status (Ini yang bikin berubah di Warga)
  const updateStatus = async (id, statusBaru) => {
    try {
      await axios.put(`http://localhost:5000/api/pengajuan/${id}`, { status: statusBaru });
      alert(`Status berhasil diubah menjadi ${statusBaru}`);
      fetchPengajuan(); // Refresh data setelah update
    } catch (err) {
      alert("Gagal memperbarui status");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">DATA PENGAJUAN SURAT</h1>
          <p className="text-slate-500 text-sm font-medium">Kelola permohonan surat warga Pekon Kandang Besi</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Warga / NIK</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Surat</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Saat Ini</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi Cepat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pengajuan.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <p className="font-bold text-slate-800 uppercase text-sm">{item.nama_warga}</p>
                  <p className="text-xs text-slate-400 font-medium">{item.nik_pengaju}</p>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-blue-50 text-[#1E3A8A] rounded-lg text-[10px] font-bold uppercase">
                    {item.jenis_surat}
                  </span>
                </td>
                <td className="p-6">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                    item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-600' : 
                    item.status === 'Ditolak' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => updateStatus(item.id, "Selesai")}
                      className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
                      title="Setujui & Selesai"
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      onClick={() => updateStatus(item.id, "Ditolak")}
                      className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-md shadow-rose-100"
                      title="Tolak Pengajuan"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}