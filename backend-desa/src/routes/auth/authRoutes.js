// backend-desa/src/routes/auth/authRoutes.js
const express = require('express');
const prisma = require('../../../db');

const loginController = require('../../controllers/auth/loginController');
const registerController = require('../../controllers/auth/registerController');
const profileController = require('../../controllers/auth/profileController');
const authMiddleware = require('../../controllers/middleware/authMiddleware');

const router = express.Router();

// --------------------------------------------------
// 🔐 AUTHENTICATION ROUTES
// --------------------------------------------------

// 1. Rute Cek NIK (Tambahkan Logic-nya di sini agar tidak perlu buat file baru)
router.get('/check-nik/:nik', async (req, res) => {
    try {
        const { nik } = req.params;
        const user = await prisma.user.findUnique({
            where: { nik: nik },
            select: { id: true } // <--- PAKSA HANYA AMBIL ID
        });

        return res.json({ available: !user }); 
    } catch (error) {
        console.error("Error cek NIK:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. Rute Register & Login (Berdiri Sendiri)
router.post('/register', registerController.register);
router.post('/login', loginController.login);

// 3. Rute Profil (Pakai Middleware)
router.get('/profile', authMiddleware.protect, profileController.getProfile);
router.put('/profile', authMiddleware.protect, profileController.updateProfile);

module.exports = router;