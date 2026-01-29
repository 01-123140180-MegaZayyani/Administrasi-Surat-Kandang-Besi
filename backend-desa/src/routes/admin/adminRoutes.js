// backend/src/routes/admin/adminRoutes.js
const express = require('express');
const adminSuratController = require('../../controllers/admin/adminSuratController');
const adminMiddleware = require('../../controllers/middleware/adminMiddleware');

const router = express.Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Update admin profile
router.put('/update-profil', adminSuratController.updateAdminProfil);

// Get all surat (admin)
router.get('/surat', adminSuratController.getAllSurat);

// Update status surat
router.put('/surat/:id/status', adminSuratController.updateStatusSurat);

// Upload surat selesai (manual upload)
router.post('/surat/:id/upload', adminSuratController.uploadSuratSelesai);

// Generate surat otomatis berdasarkan template
router.post('/surat/:id/generate', adminSuratController.generateSuratOtomatis);

// Preview template surat (HTML only)
router.post('/surat/:id/preview', adminSuratController.previewSuratTemplate);

// Delete surat
router.delete('/surat/:id', adminSuratController.deleteSurat);

// Get statistics
router.get('/statistics', adminSuratController.getStatistics);

module.exports = router;