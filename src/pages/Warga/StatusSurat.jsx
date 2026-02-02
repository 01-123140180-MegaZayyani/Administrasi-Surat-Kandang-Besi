import { useState, useEffect } from "react";
import api from '../../utils/api'; // Pastikan path ini benar (mundur 2x)
import { FileText, Download, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer"; 

export default function StatusSurat() {
  const [daftarSurat, setDaftarSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Ambil data user dengan proteksi (Gunakan key 'user_profile' agar sinkron dengan Login)
  const user = JSON.parse(localStorage.getItem("user_profile") || "{}");

  const fetchStatusSurat = async () => {
    // Jika tidak ada NIK, jangan paksa fetch, arahkan ke login atau beri pesan
    if (!user.nik) {
      setError("Sesi Anda berakhir. Silakan login kembali.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Pastikan endpoint ini sesuai dengan yang ada di server.js/suratRoutes
      const response = await api.get("/api/surat"); 
      
      // Filter data agar hanya menampilkan milik user yang sedang login
      const milikSaya = response.data.filter(item => 
        String(item.nik).trim() === String(user.nik).trim()
      );
      
      setDaftarSurat(milikSaya);
    } catch (err) {
      console.error("❌ Gagal ambil data:", err);
      setError("Gagal memuat data surat. Pastikan koneksi internet stabil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusSurat();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-[#1E3A8A] mb-10 text-left uppercase tracking-tight">
          Status Layanan
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="animate-spin text-blue-500 mb-4" size={40} />
            <p className="text-slate-500 font-medium">Memuat data pengajuan...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <p className="text-red-700 font-bold mb-4">{error}</p>
            <button onClick={fetchStatusSurat} className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg">
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {daftarSurat.length > 0 ? (
              daftarSurat.map((surat) => (
                <div key={surat.id} className="bg-white rounded-[24px] p-6 shadow-sm flex justify-between items-center border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 text-left">
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-900">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wide">
                        {surat.jenisSurat || surat.jenis_surat}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                         <span className={`w-2 h-2 rounded-full ${surat.status === 'Selesai' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                         <p className={`text-[10px] font-black uppercase tracking-widest ${surat.status === 'Selesai' ? 'text-emerald-500' : 'text-amber-500'}`}>
                           {surat.status}
                         </p>
                      </div>
                    </div>
                  </div>
                  
                  {surat.status === "Selesai" && (
                    <button 
                      onClick={() => {
                        // Pastikan data_final ada dan berbentuk objek/string JSON
                        if (!surat.data) return alert("Dokumen belum siap.");
                        navigate("/cetak-surat-warga", { state: { dataSurat: surat } });
                      }}
                      className="bg-[#1E3A8A] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Download size={14} /> Cetak
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} className="text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-700 mb-2 uppercase text-sm">Belum Ada Pengajuan</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  Anda belum memiliki riwayat pengajuan surat di sistem ini.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Card - Hanya muncul jika data ada */}
        {!loading && !error && daftarSurat.length > 0 && (
          <div className="mt-10 bg-blue-50/50 border border-blue-100 rounded-[30px] p-8 text-left">
            <h4 className="font-black text-[#1E3A8A] text-xs uppercase mb-4 tracking-widest">Alur Status Surat</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1"></div>
                  <p className="text-xs text-slate-600"><strong>Proses:</strong> Berkas sedang diverifikasi atau dalam antrean cetak desa.</p>
               </div>
               <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1"></div>
                  <p className="text-xs text-slate-600"><strong>Selesai:</strong> Surat sudah divalidasi dan dapat Anda unduh/cetak secara mandiri.</p>
               </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}