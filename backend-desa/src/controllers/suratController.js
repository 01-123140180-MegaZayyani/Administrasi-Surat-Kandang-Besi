// src/controllers/suratController.js
const prisma = require('../../db');
const { supabase } = require('./middleware/multerSupabase');

// Helper function untuk transform data Prisma ke format Frontend
const transformSuratData = (surat) => {
  return {
    id: surat.id,
    jenis_surat: surat.jenisSurat,
    nama_warga: surat.user?.nama_lengkap || "Unknown",
    nik_pengaju: surat.user?.nik || "-",
    status: surat.status,
    data_form: JSON.stringify(surat.data || {}),
    file_final: surat.fileSuratSelesai || null,
    tanggal_request: surat.createdAt,
    created_at: surat.createdAt,
    catatan_penolakan: surat.catatanAdmin || null,
    no_tiket: surat.noTiket
  };
};

// --------------------------------------------------
// 🏢 FUNGSI UNTUK WARGA (PENGGUNA)
// --------------------------------------------------

// 1. Membuat Pengajuan Surat Baru
exports.createSurat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jenisSurat, ...data_form } = req.body;

    // Handle upload file dari Supabase
    let berkasUrl = {};
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          // Nama file unik: timestamp_namafile
          const fileName = `${Date.now()}_${file.originalname.replace(/\s/g, '_')}`;
          
          // Upload Buffer ke Supabase Storage
          const { data, error } = await supabase.storage
            .from('data') 
            .upload(`pengajuan/${fileName}`, file.buffer, {
              contentType: file.mimetype
            });

          if (error) throw error;

          // Dapatkan Public URL
          const { data: publicData } = supabase.storage
            .from('surat_desa')
            .getPublicUrl(`pengajuan/${fileName}`);
            
          berkasUrl[file.fieldname] = publicData.publicUrl;
        }
      }

    // Parsing data_form dari string JSON kembali ke object untuk digabung dengan berkas
    let parsedDataForm = {};
    try {
        parsedDataForm = JSON.parse(data_form);
    } catch (e) {
        parsedDataForm = data_form; 
    }

    // Gabungkan data text form dengan URL berkas dari Supabase
    const finalData = { 
        ...parsedDataForm, 
        berkas: berkasUrls 
    };

    const newSurat = await prisma.surat.create({
      data: {
        userId: parseInt(userId),
        jenisSurat: jenisSurat || "Pengajuan Lainnya",
        noTiket: `TKT-${Date.now()}`,
        data: finalData,
        status: "Belum Dikerjakan"
      }
    });

    res.status(201).json({ success: true, data: newSurat });
  } catch (error) {
    console.error("❌ Error createSurat:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Melihat Daftar Surat Milik Sendiri (Warga)
exports.getMySurat = async (req, res) => {
  try {
    const userId = req.user.id;
    const surat = await prisma.surat.findMany({
      where: { userId: parseInt(userId) },
      include: {
        user: {
          select: {
            nama_lengkap: true,
            nik: true,
            no_telp: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const transformedSurat = surat.map(transformSuratData);
    res.json(transformedSurat);
  } catch (error) {
    console.error("❌ Error getMySurat:", error);
    res.status(500).json({ error: error.message });
  }
};

// --------------------------------------------------
// 👑 FUNGSI KHUSUS ADMIN
// --------------------------------------------------

// 3. Melihat Semua Surat (Untuk Dashboard Admin)
exports.getAllSurat = async (req, res) => {
  try {
    const surat = await prisma.surat.findMany({
      include: {
        user: {
          select: {
            nama_lengkap: true, 
            nik: true,
            no_telp: true       
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const transformedSurat = surat.map(transformSuratData);
    res.json(transformedSurat);
  } catch (error) {
    console.error("❌ Error getAllSurat:", error);
    res.status(500).json({ error: error.message });
  }
};

// 4. Update Status Surat (Dropdown di Dashboard Admin)
exports.updateStatusSurat = async (req, res) => {
  try {
  exports.updateStatusSurat = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, catatan_penolakan } = req.body; // Frontend kirim 'catatan_penolakan'

      // ✅ FIX: Mapping ke nama kolom database yang benar (catatanAdmin)
      const updateData = { status: status };
      
      if (status === "Ditolak") {
        updateData.catatanAdmin = catatan_penolakan;
      }

      const updatedSurat = await prisma.surat.update({
        where: { id: id }, // ID string (UUID)
        data: updateData,
        include: {
          user: {
            select: {
              nama_lengkap: true,
              nik: true,
              no_telp: true
            }
          }
        }
      });

      res.json({ 
        success: true, 
        data: transformSuratData(updatedSurat) 
      });
  } catch (error) {
    console.error("❌ Error updateStatusSurat:", error);
    res.status(500).json({ error: error.message });
  }
};

// 5. Hapus Surat
exports.deleteSurat = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.surat.delete({
      where: { id: id }
    });
    res.json({ success: true, message: "Berhasil dihapus" });
  } catch (error) {
    console.error("❌ Error deleteSurat:", error);
    res.status(500).json({ error: error.message });
  }
};

// 6. Ambil Detail Surat Berdasarkan ID
exports.getSuratById = async (req, res) => {
  try {
    const { id } = req.params;
    const surat = await prisma.surat.findUnique({
      where: { id: id },
      include: { 
        user: {
          select: {
            nama_lengkap: true, 
            nik: true,
            no_telp: true       
          }
        } 
      }
    });
    
    if (!surat) {
      return res.status(404).json({ error: "Surat tidak ditemukan" });
    }

    res.json(transformSuratData(surat));
  } catch (error) {
    console.error("❌ Error getSuratById:", error);
    res.status(500).json({ error: error.message });
  }
};


// 7. Placeholder Download
exports.downloadSuratSelesai = async (req, res) => {
  res.json({ message: "File PDF di-generate di Frontend" });
};

// Fungsi Arsip Surat (Admin mengunggah PDF yang sudah jadi)
exports.archiveSurat = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    let fileUrl = null;
    if (req.files && req.files.length > 0) {
      // Logic upload ke Supabase/Storage Anda
      fileUrl = req.files[0].path; 
    }

    const updated = await prisma.surat.update({
      where: { id: parseInt(id) },
      data: {
        status: status || "Selesai",
        filePdf: fileUrl // Simpan link PDF agar warga bisa download
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};