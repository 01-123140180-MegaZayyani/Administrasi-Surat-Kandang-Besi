import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, FileEdit, LogOut } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user_profile");
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Pengajuan", path: "/admin/pengajuan", icon: <FileText size={18} /> },
    { name: "Template Surat", path: "/admin/template", icon: <FileEdit size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* NAVBAR ATAS SESUAI GAMBAR */}
      <nav className="bg-[#2D4396] text-white px-12 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="font-black text-xl tracking-tighter">ADMINPORTAL</div>
          <div className="text-[10px] font-bold opacity-60 uppercase leading-none border-l pl-2 border-white/20">
            Pekon Kandang Besi
          </div>
        </div>

        {/* MENU TENGAH */}
        <div className="flex items-center gap-8">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all pb-1 border-b-2 ${
                location.pathname === item.path ? "border-white opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </div>

        {/* TOMBOL KELUAR */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
        >
          <LogOut size={14} /> Keluar Sistem
        </button>
      </nav>

      {/* KONTEN */}
      <main className="p-12">
        <Outlet />
      </main>
    </div>
  );
}