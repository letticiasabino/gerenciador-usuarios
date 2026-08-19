import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authenticate } from "../middlewares/authenticate";

export const notificationRoutes = Router();

notificationRoutes.use(authenticate);

notificationRoutes.get("/", NotificationController.findAll);
notificationRoutes.patch("/read-all", NotificationController.markAllAsRead);
notificationRoutes.patch("/:id/read", NotificationController.markAsRead);
notificationRoutes.delete("/:id", NotificationController.delete);
