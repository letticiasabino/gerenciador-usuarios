import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authenticate";

const authRoutes = Router();
const authController = new AuthController();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  },
});

const loginRateLimit =
  process.env.NODE_ENV === "test"
    ? (_req: Request, _res: Response, next: NextFunction) => next()
    : loginLimiter;

authRoutes.post("/login", loginRateLimit, authController.login);
authRoutes.get("/me", authenticate, authController.me);
authRoutes.put("/me", authenticate, authController.updateProfile);
authRoutes.put("/profile", authenticate, authController.updateProfile);

export { authRoutes };
