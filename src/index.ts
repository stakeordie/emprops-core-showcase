import dotenv from "dotenv";
import { ArtGen, Env } from "@stakeordie/emprops-core";

dotenv.config();

new ArtGen({
  blockchain: "tezos",
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
    const seed = prng.pseudorandomInteger(1000000000, Number.MAX_SAFE_INTEGER);
    const paint = prng.pseudorandomPick(["watercolor", "acrylic"]);

    const r = prng.pseudorandomInteger(0, 255);
    const g = prng.pseudorandomInteger(0, 255);
    const b = prng.pseudorandomInteger(0, 255);

    const url = `file://${__dirname}/../src/assets/index.html`;
    let output = await api.takeScreenshot(url, {
      width: 512,
      height: 512,
      window: {
        backgroundColor: { r, g, b },
      },
    });
    output = await api.runSd({
      api: "img2img",
      prompt: `A ${paint} painting of galaxy far far away universe with a lot of starts and galaxies, big bang, (((constelations)))++, expnasion, ((3D)), (((special effects))), poster`,
      negative_prompt:
        "(((frames))), background, framing, photo of the painting, framing, drawing, (photo), (((paint box))",
      seed,
      steps: 20,
      sampler_name: "Euler a",
      cfg_scale: 8.5,
      denoising_strength: 0.9,
      init_images: [output],
    });
    output = await api.runSdUpscaler({
      image: output,
      upscaler_1: "R-ESRGAN 4x+",
      upscaling_resize: 3,
    });

    api.addFeature("paint", paint);

    return output;
  })
  .start(parseInt(process.env.NUMBER || "1"), process.env.SEED);
