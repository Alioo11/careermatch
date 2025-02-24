"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generate_1 = __importDefault(require("./generate"));
class OllamaService {
}
OllamaService.generate = generate_1.default;
exports.default = OllamaService;
