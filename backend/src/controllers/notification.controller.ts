import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service";
import { AppError } from "../utils/AppError";

export class NotificationController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.adminId) {
        throw new AppError("Não autorizado", 401);
      }

      const result = await NotificationService.findAll(req.adminId);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.adminId) {
        throw new AppError("Não autorizado", 401);
      }

      const { id } = req.params;
      const updated = await NotificationService.markAsRead(id, req.adminId);
      return res.status(200).json(updated);
    } catch (error) {
      return next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.adminId) {
        throw new AppError("Não autorizado", 401);
      }

      await NotificationService.markAllAsRead(req.adminId);
      return res.status(200).json({ message: "Todas as notificações foram marcadas como lidas" });
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.adminId) {
        throw new AppError("Não autorizado", 401);
      }

      const { id } = req.params;
      await NotificationService.delete(id, req.adminId);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
