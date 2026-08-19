import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/env";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use("/api", (_req, res) => {
  res.status(404).json({
    status: "error",
    message: "Rota não encontrada",
  });
});

app.use(errorHandler);

export { app };
