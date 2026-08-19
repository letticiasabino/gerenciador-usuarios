import { execSync } from "child_process";
import path from "path";

const TEST_DATABASE_URL = "file:./test.db";

export default function globalSetup() {
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    cwd: path.resolve(__dirname),
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: "inherit",
  });
}
