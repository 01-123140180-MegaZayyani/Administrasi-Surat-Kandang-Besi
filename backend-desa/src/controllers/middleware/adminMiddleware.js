const prisma = require('../../db');

const adminOnly = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Akses ditolak. Khusus Admin.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Gagal verifikasi admin' });
  }
};
module.exports = adminOnly;