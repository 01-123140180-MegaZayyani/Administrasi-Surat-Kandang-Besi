import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { Upload } from 'lucide-react';

export default function FormDomisili() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    agama: 'Islam',
    pekerjaan: '',
    alamatLengkap: '',
    fotoKtp: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    
    // Memberitahu backend jenis surat yang diajukan
    data.append('jenisSurat', 'Surat Keterangan Domisili');

    const ttl = `${formData.tempatLahir}, ${formData.tanggalLahir}`;
    data.append('ttl', ttl);

    data.append('jenisSurat', 'domisili');
    
    Object.keys(formData).forEach(key => {
      if (key !== 'tempatLahir' && key !== 'tanggalLahir') {
        data.append(key, formData[key]);
      }
    });

    try {
      await api.post('/api/surat', data);
      alert("✅ Permohonan Domisili Berhasil!");
      navigate('/beranda');
    } catch (error) {
      console.error("Submit Error:", error);
      alert("❌ Gagal mengirim permohonan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden my-10">
      <div className="bg-[#1E3A8A] py-5 px-8 text-center">
        <h2 className="text-white font-bold text-lg uppercase tracking-wider">Formulir Keterangan Domisili</h2>
        <p className="text-blue-100 text-xs mt-1">Lengkapi data sesuai KTP untuk proses verifikasi Pekon</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-[#1E3A8A]">Nama Lengkap (Sesuai KTP)</label>
            <input type="text" className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" required 
              onChange={(e) => setFormData({...formData, nama: e.target.value})} />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1E3A8A]">NIK</label>
            <input type="text" maxLength="16" className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" required 
              onChange={(e) => setFormData({...formData, nik: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1E3A8A]">Jenis Kelamin</label>
            <select className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" required
              onChange={(e) => setFormData({...formData, jenisKelamin: e.target.value})}>
              <option value="">-- Pilih --</option>
              <option value="Laki-Laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1E3A8A]">Tempat Lahir</label>
            <input type="text" className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" required 
              onChange={(e) => setFormData({...formData, tempatLahir: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1E3A8A]">Tanggal Lahir</label>
            <input type="date" className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" required 
              onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1E3A8A]">Agama</label>
            <select className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" required
              onChange={(e) => setFormData({...formData, agama: e.target.value})}>
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Budha">Budha</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1E3A8A]">Pekerjaan</label>
            <input type="text" placeholder="Contoh: Petani/Pekebun" className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" required 
              onChange={(e) => setFormData({...formData, pekerjaan: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-[#1E3A8A]">Alamat Lengkap di Pekon Kandang Besi</label>
            <textarea className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" rows="2" required 
              onChange={(e) => setFormData({...formData, alamatLengkap: e.target.value})}></textarea>
          </div>

          {/* KOLOM UPLOAD KTP (UKURAN COMPACT) */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-[#1E3A8A]">Upload Foto KTP</label>
            <div className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all relative">
              <Upload size={20} className="text-[#1E3A8A]" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-600">
                  {formData.fotoKtp ? formData.fotoKtp.name : "Klik untuk pilih foto KTP"}
                </span>
                <span className="text-[10px] text-slate-400">Format: JPG, PNG (Maks 2MB)</span>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                required 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setFormData({...formData, fotoKtp: e.target.files[0]})} 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isSubmitting} className="bg-[#1E3A8A] text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all disabled:opacity-50">
            {isSubmitting ? 'Mengirim...' : 'Kirim Permohonan'}
          </button>
        </div>
      </form>
    </div>
  );
}