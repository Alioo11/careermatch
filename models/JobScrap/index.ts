import { PrismaClient } from "@prisma/client";
import Crawler from "../../crawlers/jobScrap";

class JobScrap {
  model = new PrismaClient().jobScrap;

  crawl = async () => {
    const links = await new Crawler().crawl();

    const now = new Date();
    const formattedData = links.map((link) => ({ scrapLink: link, crawledAt: now }));

    console.log(formattedData);
    await this.model.createMany({
      data: formattedData,
    });
  };
}

export default JobScrap;
