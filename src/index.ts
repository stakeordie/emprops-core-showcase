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
    platform: "curator",
    cdnUrl: "https://emprops.com",
    chainIds: "",
  },
  ipfs: {
    ipfsApiUrl: process.env.IPFS_URL,
    filebase: {
      url: process.env.FILEBASE_URL,
      accessKey: process.env.FILEBASE_ACCESS_KEY,
      secretKey: process.env.FILEBASE_SECRET_KEY,
      bucket: process.env.FILEBASE_BUCKET,
    },
  },
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
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
      override_settings: {
        sd_model_checkpoint: "sd_xl_base_1.0.safetensors [31e35c80fc]",
      },
      prompt: `A ${paint} painting of galaxy far far away universe with a lot of starts and galaxies, big bang, (((constelations)))++, expnasion, ((3D)), (((special effects))), poster`,
      negative_prompt:
        "(((frames))), background, framing, photo of the painting, framing, drawing, (photo), (((paint box))",
      seed,
      steps: 50,
      sampler_name: "Heun",
      cfg_scale: 16,
      denoising_strength: 0.8,
      init_images: [output],
      width: 1024,
      height: 1024,
    });

    api.addFeature("paint", paint);

    return output;
  })
  .start(parseInt(process.env.NUMBER || "1"), process.env.SEED);
