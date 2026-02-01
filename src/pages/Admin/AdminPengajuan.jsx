import { useState, useEffect } from "react";
import api from "../../utils/api";
import { 
  X, CheckCircle, XCircle, Download, FileText, 
  Image as ImageIcon, ExternalLink, RefreshCw, Trash2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminPengajuan() {
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailTerpilih, setDetailTerpilih] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/surat");
      setPengajuan(res.data);
    } catch (err) {
      console.error("Gagal mengambil data admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleUpdateStatus = async (id, statusBaru) => {
    if (!window.confirm(`Ubah status menjadi ${statusBaru}?`)) return;
    try {
      await api.put(`/api/admin/surat/${id}`, { status: statusBaru });
      alert("Status Berhasil Diperbarui!");
      fetchData();
      setDetailTerpilih(null);
    } catch (err) { 
      alert("Gagal Update Status: " + (err.response?.data?.error || "Error Server")); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengajuan ini secara permanen?")) return;
    try {
      await api.delete(`/api/admin/surat/${id}`);
      alert("Pengajuan Berhasil Dihapus");
      fetchData();
      setDetailTerpilih(null);
    } catch (err) {
      alert("Gagal menghapus data.");
    }
  };

  const handleBukaTemplate = (item) => {
    // Pastikan data diparsing dengan benar
    let dataLengkap = {};
    try {
      dataLengkap = typeof item.data === 'string' ? JSON.parse(item.data) : (item.data || {});
    } catch (e) {
      console.error("Gagal parsing data surat", e);
    }
    
    navigate("/admin/template", { 
      state: { 
        dataSurat: { ...item, parsedData: dataLengkap } 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tighter uppercase">Daftar Pengajuan</h1>
            <p className="text-slate-400 font-medium mt-1">Kelola permohonan surat warga Desa Kandang Besi</p>
          </div>
          <button onClick={fetchData} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-[#1E3A8A] hover:bg-slate-50 transition-all">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 font-bold text-slate-400 uppercase tracking-widest">Memuat Data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pengajuan.length > 0 ? (
              pengajuan.map((item) => (
                <div key={item.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-blue-50 rounded-2xl text-[#1E3A8A] group-hover:bg-[#1E3A8A] group-hover:text-white transition-all">
                      <FileText size={24} />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-600' : 
                      item.status === 'Ditolak' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-800 text-lg leading-tight mb-2 uppercase tracking-tight">
                    {item.jenisSurat || item.jenis_surat}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold mb-6 italic">Tiket: {item.noTiket || '-'}</p>
                  
                  <div className="border-t border-slate-50 pt-6 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pengaju</p>
                      <p className="font-bold text-slate-700 text-sm">{item.user?.nama_lengkap || 'Warga'}</p>
                    </div>
                    <button 
                      onClick={() => setDetailTerpilih(item)}
                      className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1E3A8A] transition-all"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                <p className="font-bold text-slate-400 uppercase">Tidak ada pengajuan surat</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL DETAIL */}
      {detailTerpilih && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl overflow-y-auto animate-slide-left">
            <div className="p-8 border-b sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#1E3A8A] uppercase tracking-tighter">Detail Pengajuan</h2>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{detailTerpilih.noTiket}</p>
              </div>
              <button onClick={() => setDetailTerpilih(null)} className="p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Info Warga */}
              <section className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <p className="text-[10px] font-black text-[#1E3A8A] uppercase tracking-widest mb-4">Informasi Pengaju</p>
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Nama Lengkap</p>
                    <p className="font-bold text-slate-800 text-sm">{detailTerpilih.user?.nama_lengkap || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">NIK</p>
                    <p className="font-bold text-slate-800 text-sm">{detailTerpilih.user?.nik || detailTerpilih.nik || '-'}</p>
                  </div>
                </div>
              </section>

              {/* Berkas - Tampilan disederhanakan agar tidak error */}
              <div>
                <p className="text-[10px] font-black text-[#1E3A8A] uppercase tracking-widest mb-4 ml-2">Lampiran Berkas</p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Logika render gambar disederhanakan */}
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                    <ImageIcon size={32} className="text-slate-300 mb-2" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Lihat Lampiran di Database</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Aksi Admin */}
            <div className="p-8 border-t bg-slate-50 sticky bottom-0 flex flex-wrap gap-4">
              <button 
                onClick={() => handleUpdateStatus(detailTerpilih.id, 'Proses')} 
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-200"
              >
                <RefreshCw size={16}/> Proses
              </button>
              <button 
                onClick={() => handleBukaTemplate(detailTerpilih)} 
                className="flex-[2] bg-[#1E3A8A] hover:bg-black text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200"
              >
                <ExternalLink size={16}/> Buat Surat
              </button>
              <button 
                onClick={() => handleUpdateStatus(detailTerpilih.id, 'Ditolak')} 
                className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-6 rounded-2xl font-black text-xs transition-all"
              >
                Tolak
              </button>
              <button 
                onClick={() => handleDelete(detailTerpilih.id)} 
                className="bg-slate-200 text-slate-600 hover:bg-red-600 hover:text-white p-4 rounded-2xl transition-all"
              >
                <Trash2 size={18}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}