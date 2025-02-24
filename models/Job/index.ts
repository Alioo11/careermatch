import { PrismaClient, type JobScrap } from "@prisma/client";
import Scrapper from "../../scrapper";
import OllamaService from "../../services/ollama";
import extractJSON from "../../utils/extractJson";

type OllamaModelJson = {
  jobTitle: string | null;
  yearsOfExperience: number | null;
  company: string | null;
  requiredSkills: string[];
};

class Job {
  extractJobPositionData = async (scrapLink:string) => {
    const scrapper = Scrapper.instance();

    const jobPositionRawText = await scrapper.getPageText(scrapLink);

    const llmPrompt = `take this content: ${jobPositionRawText}, and fill this json using the data in the content

    {
    jobTitle: string
    yearsOfExperience: number
    company: string
    requiredSkills: string[]
    }

    also your response must be a valid json (no extra text)
    `;

    const ollamaRawResult = await OllamaService.generate({ prompt: llmPrompt });

    if (!ollamaRawResult || ollamaRawResult === null) throw new Error("Ollama response is empty");

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


  scrapJobPosition = async (jobScrap: JobScrap)=>{
    const prisma = new PrismaClient();

    try {
      const jobPositionData = await this.extractJobPositionData(jobScrap.scrapLink);

      await prisma.job.create({
        data:{
          title: jobPositionData.jobTitle,
          experience: jobPositionData.yearsOfExperience,
          skills: jobPositionData.requiredSkills,
          expired:false,
          content: 'none',
        }
      })

    } catch (error) {
      console.log(error);
    }

  }

  crawl = async () => {
    const prisma = new PrismaClient();

    const jobPositions = await prisma.jobScrap.findMany({
      take: 10,
    });


    for(const job in jobPositions){
      await this.scrapJobPosition(jobPositions[job]);
    }

  };
}

export default Job;
