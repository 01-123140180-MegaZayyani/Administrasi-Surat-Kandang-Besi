import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, CheckCircle, XCircle, FileText, ChevronRight, Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Navbar from "../../components/Navbar"; // Pastikan path ini benar
import Footer from "../../components/Footer"; // Pastikan path ini benar

export default function StatusSurat() {
  const [daftarSurat, setDaftarSurat] = useState([]);
  const user = JSON.parse(localStorage.getItem("user_profile") || "{}");

  useEffect(() => {
    const fetchStatus = () => {
      if (user.nik) {
        axios.get(`http://localhost:5000/api/pengajuan-warga/${user.nik}`)
          .then(res => setDaftarSurat(res.data))
          .catch(err => console.error("Gagal ambil status"));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Cek tiap 5 detik
    return () => clearInterval(interval);
  }, [user.nik]);

  const unduhSurat = (surat) => {
    const doc = new jsPDF();
    // Header Kop Surat
    doc.setFontSize(14);
    doc.text("PEMERINTAH KABUPATEN TANGGAMUS", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("KECAMATAN TALANG PADANG", 105, 28, { align: "center" });
    doc.text("PEKON KANDANG BESI", 105, 36, { align: "center" });
    doc.setLineWidth(1);
    doc.line(20, 40, 190, 40);
    
    // Isi
    doc.setFontSize(12);
    doc.text(surat.jenis_surat.toUpperCase(), 105, 55, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(`Nomor: 140 / ${surat.id} / 20.04 / 2026`, 105, 60, { align: "center" });

    doc.text("Yang bertanda tangan di bawah ini, Kepala Pekon Kandang Besi menerangkan bahwa:", 20, 80);
    
    const tableData = [
      ["Nama Lengkap", surat.nama_warga],
      ["NIK", surat.nik_pengaju],
      ["Jenis Layanan", surat.jenis_surat],
      ["Tanggal Pengajuan", new Date(surat.created_at).toLocaleDateString('id-ID')]
    ];

    doc.autoTable({
      startY: 85,
      body: tableData,
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 2 }
    });

    doc.text("Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.", 20, doc.lastAutoTable.finalY + 20);
    doc.text("Kandang Besi, " + new Date().toLocaleDateString('id-ID'), 140, doc.lastAutoTable.finalY + 45);
    doc.text("Kepala Pekon,", 140, doc.lastAutoTable.finalY + 50);
    doc.setFont("helvetica", "italic");
    doc.text("( Tanda Tangan Elektronik )", 140, doc.lastAutoTable.finalY + 70);
    
    doc.save(`Surat_${surat.nama_warga}.pdf`);
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "selesai": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "ditolak": return "bg-rose-100 text-rose-700 border-rose-200";
      case "sedang diproses": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#1E3A8A] tracking-tight">Status Layanan</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Pantau progres pengajuan administrasi Anda secara real-time.</p>
        </div>

        <div className="grid gap-4">
          {daftarSurat.map((surat) => (
            <div key={surat.id} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="bg-[#1E3A8A]/5 p-4 rounded-2xl text-[#1E3A8A]"><FileText size={24} /></div>
                <div>
                  <h3 className="font-black text-slate-800 uppercase text-sm">{surat.jenis_surat}</h3>
                  <p className="text-[11px] text-slate-400">ID: #{surat.id.toString().padStart(4, '0')}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase ${getStatusStyle(surat.status)}`}>
                  {surat.status}
                </div>
                
                {/* Tombol Cetak muncul jika Selesai */}
                {surat.status.toLowerCase() === "selesai" && (
                  <button 
                    onClick={() => unduhSurat(surat)}
                    className="flex items-center gap-2 bg-[#1E3A8A] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-800 transition-all"
                  >
                    <Download size={14} /> Cetak Surat
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}