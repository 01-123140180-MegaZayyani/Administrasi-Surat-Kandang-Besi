import React, { useState } from "react";

const AdminTemplate = () => {
  const [selectedType, setSelectedType] = useState('domisili');
  
  // State Data Surat (Satu untuk semua agar praktis)
  const [formData, setFormData] = useState({
    nomor: "001/SK/2026",
    nama: "NAMA LENGKAP",
    nik: "1234567890123456",
    ttl: "Jakarta, 01-01-1990",
    jk: "Laki-laki",
    alamat: "Alamat Lengkap RT/RW Desa...",
    keperluan: "Keperluan pembuatan surat...",
    ket: "Keterangan tambahan jika ada...",
    tgl_surat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- KOMPONEN KERTAS SURAT (POLOS TANPA TITIK-TITIK) ---
  const SuratWrapper = ({ judul, children }) => (
    <div className="bg-white w-[794px] min-h-[1123px] shadow-2xl p-16 text-black font-serif border border-slate-300 mx-auto animate-in fade-in duration-500">
      {/* KOP SURAT */}
      <div className="text-center border-b-4 border-black pb-2 mb-10">
        <h1 className="text-xl font-bold uppercase leading-tight text-slate-900">Pemerintah Kabupaten Sidoarjo</h1>
        <h1 className="text-xl font-bold uppercase leading-tight text-slate-900">Kecamatan Waru - Desa Tropodo</h1>
        <p className="text-xs italic font-sans mt-1 text-slate-600">Jl. Raya Tropodo No. 123, Telp: (031) 1234567</p>
      </div>

      {/* JUDUL */}
      <div className="text-center mb-10">
        <h2 className="text-lg font-bold underline uppercase">{judul}</h2>
        <div className="flex justify-center items-center gap-1 mt-1">
          <span className="text-sm">Nomor:</span>
          <input name="nomor" value={formData.nomor} onChange={handleInput} className="outline-none text-sm w-40 bg-slate-50/50 hover:bg-slate-100 px-1" />
        </div>
      </div>

      {/* ISI */}
      <div className="text-[14px] space-y-6 leading-relaxed">
        <p>Yang bertanda tangan di bawah ini, Kepala Desa Tropodo menerangkan bahwa:</p>
        <div className="ml-10 space-y-2">
          {children}
        </div>
        <p className="indent-10">Demikian surat keterangan ini dibuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.</p>
      </div>

      {/* TANDA TANGAN */}
      <div className="mt-20 flex justify-end">
        <div className="text-center w-64 text-sm">
          <p>Tropodo, {formData.tgl_surat}</p>
          <p className="mb-24 font-bold uppercase mt-2">Kepala Desa Tropodo,</p>
          <p className="font-bold underline uppercase">SURYANI, S.Sos</p>
          <p className="text-xs">NIP: 19820301 201001 2 001</p>
        </div>
      </div>
    </div>
  );

  // --- LOGIKA FORM BERDASARKAN JENIS ---
  const renderTemplate = () => {
    const inputStyle = "flex-1 outline-none bg-transparent hover:bg-slate-50 px-1 font-bold uppercase";
    
    const CommonRows = () => (
      <>
        <div className="flex"><span className="w-32">Nama</span><span>:</span><input name="nama" value={formData.nama} onChange={handleInput} className={inputStyle} /></div>
        <div className="flex"><span className="w-32">NIK</span><span>:</span><input name="nik" value={formData.nik} onChange={handleInput} className={inputStyle} /></div>
        <div className="flex"><span className="w-32">Tempat/Tgl Lahir</span><span>:</span><input name="ttl" value={formData.ttl} onChange={handleInput} className={inputStyle} /></div>
        <div className="flex"><span className="w-32">Alamat</span><span>:</span><input name="alamat" value={formData.alamat} onChange={handleInput} className={inputStyle} /></div>
      </>
    );

    switch (selectedType) {
      case 'domisili': 
        return <SuratWrapper judul="Surat Keterangan Domisili"><CommonRows /><div className="flex pt-4"><span>Adalah benar warga kami yang berdomisili di alamat tersebut.</span></div></SuratWrapper>;
      case 'sktm': 
        return <SuratWrapper judul="Surat Keterangan Tidak Mampu"><CommonRows /><div className="flex mt-4"><span>Keperluan:</span><input name="keperluan" value={formData.keperluan} onChange={handleInput} className={inputStyle} /></div></SuratWrapper>;
      case 'kelahiran':
        return <SuratWrapper judul="Surat Keterangan Kelahiran"><CommonRows /><div className="flex mt-4"><span>Telah Lahir Anak Ke:</span><input name="ket" value={formData.ket} onChange={handleInput} className={inputStyle} /></div></SuratWrapper>;
      case 'kematian':
        return <SuratWrapper judul="Surat Keterangan Kematian"><CommonRows /><div className="flex mt-4"><span>Tgl Kematian:</span><input name="ket" value={formData.ket} onChange={handleInput} className={inputStyle} /></div></SuratWrapper>;
      case 'sku':
        return <SuratWrapper judul="Surat Keterangan Usaha"><CommonRows /><div className="flex mt-4"><span>Memiliki Usaha:</span><input name="ket" value={formData.ket} onChange={handleInput} className={inputStyle} /></div></SuratWrapper>;
      case 'skck':
        return <SuratWrapper judul="Pengantar SKCK"><CommonRows /><div className="flex mt-4"><span>Untuk Keperluan:</span><input name="keperluan" value={formData.keperluan} onChange={handleInput} className={inputStyle} /></div></SuratWrapper>;
      // Tambahkan case lainnya di sini dengan pola yang sama
      default:
        return <SuratWrapper judul="Surat Keterangan Umum"><CommonRows /></SuratWrapper>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center pb-20">
      {/* TOOLBAR ATAS (NAVY) */}
      <div className="w-full bg-[#0f172a] p-4 mb-8 sticky top-0 z-40 flex justify-center gap-4 shadow-lg">
        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-800 text-white text-xs font-bold uppercase px-4 py-2 rounded-lg outline-none border border-slate-700 cursor-pointer"
        >
          <option value="domisili">Domisili</option>
          <option value="sktm">SKTM</option>
          <option value="kelahiran">Kelahiran</option>
          <option value="kematian">Kematian</option>
          <option value="sku">SKU (Usaha)</option>
          <option value="skck">SKCK</option>
          <option value="nikah">Nikah (NA)</option>
          <option value="izin-keramaian">Izin Keramaian</option>
          <option value="ijazah">Ijazah (TMI)</option>
        </select>
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase px-6 py-2 rounded-lg transition-all shadow-md">
          📥 Download PDF
        </button>
      </div>

      {/* RENDER KERTAS */}
      <div className="scale-[0.9] origin-top md:scale-100">
        {renderTemplate()}
      </div>
    </div>
  );
};

export default AdminTemplate;

// Tambahkan fungsi ini di dalam komponen Form/AdminTemplate
const validateForm = () => {
  if (formData.nik.length !== 16 || isNaN(formData.nik)) {
    alert("NIK harus berjumlah 16 digit angka!");
    return false;
  }
  return true;
};

// Gunakan di handleSubmit (Baris 287)
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return; // Hentikan proses jika NIK salah

  const dataKeAdmin = { ...formData, status: "Menunggu Verifikasi" };
  // ... rest of fetch code
};