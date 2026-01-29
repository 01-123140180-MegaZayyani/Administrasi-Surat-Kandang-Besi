// backend/src/routes/suratRoutes.js
const express = require('express');
const suratController = require('../controllers/suratController');
const authMiddleware = require('../controllers/middleware/authMiddleware');
const upload = require('../controllers/middleware/multerSupabase');

const router = express.Router();

// Create surat baru (protected)
router.post('/', authMiddleware.protect, suratController.createSurat);

// Create surat baru with file uploads (protected)
router.post('/upload-lengkap', 
  authMiddleware.protect, 
  upload.fields([
    { name: 'fotoKtp', maxCount: 1 },
    { name: 'fotoKk', maxCount: 1 },
    { name: 'fotoRumah', maxCount: 1 }
  ]), 
  suratController.createSurat
);

// Get surat milik user (protected)
router.get('/', authMiddleware.protect, suratController.getMySurat);

// Get detail surat by ID (protected)
router.get('/:id', authMiddleware.protect, suratController.getSuratById);

// Download surat selesai (protected)
router.get('/:id/download', authMiddleware.protect, suratController.downloadSuratSelesai);

module.exports = router;