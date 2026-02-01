const express = require('express');
const suratController = require('../controllers/suratController');
const authMiddleware = require('../controllers/middleware/authMiddleware');
// Perhatikan kurung kurawal { upload } di bawah ini:
const { upload } = require('../controllers/middleware/multerSupabase');

const router = express.Router();

// Route tanpa file
router.post('/', authMiddleware.protect, suratController.createSurat);

// Route dengan file (Sekarang upload.fields pasti JALAN)
router.post('/upload-lengkap', 
  authMiddleware.protect, 
  upload.fields([
    { name: 'fotoKtp', maxCount: 1 },
    { name: 'fotoKk', maxCount: 1 },
    { name: 'fotoRumah', maxCount: 1 }
  ]), 
  suratController.createSurat
);

router.get('/', authMiddleware.protect, suratController.getMySurat);

module.exports = router;