import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

export default function FormDomisili() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    alamatAsal: '',
    tujuanDomisili: '',
    fotoKtp: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await api.post('/surat-domisili', data);
      alert("✅ Permohonan Domisili Berhasil!");
      navigate('/beranda');
    } catch (error) {
      alert("❌ Gagal mengirim permohonan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-[#1E3A8A] py-4 px-8 text-center">
        <h2 className="text-white font-bold text-lg uppercase tracking-wider">Formulir Keterangan Domisili</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-[#1E3A8A]">Nama Lengkap</label>
            <input 
              type="text" 
              className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" 
              required 
              onChange={(e) => setFormData({...formData, nama: e.target.value})} 
            />
          </div>
          
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-[#1E3A8A]">NIK</label>
            <input 
              type="text" 
              className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" 
              required 
              onChange={(e) => setFormData({...formData, nik: e.target.value})} 
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-[#1E3A8A]">Alamat Domisili</label>
            <textarea 
              className="p-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none" 
              rows="3" 
              required 
              onChange={(e) => setFormData({...formData, alamatAsal: e.target.value})}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-[#1E3A8A] text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Permohonan'}
          </button>
        </div>
      </form>
    </div>
  );
}