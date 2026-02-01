import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { Upload, Briefcase } from 'lucide-react';

export default function FormSKU() {
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
    namaUsaha: '',
    lokasiUsaha: 'Pekon Kandang Besi',
    fotoKtp: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    
    // Gabung Tempat & Tgl Lahir sesuai format surat: "Kandang Besi, 08-09-2001"
    const ttl = `${formData.tempatLahir}, ${formData.tanggalLahir}`;
    data.append('ttl', ttl);
    
    Object.keys(formData).forEach(key => {
      if (key !== 'tempatLahir' && key !== 'tanggalLahir') {
        data.append(key, formData[key]);
      }
    });

    try {
      await api.post('/api/surat', data);
      alert("✅ Permohonan SKU Berhasil Diajukan!");
      navigate('/beranda');
    } catch (error) {
      alert("❌ Gagal mengajukan surat");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12 font-sans text-left">
      <div className="bg-[#1E3A8A] text-white p-6 mb-8 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="bg-white/20 p-2 rounded-xl">
            <Briefcase size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide">Surat Keterangan Usaha</h1>
            <p className="text-xs opacity-80">Pemerintah Pekon Kandang Besi</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* DATA DIRI */}
          <section className="space-y-6">
            <h3 className="text-[#1E3A8A] font-bold border-b pb-2 text-sm uppercase tracking-wider">I. Data Pemilik Usaha</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-600">Nama Lengkap (Sesuai KTP)</label>
                <input type="text" className="p-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-50" required 
                  onChange={(e) => setFormData({...formData, nama: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-600">NIK</label>
                <input type="text" maxLength="16" className="p-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-50" required 
                  onChange={(e) => setFormData({...formData, nik: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-600">Jenis Kelamin</label>
                <select className="p-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-50" required
                  onChange={(e) => setFormData({...formData, jenisKelamin: e.target.value})}>
                  <option value="">-- Pilih --</option>
                  <option value="Laki-Laki">Laki-Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-600">Tempat Lahir</label>
                <input type="text" className="p-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-50" required 
                  onChange={(e) => setFormData({...formData, tempatLahir: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-600">Tanggal Lahir</label>
                <input type="date" className="p-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-50" required 
                  onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})} />
              </div>
            </div>
          </section>

          {/* KETERANGAN USAHA */}
          <section className="space-y-6 pt-4">
            <h3 className="text-[#1E3A8A] font-bold border-b pb-2 text-sm uppercase tracking-wider">II. Keterangan Usaha</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-600">Nama/Jenis Usaha</label>
                <input type="text" placeholder='Contoh: "JUAL BELI HASIL BUMI"' className="p-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-50" required 
                  onChange={(e) => setFormData({...formData, namaUsaha: e.target.value})} />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-600">Lokasi Usaha</label>
                <input type="text" defaultValue="Pekon Kandang Besi" className="p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none" required 
                  onChange={(e) => setFormData({...formData, lokasiUsaha: e.target.value})} />
              </div>
            </div>
          </section>

          {/* LAMPIRAN - COMPACT SIZE */}
          <section className="space-y-4 pt-4">
            <h3 className="text-[#1E3A8A] font-bold border-b pb-2 text-sm uppercase tracking-wider">III. Lampiran</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600">Upload Foto KTP</label>
              <div className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all relative group">
                <Upload size={20} className="text-[#1E3A8A]" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-600">
                    {formData.fotoKtp ? formData.fotoKtp.name : "Pilih foto KTP pemohon"}
                  </span>
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
          </section>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-[#1E3A8A] text-white px-12 py-3 rounded-xl font-bold hover:bg-blue-900 shadow-lg transition-all active:scale-95 disabled:opacity-50">
              {isSubmitting ? 'Mengirim...' : 'Ajukan SKU'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}