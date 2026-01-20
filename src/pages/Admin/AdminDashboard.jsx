import React from "react";
import { FileText, Clock, CheckCircle, Users, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Pengajuan", count: "124", icon: <FileText size={20} />, color: "text-blue-600", border: "border-blue-100" },
    { label: "Perlu Diproses", count: "12", icon: <Clock size={20} />, color: "text-orange-600", border: "border-orange-100" },
    { label: "Selesai Hari Ini", count: "45", icon: <CheckCircle size={20} />, color: "text-green-600", border: "border-green-100" },
    { label: "Total Warga", count: "1.240", icon: <Users size={20} />, color: "text-indigo-600", border: "border-indigo-100" },
  ];

  return (
    <div className="p-10 bg-[#F8FAFC] min-h-screen">
      {/* HEADER */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-[#1E3A8A] text-3xl font-black uppercase tracking-tighter">Ringkasan Tugas</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Dashboard Kontrol Pelayanan Desa</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Status Sistem</p>
          <div className="flex items-center gap-2 justify-end mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[#1E3A8A] font-black text-xs uppercase">Terhubung</span>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <div key={i} className={`bg-white p-8 rounded-[30px] border ${s.border} shadow-sm transition-all hover:shadow-md group`}>
            <div className={`${s.color} mb-6 flex justify-between items-center`}>
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <ArrowUpRight size={16} className="text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
            <h3 className="text-[#1E3A8A] text-4xl font-black tracking-tighter leading-none">{s.count}</h3>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 flex justify-between items-center border-b border-slate-50">
          <h3 className="text-[#1E3A8A] font-black text-sm uppercase tracking-widest flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#1E3A8A] rounded-full"></span>
            Antrian Surat Terbaru
          </h3>
          <button className="bg-slate-50 hover:bg-slate-100 text-[#1E3A8A] px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
            Lihat Semua Berkas
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Nama Warga</th>
                <th className="py-6">Jenis Surat</th>
                <th className="py-6">Tanggal Pengajuan</th>
                <th className="px-10 py-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-600">
              <tr className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <td className="px-10 py-6 text-[#1E3A8A]">Budi Santoso</td>
                <td>
                  <span className="bg-blue-50 text-[#1E3A8A] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    Surat Keterangan Usaha
                  </span>
                </td>
                <td className="text-slate-400 font-medium">20 Jan 2026</td>
                <td className="px-10 py-6 text-right">
                  <button className="bg-[#1E3A8A] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-blue-100 opacity-0 group-hover:opacity-100 transition-all">
                    Verifikasi Berkas
                  </button>
                </td>
              </tr>
              {/* Row lainnya... */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}