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
class DivarCrawler {
    constructor() {
        this.name = "divar";
        this.page = null;
        this.crawlPageLinks = (url) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.page)
                    return;
                yield this.page.goto(url, { waitUntil: "domcontentloaded" });
                const jobs = yield this.page.evaluate(() => {
                    return Array.from(document.querySelectorAll("a")).map((job) => {
                        //@ts-ignore
                        return job ? job.href : "";
                    });
                });
                return jobs.filter(j => j.startsWith('https://careers.divar.ir/positions/'));
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
        this.crawl = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const browser = yield (0, createBrowser_1.default)({ headless: false });
            const page = yield browser.newPage();
            this.page = page;
            const pageLink = `https://careers.divar.ir/positions`;
            const links = (_a = (yield this.crawlPageLinks(pageLink))) !== null && _a !== void 0 ? _a : [];
            yield browser.close();
            return links;
        });
    }
}
exports.default = DivarCrawler;
