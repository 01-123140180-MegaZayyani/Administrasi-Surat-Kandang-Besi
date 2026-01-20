import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

export default function FormKelahiran() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    namaBayi: '',
    jenisKelamin: '',
    tempatLahir: '',
    tanggalLahir: '',
    pukul: '',
    namaAyah: '',
    namaIbu: '',
    alamatLengkap: '',
    fotoKtpAyah: null, // Tambahan
    fotoKtpIbu: null,  // Tambahan
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
      await api.post('/surat', data);
      alert("✅ Permohonan Surat Kelahiran Berhasil Diajukan!");
      navigate('/beranda');
    } catch (error) {
      alert("❌ Gagal mengajukan surat");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12">
      {/* Header Banner Biru Navy Standar */}
      <div className="bg-[#1E3A8A] text-white p-6 mb-8 shadow-md">
        <div className="flex items-center gap-4 text-left">
          <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center text-[#1E3A8A] font-bold">DESA</div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide">Surat Keterangan Kelahiran</h1>
            <p className="text-sm opacity-80 text-blue-100">Pencatatan data kelahiran penduduk pekon</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-left">
        <div className="bg-white py-4 px-8 border-b border-slate-100 text-center">
          <h2 className="text-[#1E3A8A] font-bold text-lg uppercase">Formulir Kelahiran Bayi</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10 text-slate-700">
          
          {/* I. DATA BAYI */}
          <section className="space-y-6">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">
              I. DATA BAYI
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Nama Bayi <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Masukkan nama bayi" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" required 
                  onChange={(e) => setFormData({...formData, namaBayi: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Jenis Kelamin <span className="text-red-500">*</span></label>
                <select className="p-3 rounded-xl border border-slate-200 outline-none" required
                  onChange={(e) => setFormData({...formData, jenisKelamin: e.target.value})}>
                  <option value="">-- Pilih --</option>
                  <option value="Laki-Laki">Laki-Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Waktu Kelahiran <span className="text-red-500">*</span></label>
                <input type="time" className="p-3 rounded-xl border border-slate-200 outline-none" required 
                  onChange={(e) => setFormData({...formData, pukul: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Tempat Lahir <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Contoh: RSUD Kotaagung" className="p-3 rounded-xl border border-slate-200 outline-none" required 
                  onChange={(e) => setFormData({...formData, tempatLahir: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Tanggal Lahir <span className="text-red-500">*</span></label>
                <input type="date" className="p-3 rounded-xl border border-slate-200 outline-none" required 
                  onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})} />
              </div>
            </div>
          </section>

          {/* II. DATA ORANG TUA */}
          <section className="space-y-6 pt-4">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">
              II. DATA ORANG TUA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Nama Ayah <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Nama lengkap Ayah" className="p-3 rounded-xl border border-slate-200 outline-none" required 
                  onChange={(e) => setFormData({...formData, namaAyah: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Nama Ibu <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Nama lengkap Ibu" className="p-3 rounded-xl border border-slate-200 outline-none" required 
                  onChange={(e) => setFormData({...formData, namaIbu: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Alamat Domisili <span className="text-red-500">*</span></label>
                <textarea className="p-3 rounded-xl border border-slate-200 outline-none" rows="2" placeholder="Alamat lengkap orang tua" required 
                  onChange={(e) => setFormData({...formData, alamatLengkap: e.target.value})}></textarea>
              </div>
            </div>
          </section>

          {/* III. LAMPIRAN (UPDATE: KTP AYAH & IBU) */}
          <section className="space-y-6 pt-4">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">
              III. LAMPIRAN DOKUMEN
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Unggah KTP Ayah <span className="text-red-500">*</span></label>
                <div className="border-2 border-dashed border-blue-100 rounded-xl p-4 bg-blue-50/30">
                  <input type="file" required accept="image/*" className="text-xs file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1E3A8A] file:text-white cursor-pointer" 
                    onChange={(e) => setFormData({...formData, fotoKtpAyah: e.target.files[0]})} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Unggah KTP Ibu <span className="text-red-500">*</span></label>
                <div className="border-2 border-dashed border-blue-100 rounded-xl p-4 bg-blue-50/30">
                  <input type="file" required accept="image/*" className="text-xs file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1E3A8A] file:text-white cursor-pointer" 
                    onChange={(e) => setFormData({...formData, fotoKtpIbu: e.target.files[0]})} />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Unggah Kartu Keluarga (KK) <span className="text-red-500">*</span></label>
                <div className="border-2 border-dashed border-blue-100 rounded-xl p-4 bg-blue-50/30">
                  <input type="file" required accept="image/*" className="text-xs file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1E3A8A] file:text-white cursor-pointer" 
                    onChange={(e) => setFormData({...formData, fotoKk: e.target.files[0]})} />
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