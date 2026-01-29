// backend-desa/src/routes/auth/authRoutes.js
const express = require('express');
const prisma = require('../../../db');

// Pastikan file-file controller di bawah ini juga pakai module.exports, 
// kalau belum, mending buat route manual dulu di sini untuk tes.
const loginController = require('../../controllers/auth/loginController');
const registerController = require('../../controllers/auth/registerController');
const profileController = require('../../controllers/auth/profileController');
const authMiddleware = require('../../controllers/middleware/authMiddleware');

const router = express.Router();

// --------------------------------------------------
// 🔐 AUTHENTICATION ROUTES
// --------------------------------------------------

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/profile', authMiddleware.protect, profileController.getProfile);
router.put('/profile', authMiddleware.protect, profileController.updateProfile);

module.exports = router;