const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

if (!fs.existsSync("./uploads")) { fs.mkdirSync("./uploads"); }

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "desa_kandang_besi"
});

db.connect((err) => {
  if (err) console.error("Database Gagal:", err);
  else console.log("Database MySQL Terhubung!");
});

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname); }
});
const upload = multer({ storage });

// --- API AUTHENTICATION ---
app.get("/api/auth/check-nik/:nik", (req, res) => {
  db.query("SELECT nik FROM warga WHERE nik = ?", [req.params.nik], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ available: result.length === 0 });
  });
});

app.post("/api/auth/register", (req, res) => {
  const { nama_lengkap, nik, no_telp, password } = req.body;
  const sql = "INSERT INTO warga (nama_lengkap, nik, no_hp, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [nama_lengkap, nik, no_telp, password], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Registrasi Berhasil!" });
  });
});

app.post("/api/auth/login", (req, res) => {
  const { nama_lengkap, password } = req.body;
  const sqlAdmin = "SELECT *, 'admin' as role FROM admin WHERE username = ? AND password = ?";
  db.query(sqlAdmin, [nama_lengkap, password], (err, adminRes) => {
    if (adminRes && adminRes.length > 0) return res.json({ profil: adminRes[0] });
    const sqlWarga = "SELECT *, 'warga' as role FROM warga WHERE nama_lengkap = ? AND password = ?";
    db.query(sqlWarga, [nama_lengkap, password], (err, wargaRes) => {
      if (wargaRes && wargaRes.length > 0) return res.json({ profil: wargaRes[0] });
      res.status(401).json({ error: "Akun tidak ditemukan!" });
    });
  });
});

// --- API UPDATE PROFIL (WARGA & ADMIN) ---
app.put("/api/auth/update-profil", (req, res) => {
  const { id, nama_lengkap, no_hp, password, pekerjaan, agama, email, alamat } = req.body;
  let sql, params;
  if (password) {
    sql = "UPDATE warga SET nama_lengkap=?, no_hp=?, password=?, pekerjaan=?, agama=?, email=?, alamat=? WHERE id=?";
    params = [nama_lengkap, no_hp, password, pekerjaan, agama, email, alamat, id];
  } else {
    sql = "UPDATE warga SET nama_lengkap=?, no_hp=?, pekerjaan=?, agama=?, email=?, alamat=? WHERE id=?";
    params = [nama_lengkap, no_hp, pekerjaan, agama, email, alamat, id];
  }
  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("SELECT * FROM warga WHERE id = ?", [id], (err, user) => {
      res.json({ message: "Profil diperbarui!", profil: user[0] });
    });
  });
});

app.put("/api/admin/update-profil", (req, res) => {
  const { id, username, password } = req.body;
  let sql = password ? "UPDATE admin SET username=?, password=? WHERE id=?" : "UPDATE admin SET username=? WHERE id=?";
  let params = password ? [username, password, id] : [username, id];
  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("SELECT *, 'admin' as role FROM admin WHERE id = ?", [id], (err, resAdmin) => {
      res.json({ message: "Profil Admin diperbarui!", profil: resAdmin[0] });
    });
  });
});

// --- API PENGAJUAN ---
app.post("/api/pengajuan", upload.any(), (req, res) => {
  const { nik_pengaju, nama_warga, jenis_surat, data_form } = req.body;
  let parsedData = JSON.parse(data_form);
  const berkas = {};
  if (req.files) req.files.forEach(f => berkas[f.fieldname] = f.filename);
  parsedData.berkas = berkas;
  const sql = "INSERT INTO pengajuan (nik_pengaju, nama_warga, jenis_surat, data_form, status) VALUES (?, ?, ?, ?, 'Pending')";
  db.query(sql, [nik_pengaju, nama_warga, jenis_surat, JSON.stringify(parsedData)], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Berhasil!" });
  });
});

app.get("/api/pengajuan", (req, res) => {
  db.query("SELECT * FROM pengajuan ORDER BY id DESC", (err, result) => res.json(result));
});

app.get("/api/pengajuan-warga/:nik", (req, res) => {
  db.query("SELECT * FROM pengajuan WHERE nik_pengaju = ? ORDER BY id DESC", [req.params.nik], (err, result) => res.json(result));
});

app.put("/api/pengajuan/finalkan/:id", (req, res) => {
  const sql = "UPDATE pengajuan SET status = 'Selesai', data_final = ? WHERE id = ?";
  db.query(sql, [JSON.stringify(req.body.data_final), req.params.id], (err) => res.json({ message: "Selesai!" }));
});

app.put("/api/pengajuan/:id", (req, res) => {
  db.query("UPDATE pengajuan SET status = ? WHERE id = ?", [req.body.status, req.params.id], (err) => res.json({ message: "Updated" }));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));