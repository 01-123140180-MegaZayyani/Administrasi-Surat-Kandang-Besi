import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Import sidebar yang kita buat tadi

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar tetap di kiri */}
      <AdminSidebar />
      
      {/* Konten halaman admin akan muncul di Outlet ini */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}