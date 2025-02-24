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
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const job_service_1 = __importDefault(require("./services/job.service"));
(0, dotenv_1.config)();
const PORT = 9090;
const app = (0, express_1.default)();
const doSomeStuff = () => __awaiter(void 0, void 0, void 0, function* () {
    const JS = new job_service_1.default();
    yield JS.crawlJobPositions(10);
});
app.get("/", (req, res) => {
    res.send("Hello World!");
    doSomeStuff();
});
app.listen(PORT, () => {
    console.log(`app is running and listening to port ${PORT}`);
});
