// src/controllers/suratController.js
const prisma = require('../../db');

// Helper function untuk transform data Prisma ke format Frontend
const transformSuratData = (surat) => {
  return {
    id: surat.id,
    jenis_surat: surat.jenisSurat,
    nama_warga: surat.user?.nama_lengkap || "Unknown",
    nik_pengaju: surat.user?.nik || "-",
    status: surat.status,
    data_form: JSON.stringify(surat.data || {}),
    file_final: surat.filePdf || null,
    tanggal_request: surat.createdAt,
    created_at: surat.createdAt,
    catatan_penolakan: surat.catatanPenolakan || null,
    no_tiket: surat.noTiket
  };
};

// --------------------------------------------------
// 🏢 FUNGSI UNTUK WARGA (PENGGUNA)
// --------------------------------------------------

// 1. Membuat Pengajuan Surat Baru
exports.createSurat = async (req, res) => {
  try {
    const { jenisSurat, ...data_form } = req.body;
    const userId = req.user.id;

    // Handle upload file dari Supabase
    let berkas = {};
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // fieldname adalah nama inputnya (misal: fotoKtp, fotoKk)
        berkas[file.fieldname] = file.path; 
      });
    }

    // Gabungkan data teks dan link foto ke dalam kolom JSON 'data'
    const finalData = { ...data_form, berkas };

    const newSurat = await prisma.surat.create({
      data: {
        userId: parseInt(userId),
        jenisSurat: jenisSurat || "Pengajuan Surat",
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
    const { id } = req.params;
    const { status, catatan_penolakan } = req.body;

    const updateData = { status: status };
    
    if (status === "Ditolak" && catatan_penolakan) {
      updateData.catatanPenolakan = catatan_penolakan;
    }

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