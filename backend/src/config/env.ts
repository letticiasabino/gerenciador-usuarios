import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("A variável JWT_SECRET é obrigatória em produção");
  }
  return "dev_secret_nao_use_em_producao";
}

export const config = {
  port: parseInt(process.env.PORT || "3333", 10),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
  databaseUrl: process.env.DATABASE_URL || "file:./dev.db",
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
};
