import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from '../../utils/api';
import { FileText, Upload } from "lucide-react";

export default function FormulirSurat() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type")?.toLowerCase() || "";

  const user = JSON.parse(localStorage.getItem("profil") || "{}");
  
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    nama: user?.nama_lengkap || "",
    nik: user?.nik || "", 
    tempat_tgl_lahir: "",
    agama: "Islam",
    jenis_kelamin: "",
    pekerjaan: "",
    alamat: "",
    keterangan_surat: "",
    
    // Data Tambahan Keramaian
    umur: "",
    no_hp: "",
    nama_orgen_pemilik: "",
    umur_orgen: "",
    pekerjaan_orgen: "",
    alamat_orgen: "",
    nama_unit_orgen: "",
    
    // Data Tambahan SKU (Surat Keterangan Usaha)
    nama_usaha: "",
    jenis_usaha: "",
    alamat_usaha: "",
    tahun_berdiri: "",
    
    // Data Tambahan Domisili
    lama_tinggal: "3 tahun",
    keperluan: "",
    
    // Data Tambahan SKTM (Surat Keterangan Tidak Mampu)
    status: "Kawin",
    peringkat_desil: "1"
  });

  const [files, setFiles] = useState({});

  useEffect(() => {
    let kalimat = "";
    if (type === "domisili") {
      kalimat = "Adalah benar bertempat tinggal lebih dari 3 ( tiga ) tahun berturut-turut dan benar berdomisili di Pekon Kandang Besi Kecamatan Kotaagung Barat Kabupaten Tanggamus.";
    } else if (type === "sku") {
      kalimat = "Nama tersebut diatas benar memiliki usaha yang berlokasi di wilayah Pekon Kandang Besi Kecamatan Kotaagung Barat Kabupaten Tanggamus.";
    } else if (type === "keramaian") {
      kalimat = "Surat ini diajukan untuk permohonan izin keramaian/pernikahan/khitanan di Pekon Kandang Besi.";
    } else if (type === "sktm") {
      kalimat = "Nama tersebut diatas adalah benar warga Pekon Kandang Besi yang tergolong keluarga tidak mampu.";
    }
    setInputs(prev => ({ ...prev, keterangan_surat: kalimat }));
  }, [type]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const [fileError, setFileError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB dalam bytes

    if (file && file.size > maxSize) {
      setFileError(`File ${file.name} terlalu besar! Maksimal 5 MB.`);
      e.target.value = ""; // Reset input file
      return;
    }

    setFileError(""); // Hapus error jika file valid
    setFiles({ ...files, [e.target.name]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nik_pengaju", user.nik); 
      formData.append("nama_warga", inputs.nama);
      formData.append("jenis_surat", type.toUpperCase());
      formData.append("status", "Pending"); 
      formData.append("data_form", JSON.stringify(inputs));
      
      Object.keys(files).forEach((key) => {
        if (files[key]) { formData.append(key, files[key]); }
      });

      await api.post('/api/surat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Pengajuan Berhasil Terkirim!");
      navigate("/status"); 
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim pengajuan: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const renderFileUploads = () => {
    const syarat = {
      keramaian: ["ktp_penyelenggara", "ktp_pemilik_organ"],
      sku: ["ktp", "foto_usaha"],
      domisili: ["ktp", "kk"],
      sktm: ["ktp", "kk", "foto_rumah"]
    };
    const currentSyarat = syarat[type] || ["ktp", "kk"];
    return (
      <div className="flex flex-col gap-3">
        {currentSyarat.map((item) => (
          <div key={item} className="p-3 border rounded-xl bg-slate-50 flex flex-col gap-1 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Unggah {item.replace(/_/g, " ")}</label>
            <input required type="file" name={item} onChange={handleFileChange} className="text-[11px] file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-blue-100 file:text-blue-700" />
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
              <h2 className="font-bold text-xs uppercase">Data Identitas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
                <input name="nama" value={inputs.nama} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase">NIK</label>
                <input name="nik" value={inputs.nik} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Tempat/Tgl Lahir</label>
                <input name="tempat_tgl_lahir" onChange={handleChange} placeholder="Contoh: Jakarta, 01-01-1990" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Kelamin</label>
                <select name="jenis_kelamin" onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required>
                  <option value="">-- Pilih --</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Agama</label>
                <select name="agama" value={inputs.agama} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan</label>
                <input name="pekerjaan" onChange={handleChange} placeholder="Contoh: Wiraswasta" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
              </div>
              <div className="md:col-span-2 space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Lengkap</label>
                <textarea name="alamat" onChange={handleChange} placeholder="Dusun, RT/RW, Pekon, Kecamatan, Kabupaten" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold h-20 outline-none" required />
              </div>
              
              {/* DATA KHUSUS KERAMAIAN */}
              {type === "keramaian" && (
                <>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Umur</label>
                    <input name="umur" onChange={handleChange} placeholder="Contoh: 35" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">No. HP</label>
                    <input name="no_hp" onChange={handleChange} placeholder="08xxxxxxxxxx" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                  <div className="md:col-span-2 border-t pt-4 mt-2">
                    <h2 className="font-bold text-xs uppercase text-blue-800 mb-4">Data Pemilik Orgen</h2>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Pemilik Orgen</label>
                    <input name="nama_orgen_pemilik" onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Umur Pemilik Orgen</label>
                    <input name="umur_orgen" onChange={handleChange} placeholder="Contoh: 45" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Pekerjaan Pemilik</label>
                    <input name="pekerjaan_orgen" onChange={handleChange} placeholder="Contoh: Wiraswasta" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Unit Orgen</label>
                    <input name="nama_unit_orgen" onChange={handleChange} placeholder="Contoh: BERKA NADA MUSIC" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                  <div className="md:col-span-2 space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Pemilik Orgen</label>
                    <textarea name="alamat_orgen" onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold h-20 outline-none" required />
                  </div>
                </>
              )}
              
              {/* DATA KHUSUS SKU (Surat Keterangan Usaha) */}
              {type === "sku" && (
                <>
                  <div className="md:col-span-2 border-t pt-4 mt-2">
                    <h2 className="font-bold text-xs uppercase text-blue-800 mb-4">Data Usaha</h2>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Usaha</label>
                    <input name="nama_usaha" onChange={handleChange} placeholder="Contoh: Toko Sembako Makmur" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Usaha</label>
                    <input name="jenis_usaha" onChange={handleChange} placeholder="Contoh: Toko Kelontong" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                  <div className="md:col-span-2 space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Usaha</label>
                    <textarea name="alamat_usaha" onChange={handleChange} placeholder="Alamat lengkap lokasi usaha" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold h-20 outline-none" required />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Tahun Berdiri</label>
                    <input name="tahun_berdiri" onChange={handleChange} placeholder="Contoh: 2020" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Keperluan Surat</label>
                    <input name="keperluan" onChange={handleChange} placeholder="Contoh: Pengajuan Kredit" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                </>
              )}
              
              {/* DATA KHUSUS DOMISILI */}
              {type === "domisili" && (
                <>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Lama Tinggal</label>
                    <input name="lama_tinggal" value={inputs.lama_tinggal} onChange={handleChange} placeholder="Contoh: 5 tahun" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Keperluan Surat</label>
                    <input name="keperluan" onChange={handleChange} placeholder="Contoh: Melamar pekerjaan" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                </>
              )}
              
              {/* DATA KHUSUS SKTM (Surat Keterangan Tidak Mampu) */}
              {type === "sktm" && (
                <>
                  <div className="md:col-span-2 border-t pt-4 mt-2">
                    <h2 className="font-bold text-xs uppercase text-blue-800 mb-4">Data Tambahan SKTM</h2>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Status Perkawinan</label>
                    <select name="status" value={inputs.status} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required>
                      <option value="Kawin">Kawin</option>
                      <option value="Belum Kawin">Belum Kawin</option>
                      <option value="Cerai Hidup">Cerai Hidup</option>
                      <option value="Cerai Mati">Cerai Mati</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Peringkat Desil</label>
                    <select name="peringkat_desil" value={inputs.peringkat_desil} onChange={handleChange} className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required>
                      <option value="1">Desil 1 (Sangat Miskin)</option>
                      <option value="2">Desil 2</option>
                      <option value="3">Desil 3</option>
                      <option value="4">Desil 4</option>
                      <option value="5">Desil 5</option>
                      <option value="6">Desil 6</option>
                      <option value="7">Desil 7</option>
                      <option value="8">Desil 8</option>
                      <option value="9">Desil 9</option>
                      <option value="10">Desil 10</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Keperluan Surat</label>
                    <input name="keperluan" onChange={handleChange} placeholder="Contoh: Beasiswa, Bantuan Sosial, dll" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none" required />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-6 border-b pb-3 text-emerald-600">
              <Upload size={18} />
              <h2 className="text-[#1E3A8A] font-bold text-xs uppercase">Berkas Persyaratan</h2>
            </div>
            {renderFileUploads()}
          </div>

            {fileError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700 text-xs font-bold uppercase">{fileError}</p>
              </div>
            )}
            
          <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${loading ? "bg-slate-300" : "bg-[#1E3A8A] text-white hover:bg-blue-900"}`}>
            {loading ? "Sedang Mengirim..." : "Kirim Pengajuan"}
          </button>
        </form>
      </div>
    </div>
  );
}