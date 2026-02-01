const express = require('express');
const suratController = require('../controllers/suratController');
const authMiddleware = require('../controllers/middleware/authMiddleware');
const { upload } = require('../controllers/middleware/multerSupabase');

const router = express.Router();

// ✅ Route untuk membuat surat (dengan file upload)
router.post('/', 
  authMiddleware.protect, 
  upload.any(), 
  suratController.createSurat
);

// ✅ Route dengan multiple files
router.post('/upload-lengkap', 
  authMiddleware.protect, 
  upload.fields([
    { name: 'fotoKtp', maxCount: 1 },
    { name: 'fotoKk', maxCount: 1 },
    { name: 'fotoRumah', maxCount: 1 }
  ]), 
  suratController.createSurat
);

// ✅ GET /api/surat - Untuk mendapatkan surat milik user yang login (Warga)
router.get('/', authMiddleware.protect, suratController.getMySurat);

// ✅ GET /api/surat/my - Alias untuk surat milik user
router.get('/my', authMiddleware.protect, suratController.getMySurat);

// ✅ GET /api/surat/:id - Detail surat berdasarkan ID
router.get('/:id', authMiddleware.protect, suratController.getSuratById);

module.exports = router;