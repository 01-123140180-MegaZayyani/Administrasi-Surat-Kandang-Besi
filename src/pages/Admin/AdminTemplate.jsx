// src/pages/Admin/AdminTemplate.jsx

import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// 1. Menggunakan instance api kustom
import api from '../../utils/api'; 
import logoTanggamus from '../../assets/Kabupaten Tanggamus.png';
import ttdPekon from '../../assets/Tanda Tangan.png'; 

const LOGO_PATH = logoTanggamus; 
const TTD_PEKON_PATH = ttdPekon; 

export default function AdminTemplate() {
  const location = useLocation();
  const navigate = useNavigate();
  const suratRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const { id_pengajuan, warga, jenis_surat } = location.state || {};
  const type = jenis_surat?.toLowerCase() || "";

  const [formData, setFormData] = useState({
    nomorSurat: type === "keramaian" ? "331/017/60.2005/VIII/2025" : type === "domisili" ? "470/019/60.2005/XII/2025" : type === "sktm" ? "470/001/60.2005/I/2026" : "470/001/60.2005/I/2026",
    tglSurat: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: type === "keramaian" ? '2-digit' : 'long', year: 'numeric' }).replace(/\//g, '-'),
    nama: warga?.nama?.toUpperCase() || "",
    nik: warga?.nik || "",
    ttl: warga?.tempat_tgl_lahir || "",
    agama: warga?.agama || "Islam",
    jenis_kelamin: warga?.jenis_kelamin || "",
    pekerjaan: warga?.pekerjaan || "",
    alamat: warga?.alamat || "",
    no_hp: warga?.no_hp || "",
    umur: warga?.umur || "",
    status: warga?.status || "Kawin",
    peringkat_desil: warga?.peringkat_desil || "1",
    nama_pemilik_orgen: warga?.nama_orgen_pemilik || "",
    umur_orgen: warga?.umur_orgen || "",
    pekerjaan_orgen: warga?.pekerjaan_orgen || "",
    alamat_orgen: warga?.alamat_orgen || "",
    nama_unit_orgen: warga?.nama_unit_orgen || "",
    hari: "MINGGU",
    tanggal_kegiatan: "10-08-2025",
    waktu: "08.00 s.d 18.00 WIB",
    acara: "KHITANAN",
    resepsi: "KHITANAN",
    tempat_kegiatan: warga?.alamat ? `Kediaman Bpk. ${warga.nama?.split(' ')[0]} Di ${warga.alamat}` : "",
    hiburan: warga?.nama_unit_orgen || "BERKA NADA MUSIC (Orgen Tunggal)",
    jumlah_tamu: "750",
    saksi1_nama: "IWAN",
    saksi2_nama: "EDI IRAWAN",
    nama_usaha: warga?.nama_usaha?.toUpperCase() || "",
    tahun_berdiri: warga?.tahun_berdiri || "",
    alamat_usaha: warga?.alamat_usaha || "",
    tempat_dibuat: "Kandang Besi",
    penandatangan: type === "keramaian" ? "MUKHTAR" : "FATHURRAHIM",
    jabatan_penandatangan: type === "keramaian" ? "" : type === "domisili" ? "" : "A.n Kasi Pelayanan",
    nama_camat: "",
    nip_camat: ""
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      console.log("🔄 Memulai generate PDF...");
      const element = suratRef.current;
      
      const style = document.createElement('style');
      style.id = 'pdf-layout-fix';
      style.textContent = `
        .page {
          position: relative !important;
          display: block !important;
          width: 210mm !important;
          background: white !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }
        .page * {
          color: #000000 !important;
          font-family: 'Times New Roman', Times, serif !important;
        }
      `;
      document.head.appendChild(style);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      const pages = element.querySelectorAll('.page');
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      for (let i = 0; i < pages.length; i++) {
        const pageClone = pages[i].cloneNode(true);
        pageClone.style.position = 'absolute';
        pageClone.style.left = '-9999px';
        pageClone.style.width = '210mm';
        document.body.appendChild(pageClone);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const canvas = await html2canvas(pageClone, { 
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 794,
          windowHeight: pageClone.scrollHeight,
          height: pageClone.scrollHeight  
        });
        
        document.body.removeChild(pageClone);
        const imgData = canvas.toDataURL("image/png", 1.0);
        const imgProps = pdf.getImageProperties(imgData);
        let imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight, undefined, 'FAST');
      }
      
      const styleToRemove = document.getElementById('pdf-layout-fix');
      if (styleToRemove) document.head.removeChild(styleToRemove);
      
      const timestamp = Date.now();
      const fileName = `surat_${type}_${id_pengajuan}_${timestamp}.pdf`;
      const pdfBlob = pdf.output("blob");

      const uploadData = new FormData();
      uploadData.append("pdf", pdfBlob, fileName);
      uploadData.append("status", "Selesai");

      // 2. Menggunakan api.put (Base URL otomatis dari utils/api)
      const response = await api.put(
        `/api/admin/surat/${id_pengajuan}`, 
        uploadData,
        { headers: { "Content-Type": "multipart/form-data" }, timeout: 30000 }
      );
      
      if (response.status === 200) {
        pdf.save(`Surat_${type.toUpperCase()}_${formData.nama}.pdf`);
        alert("✅ Surat berhasil diterbitkan!");
        navigate("/admin/pengajuan");
      } else {
        throw new Error("Upload gagal");
      }
      
    } catch (err) {
        console.error("❌ Error detail:", err);
        
        // Jangan navigate kalau error!
        if (err.response?.status === 401) {
          // Kalau 401, baru logout
          alert("Sesi habis, silakan login kembali");
          navigate("/login");
        } else {
          // Error lain, tetap di halaman
          alert(err.response?.data?.message || `Terjadi kesalahan: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
  };

  const renderSidebarEditor = () => {
    if (type === "domisili") {
      return (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor Surat</label>
            <input name="nomorSurat" value={formData.nomorSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Surat</label>
            <input name="tglSurat" value={formData.tglSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama</label>
            <input name="nama" value={formData.nama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">NIK</label>
            <input name="nik" value={formData.nik} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">TTL</label>
            <input name="ttl" value={formData.ttl} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Agama</label>
            <input name="agama" value={formData.agama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
            <input name="status" value={formData.status} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan</label>
            <input name="pekerjaan" value={formData.pekerjaan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat</label>
            <input name="alamat" value={formData.alamat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </>
      );
    } else if (type === "keramaian") {
      return (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor Surat</label>
            <input name="nomorSurat" value={formData.nomorSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Surat</label>
            <input name="tglSurat" value={formData.tglSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Hari</label>
            <input name="hari" value={formData.hari} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tgl Acara</label>
            <input name="tanggal_kegiatan" value={formData.tanggal_kegiatan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Waktu</label>
            <input name="waktu" value={formData.waktu} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Acara</label>
            <input name="acara" value={formData.acara} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Resepsi</label>
            <input name="resepsi" value={formData.resepsi} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat</label>
            <input name="tempat_kegiatan" value={formData.tempat_kegiatan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Hiburan</label>
            <input name="hiburan" value={formData.hiburan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jumlah Tamu (estimasi)</label>
            <input name="jumlah_tamu" value={formData.jumlah_tamu} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Penandatangan</label>
            <input name="penandatangan" value={formData.penandatangan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </>
      );
    } else if (type === "sktm") {
      return (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor Surat</label>
            <input name="nomorSurat" value={formData.nomorSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Surat</label>
            <input name="tglSurat" value={formData.tglSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama</label>
            <input name="nama" value={formData.nama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Kelamin</label>
            <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Laki-Laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Tanggal Lahir</label>
            <input name="ttl" value={formData.ttl} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Agama</label>
            <input name="agama" value={formData.agama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan</label>
            <input name="pekerjaan" value={formData.pekerjaan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">NIK</label>
            <input name="nik" value={formData.nik} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Peringkat Desil</label>
            <select name="peringkat_desil" value={formData.peringkat_desil} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat</label>
            <input name="alamat" value={formData.alamat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Dibuat</label>
            <input name="tempat_dibuat" value={formData.tempat_dibuat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Camat</label>
            <input name="nama_camat" value={formData.nama_camat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="(opsional)" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">NIP Camat</label>
            <input name="nip_camat" value={formData.nip_camat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="(opsional)" />
          </div>
        </>
      );
    } else if (type === "usaha") {
      return (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor Surat</label>
            <input name="nomorSurat" value={formData.nomorSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Surat</label>
            <input name="tglSurat" value={formData.tglSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Pemohon</label>
            <input name="nama" value={formData.nama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">NIK</label>
            <input name="nik" value={formData.nik} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">TTL</label>
            <input name="ttl" value={formData.ttl} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Agama</label>
            <input name="agama" value={formData.agama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan</label>
            <input name="pekerjaan" value={formData.pekerjaan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat</label>
            <input name="alamat" value={formData.alamat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Usaha</label>
            <input name="nama_usaha" value={formData.nama_usaha} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tahun Berdiri</label>
            <input name="tahun_berdiri" value={formData.tahun_berdiri} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Usaha</label>
            <input name="alamat_usaha" value={formData.alamat_usaha} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Saksi 1</label>
            <input name="saksi1_nama" value={formData.saksi1_nama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Saksi 2</label>
            <input name="saksi2_nama" value={formData.saksi2_nama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Dibuat</label>
            <input name="tempat_dibuat" value={formData.tempat_dibuat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Penandatangan</label>
            <input name="penandatangan" value={formData.penandatangan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jabatan Penandatangan</label>
            <input name="jabatan_penandatangan" value={formData.jabatan_penandatangan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* LEFT PANEL - EDITOR */}
      <div className="w-96 bg-white shadow-lg p-6 overflow-y-auto border-r-2 border-gray-200">
        <button onClick={() => navigate("/admin/pengajuan")} className="flex items-center gap-2 mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Editor Surat {jenis_surat}</h2>
          <p className="text-sm text-gray-600">Edit data sebelum menerbitkan</p>
        </div>

        <div className="space-y-4 mb-6">{renderSidebarEditor()}</div>

        <button 
          onClick={generatePDF} 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Sedang Memproses...
            </>
          ) : (
            <>
              <Send size={20} />
              Terbitkan Surat
            </>
          )}
        </button>
      </div>

      {/* RIGHT PANEL - PREVIEW */}
      <div className="flex-1 p-8 overflow-y-auto bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white shadow-xl" ref={suratRef}>
          {type === "domisili" && <TemplateDomisili formData={formData} />}
          {type === "keramaian" && <TemplateKeramaian formData={formData} />}
          {type === "usaha" && <TemplateUsaha formData={formData} />}
          {type === "sktm" && <TemplateSKTM formData={formData} />}
        </div>
      </div>
    </div>
  );
}

function TemplateDomisili({ formData }) {
  return (
    <div className="page" style={{ 
      fontFamily: "'Times New Roman', serif", 
      fontSize: "12pt", 
      lineHeight: "1.6", 
      backgroundColor: "#ffffff", 
      width: "210mm", 
      minHeight: "auto", 
      padding: "15mm 20mm", 
      color: "#000000", 
      boxSizing: "border-box" 
    }}>
      {/* HEADER DENGAN LOGO */}
      <div style={{ display: "flex", alignItems: "center", paddingBottom: "8px", marginBottom: "12px", borderBottom: "3px solid #000000" }}>
        <img src={LOGO_PATH} alt="Logo" style={{ width: "70px", height: "70px", marginRight: "15px", objectFit: "contain" }} />
        
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            PEMERINTAH KABUPATEN TANGGAMUS
          </h1>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            KECAMATAN KOTAAGUNG BARAT
          </h2>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            PEKON KANDANG BESI
          </h2>
          <p style={{ fontSize: "10pt", margin: "3px 0 0 0", lineHeight: "1.3" }}>
            Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus Kode Pos 35651
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: "3px", margin: "0" }}>
          SURAT KETERANGAN DOMISILI
        </h2>
        <p style={{ fontSize: "12pt", margin: "6px 0 0 0" }}>Nomor : {formData.nomorSurat}</p>
      </div>

      <div style={{ marginBottom: "20px", fontSize: "12pt" }}>
        <p style={{ textAlign: "justify", marginBottom: "14px", textIndent: "40px", lineHeight: "1.6" }}>
          Yang bertanda tangan dibawah ini, Kepala Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus menerangkan dengan sebenarnya bahwa :
        </p>

        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr>
              <td style={{ width: "180px", paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Nama</td>
              <td style={{ width: "15px", paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.nama}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>NIK</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.nik}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Tempat Tgl. Lahir</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.ttl}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Agama</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.agama}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Status Pernikahan</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.status}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Pekerjaan</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.pekerjaan}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Alamat</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.alamat}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginBottom: "18px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
          Nama diatas adalah benar warga Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus dan saat ini masih berdomisili di Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus.
        </p>

        <p style={{ marginBottom: "60px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
          Demikian Surat Keterangan ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <div style={{ textAlign: "left", width: "260px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>Dikeluarkan di</p>
          <p style={{ margin: "0 0 16px 0" }}>Pada Tanggal</p>
        </div>
        <div style={{ textAlign: "left", width: "260px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>: Pekon Kandang Besi</p>
          <p style={{ margin: "0 0 16px 0" }}>: {formData.tglSurat}</p>
        </div>
      </div>

      <div style={{ textAlign: "right", marginTop: "40px", marginRight: "40px" }}>
        <p style={{ margin: "0 0 10px 0", fontSize: "12pt" }}>Kepala Pekon Kandang Besi</p>
        
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img src={TTD_PEKON_PATH} alt="TTD" style={{ width: "120px", height: "60px", objectFit: "contain", margin: "0 auto" }} />
        </div>
        
        <p style={{ margin: "0", fontSize: "12pt", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
          Mukhtar
        </p>
      </div>
    </div>
  );
}

function TemplateKeramaian({ formData }) {
  return (
    <div className="page" style={{ 
      fontFamily: "'Times New Roman', serif", 
      fontSize: "12pt", 
      lineHeight: "1.6", 
      backgroundColor: "#ffffff", 
      width: "210mm", 
      minHeight: "auto", 
      padding: "15mm 20mm 20mm 20mm",
      color: "#000000", 
      boxSizing: "border-box",
      position: "relative"
    }}>
      {/* HEADER DENGAN LOGO */}
      <div style={{ display: "flex", alignItems: "center", paddingBottom: "8px", marginBottom: "12px", borderBottom: "3px solid #000000" }}>
        <img src={LOGO_PATH} alt="Logo" style={{ width: "70px", height: "70px", marginRight: "15px", objectFit: "contain" }} />
        
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            PEMERINTAH KABUPATEN TANGGAMUS
          </h1>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            KECAMATAN KOTAAGUNG BARAT
          </h2>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            PEKON KANDANG BESI
          </h2>
          <p style={{ fontSize: "10pt", margin: "3px 0 0 0", lineHeight: "1.3" }}>
            Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus Kode Pos 35651
          </p>
        </div>
      </div>

      {/* JUDUL */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: "3px", margin: "0" }}>
          SURAT KETERANGAN
        </h2>
        <p style={{ fontSize: "12pt", margin: "6px 0 0 0" }}>Nomor : {formData.nomorSurat}</p>
      </div>

      {/* KONTEN UTAMA */}
      <div style={{ marginBottom: "20px", fontSize: "12pt" }}>
        <p style={{ marginBottom: "14px", textAlign: "justify", textIndent: "40px", lineHeight: "1.6" }}>
          Sehubungan dengan akan diadakannya kegiatan <strong>{formData.resepsi}</strong> dengan Hiburan <strong>{formData.hiburan}</strong> pada
        </p>

        <table style={{ marginBottom: "16px", marginLeft: "40px", width: "calc(100% - 40px)", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr>
              <td style={{ width: "120px", paddingBottom: "6px", verticalAlign: "top" }}>Hari</td>
              <td style={{ width: "15px", paddingBottom: "6px", verticalAlign: "top" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>{formData.hari}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Tanggal</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>{formData.tanggal_kegiatan}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Waktu</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>{formData.waktu}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Resepsi</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>{formData.resepsi}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Hiburan</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>{formData.hiburan}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Tempat</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top" }}>{formData.tempat_kegiatan}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginBottom: "16px", textAlign: "justify", textIndent: "40px", fontSize: "12pt", lineHeight: "1.6" }}>
          Untuk bahan pertimbangan Bapak, bahwa dalam hajatan tersebut akan mengundang tetangga, sanak saudara, family, kerabat serta handai taulan dengan jumlah sekitar ± {formData.jumlah_tamu} orang
        </p>

        <p style={{ marginBottom: "30px", textAlign: "justify", textIndent: "40px", fontSize: "12pt", lineHeight: "1.6" }}>
          Demikian dan atas Kebijaksanaan Bapak kami mengucapkan terimakasih.
        </p>
      </div>

      {/* BAGIAN TANDATANGAN - DIPERBAIKI DISINI */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: "30px",
        paddingLeft: "20px",
        paddingRight: "20px"
      }}>
        {/* KIRI - CAMAT */}
        <div style={{ 
          textAlign: "center", 
          width: "230px",
          fontSize: "12pt"
        }}>
          <p style={{ margin: "0 0 10px 0" }}>Camat Kotaagung</p>
          <div style={{ height: "70px" }}></div>
          <p style={{ margin: "0", fontWeight: "normal" }}>(...................................)</p>
        </div>

        {/* KANAN - KEPALA PEKON */}
        <div style={{ 
          textAlign: "center", 
          width: "230px",
          fontSize: "12pt"
        }}>
          <p style={{ margin: "0 0 10px 0" }}>Kepala Pekon Kandang Besi</p>
          
          <div style={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
            height: "70px"
          }}>
            <img 
              src={TTD_PEKON_PATH} 
              alt="TTD" 
              style={{ 
                width: "120px", 
                height: "60px", 
                objectFit: "contain"
              }} 
            />
          </div>
          
          <p style={{ 
            margin: "0", 
            fontSize: "12pt", 
            fontWeight: "bold", 
            textDecoration: "underline", 
            textUnderlineOffset: "2px" 
          }}>
            {formData.penandatangan}
          </p>
        </div>
      </div>
    </div>
  );
}

function TemplateUsaha({ formData }) {
  return (
    <div className="page" style={{ 
      fontFamily: "'Times New Roman', serif", 
      fontSize: "12pt", 
      lineHeight: "1.6", 
      backgroundColor: "#ffffff", 
      width: "210mm", 
      minHeight: "auto", 
      padding: "15mm 20mm", 
      color: "#000000", 
      boxSizing: "border-box" 
    }}>
      {/* HEADER DENGAN LOGO */}
      <div style={{ display: "flex", alignItems: "center", paddingBottom: "8px", marginBottom: "12px", borderBottom: "3px solid #000000" }}>
        <img src={LOGO_PATH} alt="Logo" style={{ width: "70px", height: "70px", marginRight: "15px", objectFit: "contain" }} />
        
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            PEMERINTAH KABUPATEN TANGGAMUS
          </h1>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            KECAMATAN KOTAAGUNG BARAT
          </h2>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            PEKON KANDANG BESI
          </h2>
          <p style={{ fontSize: "10pt", margin: "3px 0 0 0", lineHeight: "1.3" }}>
            Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus Kode Pos 35651
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: "3px", margin: "0" }}>
          SURAT KETERANGAN USAHA
        </h2>
        <p style={{ fontSize: "12pt", margin: "6px 0 0 0" }}>Nomor : {formData.nomorSurat}</p>
      </div>

      <div style={{ marginBottom: "20px", fontSize: "12pt" }}>
        <p style={{ textAlign: "justify", marginBottom: "14px", textIndent: "40px", lineHeight: "1.6" }}>
          Yang bertanda tangan dibawah ini, Kepala Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus menerangkan dengan sebenarnya bahwa :
        </p>

        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr>
              <td style={{ width: "180px", paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Nama</td>
              <td style={{ width: "15px", paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.nama}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>NIK</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.nik}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Tempat Tgl. Lahir</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.ttl}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Agama</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.agama}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Pekerjaan</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.pekerjaan}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Alamat</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.alamat}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginBottom: "14px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
          Nama diatas adalah benar warga Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus dan benar memiliki usaha dengan keterangan sebagai berikut :
        </p>

        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr>
              <td style={{ width: "180px", paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Nama Usaha</td>
              <td style={{ width: "15px", paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.nama_usaha}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Tahun Berdiri</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.tahun_berdiri}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Alamat Usaha</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.alamat_usaha}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginBottom: "18px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
          Demikian Surat Keterangan ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <div style={{ textAlign: "left", width: "260px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>Dikeluarkan di</p>
          <p style={{ margin: "0 0 16px 0" }}>Pada Tanggal</p>
        </div>
        <div style={{ textAlign: "left", width: "260px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>: Pekon {formData.tempat_dibuat}</p>
          <p style={{ margin: "0 0 16px 0" }}>: {formData.tglSurat}</p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", paddingLeft: "40px", paddingRight: "40px" }}>
        <div style={{ width: "200px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 10px 0", textAlign: "center" }}>Saksi - Saksi</p>
          <div style={{ marginTop: "10px" }}>
            <p style={{ margin: "3px 0" }}>1. {formData.saksi1_nama}</p>
            <p style={{ margin: "60px 0 3px 0" }}>(...................................)</p>
          </div>
          <div style={{ marginTop: "20px" }}>
            <p style={{ margin: "3px 0" }}>2. {formData.saksi2_nama}</p>
            <p style={{ margin: "60px 0 3px 0" }}>(...................................)</p>
          </div>
        </div>

        <div style={{ textAlign: "center", width: "230px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>{formData.jabatan_penandatangan}</p>
          <p style={{ margin: "0 0 10px 0" }}>Kepala Pekon Kandang Besi</p>
          
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img 
              src={TTD_PEKON_PATH} 
              alt="TTD" 
              style={{ 
                width: "120px", 
                height: "60px", 
                objectFit: "contain", 
                margin: "0 auto" 
              }} 
            />
          </div>
          
          <p style={{ margin: "0", fontSize: "12pt", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
            {formData.penandatangan}
          </p>
        </div>
      </div>
    </div>
  );
}

function TemplateSKTM({ formData }) {
  return (
    <div className="page" style={{ 
      fontFamily: "'Times New Roman', serif", 
      fontSize: "12pt", 
      lineHeight: "1.6", 
      backgroundColor: "#ffffff", 
      width: "210mm", 
      minHeight: "auto", 
      padding: "15mm 20mm", 
      color: "#000000", 
      boxSizing: "border-box" 
    }}>
      {/* HEADER DENGAN LOGO */}
      <div style={{ display: "flex", alignItems: "center", paddingBottom: "8px", marginBottom: "12px", borderBottom: "3px solid #000000" }}>
        <img src={LOGO_PATH} alt="Logo" style={{ width: "70px", height: "70px", marginRight: "15px", objectFit: "contain" }} />
        
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            PEMERINTAH KABUPATEN TANGGAMUS
          </h1>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            KECAMATAN KOTAAGUNG BARAT
          </h2>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            PEKON KANDANG BESI
          </h2>
          <p style={{ fontSize: "10pt", margin: "3px 0 0 0", lineHeight: "1.3" }}>
            Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus Kode Pos 35651
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: "3px", margin: "0" }}>
          SURAT KETERANGAN TIDAK MAMPU
        </h2>
        <p style={{ fontSize: "12pt", margin: "6px 0 0 0" }}>Nomor : {formData.nomorSurat}</p>
      </div>

      <div style={{ marginBottom: "20px", fontSize: "12pt" }}>
        <p style={{ textAlign: "justify", marginBottom: "14px", textIndent: "40px", lineHeight: "1.6" }}>
          Yang bertanda tangan dibawah ini, Kepala Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus menerangkan dengan sebenarnya bahwa :
        </p>

        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr>
              <td style={{ width: "180px", paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Nama</td>
              <td style={{ width: "15px", paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.nama}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Jenis Kelamin</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.jenis_kelamin}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Tempat Tgl. Lahir</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.ttl}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Agama</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.agama}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Pekerjaan</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.pekerjaan}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>NIK</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.nik}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Peringkat Desil</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.peringkat_desil}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Alamat</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.alamat}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginBottom: "18px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
          Nama diatas adalah benar warga Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus, nama tersebut diatas adalah tergolong keluarga Tidak Mampu.
        </p>

        <p style={{ marginBottom: "60px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
          Demikian Surat Keterangan ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <div style={{ textAlign: "left", width: "260px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>Dikeluarkan di</p>
          <p style={{ margin: "0 0 16px 0" }}>Pada Tanggal</p>
        </div>
        <div style={{ textAlign: "left", width: "260px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>: Pekon {formData.tempat_dibuat}</p>
          <p style={{ margin: "0 0 16px 0" }}>: {formData.tglSurat}</p>
        </div>
      </div>

        {/* BAGIAN TANDA TANGAN - BERSEBERANGAN */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginTop: "40px",
          paddingLeft: "40px",
          paddingRight: "40px"
        }}>
          
          {/* KIRI - CAMAT */}
          <div style={{ textAlign: "center", width: "230px", fontSize: "12pt" }}>
            <p style={{ margin: "0 0 3px 0" }}>Mengetahui</p>
            <p style={{ margin: "0 0 10px 0" }}>Camat Kecamatan Kotaagung Barat</p>
            
            {/* KOSONG - TANPA TTD */}
            <div style={{ height: "70px" }}></div>
            
            <p style={{ margin: "0", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              {formData.nama_camat || "(....................................)"}
            </p>
            <p style={{ margin: "3px 0 0 0", fontSize: "11pt" }}>
              NIP. {formData.nip_camat || "...................................."}
            </p>
          </div>

          {/* KANAN - KEPALA PEKON */}
          <div style={{ textAlign: "center", width: "230px", fontSize: "12pt" }}>
            <p style={{ margin: "0 0 10px 0" }}>Kepala Pekon Kandang Besi</p>
            
            {/* TTD KEPALA PEKON */}
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <img 
                src={TTD_PEKON_PATH} 
                alt="TTD" 
                style={{ 
                  width: "120px", 
                  height: "60px", 
                  objectFit: "contain", 
                  margin: "0 auto" 
                }} 
              />
            </div>
            
            <p style={{ 
              margin: "0", 
              fontSize: "12pt", 
              fontWeight: "bold", 
              textDecoration: "underline", 
              textUnderlineOffset: "2px" 
            }}>
              Mukhtar
            </p>
          </div>
      </div>
    </div>
  );
}