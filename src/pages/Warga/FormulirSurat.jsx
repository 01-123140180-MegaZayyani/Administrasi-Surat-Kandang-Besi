import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from '../../utils/api';
import { FileText, Upload, MessageSquare } from "lucide-react";

export default function FormulirSurat() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type")?.toLowerCase() || "";

  const [user] = useState(JSON.parse(localStorage.getItem("user_profile")));
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    nama: user?.nama_lengkap || "",
    nik: user?.nik || "",
    tempat_tgl_lahir: "",
    agama: "Islam",
    jenis_kelamin: "",
    pekerjaan: "",
    alamat: "",
    status_perkawinan: "Kawin",
    keterangan_surat: ""
  });

  const [files, setFiles] = useState({});

  useEffect(() => {
    let kalimat = "";
    if (type === "domisili") {
      kalimat = "Adalah benar bertempat tinggal lebih dari 3 ( tiga ) tahun berturut-turut dan benar berdomisili di Pekon Kandang Besi Kecamatan Kotaagung Barat Kabupaten Tanggamus.";
    } else if (type === "sku") {
      kalimat = "Nama tersebut diatas membuka usaha [NAMA USAHA] yang berlokasi di wilayah Pekon Kandang Besi sejak tahun [TAHUN] sampai berjalan saat ini.";
    } else if (type === "kematian") {
      kalimat = "Menerangkan bahwa [NAMA ALMARHUM] telah meninggal dunia pada tanggal [TANGGAL] karena [PENYEBAB].";
    } else if (type === "na") {
      kalimat = "Surat ini diajukan sebagai persyaratan administrasi pernikahan (NA) bagi warga tersebut di atas.";
    }
    setInputs(prev => ({ ...prev, keterangan_surat: kalimat }));
  }, [type]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nik_pengaju", user.nik);
      formData.append("nama_warga", inputs.nama);
      formData.append("jenis_surat", type.toUpperCase());
      formData.append("data_form", JSON.stringify(inputs));
      
      Object.keys(files).forEach((key) => {
        formData.append(key, files[key]);
      });

      await api.post('/api/surat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert("Pengajuan Berhasil!");
      navigate("/beranda");
    } catch (err) {
      alert("Gagal mengirim pengajuan.");
    } finally {
      setLoading(false);
    }
  };

  const renderFileUploads = () => {
    const syarat = {
      na: ["ktp_pria", "ktp_wanita", "kk_pria", "kk_wanita"],
      sku: ["ktp"],
      sktm: ["ktp", "kk"],
      kematian: ["kk", "ktp_pelapor"],
      domisili: ["ktp"],
      kelahiran: ["kk", "ktp_ayah", "ktp_ibu"]
    };
    const currentSyarat = syarat[type] || ["ktp", "kk"];

    return (
      <div className="flex flex-col gap-3">
        {currentSyarat.map((item) => (
          <div key={item} className="p-3 border rounded-xl bg-slate-50 flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">
              Unggah {item.replace("_", " ")}
            </label>
            <input 
              required
              type="file" 
              name={item} 
              onChange={handleFileChange} 
              className="text-[11px] file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-blue-100 file:text-blue-700" 
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      <div className="bg-[#1E3A8A] text-white py-10 px-6 text-center">
        <h1 className="text-xl font-bold uppercase tracking-wider">Formulir Surat {type.toUpperCase()}</h1>
        <p className="text-blue-200 text-[10px] mt-1 uppercase tracking-widest">Pekon Kandang Besi</p>
      </div>

      <div className="max-w-3xl mx-auto -mt-6 px-4 pb-20">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-3xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-6 border-b pb-3 text-[#1E3A8A]">
              <FileText size={18} />
              <h2 className="font-bold text-xs uppercase">Data Identitas Sesuai KTP</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
                <input name="nama" value={inputs.nama} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">NIK</label>
                <input name="nik" value={inputs.nik} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat, Tanggal Lahir</label>
                <input name="tempat_tgl_lahir" onChange={handleChange} placeholder="Contoh: Kandang Besi, 05-04-1964" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Agama</label>
                <select name="agama" value={inputs.agama} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Budha">Budha</option>
                  <option value="Khonghucu">Khonghucu</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Kelamin</label>
                <select name="jenis_kelamin" onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required>
                  <option value="">Pilih</option>
                  <option value="Laki-Laki">Laki-Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan</label>
                <input name="pekerjaan" onChange={handleChange} placeholder="Contoh: Petani/Pekebun" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Lengkap</label>
                <textarea name="alamat" onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold h-20 outline-none" required />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-6 border-b pb-3 text-amber-500">
              <MessageSquare size={18} />
              <h2 className="text-[#1E3A8A] font-bold text-xs uppercase">Detail Keterangan Surat</h2>
            </div>
            <textarea name="keterangan_surat" value={inputs.keterangan_surat} onChange={handleChange} className="w-full p-3 bg-amber-50 rounded-xl text-sm font-medium text-amber-900 border border-amber-100 outline-none h-28" required />
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-6 border-b pb-3 text-emerald-600">
              <Upload size={18} />
              <h2 className="text-[#1E3A8A] font-bold text-xs uppercase">Unggah Berkas Persyaratan</h2>
            </div>
            {renderFileUploads()}
          </div>

          <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${loading ? "bg-slate-300" : "bg-[#1E3A8A] text-white hover:bg-blue-900"}`}>
            {loading ? "Sedang Mengirim..." : "Kirim Pengajuan"}
          </button>
        </form>
      </div>
    </div>
  );
}