"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const isProd = process.env.NODE_ENV === "production";
const env = {
    isProd,
    ollamaModel: process.env.OLLAMA_MODEL,
    ollamaEndpoint: process.env.OLLAMA_ENDPOINT,
};
exports.default = env;
