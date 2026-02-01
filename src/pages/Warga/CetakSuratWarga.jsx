import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Download, ArrowLeft } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CetakSuratWarga() {
  const location = useLocation();
  const navigate = useNavigate();
  const suratRef = useRef(null);
  const data = location.state?.dataSurat;

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans">
      <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
        <p className="font-bold text-slate-600 mb-4">Data surat tidak ditemukan.</p>
        <button onClick={() => navigate("/status-surat")} className="bg-[#1E3A8A] text-white px-6 py-2 rounded-lg text-sm">Kembali</button>
      </div>
    </div>
  );

  const downloadPDF = async () => {
    const element = suratRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save(`Surat_${data.jenisSurat || 'Desa'}_${data.nama}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-600 py-10 flex flex-col items-center font-sans">
      <div className="w-[210mm] mb-6 flex justify-between">
        <button onClick={() => navigate(-1)} className="bg-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg text-xs hover:bg-slate-100">
          <ArrowLeft size={16}/> Kembali
        </button>
        <button onClick={downloadPDF} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg text-xs hover:bg-emerald-700">
          <Download size={16}/> Download PDF
        </button>
      </div>

      <div 
        ref={suratRef} 
        className="w-[210mm] min-h-[297mm] bg-white p-[25mm] shadow-2xl text-left box-border" 
        style={{ fontFamily: 'Times New Roman', color: 'black' }}
      >
        {/* KOP SURAT */}
        <div className="text-center border-b-[3px] border-black pb-2 mb-8">
          <h1 className="text-xl font-bold uppercase leading-tight">Pemerintah Kabupaten Tanggamus</h1>
          <h1 className="text-xl font-bold uppercase leading-tight">Kecamatan Kotaagung Barat</h1>
          <h1 className="text-2xl font-bold uppercase leading-tight">Pekon Kandang Besi</h1>
          <p className="text-[10pt] italic">Alamat : Jl. Ir. H. Juanda Km 07 Pekon Kandang Besi Kode Pos 35651</p>
        </div>

        {/* JUDUL SURAT */}
        <div className="text-center mb-10">
          <h2 className="text-[14pt] font-bold underline uppercase tracking-widest">
            {data.jenisSurat === "domisili" ? "Surat Keterangan Domisili" : data.jenisSurat === "sku" ? "Surat Keterangan Usaha" : "Surat Izin Keramaian"}
          </h2>
          <p className="text-[12pt]">Nomor : {data.nomorSurat}</p>
        </div>

        {/* ISI SURAT */}
        <div className="text-[12pt] leading-relaxed space-y-6 text-justify">
          <p>Yang bertanda tangan di bawah ini Kepala Pekon Kandang Besi Kec. Kotaagung Barat Kab. Tanggamus, dengan ini menerangkan bahwa :</p>
          
          <div className="ml-10 space-y-1">
            <div className="flex w-full"><span className="w-44 uppercase">Nama</span><span>: {data.nama}</span></div>
            <div className="flex w-full"><span className="w-44 uppercase">No NIK</span><span>: {data.nik}</span></div>
            <div className="flex w-full"><span className="w-44 uppercase">Tempat, Tgl Lahir</span><span>: {data.ttl}</span></div>
            <div className="flex w-full"><span className="w-44 uppercase">Pekerjaan</span><span>: {data.pekerjaan}</span></div>
            <div className="flex w-full items-start"><span className="w-44 uppercase">Alamat</span><span className="flex-1">: {data.alamat}</span></div>
          </div>

          {data.jenisSurat === "domisili" ? (
            <p>Adalah benar bertempat tinggal dan benar berdomisili di Pekon Kandang Besi Kecamatan Kotaagung Barat Kabupaten Tanggamus.</p>
          ) : (
            <p>Nama tersebut di atas adalah benar memiliki usaha <strong className="uppercase">"{data.isiTambahan}"</strong> yang berlokasi di wilayah Pekon Kandang Besi.</p>
          )}

          <p>Demikian surat keterangan ini dibuat agar dapat digunakan sebagaimana mestinya.</p>
        </div>

        {/* TANDA TANGAN */}
        <div className="mt-20 ml-auto w-72 text-center">
          <p>Kandang Besi, {data.tglSurat}</p>
          <p className="font-bold uppercase mb-24">Kepala Pekon Kandang Besi</p>
          <p className="font-bold underline uppercase">{data.penandatangan}</p>
        </div>
      </div>
    </div>
  );
}