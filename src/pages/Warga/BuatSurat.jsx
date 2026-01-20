import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function BuatSurat() {
  const navigate = useNavigate();

  // Daftar Jenis Surat - ID harus sama dengan case di FormulirSurat.jsx
  const jenisSurat = [
    { id: "domisili", nama: "Surat Keterangan Domisili", desc: "Keterangan tempat tinggal penduduk di desa" },
    { id: "sktm", nama: "Surat Keterangan Tidak Mampu (SKTM)", desc: "Untuk syarat bantuan pemerintah atau beasiswa" },
    { id: "sku", nama: "Surat Keterangan Usaha (SKU)", desc: "Syarat pengajuan modal atau izin usaha" },
    { id: "kelahiran", nama: "Surat Keterangan Kelahiran", desc: "Dasar pengurusan akta kelahiran" },
    { id: "kematian", nama: "Surat Keterangan Kematian", desc: "Bukti administratif pelaporan kematian" },
  ];

  // Mekanisme Pengajuan
  const mekanisme = [
    {
      no: 1,
      judul: "Menentukan Surat",
      desc: "Memilih surat online yang ingin diajukan.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      no: 2,
      judul: "Mengisi Formulir",
      desc: "Mengisi data diri dan lampiran persyaratan.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      no: 3,
      judul: "Menunggu Verifikasi",
      desc: "Operator desa akan memeriksa dokumen Anda.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      ),
    },
    {
      no: 4,
      judul: "Proses Selesai",
      desc: "Surat dapat diambil di kantor desa.",
      icon: (
        <svg className="w-10 h-10 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        
        {/* MEKANISME PENGAJUAN */}
        <section className="mb-24">
          <h2 className="text-[#1E3A8A] text-center text-2xl font-black uppercase tracking-[0.2em] mb-12">
            Mekanisme Pengajuan Surat Online
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {mekanisme.map((step) => (
              <div key={step.no} className="relative bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center flex flex-col items-center group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-4 right-4 w-7 h-7 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center text-[10px] font-black">
                  {step.no}
                </div>
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h4 className="text-[#1E3A8A] font-black text-sm uppercase tracking-wider mb-3">
                  {step.judul}
                </h4>
                <p className="text-slate-500 text-[11px] leading-relaxed font-semibold">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* LAYANAN SURAT (TERKONEKSI KE FORM) */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-[#1E3A8A] text-center text-2xl font-black uppercase tracking-[0.2em] mb-10">
            Layanan Surat Online
          </h2>

          <div className="space-y-4">
            {jenisSurat.map((surat) => (
              <button
                key={surat.id}
                // DISINI PERBAIKANNYA: Mengarahkan ke halaman formulir dengan state type
                onClick={() => navigate(`/formulir-surat?type=${surat.id}`, { state: { type: surat.id } })}
                className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white p-6 rounded-[25px] flex items-center justify-between group transition-all shadow-lg shadow-blue-900/10 active:scale-[0.99]"
              >
                <div className="text-left px-2">
                  <h4 className="font-black text-sm uppercase tracking-wide mb-1">{surat.nama}</h4>
                  <p className="text-blue-200 text-[10px] font-medium opacity-80">{surat.desc}</p>
                </div>
                
                <div className="bg-white/10 p-3 rounded-2xl group-hover:bg-white group-hover:text-[#1E3A8A] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}