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
const puppeteer_1 = __importDefault(require("puppeteer"));
const env_1 = __importDefault(require("../constants/env"));
const linuxChromiumExecutablePath = "/usr/bin/chromium-browser";
const macOSChromiumExecutablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath = env_1.default.isProd
    ? linuxChromiumExecutablePath
    : macOSChromiumExecutablePath;
const args = env_1.default.isProd ? ["--no-sandbox", "--disable-setuid-sandbox"] : [];
const defaultPuppeteerOptions = {
    executablePath: executablePath,
    headless: true,
    args: args,
};
const createBrowser = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const launchOptions = Object.assign(Object.assign({}, defaultPuppeteerOptions), options);
    const browser = yield puppeteer_1.default.launch(launchOptions);
    return browser;
});
exports.default = createBrowser;
