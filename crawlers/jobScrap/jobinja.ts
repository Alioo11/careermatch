import type { ICrawler } from "types/crawler";
import createBrowser from "../../utils/createBrowser";
import { type Page } from "puppeteer";

class JobinjaCrawler implements ICrawler {
  name: string = "jobinja";
  page: Page | null = null;

  private crawlPageLinks = async (url: string) => {
    if (!this.page) return null;

    try {

      await this.page.goto(url, { waitUntil: "domcontentloaded" });

      const jobs: Array<string> = await this.page.evaluate(() => {
        return Array.from(document.querySelectorAll(".o-listView__itemInfo")).map((job) => {
          const titleElement = job.querySelector("h2 a");
          //@ts-ignore
          return titleElement ? titleElement.href : null;
        });
      });

      return jobs;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  crawl = async () => {
    const browser = await createBrowser()
    const page = await browser.newPage();
    this.page = page;

    const links: Array<string> = [];
    for (let i = 1; i < 100; i++) {
      const pageLink = `https://jobinja.ir/jobs?&b=&filters%5Bjob_categories%5D%5B0%5D=&filters%5Bkeywords%5D%5B0%5D=frontend&filters%5Blocations%5D%5B0%5D=&page=${i}`;
      const currentPageLinks = await this.crawlPageLinks(pageLink);
      if (!Array.isArray(currentPageLinks) || currentPageLinks.length === 0) break;
      links.push(...currentPageLinks);
    }

    await browser.close();

    return links;
  };
}

export default JobinjaCrawler;
