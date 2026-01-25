// backend/scripts/seedAdmin.js
// Load environment variables when running this script directly
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main(){
  const password = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      fullName: 'Admin',
      phoneNumber: '081234567890',
      nik: '0000000000000000',
      password,
      role: 'ADMIN'
    }
  });
  console.log('Admin created/ensured');
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });