const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'ridhampokiya21@gmail.com' },
    data: { twoFactorEnabled: true }
  });
  console.log('2FA enabled for testing!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
