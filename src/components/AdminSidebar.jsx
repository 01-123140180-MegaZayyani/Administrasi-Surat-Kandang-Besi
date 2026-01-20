import { LayoutDashboard, FileInput, Users, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="w-64 min-h-screen bg-[#1E3A8A] p-8 flex flex-col">
      <div className="mb-12">
        <h1 className="text-white font-black text-xl uppercase tracking-tighter">AdminPortal</h1>
        <p className="text-blue-300 text-[8px] font-black uppercase tracking-[0.3em]">Management System</p>
      </div>

      <nav className="flex-1 space-y-4">
        <Link to="/admin/dashboard" className="block text-white/70 hover:text-white font-black text-[10px] uppercase tracking-widest py-3">Dashboard</Link>
        <Link to="/admin/pengajuan" className="block text-white/70 hover:text-white font-black text-[10px] uppercase tracking-widest py-3">Daftar Pengajuan</Link>
        <Link to="/admin/warga" className="block text-white/70 hover:text-white font-black text-[10px] uppercase tracking-widest py-3">Data Warga</Link>
        <Link to="/admin/template" className="block text-white/70 hover:text-white font-black text-[10px] uppercase tracking-widest py-3">Template Surat</Link>
      </nav>

      <button className="bg-red-500/10 text-red-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-red-500/20">
        Keluar Sistem
      </button>
    </div>
  );
}