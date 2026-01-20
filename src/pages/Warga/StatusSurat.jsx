import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function StatusSurat() {
  // Contoh Data (Nantinya data ini diambil dari Database/API)
  const [daftarSurat] = useState([
    {
      id: "SRT-001",
      jenis: "Surat Keterangan Usaha (SKU)",
      tanggal: "18 Jan 2026",
      status: "Diproses", // Bisa: "Menunggu", "Diproses", "Selesai", "Ditolak"
      catatan: "Harap unggah foto lokasi usaha yang lebih jelas (tampak depan).",
      progres: 50,
    },
    {
      id: "SRT-002",
      jenis: "Surat Domisili",
      tanggal: "15 Jan 2026",
      status: "Selesai",
      catatan: "Surat sudah ditandatangani digital oleh Kakon. Silakan cetak mandiri.",
      progres: 100,
    }
  ]);

  // Fungsi Warna Status
  const getStatusStyle = (status) => {
    switch (status) {
      case "Selesai": return "bg-green-100 text-green-700";
      case "Diproses": return "bg-blue-100 text-[#1E3A8A]";
      case "Ditolak": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-[#1E3A8A] text-3xl font-black uppercase tracking-tighter">Status Pengajuan</h2>
          <p className="text-slate-500 font-medium italic mt-2 text-sm">Pantau progres surat dan lihat catatan petugas desa di sini.</p>
        </div>

        <div className="space-y-8">
          {daftarSurat.map((surat) => (
            <div key={surat.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="p-8 md:p-10">
                {/* Header Kartu */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{surat.id} • {surat.tanggal}</p>
                    <h3 className="text-xl font-black text-[#1E3A8A] uppercase tracking-tight">{surat.jenis}</h3>
                  </div>
                  <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(surat.status)}`}>
                    {surat.status}
                  </span>
                </div>

                {/* Garis Progres (Timeline) */}
                <div className="relative mb-10 pt-4">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#1E3A8A] transition-all duration-1000" 
                      style={{ width: `${surat.progres}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Diajukan</span>
                    <span>Verifikasi</span>
                    <span>Selesai</span>
                  </div>
                </div>

                {/* Box Catatan Petugas */}
                {surat.catatan && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-orange-600 font-black text-xs uppercase tracking-widest">Catatan Petugas :</span>
                    </div>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed italic">
                      "{surat.catatan}"
                    </p>
                  </div>
                )}

                {/* Tombol Aksi */}
                {surat.status === "Selesai" && (
                  <div className="mt-8 flex justify-end">
                    <button className="bg-[#1E3A8A] hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                      Cetak Surat (PDF)
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}