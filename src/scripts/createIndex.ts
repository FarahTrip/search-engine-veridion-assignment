import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const algoliasearch = require('algoliasearch');

async function main() {
  const client = algoliasearch(
    process.env.ALGOLIA_APPID,
    process.env.ALGOLIA_APIKEY,
  );

  const records = await prisma.company.findMany();

  try {
    const index = client.initIndex('companies');
    const successfulRecords = [];
    const failedRecords = [];

    for (const record of records) {
      try {
        await index.saveObject(record, {
          autoGenerateObjectIDIfNotExist: true,
        });
        successfulRecords.push(record);
      } catch (error) {
        console.log(`Error saving record: ${error.message}`);
        failedRecords.push(record);
      }
    }

    console.log('Successfully added records:', successfulRecords.length);
    console.log('Failed to add records:', failedRecords.length);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
