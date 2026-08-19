import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { activityRoutes } from "./activity.routes";
import { logRoutes } from "./log.routes";
import { notificationRoutes } from "./notification.routes";
import { authenticate } from "../middlewares/authenticate";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", authenticate, userRoutes);
routes.use("/activities", authenticate, activityRoutes);
routes.use("/logs", authenticate, logRoutes);
routes.use("/notifications", authenticate, notificationRoutes);

export { routes };
