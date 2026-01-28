// backend/src/routes/suratRoutes.js
import express from 'express';
import * as suratController from '../controllers/suratController.js';
import authMiddleware from '../controllers/middleware/authMiddleware.js';

const router = express.Router();

// --------------------------------------------------
// 📄 SURAT ROUTES (WARGA)
// --------------------------------------------------

// Create surat baru (protected)
router.post('/', authMiddleware.protect, suratController.createSurat);

// Get surat milik user (protected)
router.get('/', authMiddleware.protect, suratController.getMySurat);

// Get detail surat by ID (protected)
router.get('/:id', authMiddleware.protect, suratController.getSuratById);

// Download surat selesai (protected)
router.get('/:id/download', authMiddleware.protect, suratController.downloadSuratSelesai);

export default router;