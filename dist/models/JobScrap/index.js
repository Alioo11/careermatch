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
const client_1 = require("@prisma/client");
const jobScrap_1 = __importDefault(require("../../crawlers/jobScrap"));
class JobScrap {
    constructor() {
        this.model = new client_1.PrismaClient().jobScrap;
        this.crawl = () => __awaiter(this, void 0, void 0, function* () {
            const links = yield new jobScrap_1.default().crawl();
            const now = new Date();
            const formattedData = links.map((link) => ({ scrapLink: link, crawledAt: now }));
            console.log(formattedData);
            yield this.model.createMany({
                data: formattedData,
            });
        });
    }
}
exports.default = JobScrap;
