import { useState, useEffect } from "react";
import api from '../../utils/api';
import { FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer"; 

export default function StatusSurat() {
  const [daftarSurat, setDaftarSurat] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user_profile") || "{}");

  useEffect(() => {
    if (user.nik) {
      api.get(`/api/surat?nik_pengaju=${user.nik}`)
        .then(res => setDaftarSurat(res.data))
        .catch(err => console.error("Gagal ambil status"));
    }
  }, [user.nik]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-[#1E3A8A] mb-10 text-left uppercase">Status Layanan</h1>
        <div className="grid gap-4">
          {daftarSurat.map((surat) => (
            <div key={surat.id} className="bg-white rounded-[24px] p-6 shadow-sm flex justify-between items-center border border-slate-100">
              <div className="flex items-center gap-4 text-left">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-900"><FileText /></div>
                <div>
                  <h3 className="font-bold text-slate-800 uppercase text-sm">{surat.jenis_surat}</h3>
                  <p className={`text-[10px] font-bold uppercase ${surat.status === 'Selesai' ? 'text-emerald-500' : 'text-amber-500'}`}>{surat.status}</p>
                </div>
              </div>
              
              {surat.status === "Selesai" && (
                <button 
                  onClick={() => {
                    if (!surat.data_final) return alert("Dokumen belum siap.");
                    navigate("/cetak-surat-warga", { state: { dataSurat: JSON.parse(surat.data_final) } });
                  }}
                  className="bg-[#1E3A8A] text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <Download size={14} /> Cetak Surat
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}