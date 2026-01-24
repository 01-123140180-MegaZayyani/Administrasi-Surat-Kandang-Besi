const express = require('express'); 
const cors = require('cors'); 
require('dotenv').config(); 
const { createClient } = require('@supabase/supabase-js'); 

const app = express(); 
const PORT = 5000;

// Konfigurasi Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(express.json());

// --- 1. REGISTER (Warga Daftar Pakai Nama & NIK) ---
app.post('/api/auth/register', async (req, res) => {
  const { nama_lengkap, nik, password } = req.body; 

  try {
    // Gunakan NIK sebagai email bayangan unik agar warga tidak perlu email asli
    const fakeEmail = `${nik}@warga.desa.id`;

    // Daftarkan akun ke sistem Auth Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: fakeEmail, 
      password: password,
    });

    if (authError) throw authError;

    // Simpan data profil ke tabel profil_users
    const { error: profileError } = await supabase
      .from('profil_users')
      .insert([{ 
        identitas: authData.user.id, 
        nama_lengkap, 
        nik, 
        email: fakeEmail,
        role: 'warga' 
      }]);

    if (profileError) throw profileError;
    res.json({ message: "Akun berhasil dibuat!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 2. LOGIN (Hanya Butuh Nama Lengkap & Password) ---
app.post('/api/auth/login', async (req, res) => {
  const { nama_lengkap, password } = req.body;
  try {
    // Cari email bayangan berdasarkan Nama Lengkap di database
    const { data: userProfile, error: searchError } = await supabase
      .from('profil_users')
      .select('email')
      .eq('nama_lengkap', nama_lengkap)
      .single();

    if (searchError || !userProfile) throw new Error("Nama tidak ditemukan!");

    // Login menggunakan email bayangan dan password
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: userProfile.email, 
      password 
    });
    
    if (error) throw error;

    // Ambil data profil lengkap untuk dikirim ke Frontend
    const { data: profil } = await supabase
      .from('profil_users')
      .select('*')
      .eq('identitas', data.user.id)
      .single();

    res.json({ user: data.user, profil });
  } catch (error) {
    res.status(401).json({ error: error.message || "Nama atau Kata Sandi salah!" });
  }
});

// --- 3. UPDATE PROFIL (Untuk Fitur Edit) ---
app.put('/api/auth/update-profil', async (req, res) => {
  const { identitas, nama_lengkap, no_hp, pekerjaan, agama } = req.body;
  try {
    const { data, error } = await supabase
      .from('profil_users')
      .update({ nama_lengkap, no_hp, pekerjaan, agama })
      .eq('identitas', identitas)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: "Update berhasil!", profil: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Jalankan Server
app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));