import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";
import { AppError } from "../utils/AppError";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Não autorizado", 401));
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, config.jwtSecret) as { sub?: string };
    if (!payload.sub) {
      return next(new AppError("Sessão inválida ou expirada", 401));
    }
    req.adminId = payload.sub;
    return next();
  } catch {
    return next(new AppError("Sessão inválida ou expirada", 401));
  }
}
