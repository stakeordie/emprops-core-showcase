import type { Env } from "@stakeordie/emprops-core";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SD_URL: string;
      SD_USERNAME: string;
      SD_PASSWORD: string;
      OPENAI_API_KEY: string;
      DEBUG?: "true" | "false";
      NODE_ENV?: "local" | "blockchain";
      FILEBASE_ACCESS_KEY: string;
      FILEBASE_SECRET_KEY: string;
      FILEBASE_BUCKET: string;
      FILEBASE_URL: string;
      EMPROPS_API_URL: string;
      PROJECT_ID: string;
      TEZOS_RPC_URL: string;
      UPDATER_WALLET_PK: string;
      STORAGE_PATH: string;
      NUMBER: string;
      SEED: string;
      IPFS_URL: string;
			S3_ACCESS_KEY: string,
			S3_SECRET_KEY: string;
			S3_REGION: string;
			S3_BUCKET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
