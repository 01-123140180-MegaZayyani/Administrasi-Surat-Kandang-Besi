import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

export default function FormKehilangan() {
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
    barangHilang: '', // Contoh: KTP, ATM, atau Ijazah
    tglKehilangan: '',
    lokasiKehilangan: '',
    fotoKk: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await api.post('/api/surat', data);
      alert("✅ Permohonan Surat Kehilangan Berhasil Diajukan!");
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
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center text-[#1E3A8A] font-bold shadow-sm">DESA</div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide">Surat Keterangan Kehilangan</h1>
            <p className="text-sm opacity-80 text-blue-100">Layanan mandiri pengurusan surat kehilangan benda/dokumen</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-white py-4 px-8 border-b border-slate-100 text-center">
          <h2 className="text-[#1E3A8A] font-bold text-lg uppercase">Formulir Laporan Kehilangan</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10 text-slate-700">
          
          {/* I. DATA DIRI */}
          <section className="space-y-6">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">
              I. DATA DIRI PELAPOR
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Masukkan nama lengkap" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" required 
                  onChange={(e) => setFormData({...formData, nama: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">NIK <span className="text-red-500">*</span></label>
                <input type="text" placeholder="16 digit NIK" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, nik: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Tempat Lahir <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Contoh: Sanggi" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, tempatLahir: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Tanggal Lahir <span className="text-red-500">*</span></label>
                <input type="date" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Agama <span className="text-red-500">*</span></label>
                <select className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none bg-white" required
                  onChange={(e) => setFormData({...formData, agama: e.target.value})}>
                  <option value="">-- Pilih Agama --</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Budha">Budha</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Pekerjaan <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Masukkan pekerjaan" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, pekerjaan: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Alamat Lengkap <span className="text-red-500">*</span></label>
                <textarea className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" rows="3" placeholder="Alamat sesuai identitas" required 
                  onChange={(e) => setFormData({...formData, alamatLengkap: e.target.value})}></textarea>
              </div>
            </div>
          </section>

          {/* II. RINCIAN KEHILANGAN */}
          <section className="space-y-6 pt-4">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">
              II. RINCIAN KEHILANGAN
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#1E3A8A]">Barang / Dokumen Yang Hilang <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Contoh: Kartu Tanda Penduduk (KTP) / ATM BRI" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, barangHilang: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Tanggal Kehilangan <span className="text-red-500">*</span></label>
                <input type="date" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, tglKehilangan: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#1E3A8A]">Lokasi Kejadian (Perkiraan) <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Contoh: Sekitar Pasar Kotaagung" className="p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, lokasiKehilangan: e.target.value})} />
              </div>
            </div>
          </section>

          {/* III. LAMPIRAN */}
          <section className="space-y-6 pt-4">
            <h3 className="text-[#1E3A8A] font-bold flex items-center gap-2 border-b pb-2 text-sm uppercase">
              III. LAMPIRAN
            </h3>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#1E3A8A]">Unggah Foto Kartu Keluarga (KK) <span className="text-red-500">*</span></label>
              <div className="border-2 border-dashed border-blue-100 rounded-xl p-4 flex items-center justify-between bg-blue-50/30">
                <input type="file" required accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#1E3A8A] file:text-white hover:file:bg-blue-800 transition-all cursor-pointer" 
                  onChange={(e) => setFormData({...formData, fotoKk: e.target.files[0]})} />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">*Sebagai bukti identitas pendukung permohonan surat kehilangan.</p>
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