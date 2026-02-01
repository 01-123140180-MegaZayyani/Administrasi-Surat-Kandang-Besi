const express = require('express');
const suratController = require('../../controllers/suratController');
const adminMiddleware = require('../../controllers/middleware/adminMiddleware');
const authMiddleware = require('../../controllers/middleware/authMiddleware');

const router = express.Router();

// Gunakan protect dulu (untuk cek login) baru adminMiddleware
router.use(authMiddleware.protect); 
router.use(adminMiddleware);

// ✅ Rute Admin - Sesuai kebutuhan Frontend
router.get('/surat', suratController.getAllSurat); // GET semua surat
router.put('/surat/:id', suratController.updateStatusSurat); // UPDATE status (mendukung catatan_penolakan)
router.put('/surat/:id/status', suratController.updateStatusSurat); // Backward compatibility
router.delete('/surat/:id', suratController.deleteSurat); // DELETE surat

module.exports = router;