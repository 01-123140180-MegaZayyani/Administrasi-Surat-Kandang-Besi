import { useState, useEffect } from "react";
import api from '../../utils/api';
import { FileText, Download, RefreshCw, AlertCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer"; 

export default function StatusSurat() {
  const [daftarSurat, setDaftarSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("profil") || "{}");

  const fetchStatusSurat = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔍 Fetching status surat untuk NIK:", user.nik);
      
      const response = await api.get("/api/pengajuan");
      console.log("📦 Data dari server:", response.data);
      
      // Filter berdasarkan NIK dengan konversi tipe yang konsisten
      const milikSaya = response.data.filter(item => {
        const itemNIK = String(item.nik_pengaju).trim();
        const userNIK = String(user.nik).trim();
        console.log(`Comparing: ${itemNIK} === ${userNIK} ?`, itemNIK === userNIK);
        return itemNIK === userNIK;
      });
      
      console.log("✅ Data surat milik saya:", milikSaya);
      
      setDaftarSurat(milikSaya);
    } catch (err) {
      console.error("❌ Error mengambil status:", err);
      
      if (err.response) {
        setError(`Server error: ${err.response.status}`);
      } else if (err.request) {
        setError("Server tidak merespons. Pastikan backend berjalan!");
      } else {
        setError(err.message || "Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusSurat();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      'Selesai': 'bg-emerald-100 text-emerald-600',
      'Proses': 'bg-blue-100 text-blue-600',
      'Ditolak': 'bg-red-100 text-red-600',
      'Pending': 'bg-amber-100 text-amber-600'
    };
    
    return badges[status] || 'bg-slate-100 text-slate-600';
  };

  const getStatusText = (status) => {
    const texts = {
      'Selesai': 'Selesai',
      'Proses': 'Sedang Diproses',
      'Ditolak': 'Ditolak',
      'Pending': 'Menunggu Antrean'
    };
    
    return texts[status] || status;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12 text-left">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-[#1E3A8A] uppercase tracking-tight">
            Status Layanan Saya
          </h1>
          <button 
            onClick={fetchStatusSurat}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-bold text-red-700 mb-1">Terjadi Kesalahan</h3>
              <p className="text-sm text-red-600">{error}</p>
              <button 
                onClick={fetchStatusSurat}
                className="mt-3 text-xs font-bold text-red-700 underline hover:no-underline"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {loading && !error && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <p className="font-bold text-slate-400">Memuat status surat...</p>
          </div>
        )}
        
        {/* Data State */}
        {!loading && !error && (
          <div className="grid gap-4">
            {daftarSurat.length > 0 ? (
              daftarSurat.map((surat) => (
                <div 
                  key={surat.id} 
                  className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-blue-50 p-4 rounded-2xl text-blue-900">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 uppercase text-sm">
                          {surat.jenis_surat}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Diajukan: {new Date(surat.tanggal_request || surat.created_at || Date.now()).toLocaleDateString('id-ID')}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${getStatusBadge(surat.status)}`}>
                            {surat.status}
                          </span>
                        </div>

                        {/* CATATAN PENOLAKAN */}
                        {surat.status === "Ditolak" && surat.catatan_penolakan && (
                          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-start gap-2">
                              <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                              <div>
                                <p className="text-xs font-bold text-red-700 uppercase mb-1">Alasan Penolakan:</p>
                                <p className="text-sm text-red-600 leading-relaxed">{surat.catatan_penolakan}</p>
                                <p className="text-xs text-red-500 italic mt-2">
                                  💡 Silakan perbaiki dan ajukan kembali
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      {surat.status === "Selesai" && surat.file_final ? (
                        <a 
                          href={`/api/uploads/${surat.file_final}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-[#1E3A8A] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-900 transition-all"
                        >
                          <Download size={14} /> Download PDF
                        </a>
                      ) : surat.status === "Selesai" ? (
                        <div className="text-center">
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">
                            Surat Sudah Selesai
                          </span>
                          <span className="text-[9px] text-slate-400 italic">
                            Ambil di Kantor Desa
                          </span>
                        </div>
                      ) : surat.status === "Ditolak" ? (
                        <div className="text-center">
                          <span className="text-[10px] font-bold text-red-500 block mb-1">
                            ✗ Ditolak
                          </span>
                          <span className="text-[9px] text-slate-400 italic">
                            Lihat alasan di bawah
                          </span>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-bold uppercase tracking-widest block ${
                          surat.status === 'Proses' ? 'text-blue-500 animate-pulse' : 'text-amber-500'
                        }`}>
                          ⏳ {getStatusText(surat.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} className="text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-700 mb-2">Belum Ada Pengajuan</h3>
                <p className="text-slate-400 text-sm">
                  Anda belum mengajukan surat apapun.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        {!loading && !error && daftarSurat.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h4 className="font-bold text-blue-900 text-xs uppercase mb-2">Informasi</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Status <strong>Pending</strong>: Menunggu verifikasi admin</li>
              <li>• Status <strong>Proses</strong>: Sedang dikerjakan oleh admin</li>
              <li>• Status <strong>Selesai</strong>: Surat sudah siap diambil/diunduh</li>
              <li>• Status <strong>Ditolak</strong>: Ada masalah dengan pengajuan Anda, silakan baca alasan penolakan dan ajukan ulang</li>
            </ul>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}