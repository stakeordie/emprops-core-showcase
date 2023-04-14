import dotenv from "dotenv";
import { ArtGen, PseudoRandom } from "@stakeordie/emprops-core";

dotenv.config();

new ArtGen({
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
    const environment = rng.pseudorandomPick(["urban", "rural"]);
    const setting = await api.runOpenAICompletion({
      model: "text-davinci-003",
      prompt: `Suggest a setting for a scene in a photo in an ${environment} environment`,
      temperature: 0.8,
      n: 1,
    });
    const seed = rng.pseudorandomInteger(1, 4294967295);
    let output = await api.runSd({
      api: "txt2img",
      prompt: `A photo of ${setting}, Realistic`,
      negative_prompt:
        "((letters)), ((numbers)), ((text)), ((symbols)), ((sentences)), ((paragraphs)), ((web interface)), ((gui)), ((web app)), ((desktop app))",
      seed,
      steps: 32,
      sampler_name: "DPM++ SDE",
    });
    output = await api.runSdUpscaler({
      image: output,
      upscaler_1: "R-ESRGAN 4x+",
    });
    return output;
  })
  .start(10);
