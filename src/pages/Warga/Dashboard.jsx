import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HeroImage from "../../assets/Surat.jpeg"; 

export default function Dashboard() {
  const navigate = useNavigate();

  const daftarPersyaratan = [
    { judul: "Surat Nikah (NA)", syarat: ["KK dari kedua belah pihak"] },
    { judul: "Izin Keramaian", syarat: ["KTP pemohon hajatan", "KTP pemilik hiburan/organ"] },
    { judul: "Surat Kehilangan", syarat: ["Fotocopy KK", "Nomor STNK", "Nomor KTP", "Nomor KK"] },
    { judul: "Keterangan Domisili", syarat: ["KTP Asli & Fotocopy"] },
    { judul: "Pengantar Imunisasi Catin", syarat: ["KTP calon pengantin bersangkutan"] },
    { judul: "SKTM", syarat: ["KTP dan KK"] },
    { judul: "Kartu Keluarga (KK) Baru", syarat: ["KK Lama", "KTP", "Buku Nikah"] },
    { judul: "Keterangan Kematian", syarat: ["KK Almarhum", "KTP Pelapor"] },
    { judul: "Izin Usaha (SKU)", syarat: ["KTP", "Keterangan jenis usaha yang dibuka"] },
    { judul: "Belum Pernah Menikah", syarat: ["KTP yang bersangkutan"] },
    { judul: "Tidak Memiliki Ijazah", syarat: ["KTP yang bersangkutan"] },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        
        {/* HERO SECTION */}
        <section className="flex flex-col md:flex-row items-center gap-12 mb-20 bg-white p-10 md:p-14 rounded-[50px] shadow-sm border border-slate-100">
          <div className="flex-1 text-[#0F172A]">
            <div className="inline-block bg-blue-50 text-[#1E3A8A] px-4 py-2 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
              Official Portal Desa
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.2] mb-6 uppercase tracking-tighter text-[#1E3A8A]">
              Layanan Digital <br /> 
              <span className="text-blue-600 italic text-3xl md:text-4xl">Mandiri & Terintegrasi</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 max-w-xl font-medium">
              Silakan gunakan layanan online untuk pengajuan cepat, atau cek persyaratan dokumen di bawah ini untuk pengurusan langsung di kantor desa.
            </p>
            <button 
              onClick={() => navigate("/buat-surat")}
              className="bg-[#1E3A8A] hover:bg-blue-800 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest"
            >
              Ajukan Surat Online ➔
            </button>
          </div>
          <div className="flex-1 w-full relative">
            <div className="w-full h-[350px] bg-slate-200 rounded-[45px] overflow-hidden shadow-2xl border-8 border-white">
              <img src={HeroImage} alt="Hero" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* SECTION: PERSYARATAN LENGKAP */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h3 className="text-[#1E3A8A] font-black text-3xl uppercase tracking-wider leading-none">Persyaratan Dokumen</h3>
              <p className="text-slate-500 text-sm mt-3 font-medium italic">Siapkan dokumen berikut sebelum datang ke kantor desa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daftarPersyaratan.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#1E3A8A] font-bold text-xs">{index + 1}</div>
                  <h4 className="font-bold text-[#1E3A8A] uppercase tracking-tight text-sm">{item.judul}</h4>
                </div>
                <ul className="space-y-2">
                  {item.syarat.map((s, i) => (
                    <li key={i} className="text-slate-500 text-xs flex items-start gap-2 font-medium">
                      <span className="text-[#1E3A8A]">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* INFO TAMBAHAN: TANDA TANGAN */}
        <section className="bg-[#1E3A8A] p-10 rounded-[45px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-200">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Sistem Validasi Digital</h3>
            <p className="text-blue-100 text-sm leading-relaxed font-medium">
              Seluruh surat yang diterbitkan dapat ditandatangani secara langsung maupun digital oleh **Kakon** atau **Sekdes**, menjamin keabsahan dokumen Anda di mata hukum.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center w-32">
              <p className="text-[10px] font-black uppercase opacity-60 mb-1">Otoritas 1</p>
              <p className="font-bold text-sm uppercase">Kakon</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center w-32">
              <p className="text-[10px] font-black uppercase opacity-60 mb-1">Otoritas 2</p>
              <p className="font-bold text-sm uppercase">Sekdes</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}