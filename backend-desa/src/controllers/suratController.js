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
    data_form: typeof surat.data === 'string' ? surat.data : JSON.stringify(surat.data || {}),
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
    const { jenis_surat, jenisSurat, ...data_form } = req.body; 
    
    const tipeSurat = jenis_surat || jenisSurat || "Pengajuan Lainnya";

    let berkasUrls = {};
    
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const fileName = `${Date.now()}_${file.originalname.replace(/\s/g, '_')}`;
          
          const { data, error } = await supabase.storage
            .from('surat_desa')
            .upload(`pengajuan/${fileName}`, file.buffer, {
              contentType: file.mimetype
            });

          if (error) throw error;

          const { data: publicData } = supabase.storage
            .from('surat_desa')
            .getPublicUrl(`pengajuan/${fileName}`);
            
          berkasUrls[file.fieldname] = publicData.publicUrl;
        }
      }

    let parsedDataForm = {};
    try {
        parsedDataForm = typeof data_form === 'string' ? JSON.parse(data_form) : data_form;
        if (parsedDataForm.data_form) parsedDataForm = JSON.parse(parsedDataForm.data_form);
    } catch (e) {
        parsedDataForm = data_form; 
    }

    const finalData = { 
        ...parsedDataForm, 
        berkas: berkasUrls 
    };

    const newSurat = await prisma.surat.create({
      data: {
        userId: parseInt(userId),
        jenisSurat: tipeSurat,
        noTiket: `TKT-${Date.now()}`,
        data: finalData,
        status: "Pending"
      },
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

    res.status(201).json({ 
      success: true, 
      data: transformSuratData(newSurat) 
    });
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

// 4. Update Status Surat (Dropdown di Dashboard Admin) + Upload PDF dari AdminTemplate
exports.updateStatusSurat = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan_penolakan } = req.body;

    console.log("📝 Update Status Request:", { 
      id, 
      status, 
      hasFile: !!req.file,
      fileName: req.file?.originalname 
    });

    const updateData = {};
    
    // ✅ KASUS 1: Admin upload PDF dari AdminTemplate
    if (req.file) {
      console.log("📤 Uploading PDF to Supabase...");
      
      const fileName = `SURAT_${id}_${Date.now()}.pdf`;
      
      // Upload PDF ke Supabase Storage
      const { data, error } = await supabase.storage
        .from('surat_desa')
        .upload(`surat-selesai/${fileName}`, req.file.buffer, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("❌ Supabase upload error:", error);
        throw new Error(`Upload gagal: ${error.message}`);
      }

      // Dapatkan Public URL
      const { data: publicData } = supabase.storage
        .from('surat_desa')
        .getPublicUrl(`surat-selesai/${fileName}`);
      
      updateData.fileSuratSelesai = publicData.publicUrl;
      updateData.status = "Selesai"; // Otomatis set status Selesai jika ada PDF
      updateData.catatanAdmin = null; // Hapus catatan penolakan jika ada
      
      console.log("✅ PDF uploaded successfully:", publicData.publicUrl);
    } 
    // ✅ KASUS 2: Admin update status manual (tanpa PDF)
    else if (status) {
      updateData.status = status;
      
      // Jika ditolak, simpan catatan
      if (status === "Ditolak" && catatan_penolakan) {
        updateData.catatanAdmin = catatan_penolakan;
      } else {
        updateData.catatanAdmin = null;
      }
    }

    // Update database
    const updatedSurat = await prisma.surat.update({
      where: { id: id },
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

    console.log("✅ Surat updated successfully:", {
      id: updatedSurat.id,
      status: updatedSurat.status,
      hasFile: !!updatedSurat.fileSuratSelesai
    });

    res.json({ 
      success: true, 
      message: "Status berhasil diupdate",
      data: transformSuratData(updatedSurat) 
    });
  } catch (error) {
    console.error("❌ Error updateStatusSurat:", error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: `Gagal update status: ${error.message}`
    });
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