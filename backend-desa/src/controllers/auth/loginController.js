const prisma = require('../../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { nik, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { nik } });
    if (!user) {
      return res.status(400).json({ error: 'NIK atau password salah' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'NIK atau password salah' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    res.json({
      success: true,
      token,
      user: { id: user.id, nama_lengkap: user.nama_lengkap, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};