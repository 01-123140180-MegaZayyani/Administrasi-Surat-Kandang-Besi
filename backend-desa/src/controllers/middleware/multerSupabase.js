const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

// Inisialisasi Supabase
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Gunakan Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Batas 5 MB per file
  }
});

// Kita export 'upload' (untuk middleware di route) 
// dan 'supabase' (untuk dipakai di controller nanti)
module.exports = { upload, supabase };