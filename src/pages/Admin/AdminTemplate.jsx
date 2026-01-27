import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

export default function AdminTemplate() {
  const location = useLocation();
  const navigate = useNavigate();
  const suratRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const { id_pengajuan, warga, jenis_surat, data_form } = location.state || {};

  const [formData, setFormData] = useState({
    nomorSurat: data_form?.nomorSurat || "470 / 015 / 60.2005 / XI / 2025",
    nama: data_form?.nama || warga?.nama || "LINDA SARI",
    jenisKelamin: data_form?.jenis_kelamin || "Perempuan",
    ttl: data_form?.tempat_tgl_lahir || "Way Liwok, 24 November 1983",
    agama: data_form?.agama || "Islam",
    pekerjaan: data_form?.pekerjaan || "Mengurus Rumah Tangga",
    alamat: data_form?.alamat || "Pekon Kandang Besi, Kec. Kotaagung Barat",
    // Kejadian Kematian
    tglMeninggal: data_form?.tgl_meninggal || "Rabu, 16 Mei 2018",
    pukulMeninggal: data_form?.pukul_meninggal || "20.00 WIB",
    tempatMeninggal: data_form?.tempat_meninggal || "Rumah Sakit Abdul Moeloek",
    penyebab: data_form?.penyebab || "Sakit",
    // Pemakaman
    tglMakam: data_form?.tgl_pemakaman || "Kamis, 17 Mei 2018",
    pukulMakam: data_form?.pukul_pemakaman || "10.00 WIB",
    tempatMakam: data_form?.tempat_pemakaman || "Tempat Pemakaman Umum Kandang Besi",
    // Data Pelapor
    namaPelapor: data_form?.nama_pelapor || "MARHAKIM",
    ttlPelapor: data_form?.ttl_pelapor || "Kandang Besi, 12-12-1965",
    pekerjaanPelapor: data_form?.pekerjaan_pelapor || "Petani/Pekebun",
    alamatPelapor: data_form?.alamat_pelapor || "Kandang Besi Kec. Kotaagung Barat",
    hubungan: data_form?.hubungan_pelapor || "ABANG IPAR",
    tglSurat: "12 - 11 - 2025"
  });

  const generatePDF = async () => {
    setLoading(true);
    const element = suratRef.current;
    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save(`Surat_Kematian_${formData.nama}.pdf`);
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* PANEL EDITOR (KIRI) */}
      <div className="w-1/3 bg-white p-8 overflow-y-auto shadow-xl border-r">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 font-bold text-[#1E3A8A]">
          <ArrowLeft size={18}/> KEMBALI
        </button>
        <h2 className="font-black uppercase text-xs mb-8 tracking-widest text-slate-400 border-b pb-2">Editor Surat Kematian</h2>
        
        <div className="space-y-6">
          {/* Identitas Utama */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Informasi Surat & Almarhum</label>
            <input type="text" value={formData.nomorSurat} onChange={(e) => setFormData({...formData, nomorSurat: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl font-bold text-sm" placeholder="Nomor Surat" />
            <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl text-sm" placeholder="Nama Almarhum" />
          </div>

          {/* Detail Kejadian */}
          <div className="space-y-3 p-4 bg-red-50 rounded-2xl border border-red-100">
            <label className="text-[10px] font-black uppercase text-red-400 tracking-wider">Detail Kematian</label>
            <input type="text" value={formData.tglMeninggal} onChange={(e) => setFormData({...formData, tglMeninggal: e.target.value})} className="w-full p-2 bg-white border rounded-lg text-xs" placeholder="Hari/Tgl Meninggal" />
            <input type="text" value={formData.penyebab} onChange={(e) => setFormData({...formData, penyebab: e.target.value})} className="w-full p-2 bg-white border rounded-lg text-xs" placeholder="Penyebab" />
            <input type="text" value={formData.tglMakam} onChange={(e) => setFormData({...formData, tglMakam: e.target.value})} className="w-full p-2 bg-white border rounded-lg text-xs" placeholder="Tgl Pemakaman" />
          </div>

          {/* Detail Pelapor (Sesuai Word) */}
          <div className="space-y-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <label className="text-[10px] font-black uppercase text-blue-400 tracking-wider">Informasi Pelapor</label>
            <input type="text" value={formData.namaPelapor} onChange={(e) => setFormData({...formData, namaPelapor: e.target.value})} className="w-full p-2 bg-white border rounded-lg text-xs" placeholder="Nama Pelapor" />
            <input type="text" value={formData.ttlPelapor} onChange={(e) => setFormData({...formData, ttlPelapor: e.target.value})} className="w-full p-2 bg-white border rounded-lg text-xs" placeholder="TTL Pelapor" />
            <input type="text" value={formData.hubungan} onChange={(e) => setFormData({...formData, hubungan: e.target.value})} className="w-full p-2 bg-white border rounded-lg text-xs font-bold" placeholder="Hubungan (Cth: ABANG IPAR)" />
          </div>
        </div>

        <button onClick={generatePDF} disabled={loading} className="w-full mt-10 bg-[#1E3A8A] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-900 transition-all">
          {loading ? <Loader2 className="animate-spin"/> : <Send size={18}/>} CETAK SURAT
        </button>
      </div>

      {/* PREVIEW SURAT (KANAN) - TETAP SESUAI TEMPLATE WORD */}
      <div className="flex-1 overflow-y-auto p-12 bg-slate-300 flex justify-center">
        <div ref={suratRef} className="w-[210mm] min-h-[297mm] bg-white p-[20mm] text-black shadow-2xl" style={{ fontFamily: "'Times New Roman', serif", fontSize: "12pt", lineHeight: "1.3" }}>
          <div className="text-center border-b-2 border-black pb-2 mb-4">
            <h2 className="text-[14pt] font-bold uppercase leading-tight">Pemerintah Pekon Kandang Besi</h2>
            <h2 className="text-[14pt] font-bold uppercase leading-tight">Kecamatan Kotaagung Barat</h2>
            <h2 className="text-[14pt] font-bold uppercase leading-tight">Kabupaten Tanggamus</h2>
            <p className="text-[9pt] italic">Alamat : Jl.Ir.H.Juanda KM 07 Pekon Kandang Besi Kec.Kotaagung Barat Kab.Tanggamus Kode Pos 35651</p>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-[14pt] font-bold underline uppercase">Surat Keterangan Kematian</h3>
            <p>NO : {formData.nomorSurat}</p>
          </div>

          <p className="mb-4 text-justify">Saya yang bertanda tangan di bawah ini Kepala Pekon Kandang Besi Kecamatan Kotaagung Barat Kabupaten Tanggamus menerangkan bahwa :</p>
          
          <table className="ml-8 mb-4 w-full">
            <tbody>
              <tr><td className="w-56">Nama</td><td>: <b>{formData.nama}</b></td></tr>
              <tr><td>Jenis Kelamin</td><td>: {formData.jenisKelamin}</td></tr>
              <tr><td>Tempat Tanggal Lahir</td><td>: {formData.ttl}</td></tr>
              <tr><td>Agama</td><td>: {formData.agama}</td></tr>
              <tr><td>Pekerjaan</td><td>: {formData.pekerjaan}</td></tr>
              <tr><td>Alamat</td><td>: {formData.alamat}</td></tr>
            </tbody>
          </table>

          <p className="mb-4">Bahwa Benar Nama tersebut di atas telah <b>Meninggal dunia</b> pada :</p>
          <table className="ml-8 mb-4 w-full">
            <tbody>
              <tr><td className="w-56">Hari / Tanggal</td><td>: {formData.tglMeninggal}</td></tr>
              <tr><td>Pukul</td><td>: {formData.pukulMeninggal}</td></tr>
              <tr><td>Tempat</td><td>: {formData.tempatMeninggal}</td></tr>
              <tr><td>Penyebab Meninggal</td><td>: {formData.penyebab}</td></tr>
            </tbody>
          </table>

          <p className="mb-4">Selanjutnya Jenazah orang tersebut telah di makamkan pada :</p>
          <table className="ml-8 mb-4 w-full">
            <tbody>
              <tr><td className="w-56">Hari / Tanggal</td><td>: {formData.tglMakam}</td></tr>
              <tr><td>Pukul</td><td>: {formData.pukulMakam}</td></tr>
              <tr><td>Tempat</td><td>: {formData.tempatMakam}</td></tr>
            </tbody>
          </table>

          <p className="mb-4">Surat Keterangan ini dibuat atas Keterangan Pelapor :</p>
          <table className="ml-8 mb-6 w-full">
            <tbody>
              <tr><td className="w-56">Nama</td><td>: <b>{formData.namaPelapor}</b></td></tr>
              <tr><td>Tempat Tanggal Lahir</td><td>: {formData.ttlPelapor}</td></tr>
              <tr><td>Pekerjaan</td><td>: {formData.pekerjaanPelapor}</td></tr>
              <tr><td>Alamat</td><td>: {formData.alamatPelapor}</td></tr>
              <tr><td>Hubungan dengan yang Meninggal</td><td>: <u><b>{formData.hubungan}</b></u></td></tr>
            </tbody>
          </table>

          <p className="mb-10 text-justify">Demikianlah Surat Kematian ini Kami buat dengan sebenar benarnya, agar dapat dipergunakan sebagai mana mestinya.</p>

          <div className="ml-auto w-72 text-center">
            <p>Kandang Besi, {formData.tglSurat}</p>
            <p className="font-bold">Kepala Pekon Kandang Besi</p>
            <div className="h-24"></div>
            <p className="font-bold uppercase underline">MUKHTAR</p>
          </div>
        </div>
      </div>
    </div>
  );
}