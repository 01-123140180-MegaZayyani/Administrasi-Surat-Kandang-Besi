// src/pages/Warga/Form/FormSKTM.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

export default function FormSKTM() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: '', nik: '', pekerjaan: '', alamatLengkap: '', penghasilan: '', 
    tujuanSKTM: '', fotoKtp: null, fotoKk: null, fotoRumah: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();

    data.append('jenisSurat', 'Surat Keterangan Tidak Mampu');

    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    try {
      await api.post('/api/surat', data);
      alert("✅ Permohonan SKTM Berhasil!");
      navigate('/beranda');
    } catch (error) { alert("❌ Gagal mengajukan surat"); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12 text-left">
      <div className="bg-[#1E3A8A] text-white p-6 mb-8 shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center text-[#1E3A8A] font-bold">DESA</div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide">Surat Keterangan Tidak Mampu (SKTM)</h1>
            <p className="text-sm opacity-80 text-blue-100">Layanan bantuan sosial dan keringanan biaya</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-10 text-slate-700">
          <section className="space-y-6">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">I. DATA PEMOHON</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" className="p-3 rounded-xl border border-slate-200 outline-none" required onChange={(e) => setFormData({...formData, nama: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Pekerjaan <span className="text-red-500">*</span></label>
                <input type="text" className="p-3 rounded-xl border border-slate-200 outline-none" required onChange={(e) => setFormData({...formData, pekerjaan: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Rata-rata Penghasilan/Bulan <span className="text-red-500">*</span></label>
                <input type="number" placeholder="Contoh: 500000" className="p-3 rounded-xl border border-slate-200 outline-none" required onChange={(e) => setFormData({...formData, penghasilan: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Tujuan Penggunaan SKTM <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Contoh: Persyaratan Beasiswa Sekolah / Keringanan RS" className="p-3 rounded-xl border border-slate-200 outline-none" required onChange={(e) => setFormData({...formData, tujuanSKTM: e.target.value})} />
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-4">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">II. LAMPIRAN</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Unggah Foto Rumah (Tampak Depan) <span className="text-red-500">*</span></label>
                <div className="border-2 border-dashed border-blue-100 rounded-xl p-4 bg-blue-50/30">
                  <input type="file" required accept="image/*" className="text-xs" onChange={(e) => setFormData({...formData, fotoRumah: e.target.files[0]})} />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-6">
            <button type="submit" disabled={isSubmitting} className="bg-[#1E3A8A] text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg active:scale-95">
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}