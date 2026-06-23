import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// .env.local (host-only overrides, e.g. localhost DB port) takes precedence over .env
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] ?? "",
  },
});
