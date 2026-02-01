// src/controllers/suratController.js
const prisma = require('../../db');

// --------------------------------------------------
// 🏢 FUNGSI UNTUK WARGA (PENGGUNA)
// --------------------------------------------------

// 1. Membuat Pengajuan Surat Baru
exports.createSurat = async (req, res) => {
  try {
    const { jenisSurat, data_form } = req.body;
    const userId = req.user.id; // Didapat dari authMiddleware.protect

    // Parsing data form karena biasanya dikirim sebagai JSON string dari frontend
    let parsedData = typeof data_form === 'string' ? JSON.parse(data_form) : data_form;

    // Menghandle upload file dari Supabase (jika ada)
    if (req.files) {
      const filePaths = {};
      Object.keys(req.files).forEach(key => {
        // req.files[key][0].path berisi URL publik Supabase dari middleware
        filePaths[key] = req.files[key][0].path; 
      });
      // Simpan URL gambar ke dalam object berkas
      parsedData.berkas = filePaths;
    }

    const newSurat = await prisma.surat.create({
      data: {
        userId: parseInt(userId),
        jenisSurat: jenisSurat,
        noTiket: `TKT-${Date.now()}`,
        data: parsedData, // Data form disimpan di kolom JSON
        status: "Belum Dikerjakan"
      }
    });

    res.status(201).json({ success: true, data: newSurat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Melihat Daftar Surat Milik Sendiri (Warga)
exports.getMySurat = async (req, res) => {
  try {
    const userId = req.user.id;
    const surat = await prisma.surat.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(surat); // Kirim array langsung agar cocok dengan frontend
  } catch (error) {
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
    
    // Kirim array langsung karena AdminDashboard.jsx pakai res.data (array)
    res.json(surat); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Update Status Surat (Dropdown di Dashboard Admin)
exports.updateStatusSurat = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Misal: "Sedang Diproses", "Selesai", "Ditolak"

    const updatedSurat = await prisma.surat.update({
      where: { id: parseInt(id) },
      data: { status: status }
    });

    res.json({ success: true, data: updatedSurat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Hapus Surat
exports.deleteSurat = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.surat.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true, message: "Berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Ambil Detail Surat Berdasarkan ID
exports.getSuratById = async (req, res) => {
  try {
    const { id } = req.params;
    const surat = await prisma.surat.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    });
    if (!surat) return res.status(404).json({ error: "Tidak ditemukan" });
    res.json(surat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. Placeholder Download
exports.downloadSuratSelesai = async (req, res) => {
    res.json({ message: "File PDF di-generate di Frontend" });
};