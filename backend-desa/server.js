const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();

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
    const user = await prisma.user.findUnique({ // Ganti warga -> user
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
    await prisma.user.create({ // Ganti warga -> user
      data: {
        fullName: nama_lengkap, // Sesuaikan nama field
        nik: nik,
        phoneNumber: no_telp, // Sesuaikan nama field
        password: password,
        role: "WARGA"
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
    // Di tabel baru, Admin dan Warga ada di satu tabel "User"
    const user = await prisma.user.findFirst({
      where: { fullName: nama_lengkap, password: password }
    });

    if (user) {
      return res.json({ profil: user }); // Role sudah ada di dalam object user
    }

    res.status(401).json({ error: "Akun tidak ditemukan!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API PENGAJUAN ---
app.post("/api/pengajuan", upload.any(), async (req, res) => {
  const { userId, jenisSurat, noTiket, data_form } = req.body;
  try {
    let parsedData = JSON.parse(data_form);
    const berkas = {};
    if (req.files) req.files.forEach(f => berkas[f.fieldname] = f.filename);
    parsedData.berkas = berkas;

    await prisma.surat.create({ // Ganti pengajuan -> surat
      data: {
        userId: parseInt(userId),
        jenisSurat: jenisSurat,
        noTiket: noTiket || `TKT-${Date.now()}`, // noTiket wajib ada dan unik
        data: parsedData, // Simpan sebagai JSON
        status: "Belum Dikerjakan"
      }
    });
    res.json({ message: "Berhasil!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/pengajuan", async (req, res) => {
  try {
    const data = await prisma.surat.findMany({ // Ganti pengajuan -> surat
      orderBy: { createdAt: "desc" }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}