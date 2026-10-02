import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .optional()
    .default("3000")
    .transform(Number)
    .refine((v) => !isNaN(v) && v > 0, { message: "PORT harus berupa angka positif" }),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z
    .string()
    .min(1, { message: "DATABASE_URL wajib diisi. Buat .env dari .env.example." }),
  JWT_SECRET: z
    .string()
    .min(1, { message: "JWT_SECRET wajib diisi." })
    .default("supersecret123"), // Default untuk memudahkan testing lokal
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Environment variable tidak valid:");
  parsed.error.issues.forEach((issue) => {
    console.error(`  [${issue.path.join(".")}] ${issue.message}`);
  });
  process.exit(1);
}

export const env = parsed.data;
