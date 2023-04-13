declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SD_URL: string;
      SD_USERNAME: string;
      SD_PASSWORD: string;
      OPENAI_API_KEY: string;
      DEBUG?: "true" | "false"
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
