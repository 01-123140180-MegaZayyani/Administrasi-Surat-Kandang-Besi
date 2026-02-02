import { useState, useEffect } from "react";
import api from "../../utils/api";
import { X, ExternalLink, RefreshCw, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminPengajuan() {
  const [pengajuan, setPengajuan] = useState([]);
  const [detailTerpilih, setDetailTerpilih] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get("/api/admin/surat");
      console.log("📦 Data pengajuan:", res.data);
      setPengajuan(res.data);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Gagal memuat data: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);
  
  const handleTolakWithNote = (id) => {
    const alasan = prompt("Masukkan alasan penolakan:");
    if (alasan === null) return; // Batal ditekan
    if (!alasan) return alert("Alasan penolakan wajib diisi!");
    
    handleUpdateStatus(id, "Ditolak", alasan);
  };

  const handleUpdateStatus = async (id, statusBaru, catatan = "") => {
    try {
      await api.put(`/api/admin/surat/${id}`, { 
          status: statusBaru,
          catatan_penolakan: catatan // Dikirim ke backend
      });
      alert("✅ Status Berhasil Diperbarui!");
      fetchData();
      setDetailTerpilih(null);
    } catch (err) { 
      console.error("❌ Error:", err);
      alert("❌ Gagal Update Status: " + (err.response?.data?.error || err.message)); 
    }
  };


  const handleBukaTemplate = (item) => {
    const dataLengkap = JSON.parse(item.data_form || '{}');
    
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
                  <button 
                    onClick={() => setDetailTerpilih(item)} 
                    className="text-[10px] font-black underline text-blue-800 hover:text-blue-500"
                  >
                    DETAIL
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detailTerpilih && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b flex justify-between bg-slate-50">
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Detail & Lampiran Berkas</h2>
              <button 
                onClick={() => setDetailTerpilih(null)} 
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-2 gap-12 max-h-[60vh] overflow-y-auto">
              <div className="text-left">
                <h3 className="text-[10px] font-black text-blue-500 mb-6 uppercase tracking-[0.2em]">Data Formulir</h3>
                {Object.entries(JSON.parse(detailTerpilih.data_form || '{}')).map(([k, v]) => (
                  k !== 'berkas' && k !== 'keterangan_surat' && typeof v !== 'object' && (
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
                  {(() => {
                    const dataForm = JSON.parse(detailTerpilih.data_form || '{}');
                    const berkas = dataForm.berkas;
                    
                    if (berkas && typeof berkas === 'object' && Object.keys(berkas).length > 0) {
                      return Object.entries(berkas).map(([key, file]) => (
                        <div 
                          key={key} 
                          className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-blue-500 transition-all"
                        >
                          <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-blue-700">
                            {key.replace(/_/g, ' ')}
                          </span>
                          
                          <div className="flex gap-2">
                            {/* Tombol Lihat */}
                            <a 
                              href={file} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="p-2 bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white rounded-xl transition-all group/btn"
                              title="Lihat file"
                            >
                              <ExternalLink size={14} />
                            </a>
                            
                            {/* Tombol Download */}
                            <a 
                              href={file} 
                              download={`${key}_${detailTerpilih.nama_warga}.${file.split('.').pop()}`}
                              className="p-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl transition-all group/btn"
                              title="Download file"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="14" 
                                height="14" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                              </svg>
                            </a>
                          </div>
                        </div> 
                      ));
                    } else {
                      return <p className="text-xs text-slate-400 italic font-medium">Tidak ada lampiran berkas.</p>;
                    }
                  })()}
                </div>
              </div>
            </div>

            <div className="p-8 border-t bg-slate-50 flex gap-4">
              <button 
                onClick={() => handleUpdateStatus(detailTerpilih.id, 'Proses')} 
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw size={16}/> Set Proses
              </button>
              <button 
                onClick={() => handleBukaTemplate(detailTerpilih)} 
                className="flex-[2] bg-[#1E3A8A] hover:bg-black text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
              >
                <ExternalLink size={16}/> Buat Surat (Buka Template)
              </button>
              <button 
                onClick={() => handleTolakWithNote(detailTerpilih.id)} 
                className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-6 rounded-2xl font-black text-xs transition-all flex items-center gap-2"
                >
                <Trash2 size={16}/> Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}