import { Request, Response, NextFunction } from "express";
import { LogService } from "../services/log.service";

export class LogController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { action, entity, page, limit } = req.query;

      const result = await LogService.findAll({
        action: typeof action === "string" ? action : undefined,
        entity: typeof entity === "string" ? entity : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}
