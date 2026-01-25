// backend/src/middleware/multerSupabaseMultiple.js
// ✅ Supabase storage untuk multiple file uploads (KTP, KK, dll)
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// ✅ Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Memory storage
const storage = multer.memoryStorage();

// ✅ File filter - accept images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/pdf'
  ];

  console.log(`📄 File upload: ${file.fieldname} - ${file.originalname} (${file.mimetype})`);

  if (allowedMimes.includes(file.mimetype)) {
    console.log('✅ File format accepted');
    cb(null, true);
  } else {
    console.log('❌ File format rejected');
    cb(new Error('❌ Format file tidak didukung. Gunakan JPG, PNG, atau PDF'), false);
  }
};

// ✅ Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10 // Max 10 files
  }
});

// ✅ Middleware untuk upload multiple files ke Supabase
const uploadMultipleToSupabase = (bucketName = 'surat-desa') => {
  return async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        console.log('⚠️ No files uploaded, skipping Supabase upload');
        return next();
      }

      console.log(`📤 Uploading ${req.files.length} files to Supabase`);

      const uploadPromises = req.files.map(async (file) => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const fileExt = path.extname(file.originalname);
        
        // Folder berdasarkan fieldname
        let folder = 'documents';
        if (file.fieldname === 'fotoKtp') folder = 'ktp';
        else if (file.fieldname === 'fotoKk') folder = 'kk';
        else if (file.fieldname.startsWith('foto')) folder = 'photos';

        const filePath = `${folder}/${file.fieldname}-${timestamp}-${random}${fileExt}`;

        console.log(`   ├─ Uploading: ${filePath} (${(file.size / 1024).toFixed(2)} KB)`);

        // Upload ke Supabase
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });

        if (error) {
          console.error(`   ❌ Failed: ${filePath}`, error.message);
          throw new Error(`Upload ${file.fieldname} gagal: ${error.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        console.log(`   ✅ Success: ${urlData.publicUrl}`);

        // Attach info ke file object
        file.supabasePath = filePath;
        file.supabaseUrl = urlData.publicUrl;
        file.path = urlData.publicUrl; // Compatibility

        return {
          fieldname: file.fieldname,
          url: urlData.publicUrl,
          path: filePath
        };
      });

      // Wait for all uploads
      const results = await Promise.all(uploadPromises);
      
      console.log(`✅ All ${results.length} files uploaded successfully`);

      next();
    } catch (err) {
      console.error('❌ Error in uploadMultipleToSupabase:', err);
      return res.status(500).json({
        success: false,
        error: 'Gagal mengupload files ke storage',
        details: err.message
      });
    }
  };
};

// ✅ Export
module.exports = {
  upload,
  uploadMultipleToSupabase,
  supabase,
  
  // Shorthand untuk user files
  uploadUserFiles: [
    upload.any(), // Accept any field
    uploadMultipleToSupabase('surat-desa')
  ],
  
  // Shorthand untuk specific fields
  uploadKtpKk: [
    upload.fields([
      { name: 'fotoKtp', maxCount: 1 },
      { name: 'fotoKk', maxCount: 1 }
    ]),
    uploadMultipleToSupabase('surat-desa')
  ]
};