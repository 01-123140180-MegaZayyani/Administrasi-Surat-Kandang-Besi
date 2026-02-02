import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "../../utils/api";
import logoTanggamus from '../../assets/Kabupaten Tanggamus.png';
import ttdPekon from '../../assets/Tanda Tangan.png'; 

// Deklarasi konstanta di luar komponen
const LOGO_PATH = logoTanggamus; 
const TTD_PEKON_PATH = ttdPekon; // TTD Kepala Pekon

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
        min-height: auto !important;
        /* ✅ HAPUS BARIS INI - biar pakai padding dari template */
        /* padding: 20mm 15mm !important; */
        margin: 0 !important;
        background: white !important;
        box-sizing: border-box !important;
        overflow: visible !important;
      }
      .page * {
        position: static !important;
        color: #000000 !important;
        background-color: transparent !important;
        font-family: 'Times New Roman', Times, serif !important;
        box-sizing: border-box !important;
      }
      .page table {
        border-collapse: collapse !important;
        border-spacing: 0 !important;
        table-layout: fixed !important;
      }
    `;
    
    document.head.appendChild(style);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pages = element.querySelectorAll('.page');
    console.log(`📄 Jumlah halaman ditemukan: ${pages.length}`);
    
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    for (let i = 0; i < pages.length; i++) {
      console.log(`🖼️ Memproses halaman ${i + 1}...`);
      
      const pageClone = pages[i].cloneNode(true);
      pageClone.style.position = 'absolute';
      pageClone.style.left = '-9999px';
      pageClone.style.width = '210mm';
      pageClone.style.minHeight = 'auto';
      document.body.appendChild(pageClone);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(pageClone, { 
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        removeContainer: true,
        allowTaint: false,
        foreignObjectRendering: false,
        imageTimeout: 0,
        width: 794,
        windowWidth: 794
      });
      
      document.body.removeChild(pageClone);
      
      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgProps = pdf.getImageProperties(imgData);
      
      let imgWidth = pdfWidth;
      let imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      if (i > 0) pdf.addPage();
      
      if (imgHeight > pdfHeight) {
        console.log(`⚠️ Halaman ${i + 1} terlalu tinggi (${imgHeight}mm), scaling down ke ${pdfHeight}mm`);
        const ratio = pdfHeight / imgHeight;
        imgWidth = imgWidth * ratio;
        imgHeight = pdfHeight;
      }
      
      const xOffset = (pdfWidth - imgWidth) / 2;
      pdf.addImage(imgData, "PNG", xOffset, 0, imgWidth, imgHeight, undefined, 'FAST');
      
      console.log(`✅ Halaman ${i + 1} selesai (${imgWidth.toFixed(2)}mm x ${imgHeight.toFixed(2)}mm)`);
    }
    
    const styleToRemove = document.getElementById('pdf-layout-fix');
    if (styleToRemove) document.head.removeChild(styleToRemove);
    
    const timestamp = Date.now();
    const fileName = `surat_${type}_${id_pengajuan}_${timestamp}.pdf`;
    
    const pdfBlob = pdf.output("blob");
    const uploadData = new FormData();
    uploadData.append("file", pdfBlob, fileName);
    uploadData.append("status", "Selesai");

    const response = await api.put(
      `/api/admin/surat/${id_pengajuan}`, 
      uploadData,
      {timeout: 30000 }
    );
    
    console.log("✅ Response dari server:", response.data);
    pdf.save(`Surat_${type.toUpperCase()}_${formData.nama}.pdf`);
    alert(`✅ Surat berhasil diterbitkan!\n\n📄 Total: ${pages.length} halaman\n🎉 Status diperbarui ke 'Selesai'\n📥 Warga sudah bisa download surat mereka`);
    navigate("/admin/pengajuan");
    
  } catch (err) {
    console.error("❌ Error detail:", err);
    if (err.response) {
      alert(`Gagal upload PDF: ${err.response.data.message || err.response.statusText}`);
    } else if (err.request) {
      alert("Server tidak merespons. Pastikan backend berjalan!");
    } else {
      alert(`Terjadi kesalahan: ${err.message}`);
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
            <input name="tglSurat" value={formData.tglSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
          </div>
          <div className="border-t pt-4 mt-2">
            <h3 className="text-[10px] font-bold text-slate-600 mb-3 uppercase">Data Pemohon</h3>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
              <input name="nama" value={formData.nama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm bg-slate-50" />
            </div>
          </div>
          <div className="border-t pt-4 mt-2">
            <h3 className="text-[10px] font-bold text-slate-600 mb-3 uppercase">Penandatangan</h3>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Dibuat</label>
              <input name="tempat_dibuat" value={formData.tempat_dibuat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Jabatan</label>
              <input name="jabatan_penandatangan" value={formData.jabatan_penandatangan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Penandatangan</label>
              <input name="penandatangan" value={formData.penandatangan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
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
            <input name="tglSurat" value={formData.tglSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
          </div>
          <div className="border-t pt-4 mt-2">
            <h3 className="text-[10px] font-bold text-slate-600 mb-3 uppercase">Data Pemohon</h3>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
              <input name="nama" value={formData.nama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm bg-slate-50" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Peringkat Desil</label>
              <input name="peringkat_desil" value={formData.peringkat_desil} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
          </div>
          <div className="border-t pt-4 mt-2">
            <h3 className="text-[10px] font-bold text-slate-600 mb-3 uppercase">Penandatangan</h3>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Dibuat</label>
              <input name="tempat_dibuat" value={formData.tempat_dibuat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Camat</label>
              <input name="nama_camat" value={formData.nama_camat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">NIP Camat</label>
              <input name="nip_camat" value={formData.nip_camat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Penandatangan (Kades)</label>
              <input name="penandatangan" value={formData.penandatangan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
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
            <input name="tglSurat" value={formData.tglSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Hari</label>
              <input name="hari" value={formData.hari} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tgl Acara</label>
              <input name="tanggal_kegiatan" value={formData.tanggal_kegiatan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Waktu</label>
            <input name="waktu" value={formData.waktu} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Acara</label>
            <input name="acara" value={formData.acara} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Hiburan</label>
            <input name="hiburan" value={formData.hiburan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Kegiatan</label>
            <textarea name="tempat_kegiatan" value={formData.tempat_kegiatan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" rows="3" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Jumlah Tamu (± orang)</label>
            <input name="jumlah_tamu" value={formData.jumlah_tamu} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
          </div>
          <div className="border-t pt-4 mt-2">
            <h3 className="text-[10px] font-bold text-slate-600 mb-3 uppercase">Data Saksi</h3>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Saksi 1</label>
              <input name="saksi1_nama" value={formData.saksi1_nama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Saksi 2</label>
              <input name="saksi2_nama" value={formData.saksi2_nama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Camat</label>
              <input name="nama_camat" value={formData.nama_camat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">NIP Camat</label>
              <input name="nip_camat" value={formData.nip_camat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Danramil</label>
              <input name="nama_danramil" value={formData.nama_danramil} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">NIP Danramil</label>
              <input name="nip_danramil" value={formData.nip_danramil} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Penandatangan (Kades)</label>
              <input name="penandatangan" value={formData.penandatangan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
          </div>
        </>
      );
    } else if (type === "sku") {
      return (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nomor Surat</label>
            <input name="nomorSurat" value={formData.nomorSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Surat</label>
            <input name="tglSurat" value={formData.tglSurat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
          </div>
          <div className="border-t pt-4 mt-2">
            <h3 className="text-[10px] font-bold text-slate-600 mb-3 uppercase">Data Pemohon</h3>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
              <input name="nama" value={formData.nama} onChange={handleInputChange} className="border p-2 rounded-lg text-sm bg-slate-50" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">NIK</label>
              <input name="nik" value={formData.nik} onChange={handleInputChange} className="border p-2 rounded-lg text-sm bg-slate-50" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat, Tanggal Lahir</label>
              <input name="ttl" value={formData.ttl} onChange={handleInputChange} className="border p-2 rounded-lg text-sm bg-slate-50" />
            </div>
          </div>
          <div className="border-t pt-4 mt-2">
            <h3 className="text-[10px] font-bold text-slate-600 mb-3 uppercase">Data Usaha</h3>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Usaha</label>
              <input name="nama_usaha" value={formData.nama_usaha} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tahun Berdiri</label>
              <input name="tahun_berdiri" value={formData.tahun_berdiri} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Usaha</label>
              <textarea name="alamat_usaha" value={formData.alamat_usaha} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" rows="3" />
            </div>
          </div>
          <div className="border-t pt-4 mt-2">
            <h3 className="text-[10px] font-bold text-slate-600 mb-3 uppercase">Penandatangan</h3>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat Dibuat</label>
              <input name="tempat_dibuat" value={formData.tempat_dibuat} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Jabatan</label>
              <input name="jabatan_penandatangan" value={formData.jabatan_penandatangan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Penandatangan</label>
              <input name="penandatangan" value={formData.penandatangan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
             <div className="flex flex-col gap-1 mb-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Kasih Pelayanan</label>
              <input name="nama_kasih_pelayanan" value={formData.nama_kasih_pelayanan} onChange={handleInputChange} className="border p-2 rounded-lg text-sm" />
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  const renderTemplateSurat = () => {
    if (type === "keramaian") return <TemplateKeramaian formData={formData} />;
    if (type === "sku") return <TemplateSKU formData={formData} />;
    if (type === "domisili") return <TemplateDomisili formData={formData} />;
    if (type === "sktm") return <TemplateSKTM formData={formData} />;
    return <div className="bg-white p-20 text-center"><h2 className="text-2xl font-bold text-red-600">Template untuk {type?.toUpperCase()} belum tersedia</h2></div>;
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
        <div className="space-y-5">{renderSidebarEditor()}</div>
        <button onClick={generatePDF} disabled={loading} className="w-full mt-10 bg-blue-900 text-white py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          {loading ? "SEDANG MEMPROSES..." : "TERBITKAN & KIRIM KE WARGA"}
        </button>
        {loading && <p className="text-[9px] text-center text-slate-400 mt-2 animate-pulse">Mohon tunggu, sedang generate PDF...</p>}
      </div>
      <div className="flex-1 h-full overflow-y-auto p-10 flex flex-col items-center bg-slate-100">
        <div ref={suratRef}>{renderTemplateSurat()}</div>
      </div>
    </div>
  );
}

function TemplateSKU({ formData }) {
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
          <h1 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            KECAMATAN KOTAAGUNG BARAT
          </h1>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            PEKON KANDANG BESI
          </h2>
          <p style={{ fontSize: "10pt", margin: "3px 0 0 0", lineHeight: "1.3" }}>
            Alamat : Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus Kode Pos : 35651
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
          Yang bertanda tangan dibawah ini Kepala Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus menerangkan dengan sebenarnya bahwa:
        </p>

        {/* TABEL DENGAN TITIK DUA SEJAJAR */}
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
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Tempat tanggal lahir</td>
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

        <p style={{ marginBottom: "14px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
          Nama tersebut diatas adalah penduduk Pekon Kandang Besi yang bertempat tinggal di wilayah Kandang Besi.
        </p>

        <p style={{ marginBottom: "18px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
          Nama tersebut diatas membuka usaha "{formData.nama_usaha}" yang berlokasi di wilayah {formData.alamat_usaha} sejak tahun {formData.tahun_berdiri} sampai berjalan saat ini.
        </p>

        <p style={{ marginBottom: "40px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
          Demikian surat keterangan ini dibuat dengan sebenar-benarnya untuk digunakan sebagaimana mestinya.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ textAlign: "left", width: "260px" }}>
          <table style={{ width: "100%", borderSpacing: "0", marginBottom: "20px", fontSize: "12pt" }}>
            <tbody>
              <tr>
                <td style={{ width: "90px", textAlign: "left", paddingBottom: "5px" }}>Dibuat</td>
                <td style={{ width: "15px", textAlign: "left", paddingBottom: "5px" }}>:</td>
                <td style={{ textAlign: "left", paddingBottom: "5px" }}>Di {formData.tempat_dibuat}</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", paddingBottom: "6px" }}>Pada Tanggal</td>
                <td style={{ textAlign: "left", paddingBottom: "6px" }}>:</td>
                <td style={{ textAlign: "left", paddingBottom: "6px" }}>{formData.tglSurat}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ margin: "0 0 3px 0", fontSize: "12pt", textAlign: "center" }}>Kepala Pekon Kandang Besi</p>
          <p style={{ margin: "0 0 10px 0", fontSize: "12pt", textAlign: "center" }}>{formData.jabatan_penandatangan}</p>
          
          <div style={{ textAlign: "center", width: "180px", fontSize: "12pt" }}>
    {/* KOSONG - TANPA TTD */}
    <div style={{ height: "70px" }}></div>
    
    <p style={{ margin: "0 0 3px 80px", fontSize: "12pt", textAlign: "center"}}>{formData.nama_kasih_pelayanan || "...................................."}</p>
        </div>
      </div>
    </div>
    </div>
  );
}

function TemplateKeramaian({ formData }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      
      {/* ================================ */}
      {/* HALAMAN 1 - SURAT PERMOHONAN */}
      {/* ================================ */}
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
            <h2 style={{ fontSize: "15pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
              PEKON KANDANG BESI
            </h2>
            <p style={{ fontSize: "10pt", margin: "3px 0 0 0", lineHeight: "1.3" }}>
              Alamat : Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus Kode Pos : 35651
            </p>
          </div>
        </div>

        <div style={{ textAlign: "right", marginBottom: "18px" }}>
          <p style={{ margin: "0", fontSize: "12pt" }}>Kandang Besi, {formData.tglSurat}</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
          <div style={{ width: "55%" }}>
            <table style={{ width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
              <tbody>
                <tr>
                  <td style={{ width: "85px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Nomor</td>
                  <td style={{ width: "15px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                  <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.nomorSurat}</td>
                </tr>
                <tr>
                  <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Lampiran</td>
                  <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                  <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>3 Lembar</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top", paddingBottom: "5px", textAlign: "left" }}>Perihal</td>
                  <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                  <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>
                    Permohonan Penerbitan Surat Izin Keramaian
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ width: "190px", textAlign: "left", fontSize: "12pt" }}>
            <p style={{ margin: "0 0 3px 0" }}>Kepada Yth.,</p>
            <p style={{ margin: "0 0 3px 0", fontWeight: "600" }}>Bapak Ka. Polsek</p>
            <p style={{ margin: "0 0 3px 0", fontWeight: "600" }}>Kotaagung</p>
            <p style={{ margin: "0 0 3px 0" }}>di –</p>
            <p style={{ margin: "0", fontWeight: "600", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              KOTA AGUNG
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "18px", fontSize: "12pt" }}>
          <p style={{ textAlign: "justify", marginBottom: "14px", textIndent: "40px", lineHeight: "1.6" }}>
            Yang bertanda tangan dibawah ini Kepala Pekon Kandang Besi Kecamatan Kotaagung Barat Kabupaten Tanggamus dengan hormat kehadapan Bapak untuk dapat kiranya menerbitkan Surat Izin Pernikahan/ Keramaian terhadap warga kami :
          </p>

          <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
            <tbody>
              <tr>
                <td style={{ width: "180px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Nama</td>
                <td style={{ width: "15px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.nama}</td>
              </tr>
              <tr>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Tempat, Tanggal Lahir</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.ttl}</td>
              </tr>
              <tr>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Pekerjaan</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.pekerjaan}</td>
              </tr>
              <tr>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Alamat</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.alamat}</td>
              </tr>
              <tr>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>No. HP</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.no_hp}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginBottom: "14px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>
            Sehubungan dengan akan diadakannya kegiatan <strong>{formData.acara}</strong> dengan Hiburan <strong>{formData.hiburan}</strong> pada
          </p>

          <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
            <tbody>
              <tr>
                <td style={{ width: "120px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Hari</td>
                <td style={{ width: "15px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.hari}</td>
              </tr>
              <tr>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Tanggal</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.tanggal_kegiatan}</td>
              </tr>
              <tr>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Waktu</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.waktu}</td>
              </tr>
              <tr>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Resepsi</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.resepsi}</td>
              </tr>
              <tr>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Hiburan</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.hiburan}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: "top", paddingBottom: "5px", textAlign: "left" }}>Tempat</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
                <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.tempat_kegiatan}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ textAlign: "justify", marginBottom: "14px", textIndent: "40px", lineHeight: "1.6" }}>
            Untuk bahan pertimbangan Bapak, bahwa dalam hajatan tersebut akan mengundang tetangga, sanak saudara, family, kerabat serta handai taulan dengan jumlah sekitar ± {formData.jumlah_tamu} orang
          </p>

          <p style={{ textAlign: "justify", textIndent: "40px", lineHeight: "1.6" }}>
            Demikian dan atas Kebijaksanaan Bapak kami mengucapkan terimakasih.
          </p>
        </div>
  
        {/* CONTAINER UNTUK KETIGA TTD */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start",
          marginTop: "30px",
          gap: "20px"
        }}>
          {/* TTD 1: Camat */}
          <div style={{ textAlign: "center", width: "180px", fontSize: "12pt" }}>
            <p style={{ margin: "0 0 10px 0" }}>Camat Kotaagung</p>
            <div style={{ height: "70px" }}></div>
            <p style={{ margin: "0", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              {formData.nama_camat || "(....................................)"}
            </p>
            <p style={{ margin: "3px 0 0 0", fontSize: "11pt" }}>
              NIP. {formData.nip_camat || "...................................."}
            </p>
          </div>

          {/* TTD 2: Kepala Pekon */}
          <div style={{ textAlign: "center", width: "180px", fontSize: "12pt" }}>
            <p style={{ margin: "0 0 10px 0" }}>Kepala Pekon Kandang Besi</p>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <img src={TTD_PEKON_PATH} alt="TTD" style={{ width: "100px", height: "50px", objectFit: "contain", margin: "0 auto" }} />
            </div>
            <p style={{ margin: "0", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              {formData.penandatangan}
            </p>
          </div>

          {/* TTD 3: Danramil */}
          <div style={{ textAlign: "center", width: "180px", fontSize: "12pt" }}>
            <p style={{ margin: "0 0 10px 0" }}>Danramil 04/KTA</p>
            <div style={{ height: "70px" }}></div>
            <p style={{ margin: "0", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              {formData.nama_danramil || "(....................................)"}
            </p>
            <p style={{ margin: "3px 0 0 0", fontSize: "11pt" }}>
              {formData.nip_danramil || "...................................."}
            </p>
          </div>
        </div>
      </div>


      {/* ================================ */}
      {/* HALAMAN 2 - SURAT PERNYATAAN PEMOHON */}
      {/* ================================ */}
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
        <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: "14pt", marginBottom: "18px", textDecoration: "underline", textUnderlineOffset: "3px" }}>
          SURAT PERNYATAAN
        </h2>

        <p style={{ marginBottom: "14px", fontSize: "12pt", textAlign: "left" }}>
          Yang bertanda tangan dibawah ini, saya :
        </p>

        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr>
              <td style={{ width: "180px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Nama</td>
              <td style={{ width: "15px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.nama}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Tempat, Tgl Lahir</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.ttl}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Umur</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>
                {(() => {
                  const birthYear = formData.ttl.split('-')[2] || formData.ttl.split(',')[1];
                  const age = birthYear ? new Date().getFullYear() - parseInt(birthYear) : formData.umur || '';
                  return age ? `${age} Tahun` : '-';
                })()}
              </td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Agama</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.agama}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Pekerjaan</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.pekerjaan}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Alamat Lengkap</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.alamat}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Nomor HP</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.no_hp}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginBottom: "14px", fontSize: "12pt", textAlign: "left" }}>
          Sehubungan dengan akan diadakannya Kegiatan Hiburan Orgen Tunggal Pada :
        </p>

        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr>
              <td style={{ width: "120px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Hari</td>
              <td style={{ width: "15px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.hari}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Tanggal</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.tanggal_kegiatan}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Waktu</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.waktu}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>Resepsi</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.resepsi}</td>
            </tr>
            <tr>
              <td style={{ verticalAlign: "top", paddingBottom: "5px", textAlign: "left" }}>Tempat</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.tempat_kegiatan}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ textAlign: "justify", marginBottom: "14px", fontSize: "12pt", lineHeight: "1.6" }}>
          Dengan ini saya menyatakan bahwa demi untuk menjaga keamanan dan ketertiban selama acara berlangsung, saya akan mematuhi semua aturan dalam Perjanjian Keramaian termasuk batas waktu tertulis dalam Permohonan Surat Izin Keramaian serta tidak akan melakukan :
        </p>

        <div style={{ marginBottom: "18px", marginLeft: "0", fontSize: "12pt" }}>
          <p style={{ marginBottom: "8px", lineHeight: "1.6", textAlign: "justify" }}>
            1. Menyelenggarakan pesta Miras (MABOK) dan pesta Narkoba.
          </p>
          <p style={{ marginBottom: "8px", lineHeight: "1.6", textAlign: "justify" }}>
            2. Penggunaan jalan umum sebagai Lokasi Pendirian Tenda (setengah badan jalan) atau menutup jalan yang dapat menggangu pengguna jalan.
          </p>
          <p style={{ marginBottom: "8px", lineHeight: "1.6", textAlign: "justify" }}>
            3. Tidak akan pernah ada ajang Perjudian.
          </p>
          <p style={{ marginBottom: "8px", lineHeight: "1.6", textAlign: "justify" }}>
            4. Waktu Pelaksanaan Hiburan Orgen paling lambat Pukul 18.00 WIB sesuai dengan Kesepakatan bersama Forkopimda Kab.Tanggamus, Ketua FKUB Kab.Tanggamus, Ketua Apdesi Kab.Tanggamus, Tokoh Adat Lampung Kab.Tanggamus, Forkopimcab Se-Kab.Tanggamus, dan Pemilik Orgen Tunggal se-Kabupaten Tanggamus yang diatur dalam Perda Kabupaten Tanggamus No.05 Tahun 2017 tentang Pengaturan Hiburan Umum.
          </p>
        </div>

        <p style={{ textAlign: "justify", marginBottom: "40px", fontSize: "12pt", lineHeight: "1.6" }}>
          Apabila saya melanggar, saya bersedia dikenakan Sanksi sesuai dengan undang-undang dan hukum yang berlaku di Wilayah Kabupaten Tanggamus, dan tidak akan melibatkan Aparatur Pekon setempat dan sepenuhnya menjadi tanggung jawab saya yang membuat Pernyataan.
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
          <div style={{ width: "260px", fontSize: "12pt" }}>
            <p style={{ marginBottom: "5px", textAlign: "left" }}>Saksi-saksi :</p>
            <p style={{ marginBottom: "5px", textAlign: "left" }}>1. Bpk. {formData.saksi1_nama.toUpperCase()} (......................)</p>
            <p style={{ marginBottom: "60px", textAlign: "left" }}>2. Bpk. {formData.saksi2_nama.toUpperCase()} (......................)</p>
          </div>

          <div style={{ textAlign: "center", width: "210px", fontSize: "12pt" }}>
            <p style={{ margin: "0 0 3px 0" }}>Kandang Besi, {formData.tglSurat}</p>
            <p style={{ margin: "0 0 3px 0" }}>Yang membuat Pernyataan</p>
            <div style={{ fontSize: "9pt", color: "#999999", fontStyle: "italic", marginBottom: "60px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Materai 10000
            </div>
            <p style={{ margin: "0", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              {formData.nama}
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "50px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>Mengetahui,</p>
          <p style={{ margin: "0 0 10px 0" }}>Kepala Pekon Kandang Besi,</p>
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img src={TTD_PEKON_PATH} alt="TTD" style={{ width: "120px", height: "60px", objectFit: "contain", margin: "0 auto" }} />
          </div>
          <p style={{ margin: "0", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
            {formData.penandatangan}
          </p>
        </div>
      </div>


      {/* ================================ */}
      {/* HALAMAN 3 - SURAT PERNYATAAN PEMILIK ORGEN */}
      {/* ================================ */}
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
        <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: "14pt", marginBottom: "18px", textDecoration: "underline", textUnderlineOffset: "3px" }}>
          SURAT PERNYATAAN
        </h2>

        <p style={{ marginBottom: "14px", fontSize: "12pt", textAlign: "left" }}>
          Yang bertanda tangan dibawah ini saya :
        </p>

        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr>
              <td style={{ width: "180px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>NAMA</td>
              <td style={{ width: "15px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.nama_pemilik_orgen.toUpperCase()}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>UMUR</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.umur_orgen} Tahun</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>PEKERJAAN</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.pekerjaan_orgen.toUpperCase()}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>ALAMAT</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.alamat_orgen}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>NAMA ORGEN</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.nama_unit_orgen}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginBottom: "14px", fontSize: "12pt", textAlign: "left" }}>
          Sehubungan akan diadakan resepsi {formData.acara.toLowerCase()} pada :
        </p>

        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr>
              <td style={{ width: "120px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>HARI</td>
              <td style={{ width: "15px", paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.hari}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>TANGGAL</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.tanggal_kegiatan}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>WAKTU</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.waktu.toUpperCase()}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>ACARA</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.acara}</td>
            </tr>
            <tr>
              <td style={{ verticalAlign: "top", paddingBottom: "5px", textAlign: "left" }}>TEMPAT</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "5px", verticalAlign: "top", textAlign: "left" }}>{formData.tempat_kegiatan}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ textAlign: "justify", marginBottom: "14px", fontSize: "12pt", lineHeight: "1.6" }}>
          Saya pemilik Orgen Tunggal dengan ini menyatakan bahwa demi untuk menjaga keamanan dan ketertiban selama acara berlangsung, saya akan mematuhi semua aturan dalam perjanjian keramaian, termasuk batas waktu yang tertulis dalam surat izin, serta saya tidak akan melakukan pelanggaran lain, yaitu :
        </p>

        <div style={{ marginBottom: "40px", marginLeft: "0", fontSize: "12pt" }}>
          <p style={{ marginBottom: "8px", lineHeight: "1.6", textAlign: "justify" }}>
            1. Menyelenggarakan pesta miras (mabuk-mabukan) dan pesta narkoba.
          </p>
          <p style={{ marginBottom: "8px", lineHeight: "1.6", textAlign: "justify" }}>
            2. Tidak memaikan Orgen tunggal diatas pukul 18.00 wib (malam hari).
          </p>
          <p style={{ marginBottom: "8px", lineHeight: "1.6", textAlign: "justify" }}>
            3. Saya sebagai pemilik Orgen Tunggal siap menerima sanksi / hukuman dari Pihak kepolisian jika saya melanggar surat pernyataan ini.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
          <div style={{ textAlign: "center", width: "210px", fontSize: "12pt" }}>
            <p style={{ margin: "0 0 3px 0" }}>YANG MEMBUAT PERNYATAAN</p>
            <div style={{ fontSize: "9pt", color: "#999999", fontStyle: "italic", marginBottom: "60px", height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Materai 10000
            </div>
            <p style={{ margin: "0", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              {formData.nama_pemilik_orgen.toUpperCase()}
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "50px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>Mengetahui</p>
          <p style={{ margin: "0 0 10px 0" }}>Kepala Pekon Kandang Besi</p>
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img src={TTD_PEKON_PATH} alt="TTD" style={{ width: "120px", height: "60px", objectFit: "contain", margin: "0 auto" }} />
          </div>
          <p style={{ margin: "0", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>
            {formData.penandatangan}
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
            PEMERINTAH PEKON KANDANG BESI
          </h1>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            KECAMATAN KOTAAGUNG BARAT
          </h2>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>
            KABUPATEN TANGGAMUS
          </h2>
          <p style={{ fontSize: "10pt", margin: "3px 0 0 0", lineHeight: "1.3" }}>
            Alamat : Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus Kode Pos : 35651
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
          Yang bertanda tangan dibawah ini Kepala Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus, dengan ini menerangkan bahwa :
        </p>

        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr>
              <td style={{ width: "180px", paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Nama</td>
              <td style={{ width: "15px", paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.nama}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Tempat, Tanggal Lahir</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.ttl}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>No NIK</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.nik}</td>
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
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Agama</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>{formData.agama}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>Alamat</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>:</td>
              <td style={{ paddingBottom: "6px", verticalAlign: "top", textAlign: "left" }}>
                Pekon Kandang Besi Kecamatan Kotaagung Barat, Kabupaten Tanggamus.
              </td>
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

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ textAlign: "center", width: "260px" }}>
          <p style={{ margin: "0 0 3px 0", fontSize: "12pt" }}>{formData.tempat_dibuat}, {formData.tglSurat}</p>
          <p style={{ margin: "0 0 10px 0", fontSize: "12pt" }}>Kepala Pekon Kandang Besi</p>
          {formData.jabatan_penandatangan && (
            <p style={{ margin: "0 0 10px 0", fontSize: "12pt" }}>{formData.jabatan_penandatangan}</p>
          )}
          
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