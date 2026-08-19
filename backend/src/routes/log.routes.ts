import { Router } from "express";
import { LogController } from "../controllers/log.controller";
import { authenticate } from "../middlewares/authenticate";

export const logRoutes = Router();

logRoutes.use(authenticate);

logRoutes.get("/", LogController.findAll);
