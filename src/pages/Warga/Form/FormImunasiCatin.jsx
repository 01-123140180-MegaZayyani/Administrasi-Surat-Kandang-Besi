import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

export default function FormImunisasiCatin() {
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
    fotoKtp: null,
    fotoKk: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await api.post('/api/surat', data);
      alert("✅ Permohonan Surat Imunisasi Berhasil!");
      navigate('/beranda');
    } catch (error) {
      alert("❌ Gagal mengajukan surat");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12">
      {/* Header Banner Biru Navy Standar Tanpa Tombol Kembali */}
      <div className="bg-[#1E3A8A] text-white p-6 mb-8 shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center text-[#1E3A8A] font-bold">DESA</div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide">Surat Keterangan Imunisasi</h1>
            <p className="text-sm opacity-80 text-blue-100">Layanan pengurusan surat secara online - mudah & cepat</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-white py-4 px-8 border-b border-slate-100 text-center">
          <h2 className="text-[#1E3A8A] font-bold text-lg uppercase">Formulir Surat Keterangan Imunisasi (Catin)</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10 text-slate-700">
          
          <section className="space-y-6">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">
              I. DATA DIRI PEMOHON
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama & NIK Ketik Manual */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Masukkan nama lengkap" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, nama: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">NIK <span className="text-red-500">*</span></label>
                <input type="text" placeholder="16 digit NIK" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, nik: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Tempat Lahir <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Tempat lahir" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, tempatLahir: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Tanggal Lahir <span className="text-red-500">*</span></label>
                <input type="date" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Jenis Kelamin <span className="text-red-500">*</span></label>
                <select className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" required
                  onChange={(e) => setFormData({...formData, jenisKelamin: e.target.value})}>
                  <option value="">-- Pilih --</option>
                  <option value="Laki-Laki">Laki-Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              {/* Agama & Pekerjaan Bersebelahan */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Agama <span className="text-red-500">*</span></label>
                <select className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" required
                  onChange={(e) => setFormData({...formData, agama: e.target.value})}>
                  <option value="">-- Pilih Agama --</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Budha">Budha</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Pekerjaan <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Masukkan pekerjaan" className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, pekerjaan: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Alamat Lengkap <span className="text-red-500">*</span></label>
                <textarea className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" rows="3" placeholder="Masukkan alamat sesuai KTP" required 
                  onChange={(e) => setFormData({...formData, alamatLengkap: e.target.value})}></textarea>
              </div>
            </div>
          </section>

          <section className="space-y-6 pt-4">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">
              II. LAMPIRAN PERSYARATAN
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Unggah KTP <span className="text-red-500">*</span></label>
                <div className="border-2 border-dashed border-blue-100 rounded-xl p-4 flex items-center justify-between bg-blue-50/30">
                  <input type="file" required accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#1E3A8A] file:text-white hover:file:bg-blue-800 transition-all cursor-pointer" 
                    onChange={(e) => setFormData({...formData, fotoKtp: e.target.files[0]})} />
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