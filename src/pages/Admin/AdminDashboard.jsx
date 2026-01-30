import { useState, useEffect } from "react";
import api from "../../utils/api";
import { ChevronDown, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPengajuan = async () => {
    try {
      const res = await api.get("/api/admin/surat");
      setPengajuan(res.data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchPengajuan(); }, []);

  // SINKRONISASI KATA: Pastikan menggunakan "Sedang Diproses" sesuai dropdown
  const stats = {
    total: pengajuan.length,
    selesai: pengajuan.filter(i => i.status === 'Selesai').length,
    proses: pengajuan.filter(i => i.status === 'Sedang Diproses').length, // Diubah agar sinkron
    ditolak: pengajuan.filter(i => i.status === 'Ditolak').length,
  };

  const updateStatus = async (id, status) => {
    let catatan = "";
    if (status === "Ditolak") {
      catatan = window.prompt("Alasan Penolakan (Akan tampil di warga):");
      if (!catatan) return;
    }
    try {
      // Mengirim status baru ke backend
      await api.put(`/api/admin/surat/${id}`, { status, catatan });
      fetchPengajuan(); // Refresh data agar statistik dan tabel update
    } catch (err) { 
      alert("Gagal update status"); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 border-l-4 border-[#1E3A8A] pl-5">
          <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">SILADES</h1>
          <p className="text-slate-500 mt-1">Sistem Administrasi Layanan Desa Kandang Besi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Pengajuan" count={stats.total} icon={<FileText className="text-blue-600" />} />
          <StatCard title="Sedang Diproses" count={stats.proses} icon={<Clock className="text-amber-500" />} />
          <StatCard title="Selesai TTD" count={stats.selesai} icon={<CheckCircle className="text-emerald-500" />} />
          <StatCard title="Ditolak / Revisi" count={stats.ditolak} icon={<AlertCircle className="text-rose-500" />} />
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-700">Antrean Pengajuan Terbaru</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Identitas Warga</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori Layanan</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="3" className="p-20 text-center text-slate-400 animate-pulse">Sinkronisasi Data...</td></tr>
              ) : pengajuan.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-6">
                    <div className="font-bold text-slate-800 text-base">{item.nama_warga}</div>
                    <div className="text-xs text-slate-400 mt-0.5 font-mono">{item.nik_pengaju}</div>
                  </td>
                  <td className="p-6">
                    <span className="px-4 py-1.5 bg-blue-50 text-[#1E40AF] rounded-md text-[11px] font-black uppercase border border-blue-100">
                      {item.jenis_surat}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <div className="relative inline-block w-44">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className={`w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer focus:ring-2 focus:ring-blue-100 ${
                            item.status === 'Selesai' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            item.status === 'Ditolak' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                            item.status === 'Sedang Diproses' ? 'bg-blue-50 border-blue-200 text-blue-700' : // Tambahkan warna biru
                            'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Sedang Diproses">Sedang Diproses</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Ditolak">Ditolak</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, count, icon }) {
  return (
    <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-4xl font-black text-slate-900 leading-none">{count}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      </div>
    </div>
  );
}