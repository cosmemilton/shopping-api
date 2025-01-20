import { PrismaClient } from '@prisma/client';
import { Utils } from '../src/utils';

const prisma = new PrismaClient();

async function main() {
  const id = Utils.generateUUID();
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id,
      email: 'admin@example.com',
      name: 'Admin User',
      username: 'admin',
      hashedPassword: Utils.generateMD5('admin'),
    }
  });

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });