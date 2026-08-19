import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/", userController.create);
userRoutes.get("/stats", userController.getStats);
userRoutes.get("/", userController.findAll);
userRoutes.get("/:id", userController.findById);
userRoutes.put("/:id", userController.update);
userRoutes.patch("/:id/status", userController.updateStatus);
userRoutes.delete("/:id", userController.delete);

export { userRoutes };
