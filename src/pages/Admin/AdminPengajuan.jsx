import React, { useState } from "react";

export default function AdminPengajuan() {
  const [filter, setFilter] = useState("Menunggu");
  const [selectedSurat, setSelectedSurat] = useState(null);

  // Contoh Data Pengajuan
  const dataPengajuan = [
    { id: "SRT-001", nama: "Budi Santoso", jenis: "SKU", status: "Menunggu", tgl: "20 Jan 2026", nik: "1801234567", data: { usaha: "Warung Sembako", alamat: "RT 01 RW 02" } },
    { id: "SRT-002", nama: "Siti Aminah", jenis: "Domisili", status: "Diproses", tgl: "19 Jan 2026", nik: "1801987654", data: { keperluan: "Syarat Bank", alamat: "RT 05 RW 01" } },
    { id: "SRT-003", nama: "Agus Salim", jenis: "SKTM", status: "Selesai", tgl: "18 Jan 2026", nik: "1801554433", data: { alasan: "Beasiswa Anak", pendapatan: "1.000.000" } },
  ];

  const filteredData = dataPengajuan.filter(item => item.status === filter);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Admin (Anggap sudah ada) */}
      <div className="flex-1 p-8">
        
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-[#1E3A8A] text-3xl font-black uppercase tracking-tighter">Kelola Pengajuan</h2>
            <p className="text-slate-500 font-medium text-sm">Verifikasi dan proses surat permohonan warga.</p>
          </div>
          
          {/* FILTER TABS */}
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
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">ID / Nama Warga</th>
                <th>Jenis Surat</th>
                <th>Tanggal Masuk</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-600">
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="text-[10px] text-slate-400 mb-1">{item.id}</div>
                    <div className="text-[#1E3A8A]">{item.nama}</div>
                  </td>
                  <td><span className="bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-lg text-[10px] uppercase">{item.jenis}</span></td>
                  <td>{item.tgl}</td>
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
          {filteredData.length === 0 && (
            <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
              Tidak ada antrian di status ini
            </div>
          )}
        </div>
      </div>

      {/* SIDE-BY-SIDE VERIFICATION PANEL (Muncul saat Detail diklik) */}
      {selectedSurat && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-screen shadow-2xl animate-slide-left overflow-y-auto">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-[#1E3A8A] font-black text-xl uppercase tracking-tighter">Verifikasi Berkas</h3>
                <button onClick={() => setSelectedSurat(null)} className="text-slate-300 hover:text-red-500 font-black text-2xl">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-12">
                {/* Sisi Kiri: Data Form */}
                <div className="space-y-6 border-r border-slate-100 pr-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Informasi Pengaju</p>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase block">Nama & NIK</label>
                    <p className="font-bold text-[#1E3A8A]">{selectedSurat.nama} ({selectedSurat.nik})</p>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase block">Data Form ({selectedSurat.jenis})</label>
                    <div className="bg-slate-50 p-4 rounded-2xl mt-2">
                      {Object.entries(selectedSurat.data).map(([key, val]) => (
                        <p key={key} className="text-xs font-bold text-slate-600 mb-2">
                          <span className="uppercase text-[8px] text-slate-400 block">{key}</span> {val}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sisi Kanan: Action Admin */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Keputusan Admin</p>
                    <textarea 
                      placeholder="Tambahkan catatan (Contoh: Foto KTP tidak jelas)"
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-[#1E3A8A] outline-none h-32"
                    />
                  </div>

                  <div className="space-y-3 mt-8">
                    <button className="w-full bg-[#1E3A8A] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100">
                      Terbitkan Surat (TTD Digital)
                    </button>
                    <button className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-100">
                      Tolak Pengajuan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}