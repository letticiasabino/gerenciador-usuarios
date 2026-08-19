import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { activityRoutes } from "./activity.routes";
import { authenticate } from "../middlewares/authenticate";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", authenticate, userRoutes);
routes.use("/activities", authenticate, activityRoutes);

export { routes };
