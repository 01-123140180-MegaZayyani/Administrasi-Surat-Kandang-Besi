const express = require('express');
const suratController = require('../../controllers/suratController');
const adminMiddleware = require('../../controllers/middleware/adminMiddleware');
const authMiddleware = require('../../controllers/middleware/authMiddleware');

const router = express.Router();

// Gunakan protect dulu (untuk cek login) baru adminMiddleware
router.use(authMiddleware.protect); 
router.use(adminMiddleware);

// Rute yang diminta Frontend temenmu:
router.get('/surat', suratController.getAllSurat); // Dipakai di AdminDashboard & AdminPengajuan
router.put('/surat/:id/status', suratController.updateStatusSurat); // Dipakai di AdminDashboard dropdown
router.delete('/surat/:id', suratController.deleteSurat);

module.exports = router;