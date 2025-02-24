import express from "express";
import {config} from "dotenv";
import JobService from "./services/job.service";

config();

const PORT = 9090;

const app = express();

const doSomeStuff = async () => {
  const JS = new JobService();
  await JS.crawlJobPositions(10);
};

app.get("/", (req, res) => {
  res.send("Hello World!");
  doSomeStuff();
});

app.listen(PORT, () => {
  console.log(`app is running and listening to port ${PORT}`);
});
