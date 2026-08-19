import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller";
import { authenticate } from "../middlewares/authenticate";

const activityRoutes = Router();
const activityController = new ActivityController();

activityRoutes.use(authenticate);

activityRoutes.post("/", (req, res) => activityController.create(req, res));
activityRoutes.get("/", (req, res) => activityController.findAll(req, res));
activityRoutes.get("/:id", (req, res) => activityController.findById(req, res));
activityRoutes.put("/:id", (req, res) => activityController.update(req, res));
activityRoutes.patch("/:id/status", (req, res) =>
  activityController.updateStatus(req, res),
);
activityRoutes.delete("/:id", (req, res) =>
  activityController.delete(req, res),
);

export { activityRoutes };
