import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { CheerioCrawler, RequestQueue } from 'crawlee';
import phone from 'phone';
import { company } from 'src/types/scrapResult';
import { PrismaService } from 'src/prisma/prisma.service';
import socialMediaList from 'src/types/socialMediaNames';
import * as results from 'scrapResults.json';

@Injectable()
export class ScrapingService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly filePath = './scrapResults.json';

  async scrapWebsites() {
    const domains = await this.readDomainsFromCSV('src/domains.csv');
    const companies: company[] = domains.map((domain) => ({
      domain,
      emails: [],
      phoneNumbers: [],
      socialMediaLinks: [],
      company_all_available_names: [],
    }));

    const requestQueue = await RequestQueue.open();
    await Promise.all(
      companies.map((company) =>
        requestQueue.addRequest({
          url: `https://${company.domain}`,
          maxRetries: 2,
        }),
      ),
    );

    const crawler = new CheerioCrawler({
      minConcurrency: 30,
      maxRequestsPerCrawl: 5000,
      requestHandlerTimeoutSecs: 10,
      requestQueue,
      handlePageFunction: async ({ $, request }) => {
        const domain = request.url.replace('https://', '');
        const company = companies.find((c) => c.domain === domain);

        const text = $('body').text().toLowerCase();

        const emails = text.match(
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?\b/g,
        );
        const phoneNumbers = text.match(
          /(?:\+\d{1,3}[- ]?)?\(?(?:\d{2,3})?\)?[- ]?\d{3,4}[- ]?\d{3,4}\b/g,
        );
        const links = $('a[href]')
          .map((_, el) => $(el).attr('href'))
          .get();

        if (emails) {
          company.emails.push(...new Set(emails));
        }

        if (links) {
          const uniqueSocialMediaLinks = new Set<string>();
          for (const link of links) {
            if (link.toLowerCase().includes('contact')) {
              await requestQueue.addRequest({ url: link });
            }
            if (
              socialMediaList.some((social) =>
                link.toLowerCase().includes(social.toLowerCase()),
              )
            ) {
              uniqueSocialMediaLinks.add(link);
            }
          }
          company.socialMediaLinks.push(...Array.from(uniqueSocialMediaLinks));
        }

        if (phoneNumbers) {
          const uniquePhoneNumbers = new Set<string>();
          for (const phoneNumber of phoneNumbers) {
            const parsedPhoneNumber = phone(phoneNumber, {
              country: null,
              validateMobilePrefix: false,
            });
            if (parsedPhoneNumber.isValid) {
              uniquePhoneNumbers.add(parsedPhoneNumber.phoneNumber);
            }
          }
          company.phoneNumbers.push(...Array.from(uniquePhoneNumbers));
        }
      },
    });

    await crawler.run();

    this.saveData('scrapResults.json', companies);
  }

  async mergeTheData() {
    const csvPath = 'src/company-names.csv';
    const companyNames = await readCSV(csvPath);

    const mergedArray: company[] = companyNames.map((company: any) => {
      const matchingItem = results.find(
        (namesData) => namesData.domain === company.domain,
      );

      matchingItem.company_all_available_names =
        company.company_all_available_names.split('|');

      return { ...company, ...matchingItem };
    });

    this.saveData('seed.json', mergedArray);
  }

  async getStatistics() {
    try {
      const rawData = fs.readFileSync(this.filePath, 'utf-8');
      const data = JSON.parse(rawData);

      let noInfoCount = 0;
      let withInfoCount = 0;
      let phoneCount = 0;
      let emailCount = 0;
      let socialMediaCount = 0;

      for (const website of data) {
        if (
          website.emails.length === 0 &&
          website.phoneNumbers.length === 0 &&
          website.socialMediaLinks.length === 0
        ) {
          noInfoCount++;
        } else {
          withInfoCount++;
        }

        if (website.phoneNumbers.length > 0) {
          phoneCount++;
        }

        if (website.emails.length > 0) {
          emailCount++;
        }

        if (website.socialMediaLinks.length > 0) {
          socialMediaCount++;
        }
      }

      return {
        noInfoCount,
        withInfoCount,
        phoneCount,
        emailCount,
        socialMediaCount,
      };
    } catch (error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
  }

  saveData(filePath: string, data: any) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log('Data saved successfully.');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  async readDomainsFromCSV(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const domains: string[] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row: any) => {
          domains.push(row.domain);
        })
        .on('end', () => {
          resolve(domains);
        })
        .on('error', (error: any) => {
          reject(error);
        });
    });
  }
}

async function readCSV(filePath) {
  return new Promise<any[]>((resolve, reject) => {
    const data = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function displayCSV(filePath) {
  try {
    const rows = await readCSV(filePath);
    console.log(rows);
  } catch (error) {
    console.error('Error reading CSV:', error);
  }
}
