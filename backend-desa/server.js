const express = require("express");
const { PrismaClient } = require("@prisma/client"); // Import Prisma
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

const prisma = new PrismaClient(); // Inisialisasi Prisma
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

if (!fs.existsSync("./uploads")) { fs.mkdirSync("./uploads"); }

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname); }
});
const upload = multer({ storage });

// --- API AUTHENTICATION ---
app.get("/api/auth/check-nik/:nik", async (req, res) => {
  try {
    const user = await prisma.warga.findUnique({
      where: { nik: req.params.nik }
    });
    res.json({ available: !user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { nama_lengkap, nik, no_telp, password } = req.body;
  try {
    await prisma.warga.create({
      data: {
        nama_lengkap,
        nik,
        no_hp: no_telp,
        password
      }
    });
    res.json({ message: "Registrasi Berhasil!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { nama_lengkap, password } = req.body;
  try {
    // Cek Admin
    const admin = await prisma.admin.findFirst({
      where: { username: nama_lengkap, password: password }
    });
    if (admin) return res.json({ profil: { ...admin, role: "admin" } });

    // Cek Warga
    const warga = await prisma.warga.findFirst({
      where: { nama_lengkap: nama_lengkap, password: password }
    });
    if (warga) return res.json({ profil: { ...warga, role: "warga" } });

    res.status(401).json({ error: "Akun tidak ditemukan!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API PENGAJUAN ---
app.post("/api/pengajuan", upload.any(), async (req, res) => {
  const { nik_pengaju, nama_warga, jenis_surat, data_form } = req.body;
  try {
    let parsedData = JSON.parse(data_form);
    const berkas = {};
    if (req.files) req.files.forEach(f => berkas[f.fieldname] = f.filename);
    parsedData.berkas = berkas;

    await prisma.pengajuan.create({
      data: {
        nik_pengaju,
        nama_warga,
        jenis_surat,
        data_form: JSON.stringify(parsedData),
        status: "Pending"
      }
    });
    res.json({ message: "Berhasil!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/pengajuan", async (req, res) => {
  try {
    const data = await prisma.pengajuan.findMany({
      orderBy: { id: "desc" }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}