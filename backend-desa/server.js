const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Koneksi Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'desa_kandang_besi' 
});

db.connect(err => {
    if (err) console.error('DATABASE ERROR: Pastikan XAMPP MySQL nyala.');
    else console.log('Database Terhubung!');
});

// 2. Pengaturan Penyimpanan File
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './Uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

app.use('/uploads', express.static('Uploads'));

// 3. API: Menerima Pengajuan dari Warga
app.post('/api/pengajuan', upload.any(), (req, res) => {
    const { nik_pengaju, nama_warga, jenis_surat, data_form } = req.body;
    const uploadedFiles = {};
    if (req.files) {
        req.files.forEach(file => { uploadedFiles[file.fieldname] = file.filename; });
    }

    const detailInput = typeof data_form === 'string' ? JSON.parse(data_form) : data_form;
    const fullData = { ...detailInput, berkas: uploadedFiles };

    const sql = "INSERT INTO pengajuan (nik_pengaju, nama_warga, jenis_surat, data_form) VALUES (?, ?, ?, ?)";
    db.query(sql, [nik_pengaju, nama_warga, jenis_surat, JSON.stringify(fullData)], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Pengajuan berhasil dikirim!" });
    });
});

// 4. API: Ambil Semua Pengajuan (Untuk Admin)
app.get('/api/pengajuan', (req, res) => {
    const sql = "SELECT * FROM pengajuan ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 5. API: Ambil Pengajuan Per Warga (Untuk Status Warga)
app.get('/api/pengajuan-warga/:nik', (req, res) => {
    const { nik } = req.params;
    const sql = "SELECT * FROM pengajuan WHERE nik_pengaju = ? ORDER BY created_at DESC";
    db.query(sql, [nik], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 6. API: Update Status (Hanya Satu Saja)
app.put('/api/pengajuan/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    const sql = "UPDATE pengajuan SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Status di database berhasil diperbarui!" });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server lari di port ${PORT}`);
});