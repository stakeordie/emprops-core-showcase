import dotenv from "dotenv";
import { ArtGen, PseudoRandom } from "@stakeordie/emprops-core";

dotenv.config();

const artGen = new ArtGen({
  debug: process.env.DEBUG === "true",
  output: {
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
})
  .onNewToken(async (token, api) => {
    const rng = new PseudoRandom(token.seed);
    const seed = rng.pseudorandomInteger(1000000000, 4294967295);
    const temperature = parseFloat(rng.pseudorandom(0, 0.65).toFixed(1));
    const setting = await api.runOpenAICompletion({
      model: "text-davinci-003",
      prompt: "Suggest a setting for a photo",
      temperature,
      n: 1,
    });
    let output = await api.runSd({
      api: "txt2img",
      prompt: `A photo of a ${setting}, Realistic`,
      negative_prompt:
        "((letters)), ((numbers)), ((text)), ((symbols)), ((sentences)), ((paragraphs)), ((web interface)), ((gui)), ((web app)), ((desktop app))",
      seed,
      sampler_name: "DPM++ SDE",
    });
    output = await api.runSdUpscaler({
      image: output,
      upscaler_1: "R-ESRGAN 4x+",
    });
    return output;
  })
  .start(10);
