import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, CheckCircle, ChevronDown } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState({ 1: "menunggu" });

  // Statistik dikurangi menjadi 3 kolom agar lebih luas dan rata
  const stats = [
    { label: "Total Pengajuan", count: "124", icon: <FileText size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Perlu Diproses", count: "12", icon: <Clock size={20} />, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Selesai Hari Ini", count: "45", icon: <CheckCircle size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const handleStatusChange = (id, newStatus, wargaData) => {
    setStatuses(prev => ({ ...prev, [id]: newStatus }));
    
    // Jika status "Selesai", otomatis arahkan ke template surat sesuai data warga
    if (newStatus === "selesai") {
      navigate("/admin/template", { state: { warga: wargaData } });
    }
  };

  return (
    <div className="p-10 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER DASHBOARD */}
        <div className="text-left">
          <h2 className="text-[#1E3A8A] text-2xl font-black uppercase tracking-tighter">Ringkasan Tugas</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Pemerintah Pekon Kandang Besi</p>
        </div>

        {/* 1. KARTU STATISTIK - SEKARANG 3 KOLOM (LEBIH RAPI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm flex items-center justify-between h-36 transition-all hover:shadow-md">
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <h3 className="text-[#1E3A8A] text-4xl font-black">{s.count}</h3>
              </div>
              <div className={`p-5 rounded-2xl ${s.bg} ${s.color}`}>
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* 2. TABEL ANTRIAN - POSISI RATA & PRESISI */}
        <div className="bg-white rounded-[45px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-12 py-8 border-b border-slate-50 flex justify-between items-center bg-white">
            <h3 className="text-[#1E3A8A] font-black uppercase text-[11px] tracking-[0.2em]">Antrian Pengajuan Terbaru</h3>
            <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 bg-emerald-50 px-4 py-1.5 rounded-full uppercase">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Sistem Terhubung
            </div>
          </div>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
                <th className="px-12 py-6 text-left w-1/3">Informasi Warga</th>
                <th className="py-6 text-left w-1/4">Layanan Surat</th>
                <th className="py-6 text-left w-1/4">Tanggal Masuk</th>
                <th className="px-12 py-6 text-right w-1/4">Update Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-600">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-12 py-8 text-left">
                  <div className="flex flex-col">
                    <span className="text-[#1E3A8A] text-base mb-1">Rusdi</span>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wider">NIK: 1806251010820003</span>
                  </div>
                </td>
                <td className="text-left">
                  <span className="bg-[#1E3A8A]/5 text-[#1E3A8A] px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest">
                    Domisili
                  </span>
                </td>
                <td className="text-left text-slate-400 font-medium">20 Jan 2026</td>
                <td className="px-12 py-8 text-right">
                  {/* DROPDOWN AKSI DENGAN WARNA SINKRON */}
                  <div className="relative inline-block text-left">
                    <select 
                      value={statuses[1]}
                      onChange={(e) => handleStatusChange(1, e.target.value, { 
                        nama: "Rusdi", 
                        nik: "1806251010820003",
                        pekerjaan: "Petani/Pekebun" 
                      })}
                      className={`
                        appearance-none pl-6 pr-12 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border transition-all cursor-pointer outline-none
                        ${statuses[1] === "menunggu" ? "bg-slate-50 border-slate-200 text-slate-400" : ""}
                        ${statuses[1] === "proses" ? "bg-amber-50 border-amber-200 text-amber-600" : ""}
                        ${statuses[1] === "selesai" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : ""}
                        ${statuses[1] === "ditolak" ? "bg-rose-50 border-rose-200 text-rose-600" : ""}
                      `}
                    >
                      <option value="menunggu">Menunggu</option>
                      <option value="proses">Proses</option>
                      <option value="selesai">Selesai</option>
                      <option value="ditolak">Ditolak</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}