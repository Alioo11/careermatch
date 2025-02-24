import type { ICrawler } from "types/crawler";
import createBrowser from "../../utils/createBrowser";
import { type Page } from "puppeteer";

class DivarCrawler implements ICrawler {
  name: string = "divar";
  page: Page | null = null;

  private crawlPageLinks = async (url: string) => {
    try {
      if (!this.page) return;

      await this.page.goto(url, { waitUntil: "domcontentloaded" });

      const jobs: Array<string> = await this.page.evaluate(() => {
        return Array.from(document.querySelectorAll("a")).map((job) => {
          //@ts-ignore
          return job ? job.href : "";
        });
      });

      return jobs.filter(j => j.startsWith('https://careers.divar.ir/positions/'));
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  crawl = async () => {
    const browser = await createBrowser({ headless: false });
    const page = await browser.newPage();
    this.page = page;

    const pageLink = `https://careers.divar.ir/positions`;
    const links = (await this.crawlPageLinks(pageLink)) ?? [];

    await browser.close();

    return links;
  };
}

export default DivarCrawler;
