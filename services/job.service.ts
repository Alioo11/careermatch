import { PrismaClient, JobScrap } from "@prisma/client";
import Scrapper from "../scrapper";
import OllamaService from "./ollama";
import extractJSON from "../utils/extractJson";

type OllamaModelJson = {
  jobTitle: string | null;
  yearsOfExperience: number | null;
  company: string | null;
  requiredSkills: string[];
};

class JobService {
  crawlPageDetailContent = async (jobPositionRawText: string) => {
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

    const ollamaRawResult = await OllamaService.generate({ prompt: llmPrompt });

    if (ollamaRawResult === null) return null;

    let ollamaResult = null;

    try {
      ollamaResult = extractJSON(ollamaRawResult.response) as unknown as OllamaModelJson;
    } catch (error) {
      throw new Error(
        `ollama result is not a valid json \n got : ${error} \n raw text: ${jobPositionRawText} \n ollama result: ${ollamaRawResult.response}`
      );
    }

    return ollamaResult;
  };

  crawlJobPosition = async (jobPosition: JobScrap) => {
    const scrapper = Scrapper.instance();
    const pageRawText = await scrapper.getPageText(jobPosition.scrapLink);
    if (!pageRawText) return null;
    const jobPositionDetails = await this.crawlPageDetailContent(pageRawText);
    if (jobPositionDetails === null) return null;
    return { ...jobPositionDetails, content: pageRawText };
  };

  crawlJobPositions = async (limit: number = 10) => {
    const prisma = new PrismaClient();

    const jobPositions = await prisma.jobScrap.findMany({
      take: limit,
      orderBy: { timesFailedToScrap: "asc" },
      where: { jobId: { isSet: false } },
    });

    for (const job of jobPositions) {
      console.log("scrapping", job);
      const scrappingResult = await this.crawlJobPosition(job);

      if (scrappingResult === null) {
        console.log("failed to scrap a job position");
        await prisma.jobScrap.update({
          where: { id: job.id },
          data: { timesFailedToScrap: job.timesFailedToScrap + 1 },
        });
      } else {
        const companyId =
          scrappingResult.company === null
            ? null
            : await prisma.company.findFirst({
                where: { name: { contains: scrappingResult.company, mode: "insensitive" } },
                select: { id: true },
              });

        const result = await prisma.job.create({
          data: {
            companyId: companyId?.id,
            skills: scrappingResult.requiredSkills,
            expired: false,
            experience: scrappingResult.yearsOfExperience,
            content: scrappingResult.content,
            title: scrappingResult.jobTitle,
          },
        });

        await prisma.jobScrap.update({
          where: { id: job.id },
          data: { jobId: result.id },
        });

      }
    }
  };
}

export default JobService;
