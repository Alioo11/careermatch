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
const createBrowser_1 = __importDefault(require("../utils/createBrowser"));
class Scrapper {
    static instance() {
        if (this._instance)
            return this._instance;
        this._instance = new Scrapper();
        return this._instance;
    }
    constructor() {
        this.browser = null;
        this.getBrowser = () => __awaiter(this, void 0, void 0, function* () {
            if (this.browser)
                return this.browser;
            const browser = yield (0, createBrowser_1.default)({ headless: false });
            return browser;
        });
        this.getPageHTML = (url) => __awaiter(this, void 0, void 0, function* () {
            let pageHTML = null;
            const browser = yield this.getBrowser();
            const page = yield browser.newPage();
            yield page.goto(url);
            yield page.waitForNetworkIdle();
            pageHTML = yield page.content();
            browser.close();
            return pageHTML;
        });
        this.getPageText = (url) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let pageHTML = null;
                const browser = yield this.getBrowser();
                const page = yield browser.newPage();
                yield page.goto(url);
                yield page.waitForNetworkIdle();
                yield page.evaluate(() => {
                    const elements = document.querySelectorAll("script, style, iframe, nav, footer");
                    elements.forEach((element) => element.remove());
                });
                let content = (_a = yield page.$eval("body", (elements) => elements.textContent)) !== null && _a !== void 0 ? _a : '';
                content = content.replace(/\s+/g, " ");
                pageHTML = content !== null && content !== void 0 ? content : '';
                yield browser.close();
                return pageHTML;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    ;
}
Scrapper._instance = null;
exports.default = Scrapper;
