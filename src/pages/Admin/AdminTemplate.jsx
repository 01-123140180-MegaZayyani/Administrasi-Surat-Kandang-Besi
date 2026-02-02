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
      
      // ✅ FIX 1: Tambahkan style yang lebih lengkap
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
          min-height: 297mm !important;
          padding-bottom: 25mm !important;
        }
        .page * {
          color: #000000 !important;
          font-family: 'Times New Roman', Times, serif !important;
        }
        /* Pastikan signature area tidak terpotong */
        .signature-section {
          page-break-inside: avoid !important;
          margin-bottom: 20mm !important;
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
        pageClone.style.minHeight = '297mm'; // ✅ FIX 2: Tambah min-height
        document.body.appendChild(pageClone);
        
        await new Promise(resolve => setTimeout(resolve, 500)); // ✅ FIX 3: Tambah delay
        
        // ✅ FIX 4: Dapatkan tinggi aktual dari element
        const actualHeight = pageClone.scrollHeight;
        
        const canvas = await html2canvas(pageClone, { 
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 794,
          height: actualHeight, // ✅ FIX 5: Gunakan tinggi dinamis
          windowHeight: actualHeight, // ✅ FIX 6: Set window height
        });
        
        document.body.removeChild(pageClone);
        const imgData = canvas.toDataURL("image/png", 1.0);
        const imgProps = pdf.getImageProperties(imgData);
        let imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        // ✅ FIX 7: Pastikan tidak melebihi tinggi PDF
        if (imgHeight > pdfHeight) {
          imgHeight = pdfHeight;
        }
        
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
            <input name="nomorSurat" value={formData.nomorSurat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Surat</label>
            <input name="tglSurat" value={formData.tglSurat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
            <input name="nama" value={formData.nama} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">NIK</label>
            <input name="nik" value={formData.nik} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Tgl Lahir</label>
            <input name="ttl" value={formData.ttl} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Agama</label>
            <input name="agama" value={formData.agama} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Kelamin</label>
            <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleInputChange} className="border p-2 rounded text-xs">
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan</label>
            <input name="pekerjaan" value={formData.pekerjaan} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat</label>
            <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} className="border p-2 rounded text-xs h-20" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Dibuat</label>
            <input name="tempat_dibuat" value={formData.tempat_dibuat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Penandatangan</label>
            <input name="penandatangan" value={formData.penandatangan} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jabatan Penandatangan</label>
            <input name="jabatan_penandatangan" value={formData.jabatan_penandatangan} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
        </>
      );
    }

    if (type === "sktm") {
      return (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor Surat</label>
            <input name="nomorSurat" value={formData.nomorSurat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Surat</label>
            <input name="tglSurat" value={formData.tglSurat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
            <input name="nama" value={formData.nama} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Kelamin</label>
            <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleInputChange} className="border p-2 rounded text-xs">
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Tgl Lahir</label>
            <input name="ttl" value={formData.ttl} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Agama</label>
            <input name="agama" value={formData.agama} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan</label>
            <input name="pekerjaan" value={formData.pekerjaan} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">NIK</label>
            <input name="nik" value={formData.nik} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Peringkat Desil</label>
            <input name="peringkat_desil" value={formData.peringkat_desil} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat</label>
            <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} className="border p-2 rounded text-xs h-20" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Dibuat</label>
            <input name="tempat_dibuat" value={formData.tempat_dibuat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Camat</label>
            <input name="nama_camat" value={formData.nama_camat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">NIP Camat</label>
            <input name="nip_camat" value={formData.nip_camat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Penandatangan</label>
            <input name="penandatangan" value={formData.penandatangan} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
        </>
      );
    }

    if (type === "keramaian") {
      return (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor Surat</label>
            <input name="nomorSurat" value={formData.nomorSurat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Surat</label>
            <input name="tglSurat" value={formData.tglSurat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
            <input name="nama" value={formData.nama} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">NIK</label>
            <input name="nik" value={formData.nik} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Umur</label>
            <input name="umur" value={formData.umur} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan</label>
            <input name="pekerjaan" value={formData.pekerjaan} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
            <select name="status" value={formData.status} onChange={handleInputChange} className="border p-2 rounded text-xs">
              <option value="Kawin">Kawin</option>
              <option value="Belum Kawin">Belum Kawin</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat</label>
            <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} className="border p-2 rounded text-xs h-20" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">No. HP</label>
            <input name="no_hp" value={formData.no_hp} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Pemilik Orgen</label>
            <input name="nama_pemilik_orgen" value={formData.nama_pemilik_orgen} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Umur Pemilik Orgen</label>
            <input name="umur_orgen" value={formData.umur_orgen} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan Pemilik Orgen</label>
            <input name="pekerjaan_orgen" value={formData.pekerjaan_orgen} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Pemilik Orgen</label>
            <textarea name="alamat_orgen" value={formData.alamat_orgen} onChange={handleInputChange} className="border p-2 rounded text-xs h-20" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Unit/Orgen</label>
            <input name="nama_unit_orgen" value={formData.nama_unit_orgen} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Hari Kegiatan</label>
            <input name="hari" value={formData.hari} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Kegiatan</label>
            <input name="tanggal_kegiatan" value={formData.tanggal_kegiatan} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Waktu</label>
            <input name="waktu" value={formData.waktu} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Acara</label>
            <input name="acara" value={formData.acara} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Resepsi</label>
            <input name="resepsi" value={formData.resepsi} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Kegiatan</label>
            <textarea name="tempat_kegiatan" value={formData.tempat_kegiatan} onChange={handleInputChange} className="border p-2 rounded text-xs h-20" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Hiburan</label>
            <input name="hiburan" value={formData.hiburan} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jumlah Tamu</label>
            <input name="jumlah_tamu" value={formData.jumlah_tamu} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Saksi 1</label>
            <input name="saksi1_nama" value={formData.saksi1_nama} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Saksi 2</label>
            <input name="saksi2_nama" value={formData.saksi2_nama} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Dibuat</label>
            <input name="tempat_dibuat" value={formData.tempat_dibuat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Penandatangan</label>
            <input name="penandatangan" value={formData.penandatangan} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
        </>
      );
    }

    if (type === "usaha") {
      return (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor Surat</label>
            <input name="nomorSurat" value={formData.nomorSurat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Surat</label>
            <input name="tglSurat" value={formData.tglSurat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
            <input name="nama" value={formData.nama} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">NIK</label>
            <input name="nik" value={formData.nik} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Tgl Lahir</label>
            <input name="ttl" value={formData.ttl} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Kelamin</label>
            <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleInputChange} className="border p-2 rounded text-xs">
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan</label>
            <input name="pekerjaan" value={formData.pekerjaan} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat</label>
            <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} className="border p-2 rounded text-xs h-20" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Usaha</label>
            <input name="nama_usaha" value={formData.nama_usaha} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tahun Berdiri</label>
            <input name="tahun_berdiri" value={formData.tahun_berdiri} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Usaha</label>
            <textarea name="alamat_usaha" value={formData.alamat_usaha} onChange={handleInputChange} className="border p-2 rounded text-xs h-20" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Dibuat</label>
            <input name="tempat_dibuat" value={formData.tempat_dibuat} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Penandatangan</label>
            <input name="penandatangan" value={formData.penandatangan} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jabatan Penandatangan</label>
            <input name="jabatan_penandatangan" value={formData.jabatan_penandatangan} onChange={handleInputChange} className="border p-2 rounded text-xs" />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR EDITOR */}
      <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft size={16} /> Kembali
        </button>
        
        <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase">Editor Surat {type}</h2>
        <div className="space-y-3">
          {renderSidebarEditor()}
        </div>

        <button
          onClick={generatePDF}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Menerbitkan...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Terbitkan & Kirim</span>
            </>
          )}
        </button>
      </div>

      {/* PREVIEW SURAT */}
      <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div ref={suratRef} className="bg-white shadow-lg">
            {type === "keramaian" && <TemplateKeramaian formData={formData} />}
            {type === "domisili" && <TemplateDomisili formData={formData} />}
            {type === "sktm" && <TemplateSKTM formData={formData} />}
            {type === "usaha" && <TemplateUsaha formData={formData} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== TEMPLATE COMPONENTS ====================

function TemplateKeramaian({ formData }) {
  return (
    <div className="page" style={{ 
      fontFamily: "'Times New Roman', serif", 
      fontSize: "12pt", 
      lineHeight: "1.6", 
      backgroundColor: "#ffffff", 
      width: "210mm", 
      minHeight: "297mm", // ✅ FIX 8: Tambah min-height
      padding: "15mm 20mm 25mm 20mm", // ✅ FIX 9: Tambah padding bottom
      color: "#000000", 
      boxSizing: "border-box" 
    }}>
      {/* HEADER */}
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
          SURAT KETERANGAN KERAMAIAN
        </h2>
        <p style={{ fontSize: "12pt", margin: "6px 0 0 0" }}>Nomor : {formData.nomorSurat}</p>
      </div>

      <div style={{ marginBottom: "20px", fontSize: "12pt" }}>
        <p style={{ textAlign: "justify", marginBottom: "14px", textIndent: "40px", lineHeight: "1.6" }}>
          Yang bertanda tangan di bawah ini Kepala Pekon Kandang Besi Kecamatan Kotaagung Barat Kabupaten Tanggamus menerangkan dengan sebenarnya bahwa :
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
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Umur</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.umur} Tahun</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Pekerjaan</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.pekerjaan}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Status</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.status}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Alamat</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.alamat}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>No. Hp/Wa</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.no_hp}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ textAlign: "justify", marginBottom: "14px", textIndent: "40px", lineHeight: "1.6" }}>
          Berdasarkan surat permohonan yang bersangkutan, maka dengan ini diberikan izin untuk mengadakan keramaian dengan ketentuan sebagai berikut :
        </p>

        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr>
              <td style={{ width: "180px", paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Hari/Tanggal</td>
              <td style={{ width: "15px", paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.hari} / {formData.tanggal_kegiatan}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Waktu</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.waktu}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Jenis Acara</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.acara}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Jenis Resepsi</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.resepsi}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Tempat Kegiatan</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.tempat_kegiatan}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Hiburan</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.hiburan}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Jumlah Undangan</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.jumlah_tamu} Orang</td>
            </tr>
          </tbody>
        </table>

        <p style={{ textAlign: "justify", marginBottom: "14px", textIndent: "40px", lineHeight: "1.6" }}>
          Dengan ketentuan kegiatan hiburan tersebut harus memperhatikan keamanan, ketertiban, dan ketentraman lingkungan serta tidak mengganggu kegiatan masyarakat sekitar.
        </p>

        <p style={{ textAlign: "justify", marginBottom: "60px", textIndent: "40px", lineHeight: "1.6" }}>
          Demikian surat izin ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
        </p>
      </div>

      {/* ✅ FIX 10: Tambah class signature-section */}
      <div className="signature-section" style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <div style={{ textAlign: "center", width: "230px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>Saksi I</p>
          <div style={{ height: "70px" }}></div>
          <p style={{ margin: "0", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
            {formData.saksi1_nama}
          </p>
        </div>

        <div style={{ textAlign: "center", width: "230px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>{formData.tempat_dibuat}, {formData.tglSurat}</p>
          <p style={{ margin: "0 0 10px 0" }}>Kepala Pekon Kandang Besi</p>
          
          {/* ✅ FIX 11: Tambah margin bottom untuk spacing */}
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img src={TTD_PEKON_PATH} alt="TTD" style={{ width: "120px", height: "60px", objectFit: "contain", margin: "0 auto" }} />
          </div>
          
          <p style={{ margin: "0", fontSize: "12pt", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
            {formData.penandatangan}
          </p>
        </div>

        <div style={{ textAlign: "center", width: "230px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>Saksi II</p>
          <div style={{ height: "70px" }}></div>
          <p style={{ margin: "0", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
            {formData.saksi2_nama}
          </p>
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
      minHeight: "297mm", // ✅ FIX 8
      padding: "15mm 20mm 25mm 20mm", // ✅ FIX 9
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
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Jenis Kelamin</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.jenis_kelamin}</td>
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
          Adalah benar bertempat tinggal lebih dari 3 (tiga) tahun berturut-turut dan benar berdomisili di Pekon Kandang Besi Kecamatan Kotaagung Barat Kabupaten Tanggamus.
        </p>

        <p style={{ marginBottom: "60px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
          Demikian surat keterangan Domisili ini dibuat agar dapat digunakan sebagaimana mestinya.
        </p>
      </div>

      {/* ✅ FIX 10: Tambah class signature-section */}
      <div className="signature-section" style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ textAlign: "center", width: "260px" }}>
          <p style={{ margin: "0 0 3px 0", fontSize: "12pt" }}>{formData.tempat_dibuat}, {formData.tglSurat}</p>
          <p style={{ margin: "0 0 10px 0", fontSize: "12pt" }}>Kepala Pekon Kandang Besi</p>
          {formData.jabatan_penandatangan && (
            <p style={{ margin: "0 0 10px 0", fontSize: "12pt" }}>{formData.jabatan_penandatangan}</p>
          )}
          
          {/* ✅ FIX 11: TTD dengan margin bottom */}
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img src={TTD_PEKON_PATH} alt="TTD" style={{ width: "120px", height: "60px", objectFit: "contain", margin: "0 auto" }} />
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
      minHeight: "297mm", // ✅ FIX 8
      padding: "15mm 20mm 25mm 20mm", // ✅ FIX 9
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

        <p style={{ marginBottom: "40px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
          Demikian Surat Keterangan ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ textAlign: "left", width: "260px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>Dikeluarkan di</p>
          <p style={{ margin: "0 0 16px 0" }}>Pada Tanggal</p>
        </div>
        <div style={{ textAlign: "left", width: "260px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>: Pekon {formData.tempat_dibuat}</p>
          <p style={{ margin: "0 0 16px 0" }}>: {formData.tglSurat}</p>
        </div>
      </div>

      {/* ✅ FIX 12: Perbaiki struktur signature section untuk SKTM */}
      <div className="signature-section" style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
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

        <div style={{ textAlign: "center", width: "230px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 10px 0" }}>Kepala Pekon Kandang Besi</p>
          
          {/* TTD KEPALA PEKON */}
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img src={TTD_PEKON_PATH} alt="TTD" style={{ width: "120px", height: "60px", objectFit: "contain", margin: "0 auto" }} />
          </div>
          
          <p style={{ margin: "0", fontSize: "12pt", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
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
      minHeight: "297mm", // ✅ FIX 8
      padding: "15mm 20mm 25mm 20mm", // ✅ FIX 9
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
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Jenis Kelamin</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.jenis_kelamin}</td>
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
          Adalah benar memiliki usaha dengan keterangan sebagai berikut :
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

        <p style={{ marginBottom: "60px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
          Demikian surat keterangan usaha ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>
      </div>

      {/* ✅ FIX 10: Tambah class signature-section */}
      <div className="signature-section" style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ textAlign: "center", width: "260px" }}>
          <p style={{ margin: "0 0 3px 0", fontSize: "12pt" }}>{formData.tempat_dibuat}, {formData.tglSurat}</p>
          <p style={{ margin: "0 0 10px 0", fontSize: "12pt" }}>Kepala Pekon Kandang Besi</p>
          {formData.jabatan_penandatangan && (
            <p style={{ margin: "0 0 10px 0", fontSize: "12pt" }}>{formData.jabatan_penandatangan}</p>
          )}
          
          {/* ✅ FIX 11: TTD dengan margin bottom */}
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img src={TTD_PEKON_PATH} alt="TTD" style={{ width: "120px", height: "60px", objectFit: "contain", margin: "0 auto" }} />
          </div>
          
          <p style={{ margin: "0", fontSize: "12pt", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
            {formData.penandatangan}
          </p>
        </div>
      </div>
    </div>
  );
}