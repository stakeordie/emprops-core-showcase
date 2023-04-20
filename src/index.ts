import dotenv from "dotenv";
import { ArtGen, Env } from "@stakeordie/emprops-core";

dotenv.config();

new ArtGen({
  env: process.env.NODE_ENV as Env,
  debug: process.env.DEBUG === "true",
  output: {
    // If you want to change this, make sure you update the "setup" script in package.json
    path: process.env.STORAGE_PATH,
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
  tezos: {
    rpcUrl: process.env.TEZOS_RPC_URL,
    updaterWalletPk: process.env.UPDATER_WALLET_PK,
  },
  emprops: {
    url: process.env.EMPROPS_API_URL,
    pollingInterval: 30_000,
    projectId: process.env.PROJECT_ID,
  },
  ipfs: {
    filebase: {
      url: process.env.FILEBASE_URL,
      accessKey: process.env.FILEBASE_ACCESS_KEY,
      secretKey: process.env.FILEBASE_SECRET_KEY,
      bucket: process.env.FILEBASE_BUCKET,
    },
  },
})
  .onNewToken(async ({ api, prng }) => {
    const seed = prng.pseudorandomInteger(1, Number.MAX_SAFE_INTEGER);
    const environment = prng.pseudorandomPick(["urban", "rural"]);

    let output = await api.runSd({
      api: "txt2img",
      prompt: `A photo of a ${environment}, Realistic`,
      negative_prompt:
        "((letters)), ((numbers)), ((text)), ((symbols)), ((sentences)), ((paragraphs)), ((web interface)), ((gui)), ((web app)), ((desktop app))",
      seed,
      steps: 32,
      sampler_name: "DPM++ SDE",
    });
    output = await api.runSdUpscaler({
      image: output,
      upscaler_1: "R-ESRGAN 4x+",
      upscaling_resize: 3,
    });

    api.addFeature("environment", environment);

    return output;
  })
  .start();
