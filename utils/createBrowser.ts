import puppeteer, { type LaunchOptions } from "puppeteer";
import env from "../constants/env";


const macOSChromiumExecutablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const linuxChromiumExecutablePath = "/usr/bin/chromium-browser";

const executablePath = env.isProd
  ? linuxChromiumExecutablePath
  : macOSChromiumExecutablePath;

const args = env.isProd ? ["--no-sandbox", "--disable-setuid-sandbox"] : [];

const defaultPuppeteerOptions: LaunchOptions = {
  executablePath: executablePath,
  protocolTimeout:60000,
  headless: 'shell',
  args: args,
};

const createBrowser = async (options?: LaunchOptions) => {
  const launchOptions = { ...defaultPuppeteerOptions, ...options };
  const browser = await puppeteer.launch(launchOptions);
  return browser;
};

export default createBrowser;
