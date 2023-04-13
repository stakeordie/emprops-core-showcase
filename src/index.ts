import dotenv from "dotenv";
import { createArtGen, PseudoRandom } from "@stakeordie/emprops-core";

dotenv.config();

const artGen = createArtGen({
  debug: process.env.DEBUG === "true",
  storage: {
    // If you want to change this, make sure you update the "setup" script in package.json
    path: "./outputs",
  },
  sd: {
    url: process.env.SD_URL,
    credentials: {
      username: process.env.SD_USERNAME,
      password: process.env.SD_PASSWORD,
    },
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
});

artGen.onNewToken(async (token, api) => {
  const rng = new PseudoRandom(token.seed);
  const seed = rng.pseudorandomInteger(0, 4294967295);
  const setting = await api.runOpenAICompletion({
    model: "text-davinci-003",
    prompt: "Suggest a setting for a photo",
    temperature: 0.8,
  });
  let output = await api.runSd({
    api: "txt2img",
    prompt: `A photo of a person, ${setting}`,
    negativePrompt:
      "((letters)), ((numbers)), ((text)), ((symbols)), ((sentences)), ((paragraphs)), ((web interface)), ((gui)), ((web app)), ((desktop app))",
    seed,
    smaplerName: "Euler",
  });
  output = await api.runSdUpscaler({
    image: output,
    upscaler1: "R-ESRGAN 4x+",
  });
  return output;
});

artGen.start(2);
