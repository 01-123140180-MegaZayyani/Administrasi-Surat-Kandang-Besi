// backend/scripts/verifyPostgresConnection.js
// Script untuk memverifikasi koneksi ke PostgreSQL dan cek data admin

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyPostgresConnection() {
  try {
    console.log('🔍 Memverifikasi koneksi ke PostgreSQL...\n');

    // 1. Cek koneksi ke database
    console.log('📌 DATABASE_URL dari .env:');
    console.log(process.env.DATABASE_URL);
    console.log('');

    // 2. Cari semua users di database
    console.log('📌 Mengambil semua users dari database:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        role: true,
        createdAt: true
      }
    });

    if (users.length === 0) {
      console.log('❌ Tidak ada users di database.');
    } else {
      console.log(`✅ Total users: ${users.length}\n`);
      console.table(users);
    }

    // 3. Cari admin secara spesifik
    console.log('\n📌 Mencari admin user:');
    const admin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (admin) {
      console.log(`✅ Admin ditemukan:`);
      console.log(`   ID: ${admin.id}`);
      console.log(`   Username: ${admin.username}`);
      console.log(`   Nama: ${admin.fullName}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Dibuat: ${admin.createdAt}`);
    } else {
      console.log('❌ Admin tidak ditemukan di database.');
    }

    // 4. Cek jumlah surat
    console.log('\n📌 Mengambil statistik surat:');
    const suratCount = await prisma.surat.count();
    console.log(`✅ Total surat di database: ${suratCount}`);

    // 5. Konfirmasi provider database
    console.log('\n📌 Informasi koneksi database:');
    const dbInfo = await prisma.$queryRaw`SELECT version();`;
    console.log(`✅ PostgreSQL Version: ${dbInfo[0].version}`);

    console.log('\n✅ VERIFIKASI SELESAI - BACKEND MENGGUNAKAN PostgreSQL ✅\n');

    await prisma.$disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('');
    console.error('Kemungkinan masalah:');
    console.error('1. DATABASE_URL tidak valid atau database tidak running');
    console.error('2. NIK/password PostgreSQL salah');
    console.error('3. Database atau tabel belum dibuat');
    console.error('');
    console.error('Penuh error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verifyPostgresConnection();