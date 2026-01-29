import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

export default function FormKematian() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    namaJenazah: '',
    nikJenazah: '',
    tglMeninggal: '',
    tempatMeninggal: '',
    sebabMeninggal: '',
    pelapor: '',
    alamatLengkap: '',
    fotoKtpPelapor: null, // Tambahan baru
    fotoKk: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      await api.post('/api/surat', data);
      alert("✅ Permohonan Surat Kematian Berhasil Diajukan!");
      navigate('/beranda');
    } catch (error) {
      alert("❌ Gagal mengajukan surat");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12 text-left">
      {/* Header Banner Biru Navy Standar */}
      <div className="bg-[#1E3A8A] text-white p-6 mb-8 shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center text-[#1E3A8A] font-bold">DESA</div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide">Surat Keterangan Kematian</h1>
            <p className="text-sm opacity-80 text-blue-100">Pelayanan administrasi pencatatan kematian penduduk</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-white py-4 px-8 border-b border-slate-100 text-center">
          <h2 className="text-[#1E3A8A] font-bold text-lg uppercase">Formulir Laporan Kematian</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10 text-slate-700">
          
          {/* I. IDENTITAS JENAZAH */}
          <section className="space-y-6">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">
              I. IDENTITAS JENAZAH
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Nama Lengkap (Alm/Almh) <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Masukkan nama jenazah" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" required 
                  onChange={(e) => setFormData({...formData, namaJenazah: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">NIK Jenazah <span className="text-red-500">*</span></label>
                <input type="text" placeholder="16 Digit NIK Jenazah" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" required 
                  onChange={(e) => setFormData({...formData, nikJenazah: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Tanggal Meninggal <span className="text-red-500">*</span></label>
                <input type="date" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" required 
                  onChange={(e) => setFormData({...formData, tglMeninggal: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Tempat Meninggal <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Contoh: Rumah Duka / RS" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" required 
                  onChange={(e) => setFormData({...formData, tempatMeninggal: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Sebab Meninggal <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Contoh: Sakit Biasa / Usia Lanjut" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" required 
                  onChange={(e) => setFormData({...formData, sebabMeninggal: e.target.value})} />
              </div>
            </div>
          </section>

          {/* II. DATA PELAPOR */}
          <section className="space-y-6 pt-4">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">
              II. DATA PELAPOR
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Nama Pelapor (Ahli Waris/Keluarga) <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Nama lengkap pelapor" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" required 
                  onChange={(e) => setFormData({...formData, pelapor: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Alamat Lengkap Pelapor <span className="text-red-500">*</span></label>
                <textarea className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" rows="2" placeholder="Masukkan alamat lengkap pelapor" required 
                  onChange={(e) => setFormData({...formData, alamatLengkap: e.target.value})}></textarea>
              </div>
            </div>
          </section>

          {/* III. LAMPIRAN (UPDATE: KTP PELAPOR) */}
          <section className="space-y-6 pt-4">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">
              III. LAMPIRAN PERSYARATAN
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Unggah KTP Pelapor <span className="text-red-500">*</span></label>
                <div className="border-2 border-dashed border-blue-100 rounded-xl p-4 bg-blue-50/30">
                  <input type="file" required accept="image/*" className="text-xs file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1E3A8A] file:text-white cursor-pointer" 
                    onChange={(e) => setFormData({...formData, fotoKtpPelapor: e.target.files[0]})} />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-6">
            <button type="submit" disabled={isSubmitting} className="bg-[#1E3A8A] text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg active:scale-95 disabled:opacity-50">
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}