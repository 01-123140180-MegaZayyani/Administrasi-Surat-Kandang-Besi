// backend/scripts/seedAdmin.js
// Load environment variables when running this script directly
require('dotenv').config();

const prisma = require('../db');
const bcrypt = require('bcryptjs');


async function main(){
  const password = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      nama_lengkap: 'Admin',
      no_telp: '081234567890',
      nik: '0000000000000000',
      password: password,
      role: 'ADMIN'
    }
  });
  console.log('Admin created/ensured');
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });