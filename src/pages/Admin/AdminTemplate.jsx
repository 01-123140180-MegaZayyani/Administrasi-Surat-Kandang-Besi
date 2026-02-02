import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  const [imagesLoaded, setImagesLoaded] = useState(false);

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
    penandatangan: "MUKHTAR",
    jabatan_penandatangan: type === "keramaian" ? "" : type === "domisili" ? "" : "A.n Kasi Pelayanan",
    nama_camat: "",
    nip_camat: "",
    nama_kasih_pelayanan: warga?.nama_kasih_pelayanan || ""
  });

  // ✅ PRE-LOAD SEMUA GAMBAR
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = [LOGO_PATH, TTD_PEKON_PATH].map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            console.log(`✅ Image loaded: ${src}`);
            resolve();
          };
          img.onerror = () => {
            console.error(`❌ Failed to load: ${src}`);
            reject();
          };
          img.src = src;
        });
      });

      try {
        await Promise.all(imagePromises);
        console.log("✅ All images pre-loaded successfully");
        setImagesLoaded(true);
      } catch (err) {
        console.error("❌ Failed to load images:", err);
        setImagesLoaded(true); // Continue anyway
      }
    };

    loadImages();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = async () => {
    if (!imagesLoaded) {
      alert("⏳ Tunggu, gambar sedang dimuat...");
      return;
    }

    setLoading(true);
    try {
      console.log("🔄 Memulai generate PDF...");
      
      const element = suratRef.current;
      if (!element) {
        throw new Error("Element surat tidak ditemukan");
      }

      // ✅ Style untuk memastikan semua konten visible
      const style = document.createElement('style');
      style.id = 'pdf-layout-fix';
      style.textContent = `
        .page {
          position: relative !important;
          display: block !important;
          width: 210mm !important;
          min-height: 297mm !important;
          padding: 15mm 20mm !important;
          margin: 0 auto !important;
          background: white !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }
        .page * {
          color: #000000 !important;
          font-family: 'Times New Roman', Times, serif !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .page img {
          display: inline-block !important;
          max-width: 100% !important;
          height: auto !important;
        }
        .page table {
          border-collapse: collapse !important;
          width: 100% !important;
        }
      `;
      document.head.appendChild(style);
      
      // ✅ Tunggu DOM update
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const pages = element.querySelectorAll('.page');
      console.log(`📄 Jumlah halaman: ${pages.length}`);
      
      if (pages.length === 0) {
        throw new Error("Tidak ada halaman yang ditemukan");
      }

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      for (let i = 0; i < pages.length; i++) {
        console.log(`📸 Capturing halaman ${i + 1}/${pages.length}...`);
        
        const pageElement = pages[i];
        
        // ✅ Scroll ke element
        pageElement.scrollIntoView({ behavior: 'instant', block: 'start' });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // ✅ Capture dengan settings optimal
        const canvas = await html2canvas(pageElement, { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: true,
          backgroundColor: '#ffffff',
          width: 794, // 210mm in pixels
          height: 1123, // 297mm in pixels
          windowWidth: 794,
          windowHeight: 1123,
          scrollY: -window.scrollY,
          scrollX: -window.scrollX,
          onclone: (clonedDoc) => {
            const clonedPage = clonedDoc.querySelector('.page');
            if (clonedPage) {
              clonedPage.style.display = 'block';
              clonedPage.style.minHeight = '297mm';
              clonedPage.style.padding = '15mm 20mm';
              
              // Force all images visible
              const imgs = clonedPage.querySelectorAll('img');
              imgs.forEach(img => {
                img.style.display = 'inline-block';
                img.style.visibility = 'visible';
                img.style.opacity = '1';
              });
            }
          }
        });
        
        console.log(`✅ Canvas created: ${canvas.width}x${canvas.height}px`);
        
        // ✅ Convert ke image dengan quality tinggi
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        
        if (i > 0) pdf.addPage();
        
        // ✅ Add image fit to page
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        // Jika lebih tinggi dari A4, scale down
        if (imgHeight > pdfHeight) {
          const scale = pdfHeight / imgHeight;
          pdf.addImage(imgData, "JPEG", 0, 0, imgWidth * scale, pdfHeight, undefined, 'FAST');
        } else {
          pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        }
        
        console.log(`✅ Halaman ${i + 1} ditambahkan ke PDF`);
      }
      
      // ✅ Cleanup
      const styleToRemove = document.getElementById('pdf-layout-fix');
      if (styleToRemove) document.head.removeChild(styleToRemove);
      
      // ✅ Save & Upload
      const timestamp = Date.now();
      const fileName = `surat_${type}_${id_pengajuan}_${timestamp}.pdf`;
      const pdfBlob = pdf.output("blob");
      
      console.log(`📦 PDF size: ${(pdfBlob.size / 1024).toFixed(2)} KB`);

      const uploadData = new FormData();
      uploadData.append("pdf", pdfBlob, fileName);
      uploadData.append("status", "Selesai");

      console.log("📤 Uploading ke server...");
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
      
      if (err.response?.status === 401) {
        alert("Sesi habis, silakan login kembali");
        navigate("/admin/login"); // ✅ FIXED: Redirect ke /admin/login
      } else {
        alert(err.response?.data?.message || `Terjadi kesalahan: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
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
  };

  const renderTemplate = () => {
    if (type === "domisili") return <TemplateDomisili formData={formData} />;
    if (type === "sktm") return <TemplateSKTM formData={formData} />;
    if (type === "keramaian") return <TemplateKeramaian formData={formData} />;
    if (type === "sku") return <TemplateSKU formData={formData} />;
    return <p className="text-center text-slate-400 py-20">Template tidak ditemukan untuk jenis: {type}</p>;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b px-8 py-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/pengajuan")} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Template Surat {type}</h1>
            <p className="text-xs text-slate-400 font-semibold">ID Pengajuan: {id_pengajuan}</p>
          </div>
        </div>
        <button onClick={generatePDF} disabled={loading || !imagesLoaded} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          {loading ? (<><Loader2 size={16} className="animate-spin" /> Generating...</>) : (<><Send size={16} /> Terbitkan Surat</>)}
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-[350px_1fr] gap-8">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border h-fit sticky top-8">
            <h2 className="text-sm font-black text-slate-800 uppercase mb-6 tracking-tight">Data Surat</h2>
            <div className="space-y-4">
              {renderFormFields()}
            </div>
          </div>

          <div className="bg-slate-100 rounded-[32px] p-8 shadow-inner">
            <div ref={suratRef} className="bg-white rounded-lg shadow-xl overflow-hidden">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// TEMPLATE COMPONENTS
// ========================================

function TemplateDomisili({ formData }) {
  return (
    <div className="page" style={{ fontFamily: "'Times New Roman', serif", fontSize: "12pt", lineHeight: "1.6", backgroundColor: "#ffffff", width: "210mm", minHeight: "297mm", padding: "15mm 20mm", color: "#000000", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", paddingBottom: "8px", marginBottom: "12px", borderBottom: "3px solid #000000" }}>
        <img src={LOGO_PATH} alt="Logo" style={{ width: "70px", height: "70px", marginRight: "15px", objectFit: "contain" }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>PEMERINTAH KABUPATEN TANGGAMUS</h1>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>KECAMATAN KOTAAGUNG BARAT</h2>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>PEKON KANDANG BESI</h2>
          <p style={{ fontSize: "10pt", margin: "3px 0 0 0", lineHeight: "1.3" }}>Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus Kode Pos 35651</p>
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: "3px", margin: "0" }}>SURAT KETERANGAN DOMISILI</h2>
        <p style={{ fontSize: "12pt", margin: "6px 0 0 0" }}>Nomor : {formData.nomorSurat}</p>
      </div>
      <div style={{ marginBottom: "20px", fontSize: "12pt" }}>
        <p style={{ textAlign: "justify", marginBottom: "14px", textIndent: "40px", lineHeight: "1.6" }}>Yang bertanda tangan dibawah ini, Kepala Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus menerangkan dengan sebenarnya bahwa :</p>
        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr><td style={{ width: "180px", paddingBottom: "6px", verticalAlign: "top" }}>Nama</td><td style={{ width: "15px", paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.nama}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Jenis Kelamin</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.jenis_kelamin}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Tempat Tgl. Lahir</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.ttl}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Agama</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.agama}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Pekerjaan</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.pekerjaan}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>NIK</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.nik}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Alamat</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.alamat}</td></tr>
          </tbody>
        </table>
        <p style={{ marginBottom: "18px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>Nama diatas adalah benar warga Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus dan berdomisili di alamat tersebut diatas.</p>
        <p style={{ marginBottom: "60px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>Demikian Surat Keterangan ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <div style={{ width: "260px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>Dikeluarkan di</p>
          <p style={{ margin: "0 0 16px 0" }}>Pada Tanggal</p>
        </div>
        <div style={{ width: "260px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>: Pekon {formData.tempat_dibuat}</p>
          <p style={{ margin: "0 0 16px 0" }}>: {formData.tglSurat}</p>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <div style={{ textAlign: "center", width: "230px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 10px 0" }}>{formData.jabatan_penandatangan || "Kepala Pekon Kandang Besi"}</p>
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img src={TTD_PEKON_PATH} alt="TTD" style={{ width: "120px", height: "60px", objectFit: "contain", margin: "0 auto", display: "block" }} />
          </div>
          <p style={{ margin: "0", fontSize: "12pt", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>{formData.penandatangan}</p>
        </div>
      </div>
    </div>
  );
}

function TemplateSKTM({ formData }) {
  return (
    <div className="page" style={{ fontFamily: "'Times New Roman', serif", fontSize: "12pt", lineHeight: "1.6", backgroundColor: "#ffffff", width: "210mm", minHeight: "297mm", padding: "15mm 20mm", color: "#000000", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", paddingBottom: "8px", marginBottom: "12px", borderBottom: "3px solid #000000" }}>
        <img src={LOGO_PATH} alt="Logo" style={{ width: "70px", height: "70px", marginRight: "15px", objectFit: "contain" }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>PEMERINTAH KABUPATEN TANGGAMUS</h1>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>KECAMATAN KOTAAGUNG BARAT</h2>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>PEKON KANDANG BESI</h2>
          <p style={{ fontSize: "10pt", margin: "3px 0 0 0", lineHeight: "1.3" }}>Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus Kode Pos 35651</p>
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: "3px", margin: "0" }}>SURAT KETERANGAN TIDAK MAMPU</h2>
        <p style={{ fontSize: "12pt", margin: "6px 0 0 0" }}>Nomor : {formData.nomorSurat}</p>
      </div>
      <div style={{ marginBottom: "20px", fontSize: "12pt" }}>
        <p style={{ textAlign: "justify", marginBottom: "14px", textIndent: "40px", lineHeight: "1.6" }}>Yang bertanda tangan dibawah ini, Kepala Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus menerangkan dengan sebenarnya bahwa :</p>
        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr><td style={{ width: "180px", paddingBottom: "6px", verticalAlign: "top" }}>Nama</td><td style={{ width: "15px", paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.nama}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Jenis Kelamin</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.jenis_kelamin}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Tempat Tgl. Lahir</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.ttl}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Agama</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.agama}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Pekerjaan</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.pekerjaan}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>NIK</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.nik}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Peringkat Desil</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.peringkat_desil}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Alamat</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.alamat}</td></tr>
          </tbody>
        </table>
        <p style={{ marginBottom: "18px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>Nama diatas adalah benar warga Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus, nama tersebut diatas adalah tergolong keluarga Tidak Mampu.</p>
        <p style={{ marginBottom: "60px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>Demikian Surat Keterangan ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
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
        <div style={{ textAlign: "center", width: "230px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>Mengetahui</p>
          <p style={{ margin: "0 0 10px 0" }}>Camat Kecamatan Kotaagung Barat</p>
          <div style={{ height: "70px" }}></div>
          <p style={{ margin: "0", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>{formData.nama_camat || "(....................................)"}</p>
          <p style={{ margin: "3px 0 0 0", fontSize: "11pt" }}>NIP. {formData.nip_camat || "...................................."}</p>
        </div>
        <div style={{ textAlign: "center", width: "230px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 10px 0" }}>Kepala Pekon Kandang Besi</p>
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img src={TTD_PEKON_PATH} alt="TTD" style={{ width: "120px", height: "60px", objectFit: "contain", margin: "0 auto", display: "block" }} />
          </div>
          <p style={{ margin: "0", fontSize: "12pt", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>Mukhtar</p>
        </div>
      </div>
    </div>
  );
}

function TemplateKeramaian({ formData }) {
  return (
    <div className="page" style={{ fontFamily: "'Times New Roman', serif", fontSize: "12pt", lineHeight: "1.5", backgroundColor: "#ffffff", width: "210mm", minHeight: "297mm", padding: "15mm 20mm", color: "#000000", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", paddingBottom: "8px", marginBottom: "12px", borderBottom: "3px solid #000000" }}>
        <img src={LOGO_PATH} alt="Logo" style={{ width: "70px", height: "70px", marginRight: "15px", objectFit: "contain" }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>PEMERINTAH KABUPATEN TANGGAMUS</h1>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>KECAMATAN KOTAAGUNG BARAT</h2>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>PEKON KANDANG BESI</h2>
          <p style={{ fontSize: "10pt", margin: "3px 0 0 0", lineHeight: "1.3" }}>Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus Kode Pos 35651</p>
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: "14px" }}>
        <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: "3px", margin: "0" }}>SURAT IZIN KERAMAIAN</h2>
        <p style={{ fontSize: "12pt", margin: "5px 0 0 0" }}>Nomor : {formData.nomorSurat}</p>
      </div>
      <div style={{ marginBottom: "18px", fontSize: "12pt" }}>
        <p style={{ textAlign: "justify", marginBottom: "12px", textIndent: "40px", lineHeight: "1.5" }}>Yang bertanda tangan dibawah ini, Kepala Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus menerangkan dengan sebenarnya bahwa :</p>
        <table style={{ marginBottom: "14px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr><td style={{ width: "180px", paddingBottom: "5px", verticalAlign: "top" }}>Nama</td><td style={{ width: "15px", paddingBottom: "5px" }}>:</td><td style={{ paddingBottom: "5px" }}>{formData.nama}</td></tr>
            <tr><td style={{ paddingBottom: "5px", verticalAlign: "top" }}>Umur</td><td style={{ paddingBottom: "5px" }}>:</td><td style={{ paddingBottom: "5px" }}>{formData.umur} Tahun</td></tr>
            <tr><td style={{ paddingBottom: "5px", verticalAlign: "top" }}>Pekerjaan</td><td style={{ paddingBottom: "5px" }}>:</td><td style={{ paddingBottom: "5px" }}>{formData.pekerjaan}</td></tr>
            <tr><td style={{ paddingBottom: "5px", verticalAlign: "top" }}>Alamat</td><td style={{ paddingBottom: "5px" }}>:</td><td style={{ paddingBottom: "5px" }}>{formData.alamat}</td></tr>
          </tbody>
        </table>
        <p style={{ marginBottom: "12px", fontSize: "12pt", lineHeight: "1.5", textAlign: "justify", textIndent: "40px" }}>Orang tersebut diatas, benar-benar warga Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus yang akan mengadakan keramaian berupa {formData.acara} pada :</p>
        <table style={{ marginBottom: "14px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr><td style={{ width: "180px", paddingBottom: "5px", verticalAlign: "top" }}>Hari / Tanggal</td><td style={{ width: "15px", paddingBottom: "5px" }}>:</td><td style={{ paddingBottom: "5px" }}>{formData.hari} / {formData.tanggal_kegiatan}</td></tr>
            <tr><td style={{ paddingBottom: "5px", verticalAlign: "top" }}>Waktu</td><td style={{ paddingBottom: "5px" }}>:</td><td style={{ paddingBottom: "5px" }}>{formData.waktu}</td></tr>
            <tr><td style={{ paddingBottom: "5px", verticalAlign: "top" }}>Acara</td><td style={{ paddingBottom: "5px" }}>:</td><td style={{ paddingBottom: "5px" }}>{formData.acara}</td></tr>
            <tr><td style={{ paddingBottom: "5px", verticalAlign: "top" }}>Tempat</td><td style={{ paddingBottom: "5px" }}>:</td><td style={{ paddingBottom: "5px" }}>{formData.tempat_kegiatan}</td></tr>
            <tr><td style={{ paddingBottom: "5px", verticalAlign: "top" }}>Hiburan</td><td style={{ paddingBottom: "5px" }}>:</td><td style={{ paddingBottom: "5px" }}>{formData.hiburan}</td></tr>
            <tr><td style={{ paddingBottom: "5px", verticalAlign: "top" }}>Jumlah Tamu</td><td style={{ paddingBottom: "5px" }}>:</td><td style={{ paddingBottom: "5px" }}>± {formData.jumlah_tamu} Orang</td></tr>
          </tbody>
        </table>
        <p style={{ marginBottom: "14px", fontSize: "12pt", lineHeight: "1.5", textAlign: "justify", textIndent: "40px" }}>Demikian Surat Izin Keramaian ini kami buat dengan sebenarnya, agar yang bersangkutan dapat melaksanakan acara dengan tertib dan aman.</p>
      </div>
      <div style={{ marginTop: "30px", fontSize: "12pt" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "50px" }}>
          <div style={{ width: "45%" }}>
            <p style={{ textAlign: "center", fontWeight: "bold", marginBottom: "60px" }}>SAKSI-SAKSI</p>
            <table style={{ width: "100%", fontSize: "12pt" }}>
              <tbody>
                <tr><td style={{ paddingBottom: "40px" }}>1. {formData.saksi1_nama}</td><td style={{ paddingBottom: "40px", textAlign: "right" }}>(....................)</td></tr>
                <tr><td>2. {formData.saksi2_nama}</td><td style={{ textAlign: "right" }}>(....................)</td></tr>
              </tbody>
            </table>
          </div>
          <div style={{ width: "45%", textAlign: "center" }}>
            <p style={{ margin: "0 0 5px 0" }}>Kandang Besi, {formData.tglSurat}</p>
            <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>PEMOHON</p>
            <div style={{ height: "60px" }}></div>
            <p style={{ fontWeight: "bold", textDecoration: "underline", margin: "0" }}>{formData.nama}</p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "11pt" }}>
          <div style={{ width: "30%", textAlign: "center" }}>
            <p style={{ margin: "0 0 5px 0" }}>Mengetahui,</p>
            <p style={{ margin: "0 0 60px 0" }}>Camat Kotaagung Barat</p>
            <p style={{ fontWeight: "bold", textDecoration: "underline", margin: "0" }}>{formData.nama_camat || "(...........................)"}</p>
            <p style={{ fontSize: "10pt", margin: "2px 0 0 0" }}>NIP. {formData.nip_camat || "..........................."}</p>
          </div>
          <div style={{ width: "30%", textAlign: "center" }}>
            <p style={{ margin: "0 0 5px 0" }}>Mengetahui,</p>
            <p style={{ margin: "0 0 60px 0" }}>Danramil 418-10/KB</p>
            <p style={{ fontWeight: "bold", textDecoration: "underline", margin: "0" }}>{formData.nama_danramil || "(...........................)"}</p>
            <p style={{ fontSize: "10pt", margin: "2px 0 0 0" }}>NIP. {formData.nip_danramil || "..........................."}</p>
          </div>
          <div style={{ width: "30%", textAlign: "center" }}>
            <p style={{ margin: "0 0 60px 0" }}>Kepala Pekon Kandang Besi</p>
            <img src={TTD_PEKON_PATH} alt="TTD" style={{ width: "100px", height: "50px", objectFit: "contain", margin: "0 auto 5px", display: "block" }} />
            <p style={{ fontWeight: "bold", textDecoration: "underline", margin: "0" }}>{formData.penandatangan}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateSKU({ formData }) {
  return (
    <div className="page" style={{ fontFamily: "'Times New Roman', serif", fontSize: "12pt", lineHeight: "1.6", backgroundColor: "#ffffff", width: "210mm", minHeight: "297mm", padding: "15mm 20mm", color: "#000000", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", paddingBottom: "8px", marginBottom: "12px", borderBottom: "3px solid #000000" }}>
        <img src={LOGO_PATH} alt="Logo" style={{ width: "70px", height: "70px", marginRight: "15px", objectFit: "contain" }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>PEMERINTAH KABUPATEN TANGGAMUS</h1>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>KECAMATAN KOTAAGUNG BARAT</h2>
          <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", margin: "0", lineHeight: "1.2" }}>PEKON KANDANG BESI</h2>
          <p style={{ fontSize: "10pt", margin: "3px 0 0 0", lineHeight: "1.3" }}>Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus Kode Pos 35651</p>
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: "3px", margin: "0" }}>SURAT KETERANGAN USAHA</h2>
        <p style={{ fontSize: "12pt", margin: "6px 0 0 0" }}>Nomor : {formData.nomorSurat}</p>
      </div>
      <div style={{ marginBottom: "20px", fontSize: "12pt" }}>
        <p style={{ textAlign: "justify", marginBottom: "14px", textIndent: "40px", lineHeight: "1.6" }}>Yang bertanda tangan dibawah ini, Kepala Pekon Kandang Besi Kec. Kotaagung Barat Kabupaten Tanggamus menerangkan dengan sebenarnya bahwa :</p>
        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr><td style={{ width: "180px", paddingBottom: "6px", verticalAlign: "top" }}>Nama</td><td style={{ width: "15px", paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.nama}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>NIK</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.nik}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Tempat, Tgl Lahir</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.ttl}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Pekerjaan</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.pekerjaan}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Alamat</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.alamat}</td></tr>
          </tbody>
        </table>
        <p style={{ marginBottom: "14px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>Nama tersebut diatas benar-benar warga Pekon Kandang Besi dan memiliki usaha dengan keterangan sebagai berikut :</p>
        <table style={{ marginBottom: "16px", marginLeft: "0", width: "100%", borderSpacing: "0", fontSize: "12pt" }}>
          <tbody>
            <tr><td style={{ width: "180px", paddingBottom: "6px", verticalAlign: "top" }}>Nama Usaha</td><td style={{ width: "15px", paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.nama_usaha}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Tahun Berdiri</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.tahun_berdiri}</td></tr>
            <tr><td style={{ paddingBottom: "6px", verticalAlign: "top" }}>Alamat Usaha</td><td style={{ paddingBottom: "6px" }}>:</td><td style={{ paddingBottom: "6px" }}>{formData.alamat_usaha}</td></tr>
          </tbody>
        </table>
        <p style={{ marginBottom: "60px", fontSize: "12pt", lineHeight: "1.6", textAlign: "justify", textIndent: "40px" }}>Demikian Surat Keterangan ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <div style={{ width: "260px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>Dikeluarkan di</p>
          <p style={{ margin: "0 0 16px 0" }}>Pada Tanggal</p>
        </div>
        <div style={{ width: "260px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 3px 0" }}>: Pekon {formData.tempat_dibuat}</p>
          <p style={{ margin: "0 0 16px 0" }}>: {formData.tglSurat}</p>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <div style={{ textAlign: "center", width: "230px", fontSize: "12pt" }}>
          <p style={{ margin: "0 0 10px 0" }}>{formData.jabatan_penandatangan || "Kepala Pekon Kandang Besi"}</p>
          {formData.nama_kasih_pelayanan && <p style={{ margin: "0 0 10px 0", fontSize: "11pt" }}>{formData.nama_kasih_pelayanan}</p>}
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img src={TTD_PEKON_PATH} alt="TTD" style={{ width: "120px", height: "60px", objectFit: "contain", margin: "0 auto", display: "block" }} />
          </div>
          <p style={{ margin: "0", fontSize: "12pt", fontWeight: "bold", textDecoration: "underline", textUnderlineOffset: "2px" }}>{formData.penandatangan}</p>
        </div>
      </div>
    </div>
  );
}