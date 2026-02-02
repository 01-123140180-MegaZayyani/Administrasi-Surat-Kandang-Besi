const express = require("express");
const path = require("path");
const cors = require("cors");
const prisma = require("./db");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./src/routes/auth/authRoutes");
const suratRoutes = require("./src/routes/suratRoutes");
const adminRoutes = require("./src/routes/admin/adminRoutes");
const adminMiddleware = require('./src/controllers/middleware/adminMiddleware');
const authMiddleware = require('./src/controllers/middleware/authMiddleware');


app.use("/api/auth", authRoutes);
app.use("/api/admin", authMiddleware.protect, adminMiddleware.isAdmin, adminRoutes);
app.use("/api/surat", suratRoutes);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Route untuk cek apakah backend jalan
app.get("/", (req, res) => {
  res.json({ 
    status: "success", 
    message: "Backend Administrasi Surat Desa Berjalan Lancar! 🚀" 
  });
});



const storage = multer.memoryStorage();
const upload = multer({ storage });


// --- API AUTHENTICATION ---
app.get("/api/auth/check-nik/:nik", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ // Pakai model 'user' sesuai gambar
      where: { nik: req.params.nik }
    });
    res.json({ available: !user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/auth/register", async (req, res) => {
  const { nama_lengkap, nik, no_telp, password } = req.body;
  try {
    await prisma.user.create({
      data: {
        nama_lengkap: nama_lengkap, // Sesuai field 'nama_lengkap' di gambar
        nik: nik,
        no_telp: no_telp, // Sesuai field 'no_telp' di gambar
        password: password,
        role: "WARGA"
      }
    });
    res.json({ message: "Registrasi Berhasil!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/auth/login", async (req, res) => {
  const { nama_lengkap, password } = req.body;
  try {
    // Di schema baru, Admin dan Warga ada di satu tabel "User" dengan beda role
    const user = await prisma.user.findFirst({
      where: { nama_lengkap: nama_lengkap, password: password }
    });

    if (user) return res.json({ profil: user });

    res.status(401).json({ error: "Akun tidak ditemukan!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- API PENGAJUAN ---
app.post("/api/pengajuan", upload.any(), async (req, res) => {
  const { userId, jenisSurat, noTiket, data_form } = req.body;
  try {
    let parsedData = JSON.parse(data_form);
    await prisma.surat.create({ // Menggunakan model 'surat'
      data: {
        userId: parseInt(userId),
        jenisSurat: jenisSurat,
        noTiket: noTiket || `TKT-${Date.now()}`,
        data: parsedData,
        status: "Belum Dikerjakan"
      }
    });
    res.json({ message: "Berhasil!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
