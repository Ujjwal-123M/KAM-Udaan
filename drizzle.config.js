import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./configs/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:v49uVnZXFCMx@ep-noisy-butterfly-a5dhuyy5.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
});
