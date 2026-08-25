import { configDotenv } from "dotenv";
import { env } from "process";

configDotenv({
  quiet: true,
});

const config = {
  NODE_ENV: env.NODE_ENV!,
  PORT: env.PORT!,
  DATABASE_URL: env.DATABASE_URL!,

  app_url: env.APP_URL,
  bcrypt_salt_rounds: env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: env.JWT_REFRESH_SECRET!,
  jwt_access_expires_in: env.JWT_ACCESS_EXPIRES_IN!,
  jwt_access_refresh_expires_in: env.JWT_ACCESS_REFRESH_EXPIRES_IN,
  // stripe_secret_key: process.env.STRIPE_SECRET_KEY,

  //   JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET!,
  //   JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET!,

  STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET!,

  //   CLIENT_URL: env.CLIENT_URL ?? "http://localhost:3000",
};

export default config;
