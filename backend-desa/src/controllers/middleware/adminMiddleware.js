// /backend/src/middleware/adminMiddleware.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminOnly = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Akses ditolak. Hanya admin yang bisa mengakses.'
      });
    }

    next();
  } catch (error) {
    console.error('❌ Error in adminOnly middleware:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal memverifikasi akses admin'
    });
  }
};

module.exports = adminOnly;