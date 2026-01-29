// backend/src/middleware/multerSupabase.js
// ✅ Supabase storage configuration for file uploads
// Handles PDFs uploaded for "surat selesai" (completed letter files)
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// ✅ Configure Supabase with environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// ✅ Debug: Log Supabase config on startup with validation
console.log('🔧 Supabase Configuration:');
console.log(`   ├─ URL: ${supabaseUrl || '❌ NOT SET'}`);
console.log(`   ├─ Service Key: ${supabaseKey ? '✅ SET' : '❌ NOT SET'}`);
console.log(`   └─ Bucket: surat-desa`);

// ✅ Validasi: Supabase config harus lengkap
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ CRITICAL: Supabase environment variables tidak lengkap!');
  console.error('   Pastikan env var berikut sudah di-set:');
  console.error('   - SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY (atau SUPABASE_ANON_KEY)');
  process.exit(1);
}

// ✅ Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ✅ Setup memory storage (file akan diupload ke Supabase setelah multer parsing)
const storage = multer.memoryStorage();

// ✅ File filter - only accept PDF
const fileFilter = (req, file, cb) => {
  console.log(`📄 File upload attempt: ${file.originalname} (${file.mimetype})`);
  
  if (file.mimetype === 'application/pdf') {
    console.log('✅ File format accepted (PDF)');
    cb(null, true);
  } else {
    console.log('❌ File format rejected (not PDF)');
    cb(new Error('❌ Hanya file PDF yang diizinkan untuk surat selesai'), false);
  }
};

// ✅ Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ✅ Middleware wrapper untuk upload ke Supabase
const uploadToSupabase = (bucketName = 'surat-desa') => {
  return async (req, res, next) => {
    try {
      // Multer sudah memproses file ke memory
      if (!req.file) {
        console.log('⚠️ No file uploaded, skipping Supabase upload');
        return next();
      }

      const file = req.file;
      const suratId = req.params.id || 'unknown';
      const timestamp = Date.now();
      const fileExt = path.extname(file.originalname);
      
      // Generate file path in Supabase bucket
      const filePath = `surat-selesai/surat-${suratId}-${timestamp}${fileExt}`;

      console.log(`📤 Uploading to Supabase: ${filePath}`);
      console.log(`   ├─ Bucket: ${bucketName}`);
      console.log(`   ├─ Size: ${(file.size / 1024).toFixed(2)} KB`);
      console.log(`   └─ MIME: ${file.mimetype}`);

      // Upload file buffer ke Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        console.error('❌ Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('✅ File uploaded to Supabase:', data.path);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('🔗 Public URL:', publicUrl);

      // Attach file info ke request untuk digunakan di controller
      req.file.supabasePath = filePath;
      req.file.supabaseUrl = publicUrl;
      req.file.path = publicUrl; // Compatibility dengan kode sebelumnya

      next();
    } catch (err) {
      console.error('❌ Error in uploadToSupabase middleware:', err);
      return res.status(500).json({
        success: false,
        error: 'Gagal mengupload file ke storage',
        details: err.message
      });
    }
  };
};

// ✅ Export middleware untuk single file upload
module.exports = {
  upload,
  uploadToSupabase,
  supabase,
  
  // Shorthand untuk surat selesai
  uploadSuratSelesai: [
    upload.single('fileSuratSelesai'),
    uploadToSupabase('surat-desa')
  ]
};