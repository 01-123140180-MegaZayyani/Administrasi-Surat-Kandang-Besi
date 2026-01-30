// src/controllers/auth/registerController.js
const prisma = require('../../../db');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { nama_lengkap, no_telp, nik, password } = req.body;

  try {
    // Cek apakah NIK sudah ada
    const existingUserByNIK = await prisma.user.findUnique({ where: { nik } });
    if (existingUserByNIK) {
      return res.status(400).json({ error: 'NIK sudah terdaftar.' });
    }

    // Cek apakah nomor telepon sudah ada
    const existingUserByPhone = await prisma.user.findUnique({ where: { no_telp } });
    if (existingUserByPhone) {
      return res.status(400).json({ error: 'Nomor telepon sudah terdaftar.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru
    const newUser = await prisma.user.create({
      data: {
        nama_lengkap,
        no_telp,
        nik,
        password: hashedPassword,
        role: 'WARGA'
      },
      select: { id: true, nama_lengkap: true, no_telp: true, nik: true, role: true }
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user: newUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};