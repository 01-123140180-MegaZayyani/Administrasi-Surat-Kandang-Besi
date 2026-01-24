// /backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Akses ditolak. Login dulu.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ambil data user lengkap
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User tidak ditemukan.'
      });
    }

    req.user = user; // <-- Hanya simpan id & role
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token sudah kadaluarsa, silakan login kembali'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Token tidak valid'
    });
  }
};