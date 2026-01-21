import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";

export default function AdminTemplate() {
  const location = useLocation();
  const dataWarga = location.state?.warga || {};

  // State untuk Form Input Manual
  const [formData, setFormData] = useState({
    nomorSurat: "470 / ___ / 60.2005 / ___ / 2026",
    nama: dataWarga.nama || "",
    nik: dataWarga.nik || "",
    ttl: dataWarga.ttl || "Kandang Besi, __-__-____",
    kelamin: dataWarga.kelamin || "Laki-Laki",
    pekerjaan: dataWarga.pekerjaan || "Petani/Pekebun",
    agama: "Islam",
    alamat: dataWarga.alamat || "Pekon Kandang Besi Kec. Kotaagung Barat",
    tglSurat: "13 Januari 2026", // Tanggal surat manual
    jenisSurat: "domisili", 
    isiTambahan: "JUAL BELI HASIL BUMI", // Untuk SKU
    penandatangan: "MUKHTAR" 
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans print:bg-white">
      
      {/* KIRI: PANEL INPUT (KETIK MANUAL) - Sembunyi saat print */}
      <div className="w-1/3 bg-white border-r border-slate-200 overflow-y-auto p-8 shadow-xl z-10 print:hidden">
        <div className="flex items-center gap-4 mb-8 text-left">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-all text-[#1E3A8A]">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-[#1E3A8A] font-black uppercase text-sm tracking-widest text-left">Input Data Surat</h2>
        </div>

        <div className="space-y-5 text-left">
          {/* Pilih Jenis Template */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pilih Template</label>
            <select 
              value={formData.jenisSurat}
              onChange={(e) => setFormData({...formData, jenisSurat: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none"
            >
              <option value="domisili">Surat Keterangan Domisili</option>
              <option value="sku">Surat Keterangan Usaha (SKU)</option>
            </select>
          </div>

          <hr className="border-slate-100" />

          {/* Form Ketik Manual */}
          {[
            { label: "Nomor Surat", key: "nomorSurat" },
            { label: "Tanggal Surat (Manual)", key: "tglSurat" },
            { label: "Nama Lengkap", key: "nama" },
            { label: "NIK", key: "nik" },
            { label: "Tempat, Tanggal Lahir", key: "ttl" },
            { label: "Pekerjaan", key: "pekerjaan" },
            { label: "Agama", key: "agama" },
          ].map((item) => (
            <div key={item.key}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{item.label}</label>
              <input 
                type="text" 
                value={formData[item.key]}
                onChange={(e) => setFormData({...formData, [item.key]: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
              />
            </div>
          ))}

          {formData.jenisSurat === "sku" && (
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama/Jenis Usaha (Untuk SKU)</label>
              <input 
                type="text" 
                value={formData.isiTambahan}
                onChange={(e) => setFormData({...formData, isiTambahan: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none"
              />
            </div>
          )}
        </div>

        <button 
          onClick={handlePrint}
          className="w-full mt-10 bg-[#1E3A8A] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg"
        >
          <Printer size={16} /> Cetak Surat Sekarang
        </button>
      </div>

      {/* KANAN: PREVIEW SURAT */}
      <div className="flex-1 overflow-y-auto p-12 flex justify-center bg-slate-100 print:p-0 print:bg-white">
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[20mm] text-black relative print:shadow-none" style={{ fontFamily: 'Times New Roman' }}>
          
          {/* KOP SURAT */}
          <div className="text-center border-b-4 border-black pb-2 mb-8">
            <h1 className="text-xl font-bold leading-tight uppercase">Pemerintah Kabupaten Tanggamus</h1>
            <h1 className="text-xl font-bold leading-tight uppercase">Kecamatan Kotaagung Barat</h1>
            <h1 className="text-2xl font-bold leading-tight uppercase">Pekon Kandang Besi</h1>
            <p className="text-[11px] italic">Alamat : Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kode Pos 35651</p>
          </div>

          {/* JUDUL SURAT */}
          <div className="text-center mb-10">
            <h2 className="text-base font-bold underline uppercase tracking-widest">
              {formData.jenisSurat === "domisili" ? "Surat Keterangan Domisili" : "Surat Keterangan Usaha"}
            </h2>
            <p className="text-[12pt]">Nomor : {formData.nomorSurat}</p>
          </div>

          {/* ISI SURAT */}
          <div className="text-[12pt] leading-relaxed text-justify space-y-6">
            <p>Yang bertanda tangan dibawah ini Kepala Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus, dengan ini menerangkan bahwa :</p>
            
            <div className="ml-10 space-y-1">
              <div className="flex w-full"><span className="w-44 uppercase">Nama</span><span>: {formData.nama}</span></div>
              <div className="flex w-full"><span className="w-44 uppercase">No NIK</span><span>: {formData.nik}</span></div>
              <div className="flex w-full"><span className="w-44 uppercase">Tempat, Tgl Lahir</span><span>: {formData.ttl}</span></div>
              <div className="flex w-full"><span className="w-44 uppercase">Jenis Kelamin</span><span>: {formData.kelamin}</span></div>
              <div className="flex w-full"><span className="w-44 uppercase">Pekerjaan</span><span>: {formData.pekerjaan}</span></div>
              <div className="flex w-full"><span className="w-44 uppercase">Agama</span><span>: {formData.agama}</span></div>
              <div className="flex w-full items-start"><span className="w-44 uppercase">Alamat</span><span className="flex-1">: {formData.alamat}</span></div>
            </div>

            {formData.jenisSurat === "domisili" ? (
              <p>Adalah benar bertempat tinggal lebih dari 3 (tiga) tahun berturut-turut dan benar berdomisili di Pekon Kandang Besi Kecamatan Kotaagung Barat Kabupaten Tanggamus.</p>
            ) : (
              <div className="space-y-4">
                <p>Nama tersebut diatas adalah penduduk Pekon Kandang Besi yang bertempat tinggal di wilayah Kandang Besi.</p>
                <p>Nama tersebut diatas membuka usaha “{formData.isiTambahan}” yang berlokasi di wilayah Pekon Kandang Besi sejak tahun 2021 sampai berjalan saat ini.</p>
              </div>
            )}

            <p>Demikian surat keterangan ini dibuat agar dapat digunakan sebagaimana mestinya.</p>
          </div>

          {/* TANDA TANGAN */}
          <div className="mt-16 ml-auto w-72 text-center">
            <p>Kandang Besi, {formData.tglSurat}</p>
            <p className="font-bold uppercase mb-24">Kepala Pekon Kandang Besi</p>
            <p className="font-bold underline uppercase">{formData.penandatangan}</p>
          </div>
        </div>
      </div>
    </div>
  );
}