import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export default defineConfig({
  use: {
    baseURL: "http://localhost:5173",
  },
});
