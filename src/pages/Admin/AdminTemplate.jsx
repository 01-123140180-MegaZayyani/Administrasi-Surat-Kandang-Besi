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
        `/pengajuan/arsip/${id_pengajuan}`, 
        uploadData,
        { headers: { "Content-Type": "multipart/form-data" }, timeout: 30000 }
      );
      
      console.log("✅ Response dari server:", response.data);
      pdf.save(`Surat_${type.toUpperCase()}_${formData.nama}.pdf`);
      alert(`✅ Surat berhasil diterbitkan!`);
      navigate("/admin/pengajuan");
      
    } catch (err) {
      console.error("❌ Error detail:", err);
      alert(err.response?.data?.message || `Terjadi kesalahan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderSidebarEditor = () => {
    // ... Logika renderSidebarEditor tetap sama seperti kode Anda sebelumnya ...
    // (Dipotong untuk ringkas, namun tetap gunakan state formData)
  };

  const renderTemplateSurat = () => {
    if (type === "keramaian") return <TemplateKeramaian formData={formData} />;
    if (type === "sku") return <TemplateSKU formData={formData} />;
    if (type === "domisili") return <TemplateDomisili formData={formData} />;
    if (type === "sktm") return <TemplateSKTM formData={formData} />;
    return <div className="bg-white p-20 text-center"><h2 className="text-2xl font-bold text-red-600">Template belum tersedia</h2></div>;
  };

  return (
    <div className="flex h-screen bg-slate-200 font-sans overflow-hidden">
      <div className="w-[350px] bg-white h-full shadow-2xl z-20 p-6 overflow-y-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-800 font-bold text-xs mb-6 hover:underline">
          <ArrowLeft size={16} /> KEMBALI
        </button>
        <h2 className="text-sm font-black text-slate-800 border-b pb-2 mb-6 uppercase tracking-widest">
          Editor Surat {type?.toUpperCase()}
        </h2>
        <div className="space-y-5">
           {/* Masukkan input fields di sini berdasarkan type surat */}
           {renderSidebarEditor()}
        </div>
        <button onClick={generatePDF} disabled={loading} className="w-full mt-10 bg-blue-900 text-white py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          {loading ? "SEDANG MEMPROSES..." : "TERBITKAN & KIRIM KE WARGA"}
        </button>
      </div>
      <div className="flex-1 h-full overflow-y-auto p-10 flex flex-col items-center bg-slate-100">
        <div ref={suratRef}>{renderTemplateSurat()}</div>
      </div>
    </div>
  );
}

// Komponen Template SKU (Contoh)
function TemplateSKU({ formData }) {
  return (
    <div className="page" style={{ 
      fontFamily: "'Times New Roman', serif", 
      fontSize: "12pt", 
      lineHeight: "1.6", 
      backgroundColor: "#ffffff", 
      width: "210mm", 
      padding: "15mm 20mm", 
      color: "#000000", 
      boxSizing: "border-box" 
    }}>
      {/* Header & Isi Template SKU Anda di sini */}
      <div style={{ display: "flex", alignItems: "center", paddingBottom: "8px", marginBottom: "12px", borderBottom: "3px solid #000000" }}>
        <img src={LOGO_PATH} alt="Logo" style={{ width: "70px", height: "70px", marginRight: "15px" }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1 style={{ fontSize: "14pt", fontWeight: "bold", margin: "0" }}>PEMERINTAH KABUPATEN TANGGAMUS</h1>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", margin: "0" }}>PEKON KANDANG BESI</h2>
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2 style={{ textDecoration: "underline", fontWeight: "bold" }}>SURAT KETERANGAN USAHA</h2>
        <p>Nomor : {formData.nomorSurat}</p>
      </div>
      {/* ... sisa konten template ... */}
    </div>
  );
}

// Tambahkan TemplateKeramaian, TemplateDomisili, TemplateSKTM di bawah ini sesuai kebutuhan