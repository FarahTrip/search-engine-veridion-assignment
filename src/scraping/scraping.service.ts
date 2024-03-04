import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { CheerioCrawler, Dataset } from 'crawlee';

@Injectable()
export class ScrapingService {
  async handleCron() {
    console.log('Logged at ');
  }

  async scrapWebsites() {
    const domains = await this.readDomainsFromCSV('src/domains.csv');
    const sample = domains.slice(-10);
    console.log(sample);

    const crawler = new CheerioCrawler({
      async requestHandler({ request, $, enqueueLinks, log }) {
        const title = $('title').text();
        log.info(`Title of ${request.loadedUrl} is '${title}'`);

        // Save results as JSON to ./storage/datasets/default
        await Dataset.pushData({ title, url: request.loadedUrl });

        // Extract links from the current page
        // and add them to the crawling queue.
        await enqueueLinks();
      },
      maxRequestsPerCrawl: 50,
    });

    await crawler.run(sample);
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
