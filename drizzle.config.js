import { defineConfig } from "drizzle-kit";
import "dotenv/config";
export default defineConfig({
  schema: "./configs/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING,
  },
});
