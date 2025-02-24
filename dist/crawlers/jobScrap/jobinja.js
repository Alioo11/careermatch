"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createBrowser_1 = __importDefault(require("../../utils/createBrowser"));
class JobinjaCrawler {
    constructor() {
        this.name = "jobinja";
        this.page = null;
        this.crawlPageLinks = (url) => __awaiter(this, void 0, void 0, function* () {
            if (!this.page)
                return null;
            try {
                yield this.page.goto(url, { waitUntil: "domcontentloaded" });
                const jobs = yield this.page.evaluate(() => {
                    return Array.from(document.querySelectorAll(".o-listView__itemInfo")).map((job) => {
                        const titleElement = job.querySelector("h2 a");
                        //@ts-ignore
                        return titleElement ? titleElement.href : null;
                    });
                });
                return jobs;
            }
            catch (err) {
                console.log(err);
                return null;
            }
        });
        this.crawl = () => __awaiter(this, void 0, void 0, function* () {
            const browser = yield (0, createBrowser_1.default)({ headless: false });
            const page = yield browser.newPage();
            this.page = page;
            const links = [];
            for (let i = 1; i < 100; i++) {
                const pageLink = `https://jobinja.ir/jobs?&b=&filters%5Bjob_categories%5D%5B0%5D=&filters%5Bkeywords%5D%5B0%5D=frontend&filters%5Blocations%5D%5B0%5D=&page=${i}`;
                const currentPageLinks = yield this.crawlPageLinks(pageLink);
                if (!Array.isArray(currentPageLinks) || currentPageLinks.length === 0)
                    break;
                links.push(...currentPageLinks);
            }
            yield browser.close();
            return links;
        });
    }
}
exports.default = JobinjaCrawler;
