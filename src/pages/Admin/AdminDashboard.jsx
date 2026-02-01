import { useState, useEffect } from "react";
import api from "../../utils/api";
import { ChevronDown, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    proses: 0,
    selesai: 0
  });
  const [recentPengajuan, setRecentPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [catatanPenolakan, setCatatanPenolakan] = useState("");
  const navigate = useNavigate();
  
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/surat");
      const data = response.data;
      
      console.log("📊 Data dari server:", data);

      // Hitung statistik
      setStats({
        total: data.length,
        pending: data.filter(item => item.status === "Pending").length,
        proses: data.filter(item => item.status === "Proses").length,
        selesai: data.filter(item => item.status === "Selesai").length
      });

      // Ambil 5 pengajuan terbaru
      const sortedData = [...data].sort((a, b) => {
        // Coba berbagai field tanggal yang mungkin ada
        const dateA = new Date(a.tanggal_request || a.created_at || a.tanggal_pengajuan || a.createdAt || Date.now());
        const dateB = new Date(b.tanggal_request || b.created_at || b.tanggal_pengajuan || b.createdAt || Date.now());
        return dateB - dateA;
      });
      
      setRecentPengajuan(sortedData.slice(0, 5));
      
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
      setPengajuan(res.data);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatTanggal = (tanggal) => {
    // Handle berbagai format tanggal
    if (!tanggal) return "-";
    
    try {
      const date = new Date(tanggal);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "-";
      }
      
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-amber-100 text-amber-600',
      'Proses': 'bg-blue-100 text-blue-600',
      'Selesai': 'bg-emerald-100 text-emerald-600',
      'Ditolak': 'bg-red-100 text-red-600'
    };
    return colors[status] || 'bg-slate-100 text-slate-600';
  };

  const handleStatusChange = async (item, newStatus) => {
    // Jika status diubah ke "Ditolak", tampilkan modal
    if (newStatus === "Ditolak") {
      setSelectedItem(item);
      setCatatanPenolakan(""); // Reset catatan
      setShowRejectModal(true);
      return;
    }

    // Untuk status lain, langsung update
    try {
      await api.put(`/api/pengajuan/${item.id}`, {
        status: newStatus
      });
      fetchDashboardData();
      alert(`✅ Status berhasil diubah menjadi ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("❌ Gagal update status");
    }
  };
  
  const handleReject = async () => {
    if (!catatanPenolakan.trim()) {
      alert("⚠️ Harap isi alasan penolakan!");
      return;
    }
    
    try {
      await api.put(`/api/admin/surat/${selectedItem.id}`, { 
        status: "Ditolak",
        catatan_penolakan: catatanPenolakan
      });
      fetchPengajuan(); // Refresh data agar statistik dan tabel update
      setShowRejectModal(false);
      setSelectedItem(null);
      setCatatanPenolakan("");
      fetchDashboardData();
      alert("✅ Pengajuan berhasil ditolak dengan catatan");
    } catch (err) {
      console.error("Error rejecting:", err);
      alert("❌ Gagal menolak pengajuan");
    } 
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">SILADES</h1>
          <p className="text-slate-500 text-sm mt-1">Sistem Administrasi Layanan Desa Kandang Besi</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengajuan</p>
              <h2 className="text-4xl font-black text-slate-800 mt-2">{stats.total}</h2>
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</p>
              <h2 className="text-4xl font-black text-amber-600 mt-2">{stats.pending}</h2>
            </div>
            <div className="bg-amber-50 p-3 rounded-2xl">
              <AlertCircle className="text-amber-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sedang Diproses</p>
              <h2 className="text-4xl font-black text-blue-600 mt-2">{stats.proses}</h2>
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl">
              <Clock className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selesai</p>
              <h2 className="text-4xl font-black text-emerald-600 mt-2">{stats.selesai}</h2>
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl">
              <CheckCircle className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-black text-slate-800 uppercase tracking-tight">Antrean Pengajuan Terbaru</h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <p className="text-slate-400 font-bold">Memuat data...</p>
          </div>
        ) : recentPengajuan.length > 0 ? (
          <table className="w-full">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
              <tr>
                <th className="p-6 text-left">Identitas Warga</th>
                <th className="text-left">Kategori Layanan</th>
                <th className="text-left">Tanggal Pengajuan</th>
                <th className="text-left">Status Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPengajuan.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6">
                    <div className="font-bold text-slate-700">{item.nama_warga || "Warga"}</div>
                    <div className="text-[10px] text-slate-400">NIK: {item.nik_pengaju || "-"}</div>
                  </td>
                  <td>
                    <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">
                      {item.jenis_surat}
                    </span>
                  </td>
                  <td className="text-sm text-slate-600">
                    {formatTanggal(item.tanggal_request || item.created_at || item.tanggal_pengajuan || item.createdAt)}
                  </td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item, e.target.value)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-0 outline-none cursor-pointer ${getStatusColor(item.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Proses">Proses</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-700 mb-2">Belum Ada Pengajuan</h3>
            <p className="text-slate-400 text-sm">Belum ada pengajuan surat yang masuk.</p>
          </div>
        )}
        
        {!loading && recentPengajuan.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <button
              onClick={() => navigate("/admin/pengajuan")}
              className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
            >
              Lihat Semua Pengajuan →
            </button>
          </div>
        )}
      </div>

      {/* MODAL PENOLAKAN */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-800 uppercase">Tolak Pengajuan</h2>
                <p className="text-xs text-slate-500 mt-1">Berikan alasan penolakan untuk warga</p>
              </div>
              <button 
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedItem(null);
                  setCatatanPenolakan("");
                }}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Detail Pengajuan</p>
                <p className="text-sm font-bold text-slate-800">{selectedItem?.nama_warga}</p>
                <p className="text-xs text-slate-500">
                  {selectedItem?.jenis_surat} • {formatTanggal(selectedItem?.tanggal_request)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Alasan Penolakan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={catatanPenolakan}
                  onChange={(e) => setCatatanPenolakan(e.target.value)}
                  placeholder="Contoh: Berkas KTP tidak terbaca dengan jelas, mohon upload ulang dengan resolusi yang lebih baik"
                  className="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-blue-500 transition-all h-32 resize-none"
                  required
                />
                <p className="text-xs text-slate-400 italic">
                  💡 Berikan alasan yang jelas agar warga bisa memperbaiki pengajuannya
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedItem(null);
                  setCatatanPenolakan("");
                }}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs uppercase hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={!catatanPenolakan.trim()}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-xs uppercase hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tolak Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}