import { type Browser } from "puppeteer";
import createBrowser from "../utils/createBrowser";

class Scrapper {
  private static _instance: Scrapper | null = null;

  browser: Browser | null = null;

  getBrowser = async () => {
    if (this.browser) return this.browser;
    const browser = await createBrowser();
    return browser;
  };

  getPageHTML = async (url: string) => {
    let pageHTML = null;
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForNetworkIdle();
    pageHTML = await page.content();
    browser.close();
    return pageHTML;
  };

  getPageText = async (url: string) => {
    try{
      let pageHTML = null;
      const browser = await this.getBrowser();
      const page = await browser.newPage();
      await page.goto(url);
      // await page.waitForNetworkIdle();
      await page.evaluate(() => {
        const elements = document.querySelectorAll("script, style, iframe, nav, footer");
        elements.forEach((element) => element.remove());
      });
      let content = await page.$eval("body", (elements) => elements.textContent) ?? ''
      content = content.replace(/\s+/g , " ");
      pageHTML = content ?? '';
      await browser.close();
      return pageHTML;
    }catch(error){
      console.log(error);
      return null;
    }
  };

  
  static instance(){
    if(this._instance) return this._instance;
    this._instance = new Scrapper();
    return this._instance;
  }

  private constructor(){};
}

export default Scrapper;
