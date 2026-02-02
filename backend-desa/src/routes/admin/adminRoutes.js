const express = require('express');
const suratController = require('../../controllers/suratController');
const adminMiddleware = require('../../controllers/middleware/adminMiddleware');
const authMiddleware = require('../../controllers/middleware/authMiddleware');
const { upload } = require('../../controllers/middleware/multerSupabase');

const router = express.Router();

// Gunakan protect dulu (untuk cek login) baru adminMiddleware
router.use(authMiddleware.protect); 
router.use(adminMiddleware);

// ✅ Rute Admin - Sesuai kebutuhan Frontend
router.get('/surat', suratController.getAllSurat); // GET semua surat

// ✅ UPDATE dengan FILE UPLOAD (untuk Admin Template kirim PDF)
router.put('/surat/:id', 
  upload.single('pdf'),  // Accept file dengan field name 'pdf'
  suratController.updateStatusSurat
);

router.put('/surat/:id/status', suratController.updateStatusSurat); // Backward compatibility tanpa file
router.delete('/surat/:id', suratController.deleteSurat); // DELETE surat

module.exports = router;