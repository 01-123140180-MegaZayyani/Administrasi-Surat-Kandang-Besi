import { useState, useEffect } from "react";
import api from "../../utils/api";
import { X, CheckCircle, XCircle, Download, FileText, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { X, ExternalLink, RefreshCw, Trash2 } from "lucide-react";

export default function AdminPengajuan() {
  const [pengajuan, setPengajuan] = useState([]);
  const [detailTerpilih, setDetailTerpilih] = useState(null);
  const navigate = useNavigate();

  const fetchData = () => {
    api.get("/api/admin/surat")
      .then(res => setPengajuan(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateStatus = async (id, statusBaru) => {
    try {
      await api.put(`/api/admin/surat/${id}`, { status: statusBaru });
      alert("Status Berhasil Diperbarui!");
      fetchData();
      setDetailTerpilih(null);
    } catch (err) { alert("Gagal Update Status."); }
  };

  const handleBukaTemplate = (item) => {
    const dataLengkap = JSON.parse(item.data_form || '{}');
    
    // Navigasi ke template UNIVERSAL dengan membawa data lengkap
    navigate("/admin/template", { 
      state: { 
        id_pengajuan: item.id,
        jenis_surat: item.jenis_surat,
        warga: { 
          nama: item.nama_warga, 
          nik: item.nik_pengaju, 
          ...dataLengkap 
        }
      } 
    });
  };

  const updateStatus = (id, statusBaru) => {
    api.put(`/api/admin/surat/${id}/status`, { status: statusBaru })
      .then(() => {
        fetchData();
        setDetailTerpilih(null);
      })
      .catch(err => alert("Gagal update status"));
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans text-left">
      <h1 className="text-3xl font-black text-slate-800 uppercase mb-10 tracking-tight">Daftar Pengajuan</h1>
      
      <div className="bg-white rounded-[32px] shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
            <tr>
              <th className="p-6 text-left">Pemohon</th>
              <th className="text-left">Jenis Surat</th>
              <th className="text-left">Status</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pengajuan.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-6">
                  <div className="font-bold text-slate-700">{item.nama_warga}</div>
                  <div className="text-[10px] text-slate-400">{item.nik_pengaju}</div>
                </td>
                <td className="text-xs font-black text-blue-600 uppercase">{item.jenis_surat}</td>
                <td>
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${
                    item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 
                    item.status === 'Proses' ? 'bg-blue-50 text-blue-600' :
                    item.status === 'Ditolak' ? 'bg-red-50 text-red-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="text-center">
                  <button onClick={() => setDetailTerpilih(item)} className="text-[10px] font-black underline text-blue-800 hover:text-blue-500">DETAIL</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL & BERKAS PERSYARATAN */}
      {detailTerpilih && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b flex justify-between bg-slate-50">
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Detail & Lampiran Berkas</h2>
              <button onClick={() => setDetailTerpilih(null)} className="text-slate-400 hover:text-red-500 transition-colors"><X /></button>
            </div>
            
            <div className="p-8 grid grid-cols-2 gap-12 max-h-[60vh] overflow-y-auto">
                <div className="text-left">
                  <h3 className="text-[10px] font-black text-blue-500 mb-6 uppercase tracking-[0.2em]">Data Formulir</h3>
                  {Object.entries(JSON.parse(detailTerpilih.data_form || '{}')).map(([k, v]) => (
                    k !== 'berkas' && k !== 'keterangan_surat' && (
                      <div key={k} className="mb-4 border-b border-slate-100 pb-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{k.replace(/_/g, ' ')}</p>
                        <p className="text-sm font-bold text-slate-700">{v || "-"}</p>
                      </div>
                    )
                  ))}
                </div>
                
                <div>
                  <h3 className="text-[10px] font-black text-blue-500 mb-6 uppercase tracking-[0.2em]">Persyaratan (Upload Warga)</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {detailTerpilih.data_form && JSON.parse(detailTerpilih.data_form).berkas ? (
                      Object.entries(JSON.parse(detailTerpilih.data_form).berkas).map(([key, file]) => (
                        <a key={key} href={`http:/uploads/${file}`} target="_blank" rel="noreferrer" 
                           className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-blue-500 hover:bg-blue-50 transition-all">
                          <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-blue-700">{key}</span>
                          <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500"/>
                        </a>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic font-medium">Tidak ada lampiran berkas.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-full">
                    <h3 className="font-black text-xs uppercase mb-6 text-slate-800 border-b pb-4">Lampiran Berkas</h3>
                    <div className="flex-grow grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px]">
                      {(() => {
                        const data = JSON.parse(detailTerpilih.data_form || '{}');
                        const berkas = data.berkas || {};
                        return Object.entries(berkas).map(([key, file]) => (
                          <div key={key} className="p-4 border rounded-2xl bg-slate-50">
                            <p className="text-[9px] font-bold uppercase text-blue-600 mb-2">{key}</p>
                            <img src={file} className="w-full rounded-xl" alt={key} />
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t bg-slate-50 flex gap-4">
              <button onClick={() => handleUpdateStatus(detailTerpilih.id, 'Proses')} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all">
                <RefreshCw size={16}/> Set Proses
              </button>
              <button onClick={() => handleBukaTemplate(detailTerpilih)} className="flex-[2] bg-[#1E3A8A] hover:bg-black text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                <ExternalLink size={16}/> Buat Surat (Buka Template)
              </button>
              <button onClick={() => handleUpdateStatus(detailTerpilih.id, 'Ditolak')} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-6 rounded-2xl font-black text-xs transition-all">
                <Trash2 size={16}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}