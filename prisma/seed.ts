import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as seed from '../seed.json';

async function main() {
  const seedResponse = await prisma.company.createMany({
    data: seed,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
