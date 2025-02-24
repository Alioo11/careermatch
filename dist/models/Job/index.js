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
const scrapper_1 = __importDefault(require("../../scrapper"));
const ollama_1 = __importDefault(require("../../services/ollama"));
const extractJson_1 = __importDefault(require("../../utils/extractJson"));
class Job {
    constructor() {
        this.extractJobPositionData = (scrapLink) => __awaiter(this, void 0, void 0, function* () {
            const scrapper = scrapper_1.default.instance();
            const jobPositionRawText = yield scrapper.getPageText(scrapLink);
            const llmPrompt = `take this content: ${jobPositionRawText}, and fill this json using the data in the content

    {
    jobTitle: string
    yearsOfExperience: number
    company: string
    requiredSkills: string[]
    }

    also your response must be a valid json (no extra text)
    `;
            const ollamaRawResult = yield ollama_1.default.generate({ prompt: llmPrompt });
            if (!ollamaRawResult || ollamaRawResult === null)
                throw new Error("Ollama response is empty");
            let ollamaResult = null;
            try {
                ollamaResult = (0, extractJson_1.default)(ollamaRawResult.response);
            }
            catch (error) {
                throw new Error(`ollama result is not a valid json \n got : ${error} \n raw text: ${jobPositionRawText} \n ollama result: ${ollamaRawResult.response}`);
            }
            return ollamaResult;
        });
        this.scrapJobPosition = (jobScrap) => __awaiter(this, void 0, void 0, function* () {
            const prisma = new client_1.PrismaClient();
            try {
                const jobPositionData = yield this.extractJobPositionData(jobScrap.scrapLink);
                yield prisma.job.create({
                    data: {
                        title: jobPositionData.jobTitle,
                        experience: jobPositionData.yearsOfExperience,
                        skills: jobPositionData.requiredSkills,
                        expired: false,
                        content: 'none',
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.crawl = () => __awaiter(this, void 0, void 0, function* () {
            const prisma = new client_1.PrismaClient();
            const jobPositions = yield prisma.jobScrap.findMany({
                take: 10,
            });
            for (const job in jobPositions) {
                yield this.scrapJobPosition(jobPositions[job]);
            }
        });
    }
}
exports.default = Job;
