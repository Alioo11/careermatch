import {config} from 'dotenv'

config();

const isProd = process.env.NODE_ENV === "production";

const env = {
  isProd,
  ollamaModel: process.env.OLLAMA_MODEL,
  ollamaEndpoint: process.env.OLLAMA_ENDPOINT,
};

export default env;
