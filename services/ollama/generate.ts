import axios from "axios";
import endpoints from "../../constants/endpoints";
import env from "../../constants/env";
import type { IOllama } from "../../types/ollama";

interface OllamaParams {
  prompt: string;
}

const handler = async (params: OllamaParams) => {
  const { prompt } = params;

  axios.defaults.baseURL = env.ollamaEndpoint;


  
  console.log("running ollama model" , axios.defaults.headers);  
  try {
    const response = await axios.post<IOllama>(endpoints.ollama.generate, {
      prompt,
      model: env.ollamaModel,
      stream: false,
    });

    return response.data;
  } catch (error) {
    console.log("error while running ollama model");
    // console.log(error);
    return null;
  }
};

export default handler;
