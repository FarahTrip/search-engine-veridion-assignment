import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class ScrapingService {
  async scrapWebsites() {
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: './temp',
    });

    const page = await browser.newPage();

    await page.goto(
      'https://www.emag.ro/desktop-pc/c?ref=hp_menu_quick-nav_23_1&type=category',
    );

    // const element = await page.waitForSelector('div > .js-products-container');
    const element = await page.$$('#card_grid');

    for (const productHandle of element) {
      const title = await page.evaluate(() =>
        page
          .$$('div > div > div.card-v2-info > div > h2 > a')
          .then((res) => console.log(res)),
      );
    }

    browser.close();
  }
}
