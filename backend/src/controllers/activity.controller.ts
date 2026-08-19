import { Request, Response } from "express";
import { ActivityService } from "../services/activity.service";
import {
  createActivitySchema,
  updateActivitySchema,
  updateActivityStatusSchema,
  queryActivitiesSchema,
} from "../schemas/activity.schema";

const activityService = new ActivityService();

export class ActivityController {
  async create(req: Request, res: Response): Promise<void> {
    const data = createActivitySchema.parse(req.body);
    const activity = await activityService.create(data);
    res.status(201).json(activity);
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const query = queryActivitiesSchema.parse(req.query);
    const activities = await activityService.findAll(query);
    res.status(200).json(activities);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const activity = await activityService.findById(id);
    res.status(200).json(activity);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = updateActivitySchema.parse(req.body);
    const activity = await activityService.update(id, data);
    res.status(200).json(activity);
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { status } = updateActivityStatusSchema.parse(req.body);
    const activity = await activityService.updateStatus(id, status);
    res.status(200).json(activity);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await activityService.delete(id);
    res.status(204).send();
  }
}
