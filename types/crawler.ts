import { type JobScrap } from "@prisma/client";

export interface ICrawler {
  name: string;  
  crawl: () => Promise<Array<string>>;
}