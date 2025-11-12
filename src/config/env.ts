import { config } from "dotenv";
import { z } from "zod";

// Load .env file into process.env
config();

// 🧩 Define schemas for logical sections
const appSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  SIGN_IN_URL: z.string().min(1, "SIGN_IN_URL is required"),
  SIGN_UP_URL: z.string().min(1, "SIGN_UP_URL is required"),
});

const apiSchema = z.object({
  BASE_API_URL: z.string().min(1, "BASE_API_URL is required"),
});

const authSchema = z.object({
  CLERK_PUBLISHABLE_KEY: z.string().min(1, "CLERK_PUBLISHABLE_KEY is required"),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  CLERK_WEBHOOK_SIGNING_SECRET: z
    .string()
    .min(1, "CLERK_WEBHOOK_SIGNING_SECRET is required"),
});

// 🧠 Combine all schemas
const envSchema = z.object({
  app: appSchema,
  api: apiSchema,
  auth: authSchema,
});

// 🔍 Parse and validate
const parseEnv = () => {
  try {
    // Flatten process.env into sections
    const rawEnv = {
      app: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
        SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
      },
      api: {
        BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
      },
      auth: {
        CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        CLERK_WEBHOOK_SIGNING_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
      },
    };

    return envSchema.parse(rawEnv);
  } catch (error) {
    console.error("❌ Invalid environment configuration:");
    if (error instanceof z.ZodError) {
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      });
    }
    process.exit(1);
  }
};

// ✅ Parsed, typed environment variables
export const env = parseEnv();

// 🧠 Infer TypeScript types
export type Env = z.infer<typeof envSchema>;
export type AppEnv = z.infer<typeof appSchema>;
export type AuthEnv = z.infer<typeof authSchema>;
