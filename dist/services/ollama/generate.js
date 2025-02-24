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
const axios_1 = __importDefault(require("axios"));
const endpoints_1 = __importDefault(require("../../constants/endpoints"));
const env_1 = __importDefault(require("../../constants/env"));
const handler = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = params;
    axios_1.default.defaults.baseURL = env_1.default.ollamaEndpoint;
    console.log("running ollama model", axios_1.default.defaults.headers);
    try {
        const response = yield axios_1.default.post(endpoints_1.default.ollama.generate, {
            prompt,
            model: env_1.default.ollamaModel,
            stream: false,
        });
        return response.data;
    }
    catch (error) {
        console.log("error while running ollama model");
        // console.log(error);
        return null;
    }
});
exports.default = handler;
