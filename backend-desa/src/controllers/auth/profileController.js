  // /backend/src/controllers/auth/profileController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.user.id) },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        nik: true,
        role: true,
        tempatLahir: true,
        tanggalLahir: true,
        jenisKelamin: true,
        agama: true,
        pekerjaan: true,
        statusPerkawinan: true,
        pendidikan: true,
        alamatLengkap: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal memuat profil'
    });
  }
};

  exports.updateProfile = async (req, res) => {
    try {
      const { fullName, nik, phoneNumber, tempatLahir, tanggalLahir, jenisKelamin, agama, pekerjaan, statusPerkawinan, pendidikan, alamatLengkap } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(req.user.id) },
        data: {
          fullName,
          nik,
          phoneNumber,
          tempatLahir,
          tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : undefined,
          jenisKelamin,
          agama,
          pekerjaan,
          statusPerkawinan,
          pendidikan,
          alamatLengkap
        }
      });

      res.json({
        success: true,
        message: 'Profil berhasil diperbarui',
        user: {
          id: updatedUser.id,
          fullName: updatedUser.fullName,
          phoneNumber: updatedUser.phoneNumber,
          nik: updatedUser.nik,
          role: updatedUser.role,
          tempatLahir: updatedUser.tempatLahir,
          tanggalLahir: updatedUser.tanggalLahir,
          jenisKelamin: updatedUser.jenisKelamin,
          agama: updatedUser.agama,
          pekerjaan: updatedUser.pekerjaan,
          statusPerkawinan: updatedUser.statusPerkawinan,
          pendidikan: updatedUser.pendidikan,
          alamatLengkap: updatedUser.alamatLengkap
        }
      });

    } catch (error) {
      console.error('❌ Error updating profile:', error);
      res.status(500).json({
        success: false,
        error: 'Gagal memperbarui profil'
      });
    }
  };