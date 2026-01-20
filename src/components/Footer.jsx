import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#1E3A8A] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black tracking-tighter">SuratDesa</h2>
          <p className="text-blue-100 text-sm leading-relaxed opacity-80 max-w-xs">
            Solusi digitalisasi layanan publik untuk mempercepat administrasi kependudukan di tingkat desa.
          </p>
        </div>

        {/* Contact Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">Kontak Kami</h3>
          <ul className="space-y-3 text-sm text-blue-50">
            <li className="flex items-center gap-3">
              <span className="opacity-70">📍</span> Jl. Balai Desa No. 45
            </li>
            <li className="flex items-center gap-3">
              <span className="opacity-70">📞</span> +62 812-3456-7890
            </li>
            <li className="flex items-center gap-3">
              <span className="opacity-70">✉️</span> kontak@desaku.go.id
            </li>
          </ul>
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">Tautan</h3>
          <ul className="space-y-3 text-sm text-blue-50">
            <li><a href="#" className="hover:text-white transition-colors">• Profil Desa</a></li>
            <li><a href="#" className="hover:text-white transition-colors">• Regulasi</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-blue-400/30 text-center">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">
          © 2026 PORTAL RESMI SURATDESA.
        </p>
      </div>
    </footer>
  );
}