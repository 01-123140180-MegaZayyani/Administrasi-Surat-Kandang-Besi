import React, { useState, useEffect } from "react";
import api from "../../utils/api"
import { X, CheckCircle, XCircle, Download, FileText, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminPengajuan() {
  const [pengajuan, setPengajuan] = useState([]);
  const [detailTerpilih, setDetailTerpilih] = useState(null);
  const navigate = useNavigate();

  const fetchData = () => {
    api.get("/api/pengajuan")
      .then(res => setPengajuan(res.data))
      .catch(err => console.error("Gagal ambil data"));
  };

  useEffect(() => { fetchData(); }, []);

  const handleProsesSurat = (item) => {
    const dataForm = JSON.parse(item.data_form || '{}');
    navigate("/admin/template", { 
      state: { 
        id_pengajuan: item.id,
        jenis_surat: item.jenis_surat,
        warga: {
          nama: item.nama_warga,
          nik: item.nik_pengaju,
          alamat: dataForm.alamat || "",
          pekerjaan: dataForm.pekerjaan || "",
          agama: dataForm.agama || "",
          ttl: dataForm.tempat_tgl_lahir || ""
        }
      } 
    });
  };

  const updateStatus = (id, statusBaru) => {
    api.put(`/api/pengajuan/${id}`, { status: statusBaru })
      .then(() => {
        fetchData();
        setDetailTerpilih(null);
      })
      .catch(err => alert("Gagal update status"));
  };

  return (
    <div className="p-10 font-sans text-left bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Data Pengajuan Surat</h1>
        <p className="text-slate-400 text-sm font-medium">Panel Verifikasi Dokumen Pekon Kandang Besi</p>
      </div>
      
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[11px] font-black uppercase tracking-widest text-slate-400">
              <th className="p-8">Warga / NIK</th>
              <th>Jenis Surat</th>
              <th>Status</th>
              <th className="text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pengajuan.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="p-8">
                  <div className="font-bold text-slate-700">{item.nama_warga}</div>
                  <div className="text-[10px] text-slate-400 font-black tracking-wider">{item.nik_pengaju}</div>
                </td>
                <td>
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">
                    {item.jenis_surat}
                  </span>
                </td>
                <td>
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                    item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    item.status === 'Ditolak' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {item.status || "Menunggu"}
                  </div>
                </td>
                <td className="p-8 text-center">
                  <button onClick={() => setDetailTerpilih(item)} className="text-[10px] font-black uppercase tracking-widest text-[#1E3A8A] underline underline-offset-8 hover:text-blue-700 transition-colors">
                    Buka Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detailTerpilih && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Detail Permohonan</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">ID: #{detailTerpilih.id}</p>
              </div>
              <button onClick={() => setDetailTerpilih(null)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"><X size={24} /></button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-slate-50/30 flex-grow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                      <FileText className="text-blue-600" size={20} /><h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Biodata Pengaju</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      {(() => {
                        const data = JSON.parse(detailTerpilih.data_form || '{}');
                        return [
                          { label: "Nama Lengkap", value: data.nama },
                          { label: "NIK", value: data.nik },
                          { label: "Tempat, Tanggal Lahir", value: data.tempat_tgl_lahir },
                          { label: "Pekerjaan", value: data.pekerjaan },
                          { label: "Agama", value: data.agama },
                          { label: "Jenis Kelamin", value: data.jenis_kelamin },
                          { label: "Status Kawin", value: data.status_perkawinan },
                          { label: "Alamat Lengkap", value: data.alamat },
                        ].map((info, i) => (
                          <div key={i} className="flex flex-col border-b border-slate-50 pb-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{info.label}</span>
                            <span className="text-sm font-bold text-slate-700">{info.value || "-"}</span>
                          </div>
                        ));
                      })()}
                    </div>
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
                            <img src={`https://backend-administrasi-surat-kandang-two.vercel.app/uploads/${file}`} className="w-full rounded-xl" alt={key} />
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-50 flex gap-4 bg-white">
              <button onClick={() => handleProsesSurat(detailTerpilih)} className="flex-[2] bg-emerald-600 text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95"><CheckCircle size={18} /> Proses & Isi Template</button>
              <button onClick={() => updateStatus(detailTerpilih.id, 'Ditolak')} className="flex-1 bg-rose-600 text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95"><XCircle size={18} /> Tolak Pengajuan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}