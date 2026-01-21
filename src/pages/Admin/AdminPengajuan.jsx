import React, { useState } from "react";
import { X, User, MapPin, Briefcase, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminPengajuan() {
  const [filter, setFilter] = useState("Menunggu");
  const [selectedSurat, setSelectedSurat] = useState(null);

  // Contoh Data Pengajuan Lengkap (Simulasi data yang masuk dari form sebelumnya)
  const dataPengajuan = [
    { 
      id: "SRT-001", 
      nama: "Budi Santoso", 
      jenis: "SKU", 
      status: "Menunggu", 
      tgl: "20 Jan 2026", 
      nik: "1806180504640001", 
      data: { 
        ttl: "Kandang Besi, 05-04-1964",
        jenisKelamin: "Laki-Laki",
        agama: "Islam",
        pekerjaan: "Petani/Pekebun",
        alamatLengkap: "Pekon Kandang Besi, Kotaagung Barat",
        namaUsaha: "JUAL BELI HASIL BUMI",
        lokasiUsaha: "RT 02 Pekon Kandang Besi",
        fotoKtp: "https://via.placeholder.com/400x250?text=Preview+KTP+Budi" // Ganti dengan URL file asli
      } 
    },
    { 
      id: "SRT-002", 
      nama: "Siti Aminah", 
      jenis: "Domisili", 
      status: "Menunggu", 
      tgl: "19 Jan 2026", 
      nik: "180615402900004", 
      data: { 
        ttl: "Sanggi, 14-02-1990",
        jenisKelamin: "Perempuan",
        agama: "Islam",
        pekerjaan: "Mengurus Rumah Tangga",
        alamatLengkap: "Pekon Kandang Besi, Kotaagung Barat",
        fotoKtp: "https://via.placeholder.com/400x250?text=Preview+KTP+Siti"
      } 
    },
  ];

  const filteredData = dataPengajuan.filter(item => item.status === filter);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <div className="flex-1 p-8">
        
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-[#1E3A8A] text-3xl font-black uppercase tracking-tighter">Kelola Pengajuan</h2>
            <p className="text-slate-500 font-medium text-sm">Verifikasi data dan lampiran KTP warga.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {["Menunggu", "Diproses", "Selesai"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === tab ? "bg-[#1E3A8A] text-white shadow-lg" : "text-slate-400 hover:text-[#1E3A8A]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE DAFTAR SURAT */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden text-left">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Warga / NIK</th>
                <th>Jenis Surat</th>
                <th>Tanggal</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-600">
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="text-[#1E3A8A]">{item.nama}</div>
                    <div className="text-[10px] text-slate-400">{item.nik}</div>
                  </td>
                  <td><span className="bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-lg text-[10px] uppercase">{item.jenis}</span></td>
                  <td className="text-slate-400 font-medium">{item.tgl}</td>
                  <td className="text-center">
                    <button 
                      onClick={() => setSelectedSurat(item)}
                      className="bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Buka Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL VERIFIKASI PANEL */}
      {selectedSurat && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-4xl bg-white h-screen shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Header Detail */}
            <div className="p-8 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <div>
                <h3 className="text-[#1E3A8A] font-black text-xl uppercase tracking-tighter">Lembar Verifikasi</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {selectedSurat.id}</p>
              </div>
              <button onClick={() => setSelectedSurat(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* SISI KIRI: DATA FORM */}
              <div className="space-y-8 text-left">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <User size={14} /> Identitas Pemohon
                  </h4>
                  <div className="grid grid-cols-1 gap-4 bg-slate-50 p-6 rounded-[30px]">
                    <DetailBox label="Nama Lengkap" value={selectedSurat.nama} />
                    <DetailBox label="NIK" value={selectedSurat.nik} />
                    <DetailBox label="Tempat, Tgl Lahir" value={selectedSurat.data.ttl} />
                    <div className="grid grid-cols-2 gap-4">
                        <DetailBox label="Jenis Kelamin" value={selectedSurat.data.jenisKelamin} />
                        <DetailBox label="Agama" value={selectedSurat.data.agama} />
                    </div>
                    <DetailBox label="Pekerjaan" value={selectedSurat.data.pekerjaan} />
                    <DetailBox label="Alamat" value={selectedSurat.data.alamatLengkap} />
                    
                    {/* Jika SKU tampilkan detail usaha */}
                    {selectedSurat.jenis === "SKU" && (
                        <div className="pt-4 border-t border-slate-200 mt-2 space-y-4">
                            <DetailBox label="Nama Usaha" value={selectedSurat.data.namaUsaha} color="text-emerald-600" />
                            <DetailBox label="Lokasi Usaha" value={selectedSurat.data.lokasiUsaha} />
                        </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SISI KANAN: LAMPIRAN KTP & AKSI */}
              <div className="space-y-8 text-left">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <ImageIcon size={14} /> Lampiran Foto KTP
                  </h4>
                  <div className="border-4 border-slate-50 rounded-[30px] overflow-hidden shadow-inner bg-slate-100">
                    {selectedSurat.data.fotoKtp ? (
                        <img 
                          src={selectedSurat.data.fotoKtp} 
                          alt="KTP" 
                          className="w-full h-auto hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="p-20 text-center text-slate-300 italic text-xs">Foto tidak diunggah</div>
                    )}
                  </div>
                  <p className="text-[9px] text-center text-slate-400 font-bold uppercase italic">Klik gambar untuk memperbesar</p>
                </div>

                {/* Tombol Keputusan */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex gap-3">
                    <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Verifikasi Sesuai
                    </button>
                    <button className="flex-1 bg-red-50 text-red-500 border border-red-100 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                      <AlertCircle size={16} /> Data Salah
                    </button>
                  </div>
                  <button className="w-full bg-[#1E3A8A] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100">
                    Terbitkan & Cetak Surat
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-komponen untuk tampilan detail agar rapi
function DetailBox({ label, value, color = "text-slate-700" }) {
  return (
    <div>
      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{label}</label>
      <p className={`text-xs font-bold ${color}`}>{value || "-"}</p>
    </div>
  );
}