import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

export default function FormBelumNikah() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    agama: '',
    pekerjaan: '',
    alamatLengkap: '',
    keperluan: '',
    fotoKtp: null,
    fotoKk: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nik.length !== 16 || isNaN(formData.nik)) {
      return alert("Gagal! NIK harus berjumlah 16 digit angka.");
    }

    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      // Ubah fetch localhost menjadi api.post
      await api.post('/api/surat', data); 
      alert("✅ Permohonan 'Surat Belum Nikah' Berhasil!");
      navigate('/status-pengajuan');
    } catch (error) {
      alert("❌ Gagal mengajukan surat");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12 text-left animate-fadeIn">
      {/* Header Navy */}
      <div className="bg-[#1E3A8A] text-white p-6 mb-8 shadow-md rounded-xl">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center text-[#1E3A8A] font-bold">DESA</div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide">Surat Keterangan Belum Menikah</h1>
            <p className="text-sm opacity-80 text-blue-100">Status perkawinan Belum Kawin</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-10 text-slate-700">
          <section className="space-y-6">
            <h3 className="text-[#1E3A8A] font-bold border-b pb-2 text-sm uppercase">I. DATA PRIBADI</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" className="p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500" required 
                  onChange={(e) => setFormData({...formData, nama: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">NIK <span className="text-red-500">*</span></label>
                <input type="text" className="p-3 rounded-xl border border-slate-200 outline-none" required 
                  onChange={(e) => setFormData({...formData, nik: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Pekerjaan <span className="text-red-500">*</span></label>
                <input type="text" className="p-3 rounded-xl border border-slate-200 outline-none" required 
                  onChange={(e) => setFormData({...formData, pekerjaan: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Keperluan Surat <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Contoh: Syarat Melamar Pekerjaan" className="p-3 rounded-xl border border-slate-200 outline-none" required 
                  onChange={(e) => setFormData({...formData, keperluan: e.target.value})} />
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-4">
            <h3 className="text-[#1E3A8A] font-bold border-b pb-2 text-sm uppercase">II. LAMPIRAN</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Foto KTP <span className="text-red-500">*</span></label>
                <div className="border-2 border-dashed border-blue-100 rounded-xl p-4 bg-blue-50/30">
                  <input type="file" required accept="image/*" className="text-xs" 
                    onChange={(e) => setFormData({...formData, fotoKtp: e.target.files[0]})} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Foto KK <span className="text-red-500">*</span></label>
                <div className="border-2 border-dashed border-blue-100 rounded-xl p-4 bg-blue-50/30">
                  <input type="file" required accept="image/*" className="text-xs" 
                    onChange={(e) => setFormData({...formData, fotoKk: e.target.files[0]})} />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-6">
            <button type="submit" disabled={isSubmitting} className="bg-[#1E3A8A] text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-900 shadow-lg active:scale-95 transition-all">
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}