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
const scrapper_1 = __importDefault(require("../scrapper"));
const ollama_1 = __importDefault(require("./ollama"));
const extractJson_1 = __importDefault(require("../utils/extractJson"));
class JobService {
    constructor() {
        this.crawlPageDetailContent = (jobPositionRawText) => __awaiter(this, void 0, void 0, function* () {
            const llmPrompt = `take this content: ${jobPositionRawText}, and fill this json using the data in the content
        {
            jobTitle: string
            yearsOfExperience: number
            company: string
            requiredSkills: string[]
        }
        also your response must be a valid json (no extra text)
        company must me in english characters
        `;
            const ollamaRawResult = yield ollama_1.default.generate({ prompt: llmPrompt });
            if (ollamaRawResult === null)
                return null;
            let ollamaResult = null;
            try {
                ollamaResult = (0, extractJson_1.default)(ollamaRawResult.response);
            }
            catch (error) {
                throw new Error(`ollama result is not a valid json \n got : ${error} \n raw text: ${jobPositionRawText} \n ollama result: ${ollamaRawResult.response}`);
            }
            return ollamaResult;
        });
        this.crawlJobPosition = (jobPosition) => __awaiter(this, void 0, void 0, function* () {
            const scrapper = scrapper_1.default.instance();
            const pageRawText = yield scrapper.getPageText(jobPosition.scrapLink);
            if (!pageRawText)
                return null;
            const jobPositionDetails = yield this.crawlPageDetailContent(pageRawText);
            if (jobPositionDetails === null)
                return null;
            return Object.assign(Object.assign({}, jobPositionDetails), { content: pageRawText });
        });
        this.crawlJobPositions = (...args_1) => __awaiter(this, [...args_1], void 0, function* (limit = 10) {
            const prisma = new client_1.PrismaClient();
            const jobPositions = yield prisma.jobScrap.findMany({
                take: limit,
                orderBy: { timesFailedToScrap: "asc" },
                where: { jobId: { isSet: false } },
            });
            for (const job of jobPositions) {
                console.log("scrapping", job);
                const scrappingResult = yield this.crawlJobPosition(job);
                if (scrappingResult === null) {
                    console.log("failed to scrap a job position");
                    yield prisma.jobScrap.update({
                        where: { id: job.id },
                        data: { timesFailedToScrap: job.timesFailedToScrap + 1 },
                    });
                }
                else {
                    const companyId = scrappingResult.company === null
                        ? null
                        : yield prisma.company.findFirst({
                            where: { name: { contains: scrappingResult.company, mode: "insensitive" } },
                            select: { id: true },
                        });
                    const result = yield prisma.job.create({
                        data: {
                            companyId: companyId === null || companyId === void 0 ? void 0 : companyId.id,
                            skills: scrappingResult.requiredSkills,
                            expired: false,
                            experience: scrappingResult.yearsOfExperience,
                            content: scrappingResult.content,
                            title: scrappingResult.jobTitle,
                        },
                    });
                    yield prisma.jobScrap.update({
                        where: { id: job.id },
                        data: { jobId: result.id },
                    });
                }
            }
        });
    }
}
exports.default = JobService;
