import DivarCrawler from "./divar";
import JobinjaCrawler from "./jobinja";

class Crawler {
  crawlers = [new JobinjaCrawler(), new DivarCrawler()];

  crawl = async () => {
    const links = await Promise.all(this.crawlers.map((crawler) => crawler.crawl()));
    return links.flat();
  };
}

export default Crawler;
