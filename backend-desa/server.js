const express = require("express");
const path = require("path");
const cors = require("cors");
const prisma = require("./db");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Pastikan folder uploads ada
if (!fs.existsSync("./uploads")) { 
    fs.mkdirSync("./uploads"); 
}

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "desa_kandang_besi",
  port: 3307 
});

db.connect((err) => {
  if (err) console.error("Database Gagal:", err);
  else console.log("Database MySQL Terhubung!");
});

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => { 
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, '_')); 
  }
});
const upload = multer({ storage });

// --- AUTH API ---
app.post("/api/auth/login", (req, res) => {
=======
const authRoutes = require("./src/routes/auth/authRoutes");
const suratRoutes = require("./src/routes/suratRoutes");
const adminRoutes = require("./src/routes/admin/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/surat", suratRoutes);

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
>>>>>>> 71ef24becb5e3a7830bea0a5e2e3ad4db0958f49
  const { nama_lengkap, password } = req.body;
  try {
    // Di schema baru, Admin dan Warga ada di satu tabel "User" dengan beda role
    const user = await prisma.user.findFirst({
      where: { nama_lengkap: nama_lengkap, password: password }
    });

<<<<<<< HEAD
// --- PENGAJUAN API ---
app.post("/api/pengajuan", upload.any(), (req, res) => {
  const { nik_pengaju, nama_warga, jenis_surat, data_form } = req.body;
  let parsedData = JSON.parse(data_form || "{}");
  const berkas = {};
  if (req.files) {
    req.files.forEach(f => { berkas[f.fieldname] = f.filename; });
  }
  parsedData.berkas = berkas;

  const sql = "INSERT INTO pengajuan (nik_pengaju, nama_warga, jenis_surat, data_form, status) VALUES (?, ?, ?, ?, 'Pending')";
  db.query(sql, [nik_pengaju, nama_warga, jenis_surat, JSON.stringify(parsedData)], (err) => {
    if (err) return res.status(500).json({ error: err.message });
=======
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
>>>>>>> 71ef24becb5e3a7830bea0a5e2e3ad4db0958f49
    res.json({ message: "Berhasil!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

<<<<<<< HEAD
app.get("/api/pengajuan", (req, res) => {
  db.query("SELECT * FROM pengajuan ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Update Status (Tolak/Proses)
app.put("/api/pengajuan/:id", (req, res) => {
  db.query("UPDATE pengajuan SET status = ? WHERE id = ?", [req.body.status, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Status Updated" });
  });
});

// Update Status + Simpan Arsip PDF
app.put("/api/pengajuan/arsip/:id", upload.single("pdf"), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const fileName = req.file ? req.file.filename : null;

  const sql = "UPDATE pengajuan SET status = ?, file_final = ? WHERE id = ?";
  db.query(sql, [status, fileName, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Arsip Berhasil Disimpan" });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
module.exports = app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
>>>>>>> 71ef24becb5e3a7830bea0a5e2e3ad4db0958f49
