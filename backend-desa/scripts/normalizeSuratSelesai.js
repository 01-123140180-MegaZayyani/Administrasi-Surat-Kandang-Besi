const { PrismaClient } = require('@prisma/client');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  console.log('Start normalizing file paths in Surat...');
  
  // Ambil semua surat yang memiliki file
  const suratList = await prisma.surat.findMany({
    where: {
      OR: [
        { fileSuratSelesai: { not: null } },
        { fotoKtp: { not: null } },
        { fotoKk: { not: null } }
      ]
    },
    select: { 
      id: true, 
      jenisSurat: true,
      fileSuratSelesai: true,
      fotoKtp: true,
      fotoKk: true
    }
  });

  let updateCount = 0;

  for (const surat of suratList) {
    const updateData = {};
    let needUpdate = false;

    // Normalisasi fileSuratSelesai
    if (surat.fileSuratSelesai) {
      const filename = surat.fileSuratSelesai.split('/').pop().split('\\').pop();
      if (filename !== surat.fileSuratSelesai) {
        updateData.fileSuratSelesai = filename;
        needUpdate = true;
        console.log(`[${surat.jenisSurat}] id=${surat.id} fileSuratSelesai -> ${filename}`);
      }
    }

    // Normalisasi fotoKtp
    if (surat.fotoKtp) {
      const filename = surat.fotoKtp.split('/').pop().split('\\').pop();
      if (filename !== surat.fotoKtp) {
        updateData.fotoKtp = filename;
        needUpdate = true;
        console.log(`[${surat.jenisSurat}] id=${surat.id} fotoKtp -> ${filename}`);
      }
    }

    // Normalisasi fotoKk
    if (surat.fotoKk) {
      const filename = surat.fotoKk.split('/').pop().split('\\').pop();
      if (filename !== surat.fotoKk) {
        updateData.fotoKk = filename;
        needUpdate = true;
        console.log(`[${surat.jenisSurat}] id=${surat.id} fotoKk -> ${filename}`);
      }
    }

    // Update jika ada perubahan
    if (needUpdate) {
      await prisma.surat.update({
        where: { id: surat.id },
        data: updateData
      });
      updateCount++;
    }
  }

  console.log(`\nNormalization finished. Updated ${updateCount} records.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error:', e);
    prisma.$disconnect();
    process.exit(1);
  });